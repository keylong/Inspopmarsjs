// 订阅套餐类型
export interface SubscriptionPlan {
  id: string
  name: string
  nameEn: string | null
  description: string
  descriptionEn: string | null
  price: number
  currency: string
  duration: string
  features: string[]
  featuresEn: string[] | null
  downloadLimit: number // -1 表示无限制
  stripeProductId?: string | null
  stripePriceId?: string | null
  alipayProductId?: string | null
  isActive: boolean
  sortOrder: number
  createdAt: Date
  updatedAt: Date
}

// 用户订阅信息
export interface UserSubscription {
  id: string
  userId: string
  planId: string
  status: 'active' | 'canceled' | 'expired' | 'pending'
  paymentMethod: 'stripe' | 'alipay'
  currentPeriodStart: string
  currentPeriodEnd: string
  cancelAtPeriodEnd: boolean
  downloadCount: number // 本周期已使用的下载次数
  stripeSubscriptionId?: string
  alipayOrderId?: string
  createdAt: string
  updatedAt: string
}

// 支付订单
export interface PaymentOrder {
  id: string
  userId: string
  planId: string
  amount: number
  currency: string
  paymentMethod: 'stripe' | 'alipay'
  status: 'pending' | 'paid' | 'failed' | 'canceled' | 'refunded'
  paymentIntentId?: string // Stripe payment intent ID
  alipayTradeNo?: string // 支付宝交易号
  paidAt?: string
  failedReason?: string
  metadata?: Record<string, unknown>
  createdAt: string
  updatedAt: string
}

// 发票信息
export interface Invoice {
  id: string
  userId: string
  orderId: string
  invoiceNumber: string
  amount: number
  currency: string
  tax: number
  totalAmount: number
  status: 'draft' | 'sent' | 'paid' | 'void'
  issuedAt: string
  dueAt: string
  paidAt?: string
  downloadUrl?: string
  createdAt: string
  updatedAt: string
}

// Stripe 相关类型
export interface StripeCheckoutSession {
  sessionId: string
  url: string
  planId: string
  userId: string
}

export interface StripeWebhookEvent {
  id: string
  type: string
  data: {
    object: Record<string, unknown>
  }
  created: number
}

// 支付宝相关类型
export interface AlipayOrderParams {
  out_trade_no: string
  total_amount: string
  subject: string
  body?: string
  return_url?: string
  notify_url?: string
}

export interface AlipayNotifyParams {
  trade_no: string
  out_trade_no: string
  trade_status: string
  total_amount: string
  buyer_email?: string
  [key: string]: unknown
}

// API 请求/响应类型
export interface CreateCheckoutSessionRequest {
  planId: string
  paymentMethod: 'stripe' | 'alipay'
  returnUrl?: string
}

export interface CreateCheckoutSessionResponse {
  success: boolean
  data?: {
    sessionId?: string
    checkoutUrl: string
    orderId: string
  }
  error?: string
}

export interface GetSubscriptionResponse {
  success: boolean
  data?: {
    subscription: UserSubscription | null
    plan: SubscriptionPlan | null
    usage: {
      downloadCount: number
      downloadLimit: number
      remainingDownloads: number
    }
  }
  error?: string
}

export interface GetPlansResponse {
  success: boolean
  data?: SubscriptionPlan[]
  error?: string
}

export interface CancelSubscriptionResponse {
  success: boolean
  message: string
  error?: string
}

// 支付配置
export interface PaymentConfig {
  stripe: {
    publicKey: string
    secretKey: string
    webhookSecret: string
  }
  alipay: {
    appId: string
    privateKey: string
    publicKey: string
    gatewayUrl: string
    notifyUrl: string
    returnUrl: string
  }
}

// 使用统计
export interface UsageStats {
  userId: string
  subscriptionId: string
  downloadCount: number
  lastResetAt: string
  createdAt: string
  updatedAt: string
}