import Stripe from 'stripe'
import { paymentConfig, getCurrentDomain } from './payment-config'
import { 
  getSubscriptionPlanById, 
  createPaymentOrder, 
  updatePaymentOrder,
  createUserSubscription,
  updateUserSubscription,
  getUserSubscription
} from './payment-db'
import { createInvoice } from './invoice'
import { StripeCheckoutSession } from '@/types/payment'

// 初始化 Stripe
const stripe = new Stripe(paymentConfig.stripe.secretKey, {
  apiVersion: '2024-12-18.acacia',
})

/**
 * 创建 Stripe 支付会话
 */
export async function createStripeCheckoutSession(
  userId: string,
  planId: string,
  returnUrl?: string
): Promise<StripeCheckoutSession> {
  try {
    const plan = await getSubscriptionPlanById(planId)
    if (!plan || !plan.stripePriceId) {
      throw new Error('订阅套餐不存在或未配置 Stripe')
    }

    // 创建支付订单
    const order = await createPaymentOrder({
      userId,
      planId,
      amount: plan.price,
      currency: plan.currency,
      paymentMethod: 'stripe',
      status: 'pending',
    })

    const domain = getCurrentDomain()
    const successUrl = returnUrl || `${domain}/subscription/success?session_id={CHECKOUT_SESSION_ID}`
    const cancelUrl = `${domain}/subscription/cancel?order_id=${order.id}`

    // 创建 Stripe checkout session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price: plan.stripePriceId,
          quantity: 1,
        },
      ],
      mode: plan.duration === 'lifetime' ? 'payment' : 'subscription',
      success_url: successUrl,
      cancel_url: cancelUrl,
      client_reference_id: order.id,
      customer_email: undefined, // 可以从用户信息中获取
      metadata: {
        userId,
        planId,
        orderId: order.id,
      },
    })

    // 更新订单信息
    await updatePaymentOrder(order.id, {
      paymentIntentId: session.id,
      metadata: { sessionId: session.id, sessionUrl: session.url },
    })

    return {
      sessionId: session.id,
      url: session.url || '',
      planId,
      userId,
    }
  } catch (error) {
    console.error('创建 Stripe 支付会话失败:', error)
    throw new Error('创建支付会话失败')
  }
}

/**
 * 处理 Stripe webhook 事件
 */
export async function handleStripeWebhook(
  body: string,
  signature: string
): Promise<{ success: boolean; message?: string }> {
  let event: Stripe.Event

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      paymentConfig.stripe.webhookSecret
    )
  } catch (error) {
    console.error('Webhook 签名验证失败:', error)
    return { success: false, message: 'Invalid signature' }
  }

  try {
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session
        await handleCheckoutSessionCompleted(session)
        break
      }
      
      case 'customer.subscription.created':
      case 'customer.subscription.updated': {
        const subscription = event.data.object as Stripe.Subscription
        await handleSubscriptionUpdated(subscription)
        break
      }
      
      case 'customer.subscription.deleted': {
        const subscription = event.data.object as Stripe.Subscription
        await handleSubscriptionDeleted(subscription)
        break
      }
      
      case 'invoice.payment_succeeded': {
        const invoice = event.data.object as Stripe.Invoice
        await handleInvoicePaymentSucceeded(invoice)
        break
      }
      
      case 'invoice.payment_failed': {
        const invoice = event.data.object as Stripe.Invoice
        await handleInvoicePaymentFailed(invoice)
        break
      }
      
      default:
        console.log(`未处理的事件类型: ${event.type}`)
    }

    return { success: true }
  } catch (error) {
    console.error('处理 Stripe webhook 失败:', error)
    return { success: false, message: 'Processing failed' }
  }
}

/**
 * 处理支付会话完成
 */
async function handleCheckoutSessionCompleted(session: Stripe.Checkout.Session) {
  const orderId = session.client_reference_id
  if (!orderId) {
    console.error('支付会话缺少 orderId')
    return
  }

  const order = await updatePaymentOrder(orderId, {
    status: 'paid',
    paidAt: new Date().toISOString(),
    metadata: { sessionId: session.id },
  })

  if (!order) {
    console.error('订单不存在:', orderId)
    return
  }

  const plan = await getSubscriptionPlanById(order.planId)
  if (!plan) {
    console.error('套餐不存在:', order.planId)
    return
  }

  // 创建或更新用户订阅
  if (plan.duration === 'lifetime') {
    // 终身套餐
    const existingSubscription = await getUserSubscription(order.userId)
    if (existingSubscription) {
      await updateUserSubscription(existingSubscription.id, {
        status: 'canceled',
      })
    }

    await createUserSubscription({
      userId: order.userId,
      planId: order.planId,
      status: 'active',
      paymentMethod: 'stripe',
      currentPeriodStart: new Date().toISOString(),
      currentPeriodEnd: new Date(Date.now() + 100 * 365 * 24 * 60 * 60 * 1000).toISOString(), // 100年后
      cancelAtPeriodEnd: false,
      downloadCount: 0,
      stripeSubscriptionId: session.subscription as string || undefined,
    })
  } else {
    // 定期订阅
    const now = new Date()
    const periodEnd = new Date(now)
    if (plan.duration === 'monthly') {
      periodEnd.setMonth(periodEnd.getMonth() + 1)
    } else if (plan.duration === 'yearly') {
      periodEnd.setFullYear(periodEnd.getFullYear() + 1)
    }

    const existingSubscription = await getUserSubscription(order.userId)
    if (existingSubscription) {
      await updateUserSubscription(existingSubscription.id, {
        planId: order.planId,
        status: 'active',
        currentPeriodStart: now.toISOString(),
        currentPeriodEnd: periodEnd.toISOString(),
        downloadCount: 0, // 重置下载次数
        stripeSubscriptionId: session.subscription as string || undefined,
      })
    } else {
      await createUserSubscription({
        userId: order.userId,
        planId: order.planId,
        status: 'active',
        paymentMethod: 'stripe',
        currentPeriodStart: now.toISOString(),
        currentPeriodEnd: periodEnd.toISOString(),
        cancelAtPeriodEnd: false,
        downloadCount: 0,
        stripeSubscriptionId: session.subscription as string || undefined,
      })
    }
  }

  // 生成发票
  try {
    await createInvoice(orderId)
    console.log('发票生成成功:', orderId)
  } catch (error) {
    console.error('生成发票失败:', orderId, error)
  }
}

/**
 * 处理订阅更新
 */
async function handleSubscriptionUpdated(subscription: Stripe.Subscription) {
  // 根据 Stripe subscription ID 查找用户订阅
  // 这里需要添加通过 stripeSubscriptionId 查找订阅的方法
  console.log('订阅更新:', subscription.id, subscription.status)
}

/**
 * 处理订阅删除
 */
async function handleSubscriptionDeleted(subscription: Stripe.Subscription) {
  console.log('订阅删除:', subscription.id)
}

/**
 * 处理发票支付成功
 */
async function handleInvoicePaymentSucceeded(invoice: Stripe.Invoice) {
  console.log('发票支付成功:', invoice.id)
}

/**
 * 处理发票支付失败
 */
async function handleInvoicePaymentFailed(invoice: Stripe.Invoice) {
  console.log('发票支付失败:', invoice.id)
}

/**
 * 取消用户订阅
 */
export async function cancelStripeSubscription(
  subscriptionId: string,
  cancelAtPeriodEnd = true
): Promise<{ success: boolean; message?: string }> {
  try {
    const subscription = await stripe.subscriptions.update(subscriptionId, {
      cancel_at_period_end: cancelAtPeriodEnd,
    })

    return { 
      success: true, 
      message: cancelAtPeriodEnd ? '订阅将在当前周期结束后取消' : '订阅已立即取消' 
    }
  } catch (error) {
    console.error('取消订阅失败:', error)
    return { success: false, message: '取消订阅失败' }
  }
}

/**
 * 获取 Stripe 订阅详情
 */
export async function getStripeSubscription(subscriptionId: string) {
  try {
    return await stripe.subscriptions.retrieve(subscriptionId)
  } catch (error) {
    console.error('获取订阅详情失败:', error)
    return null
  }
}

/**
 * 创建 Stripe 客户门户会话
 */
export async function createStripePortalSession(
  customerId: string,
  returnUrl?: string
): Promise<string | null> {
  try {
    const domain = getCurrentDomain()
    const session = await stripe.billingPortal.sessions.create({
      customer: customerId,
      return_url: returnUrl || `${domain}/subscription`,
    })

    return session.url
  } catch (error) {
    console.error('创建客户门户会话失败:', error)
    return null
  }
}