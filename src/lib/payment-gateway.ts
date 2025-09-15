import crypto from 'crypto'

// 支付网关配置
export interface PaymentGatewayConfig {
  gatewayUrl: string
  apiKey: string
  callbackUrl: string
}

// 支付网关订单创建参数
export interface CreateGatewayOrderParams {
  productName: string
  amount: number
  paymentMethod: 'alipay' | 'wechat'
}

// 支付网关订单响应
export interface GatewayOrderResponse {
  success: boolean
  orderId: string
  amount: number
  displayAmount: number
  paymentMethod: string
  message: string
  expiresAt: string
  qrCodeUrl?: string  // 可能包含二维码链接
}

// 支付网关订单状态响应
export interface GatewayOrderStatusResponse {
  orderId: string
  productName: string
  amount: number
  paymentMethod: string
  status: 'pending' | 'success' | 'failed' | 'expired'
  paymentId?: string
  createdAt: string
  expiresAt: string
  paidAt?: string
}

// 支付网关回调数据
export interface GatewayCallbackData {
  orderId: string
  amount: number
  uid: string
  paymentMethod: string
  status: string
  timestamp: number | string // 支持数字类型的Unix时间戳或字符串
  customerType?: string // 可选字段
  nonce: string
  signature: string
}

// 获取支付网关配置
export function getPaymentGatewayConfig(): PaymentGatewayConfig {
  return {
    gatewayUrl: process.env.PAYMENT_GATEWAY_URL || 'https://pay.chats2gpt.com',
    apiKey: process.env.PAYMENT_GATEWAY_API_KEY || '',
    callbackUrl: process.env.PAYMENT_GATEWAY_CALLBACK_URL || `${getCurrentDomain()}/api/payment/gateway-callback`
  }
}

// 获取当前域名
function getCurrentDomain(): string {
  if (process.env.NODE_ENV === 'production') {
    return process.env.NEXTAUTH_URL || 'https://ins.popmars.com'
  }
  return 'http://localhost:3000'
}

// 生成签名
export function generateSignature(params: Record<string, string | number | boolean>, apiKey: string): string {
  // 添加API密钥到参数中
  const allParams: Record<string, string | number | boolean> = { ...params, api_key: apiKey }
  
  // 按key排序
  const sortedKeys = Object.keys(allParams).sort()
  
  // 构建签名字符串
  const signString = sortedKeys
    .filter(key => allParams[key] !== undefined && allParams[key] !== null)
    .map(key => `${key}=${allParams[key]}`)
    .join('&')
  
  console.log('签名字符串:', signString)
  
  // 生成HMAC-SHA256签名
  return crypto.createHmac('sha256', apiKey)
    .update(signString, 'utf8')
    .digest('hex')
}

// 验证签名
export function verifySignature(params: Record<string, string | number | boolean>, receivedSignature: string, apiKey: string): boolean {
  try {
    const { signature: _signature, ...otherParams } = params // 从参数中提取签名（未直接使用）
    const expectedSignature = generateSignature(otherParams, apiKey)
    
    // 使用constant-time比较防止时序攻击
    return crypto.timingSafeEqual(
      Buffer.from(receivedSignature, 'hex'),
      Buffer.from(expectedSignature, 'hex')
    )
  } catch (error: unknown) {
    console.error('签名验证错误:', error)
    return false
  }
}

// 创建支付网关订单
export async function createGatewayOrder(params: CreateGatewayOrderParams): Promise<GatewayOrderResponse> {
  const config = getPaymentGatewayConfig()
  
  try {
    const response = await fetch(`${config.gatewayUrl}/api/orders`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        productName: params.productName,
        amount: params.amount,
        paymentMethod: params.paymentMethod
      }),
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const result = await response.json()
    
    if (!result.success) {
      throw new Error(result.message || '创建订单失败')
    }

    return result
  } catch (error: unknown) {
    console.error('创建支付网关订单失败:', error)
    throw error
  }
}

// 查询支付网关订单状态
export async function getGatewayOrderStatus(orderId: string): Promise<GatewayOrderStatusResponse> {
  const config = getPaymentGatewayConfig()
  
  try {
    const response = await fetch(`${config.gatewayUrl}/api/order-status?orderId=${orderId}`)

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const result = await response.json()
    return result
  } catch (error: unknown) {
    console.error('查询支付网关订单状态失败:', error)
    throw error
  }
}

// 配置支付网关回调地址和API密钥
export async function configurePaymentGateway(): Promise<void> {
  const config = getPaymentGatewayConfig()
  
  if (!config.apiKey) {
    console.warn('支付网关API密钥未配置')
    return
  }
  
  try {
    const response = await fetch(`${config.gatewayUrl}/api/config`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        callbackUrl: config.callbackUrl,
        apiKey: config.apiKey,
        name: 'Inspopmars支付系统',
        description: 'Instagram内容下载服务支付系统'
      }),
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const result = await response.json()
    
    if (result.success) {
      console.log('支付网关配置更新成功')
    } else {
      console.error('支付网关配置更新失败:', result.message)
    }
  } catch (error: unknown) {
    console.error('配置支付网关失败:', error)
  }
}