import { NextRequest, NextResponse } from 'next/server'
import { getPaymentOrderById } from '@/lib/payment-db-prisma'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ orderId: string }> }
) {
  try {
    const { orderId } = await params

    if (!orderId) {
      return NextResponse.json({
        success: false,
        error: '订单ID不能为空'
      }, { status: 400 })
    }

    // 查找订单
    const order = await getPaymentOrderById(orderId)

    if (!order) {
      return NextResponse.json({
        success: false,
        error: '订单不存在'
      }, { status: 404 })
    }

    return NextResponse.json({
      success: true,
      data: {
        id: order.id,
        status: order.status,
        amount: order.amount,
        currency: order.currency,
        paymentMethod: order.paymentMethod,
        createdAt: order.createdAt,
        paidAt: order.paidAt,
        metadata: order.metadata
      }
    })

  } catch (error) {
    console.error('查询订单状态API错误:', error)
    return NextResponse.json({
      success: false,
      error: '服务器错误'
    }, { status: 500 })
  }
}