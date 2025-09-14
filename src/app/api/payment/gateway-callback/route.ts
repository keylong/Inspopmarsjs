import { NextRequest, NextResponse } from 'next/server'
import { verifySignature, getPaymentGatewayConfig } from '@/lib/payment-gateway'
import { getPaymentOrderByGatewayId, updatePaymentOrder } from '@/lib/payment-db'
import { processSimplePayment } from '@/lib/payment-simple'
import type { GatewayCallbackData } from '@/lib/payment-gateway'

export async function POST(request: NextRequest) {
  try {
    const callbackData: GatewayCallbackData = await request.json()
    console.log('=== 支付回调处理开始 ===')
    console.log('收到支付回调:', callbackData)
    console.log('回调IP:', request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'unknown')

    const config = getPaymentGatewayConfig()

    // 验证签名
    console.log('开始验证签名...')
    if (!verifySignature(callbackData, callbackData.signature, config.apiKey)) {
      console.error('❌ 签名验证失败')
      return NextResponse.json({
        success: false,
        error: '签名验证失败'
      }, { status: 401 })
    }
    console.log('✅ 签名验证通过')

    // 验证时间戳（5分钟有效期）
    if (callbackData.timestamp) {
      // 将Unix秒时间戳转换为毫秒时间戳
      const timestampMs = typeof callbackData.timestamp === 'number' 
        ? callbackData.timestamp * 1000 
        : parseInt(callbackData.timestamp) * 1000
      
      const callbackTime = new Date(timestampMs)
      const currentTime = new Date()
      const timeDiff = Math.abs(currentTime.getTime() - callbackTime.getTime()) / 1000

      console.log(`时间戳验证: 原始=${callbackData.timestamp}, 转换后=${callbackTime.toISOString()}, 当前=${currentTime.toISOString()}, 时差=${timeDiff}秒`)

      if (timeDiff > 300) { // 5分钟
        console.error(`❌ 回调时间戳过期: 时差${timeDiff}秒超过300秒限制`)
        return NextResponse.json({
          success: false,
          error: '回调已过期'
        }, { status: 401 })
      }
      console.log('✅ 时间戳验证通过')
    }

    // 查找对应的本地订单
    const order = await getPaymentOrderByGatewayId(callbackData.orderId)

    if (!order) {
      console.error('订单不存在:', callbackData.orderId)
      return NextResponse.json({
        success: false,
        error: '订单不存在'
      }, { status: 404 })
    }

    // 检查订单是否已处理（幂等性）
    if (order.status === 'paid') {
      console.log(`订单 ${order.id} 已处理过，直接返回成功`)
      return NextResponse.json({
        success: true,
        message: '订单已处理'
      })
    }

    // 处理支付成功
    if (callbackData.status === 'success') {
      console.log(`订单支付成功: ${order.id}, 金额: ${callbackData.amount}`)

      try {
        // 使用简化的支付处理逻辑
        await processSimplePayment({
          userId: order.userId,
          planId: order.planId,
          orderId: order.id,
          paymentId: callbackData.uid,
          amount: callbackData.amount
        })

        // 更新订单状态为已支付
        await updatePaymentOrder(order.id, {
          status: 'paid',
          paidAt: typeof callbackData.timestamp === 'number' 
            ? new Date(callbackData.timestamp * 1000).toISOString()
            : new Date(parseInt(callbackData.timestamp) * 1000).toISOString(),
          metadata: {
            ...order.metadata,
            paymentId: callbackData.uid,
            processedAt: new Date().toISOString()
          }
        })

        console.log(`🎉 简化支付处理完成: 订单=${order.id}, 用户=${order.userId}`)
        console.log('=== 支付回调处理结束 ===')
        
        // 发送成功响应
        return NextResponse.json({
          success: true,
          message: '回调处理成功',
          orderId: order.id
        })
      } catch (error) {
        console.error('处理支付成功失败:', error)
        return NextResponse.json({
          success: false,
          error: '处理支付失败'
        }, { status: 500 })
      }
    }

    // 处理其他状态
    console.log(`订单状态: ${callbackData.status}, 订单ID: ${order.id}`)
    
    return NextResponse.json({
      success: true,
      message: '回调处理完成'
    })

  } catch (error) {
    console.error('回调处理异常:', error)
    return NextResponse.json({
      success: false,
      error: '内部处理错误'
    }, { status: 500 })
  }
}

// 健康检查
export async function GET() {
  return NextResponse.json({
    status: 'ok',
    service: 'payment-gateway-callback',
    timestamp: new Date().toISOString()
  })
}