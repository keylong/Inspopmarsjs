import { NextRequest, NextResponse } from 'next/server'
import { getPaymentOrderById, updatePaymentOrder } from '@/lib/payment-db'
import { processSimplePayment } from '@/lib/payment-simple'

export async function POST(request: NextRequest) {
  try {
    const { orderId, adminKey } = await request.json()

    // 简单的管理员验证（生产环境应使用更安全的方式）
    const ADMIN_KEY = process.env.ADMIN_KEY || 'admin123'
    if (!adminKey || adminKey !== ADMIN_KEY) {
      return NextResponse.json({
        success: false,
        error: '管理员权限验证失败'
      }, { status: 401 })
    }

    console.log(`=== 管理员手动确认支付: ${orderId} ===`)

    // 查找订单
    const order = await getPaymentOrderById(orderId)
    if (!order) {
      return NextResponse.json({
        success: false,
        error: '订单不存在'
      }, { status: 404 })
    }

    // 检查订单状态
    if (order.status === 'paid') {
      return NextResponse.json({
        success: true,
        message: '订单已经是已支付状态',
        data: { orderId: order.id, status: order.status }
      })
    }

    // 使用简化的支付处理逻辑
    await processSimplePayment({
      userId: order.userId,
      planId: order.planId,
      orderId: order.id,
      paymentId: `manual_${Date.now()}`,
      amount: order.amount
    })

    // 更新订单状态
    await updatePaymentOrder(order.id, {
      status: 'paid',
      paidAt: new Date().toISOString(),
      metadata: {
        ...order.metadata,
        paymentId: `manual_${Date.now()}`,
        processedAt: new Date().toISOString(),
        manualConfirm: true
      }
    })

    console.log(`✅ 管理员手动确认支付成功: 订单=${order.id}, 用户=${order.userId}`)

    return NextResponse.json({
      success: true,
      message: '支付确认成功，会员权益已激活',
      data: {
        orderId: order.id,
        userId: order.userId,
        planId: order.planId,
        processedAt: new Date().toISOString()
      }
    })

  } catch (error) {
    console.error('管理员确认支付失败:', error)
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : '服务器错误'
    }, { status: 500 })
  }
}

// 健康检查
export async function GET() {
  return NextResponse.json({
    service: 'admin-confirm-payment',
    status: 'ok',
    timestamp: new Date().toISOString()
  })
}