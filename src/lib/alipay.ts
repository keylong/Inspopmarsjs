import * as AlipaySdk from 'alipay-sdk'
import { paymentConfig, getCurrentDomain } from './payment-config'
import { 
  getSubscriptionPlanById, 
  createPaymentOrder, 
  updatePaymentOrder,
  createUserSubscription,
  updateUserSubscription,
  getUserSubscription,
  getPaymentOrderByAlipayTradeNo
} from './payment-db'
import { createInvoice } from './invoice'
import { AlipayOrderParams, AlipayNotifyParams } from '@/types/payment'
import crypto from 'crypto'

// 初始化支付宝 SDK
const alipaySdk = new AlipaySdk({
  appId: paymentConfig.alipay.appId,
  privateKey: paymentConfig.alipay.privateKey,
  alipayPublicKey: paymentConfig.alipay.publicKey,
  gateway: paymentConfig.alipay.gatewayUrl,
  timeout: 5000,
  camelCase: true,
})

/**
 * 创建支付宝支付订单
 */
export async function createAlipayOrder(
  userId: string,
  planId: string,
  returnUrl?: string
): Promise<{
  orderId: string
  payUrl: string
}> {
  try {
    const plan = await getSubscriptionPlanById(planId)
    if (!plan) {
      throw new Error('订阅套餐不存在')
    }

    // 创建支付订单
    const order = await createPaymentOrder({
      userId,
      planId,
      amount: plan.price,
      currency: 'CNY', // 支付宝使用人民币
      paymentMethod: 'alipay',
      status: 'pending',
    })

    const domain = getCurrentDomain()
    const outTradeNo = `order_${order.id}_${Date.now()}`
    
    const orderParams: AlipayOrderParams = {
      out_trade_no: outTradeNo,
      total_amount: (plan.price * 6.5).toFixed(2), // USD to CNY 假设汇率
      subject: `${plan.name} - Instagram 下载器订阅`,
      body: plan.description,
      return_url: returnUrl || `${domain}/subscription/success`,
      notify_url: `${domain}/api/payment/webhook/alipay`,
    }

    // 生成支付页面 URL
    const payUrl = await alipaySdk.pageExecute('alipay.trade.page.pay', {
      bizContent: {
        outTradeNo: orderParams.out_trade_no,
        totalAmount: orderParams.total_amount,
        subject: orderParams.subject,
        body: orderParams.body,
        productCode: 'FAST_INSTANT_TRADE_PAY',
      },
      returnUrl: orderParams.return_url,
      notifyUrl: orderParams.notify_url,
    })

    // 更新订单信息
    await updatePaymentOrder(order.id, {
      alipayTradeNo: outTradeNo,
      metadata: { payUrl, orderParams },
    })

    return {
      orderId: order.id,
      payUrl,
    }
  } catch (error) {
    console.error('创建支付宝支付订单失败:', error)
    throw new Error('创建支付订单失败')
  }
}

/**
 * 处理支付宝支付回调通知
 */
export async function handleAlipayNotify(
  params: Record<string, string>
): Promise<{ success: boolean; message?: string }> {
  try {
    // 验证签名
    const isValid = alipaySdk.checkNotifySign(params)
    if (!isValid) {
      console.error('支付宝回调签名验证失败')
      return { success: false, message: 'Invalid signature' }
    }

    const {
      trade_no,
      out_trade_no,
      trade_status,
      total_amount,
      buyer_email,
    } = params as AlipayNotifyParams

    // 根据商户订单号查找订单
    const order = await getPaymentOrderByAlipayTradeNo(out_trade_no)
    if (!order) {
      console.error('订单不存在:', out_trade_no)
      return { success: false, message: 'Order not found' }
    }

    // 处理不同的交易状态
    switch (trade_status) {
      case 'TRADE_SUCCESS':
      case 'TRADE_FINISHED': {
        // 支付成功
        await updatePaymentOrder(order.id, {
          status: 'paid',
          paidAt: new Date().toISOString(),
          metadata: {
            ...order.metadata,
            tradeNo: trade_no,
            buyerEmail: buyer_email,
          },
        })

        // 激活订阅
        await activateSubscription(order)
        break
      }
      
      case 'TRADE_CLOSED': {
        // 交易关闭
        await updatePaymentOrder(order.id, {
          status: 'canceled',
          failedReason: '交易已关闭',
        })
        break
      }
      
      default:
        console.log(`未处理的交易状态: ${trade_status}`)
    }

    return { success: true }
  } catch (error) {
    console.error('处理支付宝回调失败:', error)
    return { success: false, message: 'Processing failed' }
  }
}

/**
 * 激活用户订阅
 */
async function activateSubscription(order: any) {
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
      paymentMethod: 'alipay',
      currentPeriodStart: new Date().toISOString(),
      currentPeriodEnd: new Date(Date.now() + 100 * 365 * 24 * 60 * 60 * 1000).toISOString(), // 100年后
      cancelAtPeriodEnd: false,
      downloadCount: 0,
      alipayOrderId: order.alipayTradeNo,
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
        alipayOrderId: order.alipayTradeNo,
      })
    } else {
      await createUserSubscription({
        userId: order.userId,
        planId: order.planId,
        status: 'active',
        paymentMethod: 'alipay',
        currentPeriodStart: now.toISOString(),
        currentPeriodEnd: periodEnd.toISOString(),
        cancelAtPeriodEnd: false,
        downloadCount: 0,
        alipayOrderId: order.alipayTradeNo,
      })
    }
  }

  // 生成发票
  try {
    await createInvoice(order.id)
    console.log('支付宝订单发票生成成功:', order.id)
  } catch (error) {
    console.error('支付宝订单生成发票失败:', order.id, error)
  }
}

/**
 * 查询支付宝交易状态
 */
export async function queryAlipayTradeStatus(outTradeNo: string): Promise<{
  success: boolean
  tradeStatus?: string
  tradeNo?: string
  totalAmount?: string
  error?: string
}> {
  try {
    const result = await alipaySdk.exec('alipay.trade.query', {
      bizContent: {
        outTradeNo,
      },
    })

    if (result.code === '10000') {
      return {
        success: true,
        tradeStatus: result.tradeStatus,
        tradeNo: result.tradeNo,
        totalAmount: result.totalAmount,
      }
    } else {
      return {
        success: false,
        error: result.subMsg || result.msg || '查询失败',
      }
    }
  } catch (error) {
    console.error('查询交易状态失败:', error)
    return {
      success: false,
      error: '查询失败',
    }
  }
}

/**
 * 关闭支付宝交易
 */
export async function closeAlipayTrade(outTradeNo: string): Promise<{
  success: boolean
  message?: string
}> {
  try {
    const result = await alipaySdk.exec('alipay.trade.close', {
      bizContent: {
        outTradeNo,
      },
    })

    if (result.code === '10000') {
      return {
        success: true,
        message: '订单已关闭',
      }
    } else {
      return {
        success: false,
        message: result.subMsg || result.msg || '关闭失败',
      }
    }
  } catch (error) {
    console.error('关闭交易失败:', error)
    return {
      success: false,
      message: '关闭失败',
    }
  }
}