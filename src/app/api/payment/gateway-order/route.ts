import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import { createGatewayOrder } from '@/lib/payment-gateway'
import { getSubscriptionPlanById, createPaymentOrder } from '@/lib/payment-db-prisma'

export async function POST(request: NextRequest) {
  try {
    const { planId, paymentMethod } = await request.json()

    // 验证参数
    if (!planId || !paymentMethod) {
      return NextResponse.json({
        success: false,
        error: '缺少必要参数'
      }, { status: 400 })
    }

    if (!['alipay', 'wechat'].includes(paymentMethod)) {
      return NextResponse.json({
        success: false,
        error: '不支持的支付方式'
      }, { status: 400 })
    }

    // 获取用户信息
    const authHeader = request.headers.get('authorization')
    if (!authHeader) {
      return NextResponse.json({
        success: false,
        error: '未授权访问'
      }, { status: 401 })
    }

    const token = authHeader.replace('Bearer ', '')
    const { data: { user }, error: authError } = await supabase.auth.getUser(token)
    
    if (authError || !user) {
      return NextResponse.json({
        success: false,
        error: '用户验证失败'
      }, { status: 401 })
    }

    // 获取套餐信息
    const plan = await getSubscriptionPlanById(planId)

    if (!plan || !plan.isActive) {
      return NextResponse.json({
        success: false,
        error: '套餐不存在或已下线'
      }, { status: 404 })
    }

    // 创建支付网关订单
    const gatewayOrder = await createGatewayOrder({
      productName: `${plan.name} - ${plan.description}`,
      amount: plan.price,
      paymentMethod: paymentMethod as 'alipay' | 'wechat'
    })

    // 保存本地订单记录
    const order = await createPaymentOrder({
      userId: user.id,
      planId: plan.id,
      amount: plan.price, // 使用套餐原始价格，而不是支付网关返回的价格
      currency: plan.currency,
      paymentMethod: paymentMethod,
      status: 'pending',
      metadata: {
        gatewayOrderData: gatewayOrder,
        planName: plan.name,
        planDescription: plan.description,
        // 记录支付网关的实际收款金额用于对账
        gatewayAmount: gatewayOrder.amount,
        displayAmount: gatewayOrder.displayAmount
      }
    })

    return NextResponse.json({
      success: true,
      data: {
        orderId: order.id,
        gatewayOrderId: gatewayOrder.orderId,
        amount: plan.price, // 返回套餐原始价格
        displayAmount: plan.price, // 显示套餐原始价格
        currency: plan.currency,
        gatewayAmount: gatewayOrder.amount, // 支付网关实际收款金额
        paymentMethod: gatewayOrder.paymentMethod,
        expiresAt: gatewayOrder.expiresAt,
        message: gatewayOrder.message
      }
    })

  } catch (error) {
    console.error('创建支付网关订单API错误:', error)
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : '服务器错误'
    }, { status: 500 })
  }
}