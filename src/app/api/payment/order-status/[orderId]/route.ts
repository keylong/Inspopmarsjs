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
      }, { 
        status: 400,
        headers: {
          'Cache-Control': 'no-cache, no-store, must-revalidate',
          'Pragma': 'no-cache',
          'Expires': '0'
        }
      })
    }

    // 查找订单
    const order = await getPaymentOrderById(orderId)

    if (!order) {
      return NextResponse.json({
        success: false,
        error: '订单不存在'
      }, { 
        status: 404,
        headers: {
          'Cache-Control': 'no-cache, no-store, must-revalidate',
          'Pragma': 'no-cache',
          'Expires': '0'
        }
      })
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
    }, {
      headers: {
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0'
      }
    })

  } catch (error) {
    console.error('查询订单状态API错误:', error)
    return NextResponse.json({
      success: false,
      error: '服务器错误'
    }, { 
      status: 500,
      headers: {
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0'
      }
    })
  }
}