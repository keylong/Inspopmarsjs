import { PrismaClient, Prisma } from '@prisma/client'
import { Decimal } from '@prisma/client/runtime/library'
import type { SubscriptionPlan as ISubscriptionPlan, PaymentOrder as IPaymentOrder, UserSubscription as IUserSubscription } from '@/types/payment'

// 全局 Prisma 实例
const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: ['query'],
  })

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma

// 导出类型别名
export type SubscriptionPlan = ISubscriptionPlan
export type PaymentOrder = IPaymentOrder  
export type UserSubscription = IUserSubscription

// 扩展类型定义（增加数据库特有字段）
interface DbSubscriptionPlan extends ISubscriptionPlan {
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
  downloadLimit: number
  stripeProductId: string | null
  stripePriceId: string | null
  alipayProductId: string | null
  isActive: boolean
  sortOrder: number
  createdAt: Date
  updatedAt: Date
}

interface DbUserSubscription {
  id: string
  userId: string
  planId: string
  status: 'active' | 'canceled' | 'expired' | 'pending'
  paymentMethod: 'stripe' | 'alipay'
  currentPeriodStart: Date
  currentPeriodEnd: Date
  cancelAtPeriodEnd: boolean
  downloadCount: number
  stripeSubscriptionId?: string | null
  alipayOrderId?: string | null
  createdAt: Date
  updatedAt: Date
}

interface DbPaymentOrder {
  id: string
  userId: string
  planId: string
  amount: Decimal
  currency: string
  paymentMethod: string
  status: string
  paymentIntentId: string | null
  alipayTradeNo: string | null
  gatewayOrderId?: string | null
  gatewayAmount?: Decimal | null
  metadata: any
  paidAt: Date | null
  failedReason?: string | null
  createdAt: Date
  updatedAt: Date
}

export interface UsageStats {
  id: string
  userId: string
  subscriptionId: string
  downloadCount: number
  lastResetAt: Date
  createdAt: Date
  updatedAt: Date
}

// ===== 订阅套餐管理 =====

export async function getSubscriptionPlans(): Promise<SubscriptionPlan[]> {
  try {
    const plans = await prisma.subscriptionPlan.findMany({
      where: { isActive: true },
      orderBy: { sortOrder: 'asc' }
    })
    
    // 转换Decimal为number
    return plans.map(plan => ({
      ...plan,
      price: plan.price.toNumber(),
      features: plan.features as string[],
      featuresEn: plan.featuresEn as string[] | null
    }))
  } catch (error) {
    console.error('获取订阅套餐失败:', error)
    // 返回默认套餐
    return await getDefaultPlans()
  }
}

export async function getSubscriptionPlanById(planId: string): Promise<SubscriptionPlan | null> {
  try {
    const plan = await prisma.subscriptionPlan.findFirst({
      where: { 
        id: planId,
        isActive: true 
      }
    })
    
    if (!plan) return null
    
    return {
      ...plan,
      price: plan.price.toNumber(),
      features: plan.features as string[],
      featuresEn: plan.featuresEn as string[] | null
    }
  } catch (error) {
    console.error('获取套餐详情失败:', error)
    return null
  }
}

async function getDefaultPlans(): Promise<SubscriptionPlan[]> {
  const defaultPlans = [
    {
      id: 'basic-monthly',
      name: '基础月度套餐',
      nameEn: 'Basic Monthly',
      description: '每月100次下载，支持图片和视频',
      descriptionEn: '100 downloads per month, supports images and videos',
      price: new Decimal(28),
      currency: 'CNY',
      duration: 'monthly',
      features: ['每月100次下载', '图片视频下载', '标准画质', '邮件支持'],
      featuresEn: ['100 downloads/month', 'Image & video download', 'Standard quality', 'Email support'],
      downloadLimit: 100,
      stripeProductId: 'prod_basic_monthly',
      stripePriceId: 'price_basic_monthly',
      alipayProductId: 'basic_monthly',
      isActive: true,
      sortOrder: 1,
    },
    {
      id: 'pro-monthly',
      name: '专业年度套餐',
      nameEn: 'Pro Monthly',
      description: '每月500次下载，高清画质，批量下载',
      descriptionEn: '500 downloads per month, HD quality, batch download',
      price: new Decimal(188),
      currency: 'CNY',
      duration: 'monthly',
      features: ['每月500次下载', '高清画质', '批量下载', '优先支持'],
      featuresEn: ['500 downloads/month', 'HD quality', 'Batch download', 'Priority support'],
      downloadLimit: 500,
      stripeProductId: 'prod_pro_monthly',
      stripePriceId: 'price_pro_monthly',
      alipayProductId: 'pro_monthly',
      isActive: true,
      sortOrder: 2,
    },
    {
      id: 'unlimited-monthly',
      name: '年SVIP套餐',
      nameEn: 'Unlimited Monthly',
      description: '无限下载，最高画质，API访问',
      descriptionEn: 'Unlimited downloads, highest quality, API access',
      price: new Decimal(398),
      currency: 'CNY',
      duration: 'monthly',
      features: ['无限下载', '最高画质', 'API访问', '24/7支持'],
      featuresEn: ['Unlimited downloads', 'Highest quality', 'API access', '24/7 support'],
      downloadLimit: -1,
      stripeProductId: 'prod_unlimited_monthly',
      stripePriceId: 'price_unlimited_monthly',
      alipayProductId: 'unlimited_monthly',
      isActive: true,
      sortOrder: 3,
    }
  ]

  try {
    // 使用upsert确保默认套餐存在
    for (const plan of defaultPlans) {
      await prisma.subscriptionPlan.upsert({
        where: { id: plan.id },
        update: plan,
        create: plan
      })
    }

    return defaultPlans.map(plan => ({
      ...plan,
      price: plan.price.toNumber(),
      createdAt: new Date(),
      updatedAt: new Date()
    }))
  } catch (error) {
    console.error('创建默认套餐失败:', error)
    throw error
  }
}

// ===== 用户订阅管理 =====

// 辅助函数：转换数据库订阅到应用订阅
function convertDbSubscriptionToApp(dbSub: DbUserSubscription): UserSubscription {
  return {
    id: dbSub.id,
    userId: dbSub.userId,
    planId: dbSub.planId,
    status: dbSub.status,
    paymentMethod: dbSub.paymentMethod,
    currentPeriodStart: dbSub.currentPeriodStart.toISOString(),
    currentPeriodEnd: dbSub.currentPeriodEnd.toISOString(),
    cancelAtPeriodEnd: dbSub.cancelAtPeriodEnd,
    downloadCount: dbSub.downloadCount,
    stripeSubscriptionId: dbSub.stripeSubscriptionId || undefined,
    alipayOrderId: dbSub.alipayOrderId || undefined,
    createdAt: dbSub.createdAt.toISOString(),
    updatedAt: dbSub.updatedAt.toISOString()
  }
}

export async function getUserSubscription(userId: string): Promise<UserSubscription | null> {
  try {
    const subscription = await prisma.userSubscription.findFirst({
      where: {
        userId,
        status: {
          in: ['active', 'pending']
        },
        currentPeriodEnd: {
          gt: new Date()
        }
      },
      orderBy: { createdAt: 'desc' }
    }) as DbUserSubscription | null

    if (!subscription) return null

    return convertDbSubscriptionToApp(subscription)
  } catch (error) {
    console.error('获取用户订阅失败:', error)
    return null
  }
}

export async function createUserSubscription(subscription: Omit<UserSubscription, 'id' | 'createdAt' | 'updatedAt'>): Promise<UserSubscription> {
  try {
    const newSubscription = await prisma.userSubscription.create({
      data: {
        ...subscription,
        currentPeriodStart: new Date(subscription.currentPeriodStart),
        currentPeriodEnd: new Date(subscription.currentPeriodEnd)
      }
    })

    console.log(`创建用户订阅成功: ${newSubscription.id}`)
    return convertDbSubscriptionToApp(newSubscription as DbUserSubscription)
  } catch (error) {
    console.error('创建用户订阅失败:', error)
    throw new Error(`创建订阅失败: ${error instanceof Error ? error.message : String(error)}`)
  }
}

export async function updateUserSubscription(id: string, updates: Partial<Omit<UserSubscription, 'id' | 'createdAt'>>): Promise<UserSubscription | null> {
  try {
    const updatedSubscription = await prisma.userSubscription.update({
      where: { id },
      data: updates
    })

    return convertDbSubscriptionToApp(updatedSubscription as DbUserSubscription)
  } catch (error) {
    console.error('更新用户订阅失败:', error)
    return null
  }
}

// ===== 支付订单管理 =====

// 辅助函数：转换数据库订单到应用订单
function convertDbOrderToApp(dbOrder: DbPaymentOrder): PaymentOrder {
  return {
    id: dbOrder.id,
    userId: dbOrder.userId,
    planId: dbOrder.planId,
    amount: dbOrder.amount.toNumber(),
    currency: dbOrder.currency,
    paymentMethod: dbOrder.paymentMethod as 'stripe' | 'alipay',
    status: dbOrder.status as 'pending' | 'paid' | 'failed' | 'canceled' | 'refunded',
    paymentIntentId: dbOrder.paymentIntentId || undefined,
    alipayTradeNo: dbOrder.alipayTradeNo || undefined,
    paidAt: dbOrder.paidAt ? dbOrder.paidAt.toISOString() : undefined,
    failedReason: dbOrder.failedReason || undefined,
    metadata: dbOrder.metadata || undefined,
    createdAt: dbOrder.createdAt.toISOString(),
    updatedAt: dbOrder.updatedAt.toISOString()
  }
}

export async function createPaymentOrder(order: Omit<PaymentOrder, 'id' | 'createdAt' | 'updatedAt'>): Promise<PaymentOrder> {
  try {
    const { metadata, paidAt, ...orderData } = order
    const newOrder = await prisma.paymentOrder.create({
      data: {
        ...orderData,
        amount: new Decimal(order.amount),
        metadata: metadata as Prisma.InputJsonValue || undefined,
        paidAt: paidAt ? new Date(paidAt) : undefined
      }
    })

    console.log(`创建支付订单成功: ${newOrder.id}`)
    return convertDbOrderToApp(newOrder as DbPaymentOrder)
  } catch (error) {
    console.error('创建支付订单失败:', error)
    throw new Error(`创建订单失败: ${error instanceof Error ? error.message : String(error)}`)
  }
}

export async function updatePaymentOrder(id: string, updates: Partial<Omit<PaymentOrder, 'id' | 'createdAt'>>): Promise<PaymentOrder | null> {
  try {
    const updateData: any = { ...updates }
    if (updates.amount !== undefined) {
      updateData.amount = new Decimal(updates.amount)
    }
    // 转换 paidAt 为 Date 对象
    if (updates.paidAt !== undefined) {
      updateData.paidAt = updates.paidAt ? new Date(updates.paidAt) : null
    }

    const updatedOrder = await prisma.paymentOrder.update({
      where: { id },
      data: updateData
    })

    return convertDbOrderToApp(updatedOrder as DbPaymentOrder)
  } catch (error) {
    console.error('更新支付订单失败:', error)
    return null
  }
}

export async function getPaymentOrderById(id: string): Promise<PaymentOrder | null> {
  try {
    const order = await prisma.paymentOrder.findUnique({
      where: { id }
    })

    if (!order) return null

    return convertDbOrderToApp(order as DbPaymentOrder)
  } catch (error) {
    console.error('获取支付订单失败:', error)
    return null
  }
}

export async function getPaymentOrderByPaymentIntentId(paymentIntentId: string): Promise<PaymentOrder | null> {
  try {
    const order = await prisma.paymentOrder.findFirst({
      where: { paymentIntentId }
    })

    if (!order) return null

    return convertDbOrderToApp(order as DbPaymentOrder)
  } catch (error) {
    console.error('通过PaymentIntentId获取订单失败:', error)
    return null
  }
}

export async function getPaymentOrderByAlipayTradeNo(tradeNo: string): Promise<PaymentOrder | null> {
  try {
    const order = await prisma.paymentOrder.findFirst({
      where: { alipayTradeNo: tradeNo }
    })

    if (!order) return null

    return convertDbOrderToApp(order as DbPaymentOrder)
  } catch (error) {
    console.error('通过支付宝交易号获取订单失败:', error)
    return null
  }
}

export async function getPaymentOrderByGatewayId(gatewayOrderId: string): Promise<PaymentOrder | null> {
  try {
    const order = await prisma.paymentOrder.findFirst({
      where: {
        metadata: {
          path: ['gatewayOrderData', 'orderId'],
          equals: gatewayOrderId
        }
      }
    })

    if (!order) return null

    return convertDbOrderToApp(order as DbPaymentOrder)
  } catch (error) {
    console.error('通过网关订单ID获取订单失败:', error)
    return null
  }
}

// 支付成功处理
interface ProcessPaymentParams {
  orderId: string
  userId: string
  planId: string
  paymentId: string
  paidAt: string
}

export async function processSuccessfulPayment(params: ProcessPaymentParams): Promise<void> {
  try {
    const { orderId, userId, planId, paymentId, paidAt } = params

    // 获取订单
    const order = await getPaymentOrderById(orderId)
    if (!order) {
      throw new Error('订单不存在')
    }

    // 获取套餐信息
    const plan = await getSubscriptionPlanById(planId)
    if (!plan) {
      throw new Error('套餐不存在')
    }

    // 更新订单状态
    await updatePaymentOrder(orderId, {
      status: 'paid',
      paidAt: paidAt,
      metadata: {
        ...order.metadata,
        paymentId,
        processedAt: new Date().toISOString()
      }
    })

    // 检查用户是否已有活跃订阅
    const existingSubscription = await getUserSubscription(userId)

    if (existingSubscription) {
      // 如果有现有订阅，先取消它
      await updateUserSubscription(existingSubscription.id, {
        status: 'canceled',
        cancelAtPeriodEnd: true
      })
    }

    // 计算订阅周期
    const currentTime = new Date()
    let periodEnd: Date

    switch (plan.duration) {
      case 'monthly':
        periodEnd = new Date(currentTime.getTime() + 30 * 24 * 60 * 60 * 1000) // 30天
        break
      case 'yearly':
        periodEnd = new Date(currentTime.getTime() + 365 * 24 * 60 * 60 * 1000) // 365天
        break
      case 'lifetime':
        periodEnd = new Date(Date.UTC(2099, 11, 31)) // 设置为2099年
        break
      default:
        periodEnd = new Date(currentTime.getTime() + 30 * 24 * 60 * 60 * 1000)
    }

    // 创建新订阅
    const newSubscription = await createUserSubscription({
      userId,
      planId,
      status: 'active',
      paymentMethod: order.paymentMethod,
      currentPeriodStart: currentTime.toISOString(),
      currentPeriodEnd: periodEnd.toISOString(),
      cancelAtPeriodEnd: false,
      downloadCount: 0
    })

    // 创建使用统计记录
    await createOrUpdateUsageStats(userId, newSubscription.id, 0)

    console.log(`支付成功处理完成: 订单=${orderId}, 用户=${userId}, 订阅=${newSubscription.id}`)

  } catch (error) {
    console.error('处理支付成功失败:', error)
    throw error
  }
}

// ===== 使用统计管理 =====

export async function getUserUsageStats(userId: string, subscriptionId: string): Promise<UsageStats | null> {
  try {
    const stats = await prisma.usageStats.findUnique({
      where: {
        userId_subscriptionId: {
          userId,
          subscriptionId
        }
      }
    })

    return stats
  } catch (error) {
    console.error('获取使用统计失败:', error)
    return null
  }
}

export async function createOrUpdateUsageStats(userId: string, subscriptionId: string, downloadCount: number): Promise<UsageStats> {
  try {
    if (!userId?.trim() || !subscriptionId?.trim()) {
      throw new Error('用户ID和订阅ID不能为空')
    }
    
    if (downloadCount < 0) {
      throw new Error('下载次数不能为负数')
    }

    const now = new Date()

    const stats = await prisma.usageStats.upsert({
      where: {
        userId_subscriptionId: {
          userId: userId.trim(),
          subscriptionId: subscriptionId.trim()
        }
      },
      update: {
        downloadCount,
        updatedAt: now
      },
      create: {
        userId: userId.trim(),
        subscriptionId: subscriptionId.trim(),
        downloadCount,
        lastResetAt: now
      }
    })

    console.log(`使用统计操作成功: ${userId} - ${subscriptionId}`)
    return stats
  } catch (error) {
    console.error('创建或更新使用统计失败:', error)
    throw new Error(`使用统计操作失败: ${error instanceof Error ? error.message : String(error)}`)
  }
}

export async function incrementDownloadCount(userId: string): Promise<{
  success: boolean
  remainingDownloads: number
  message?: string
}> {
  try {
    if (!userId?.trim()) {
      return {
        success: false,
        remainingDownloads: 0,
        message: '用户ID不能为空'
      }
    }

    const subscription = await getUserSubscription(userId)
    
    if (!subscription) {
      return {
        success: false,
        remainingDownloads: 0,
        message: '没有有效订阅'
      }
    }

    const plan = await getSubscriptionPlanById(subscription.planId)
    if (!plan) {
      return {
        success: false,
        remainingDownloads: 0,
        message: '订阅套餐不存在'
      }
    }

    // 无限制套餐
    if (plan.downloadLimit === -1) {
      const newDownloadCount = subscription.downloadCount + 1
      await createOrUpdateUsageStats(userId, subscription.id, newDownloadCount)
      await updateUserSubscription(subscription.id, {
        downloadCount: newDownloadCount
      })
      return {
        success: true,
        remainingDownloads: -1
      }
    }

    // 检查下载次数限制
    if (subscription.downloadCount >= plan.downloadLimit) {
      return {
        success: false,
        remainingDownloads: 0,
        message: '本周期下载次数已用完'
      }
    }

    // 增加下载次数
    const newDownloadCount = subscription.downloadCount + 1
    await createOrUpdateUsageStats(userId, subscription.id, newDownloadCount)
    await updateUserSubscription(subscription.id, {
      downloadCount: newDownloadCount
    })

    const remaining = plan.downloadLimit - newDownloadCount
    console.log(`用户 ${userId} 下载次数增加，剩余: ${remaining}`)

    return {
      success: true,
      remainingDownloads: remaining
    }
  } catch (error) {
    console.error('增加下载次数失败:', error)
    return {
      success: false,
      remainingDownloads: 0,
      message: `操作失败: ${error instanceof Error ? error.message : String(error)}`
    }
  }
}