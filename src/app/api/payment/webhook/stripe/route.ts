import { NextRequest, NextResponse } from 'next/server'
import { handleStripeWebhook } from '@/lib/stripe'

export async function POST(request: NextRequest) {
  try {
    const body = await request.text()
    const signature = request.headers.get('stripe-signature')

    if (!signature) {
      return NextResponse.json({ error: 'Missing signature' }, { status: 400 })
    }

    const result = await handleStripeWebhook(body, signature)

    if (result.success) {
      return NextResponse.json({ received: true })
    } else {
      return NextResponse.json(
        { error: result.message || 'Webhook processing failed' }, 
        { status: 400 }
      )
    }
  } catch (error) {
    console.error('Stripe webhook 处理失败:', error)
    return NextResponse.json(
      { error: 'Internal server error' }, 
      { status: 500 }
    )
  }
}

// 禁用 Next.js 的请求体解析，保持原始格式用于签名验证
export const config = {
  api: {
    bodyParser: false,
  },
}