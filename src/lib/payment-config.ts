import { PaymentConfig } from '@/types/payment'

export const paymentConfig: PaymentConfig = {
  stripe: {
    publicKey: process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || '',
    secretKey: process.env.STRIPE_SECRET_KEY || '',
    webhookSecret: process.env.STRIPE_WEBHOOK_SECRET || '',
  },
  alipay: {
    appId: process.env.ALIPAY_APP_ID || '',
    privateKey: process.env.ALIPAY_PRIVATE_KEY || '',
    publicKey: process.env.ALIPAY_PUBLIC_KEY || '',
    gatewayUrl: process.env.ALIPAY_GATEWAY_URL || 'https://openapi.alipay.com/gateway.do',
    notifyUrl: process.env.ALIPAY_NOTIFY_URL || '',
    returnUrl: process.env.ALIPAY_RETURN_URL || '',
  },
}

// 验证配置是否完整
export function validatePaymentConfig() {
  const errors: string[] = []

  // 验证 Stripe 配置
  if (!paymentConfig.stripe.publicKey) {
    errors.push('NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY 环境变量未设置')
  }
  if (!paymentConfig.stripe.secretKey) {
    errors.push('STRIPE_SECRET_KEY 环境变量未设置')
  }
  if (!paymentConfig.stripe.webhookSecret) {
    errors.push('STRIPE_WEBHOOK_SECRET 环境变量未设置')
  }

  // 验证支付宝配置
  if (!paymentConfig.alipay.appId) {
    errors.push('ALIPAY_APP_ID 环境变量未设置')
  }
  if (!paymentConfig.alipay.privateKey) {
    errors.push('ALIPAY_PRIVATE_KEY 环境变量未设置')
  }
  if (!paymentConfig.alipay.publicKey) {
    errors.push('ALIPAY_PUBLIC_KEY 环境变量未设置')
  }
  if (!paymentConfig.alipay.notifyUrl) {
    errors.push('ALIPAY_NOTIFY_URL 环境变量未设置')
  }

  return {
    isValid: errors.length === 0,
    errors,
  }
}

// 获取当前域名
export function getCurrentDomain(): string {
  if (process.env.NODE_ENV === 'production') {
    return process.env.NEXTAUTH_URL || 'https://ins.popmars.com'
  }
  return 'http://localhost:3000'
}