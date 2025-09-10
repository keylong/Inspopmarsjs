import { NextRequest, NextResponse } from 'next/server'
import { getCurrentUser } from '@/lib/auth'
import { createStripeCheckoutSession } from '@/lib/stripe'
import { createAlipayOrder } from '@/lib/alipay'
import { CreateCheckoutSessionRequest, CreateCheckoutSessionResponse } from '@/types/payment'
import { z } from 'zod'

const createCheckoutSchema = z.object({
  planId: z.string().min(1),
  paymentMethod: z.enum(['stripe', 'alipay']),
  returnUrl: z.string().url().optional(),
})

export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser()
    
    if (!user?.id) {
      const response: CreateCheckoutSessionResponse = {
        success: false,
        error: '请先登录',
      }
      return NextResponse.json(response, { status: 401 })
    }

    const body = await request.json()
    const validationResult = createCheckoutSchema.safeParse(body)
    
    if (!validationResult.success) {
      const response: CreateCheckoutSessionResponse = {
        success: false,
        error: '参数无效',
      }
      return NextResponse.json(response, { status: 400 })
    }

    const { planId, paymentMethod, returnUrl } = validationResult.data

    if (paymentMethod === 'stripe') {
      const checkoutSession = await createStripeCheckoutSession(
        user.id,
        planId,
        returnUrl
      )
      
      const response: CreateCheckoutSessionResponse = {
        success: true,
        data: {
          sessionId: checkoutSession.sessionId,
          checkoutUrl: checkoutSession.url,
          orderId: '', // TODO: 返回实际的订单ID
        },
      }
      
      return NextResponse.json(response)
    }

    if (paymentMethod === 'alipay') {
      const alipayOrder = await createAlipayOrder(
        user.id,
        planId,
        returnUrl
      )
      
      const response: CreateCheckoutSessionResponse = {
        success: true,
        data: {
          checkoutUrl: alipayOrder.payUrl,
          orderId: alipayOrder.orderId,
        },
      }
      
      return NextResponse.json(response)
    }

    const response: CreateCheckoutSessionResponse = {
      success: false,
      error: '不支持的支付方式',
    }
    return NextResponse.json(response, { status: 400 })
    
  } catch (error) {
    console.error('创建支付会话失败:', error)
    
    const response: CreateCheckoutSessionResponse = {
      success: false,
      error: '创建支付会话失败',
    }
    
    return NextResponse.json(response, { status: 500 })
  }
}