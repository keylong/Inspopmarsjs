import fs from 'fs/promises'
import path from 'path'
import {
  SubscriptionPlan,
  UserSubscription,
  PaymentOrder,
  Invoice,
  UsageStats
} from '@/types/payment'

// 数据存储路径
const DB_PATH = path.join(process.cwd(), 'data')
const PLANS_FILE = path.join(DB_PATH, 'subscription-plans.json')
const SUBSCRIPTIONS_FILE = path.join(DB_PATH, 'user-subscriptions.json')
const ORDERS_FILE = path.join(DB_PATH, 'payment-orders.json')
const INVOICES_FILE = path.join(DB_PATH, 'invoices.json')
const USAGE_FILE = path.join(DB_PATH, 'usage-stats.json')

// 确保数据目录存在
async function ensureDataDir() {
  try {
    await fs.access(DB_PATH)
  } catch {
    await fs.mkdir(DB_PATH, { recursive: true })
  }
}

// ===== 订阅套餐管理 =====

export async function getSubscriptionPlans(): Promise<SubscriptionPlan[]> {
  try {
    await ensureDataDir()
    const data = await fs.readFile(PLANS_FILE, 'utf-8')
    const plans = JSON.parse(data) as SubscriptionPlan[]
    return plans.filter(plan => plan.isActive).sort((a, b) => a.sortOrder - b.sortOrder)
  } catch {
    // 返回默认套餐
    return getDefaultPlans()
  }
}

export async function getSubscriptionPlanById(planId: string): Promise<SubscriptionPlan | null> {
  const plans = await getSubscriptionPlans()
  return plans.find(plan => plan.id === planId) || null
}

async function getDefaultPlans(): Promise<SubscriptionPlan[]> {
  const defaultPlans: SubscriptionPlan[] = [
    {
      id: 'basic-monthly',
      name: '基础月度套餐',
      nameEn: 'Basic Monthly',
      description: '每月100次下载，支持图片和视频',
      descriptionEn: '100 downloads per month, supports images and videos',
      price: 9.99,
      currency: 'USD',
      duration: 'monthly',
      features: ['每月100次下载', '图片视频下载', '标准画质', '邮件支持'],
      featuresEn: ['100 downloads/month', 'Image & video download', 'Standard quality', 'Email support'],
      downloadLimit: 100,
      stripeProductId: 'prod_basic_monthly',
      stripePriceId: 'price_basic_monthly',
      alipayProductId: 'basic_monthly',
      isActive: true,
      sortOrder: 1,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: 'pro-monthly',
      name: '专业月度套餐',
      nameEn: 'Pro Monthly',
      description: '每月500次下载，高清画质，批量下载',
      descriptionEn: '500 downloads per month, HD quality, batch download',
      price: 19.99,
      currency: 'USD',
      duration: 'monthly',
      features: ['每月500次下载', '高清画质', '批量下载', '优先支持'],
      featuresEn: ['500 downloads/month', 'HD quality', 'Batch download', 'Priority support'],
      downloadLimit: 500,
      stripeProductId: 'prod_pro_monthly',
      stripePriceId: 'price_pro_monthly',
      alipayProductId: 'pro_monthly',
      isActive: true,
      sortOrder: 2,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: 'unlimited-monthly',
      name: '无限月度套餐',
      nameEn: 'Unlimited Monthly',
      description: '无限下载，最高画质，API访问',
      descriptionEn: 'Unlimited downloads, highest quality, API access',
      price: 39.99,
      currency: 'USD',
      duration: 'monthly',
      features: ['无限下载', '最高画质', 'API访问', '24/7支持'],
      featuresEn: ['Unlimited downloads', 'Highest quality', 'API access', '24/7 support'],
      downloadLimit: -1,
      stripeProductId: 'prod_unlimited_monthly',
      stripePriceId: 'price_unlimited_monthly',
      alipayProductId: 'unlimited_monthly',
      isActive: true,
      sortOrder: 3,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }
  ]

  // 保存默认套餐
  await ensureDataDir()
  await fs.writeFile(PLANS_FILE, JSON.stringify(defaultPlans, null, 2), 'utf-8')
  return defaultPlans
}

// ===== 用户订阅管理 =====

async function readUserSubscriptions(): Promise<UserSubscription[]> {
  try {
    await ensureDataDir()
    const data = await fs.readFile(SUBSCRIPTIONS_FILE, 'utf-8')
    return JSON.parse(data)
  } catch {
    return []
  }
}

async function writeUserSubscriptions(subscriptions: UserSubscription[]): Promise<void> {
  await ensureDataDir()
  await fs.writeFile(SUBSCRIPTIONS_FILE, JSON.stringify(subscriptions, null, 2), 'utf-8')
}

export async function getUserSubscription(userId: string): Promise<UserSubscription | null> {
  const subscriptions = await readUserSubscriptions()
  const activeSubscription = subscriptions.find(
    sub => sub.userId === userId && 
    (sub.status === 'active' || sub.status === 'pending') &&
    new Date(sub.currentPeriodEnd) > new Date()
  )
  return activeSubscription || null
}

export async function createUserSubscription(subscription: Omit<UserSubscription, 'id' | 'createdAt' | 'updatedAt'>): Promise<UserSubscription> {
  const subscriptions = await readUserSubscriptions()
  
  const newSubscription: UserSubscription = {
    id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
    ...subscription,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }

  subscriptions.push(newSubscription)
  await writeUserSubscriptions(subscriptions)
  
  return newSubscription
}

export async function updateUserSubscription(id: string, updates: Partial<Omit<UserSubscription, 'id' | 'createdAt'>>): Promise<UserSubscription | null> {
  const subscriptions = await readUserSubscriptions()
  const subscriptionIndex = subscriptions.findIndex(sub => sub.id === id)
  
  if (subscriptionIndex === -1) {
    return null
  }

  subscriptions[subscriptionIndex] = {
    ...subscriptions[subscriptionIndex],
    ...updates,
    updatedAt: new Date().toISOString(),
  }

  await writeUserSubscriptions(subscriptions)
  return subscriptions[subscriptionIndex]
}

// ===== 支付订单管理 =====

async function readPaymentOrders(): Promise<PaymentOrder[]> {
  try {
    await ensureDataDir()
    const data = await fs.readFile(ORDERS_FILE, 'utf-8')
    return JSON.parse(data)
  } catch {
    return []
  }
}

async function writePaymentOrders(orders: PaymentOrder[]): Promise<void> {
  await ensureDataDir()
  await fs.writeFile(ORDERS_FILE, JSON.stringify(orders, null, 2), 'utf-8')
}

export async function createPaymentOrder(order: Omit<PaymentOrder, 'id' | 'createdAt' | 'updatedAt'>): Promise<PaymentOrder> {
  const orders = await readPaymentOrders()
  
  const newOrder: PaymentOrder = {
    id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
    ...order,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }

  orders.push(newOrder)
  await writePaymentOrders(orders)
  
  return newOrder
}

export async function updatePaymentOrder(id: string, updates: Partial<Omit<PaymentOrder, 'id' | 'createdAt'>>): Promise<PaymentOrder | null> {
  const orders = await readPaymentOrders()
  const orderIndex = orders.findIndex(order => order.id === id)
  
  if (orderIndex === -1) {
    return null
  }

  orders[orderIndex] = {
    ...orders[orderIndex],
    ...updates,
    updatedAt: new Date().toISOString(),
  }

  await writePaymentOrders(orders)
  return orders[orderIndex]
}

export async function getPaymentOrderById(id: string): Promise<PaymentOrder | null> {
  const orders = await readPaymentOrders()
  return orders.find(order => order.id === id) || null
}

export async function getPaymentOrderByPaymentIntentId(paymentIntentId: string): Promise<PaymentOrder | null> {
  const orders = await readPaymentOrders()
  return orders.find(order => order.paymentIntentId === paymentIntentId) || null
}

export async function getPaymentOrderByAlipayTradeNo(tradeNo: string): Promise<PaymentOrder | null> {
  const orders = await readPaymentOrders()
  return orders.find(order => order.alipayTradeNo === tradeNo) || null
}

// ===== 使用统计管理 =====

async function readUsageStats(): Promise<UsageStats[]> {
  try {
    await ensureDataDir()
    const data = await fs.readFile(USAGE_FILE, 'utf-8')
    return JSON.parse(data)
  } catch {
    return []
  }
}

async function writeUsageStats(stats: UsageStats[]): Promise<void> {
  await ensureDataDir()
  await fs.writeFile(USAGE_FILE, JSON.stringify(stats, null, 2), 'utf-8')
}

export async function getUserUsageStats(userId: string, subscriptionId: string): Promise<UsageStats | null> {
  const stats = await readUsageStats()
  return stats.find(stat => stat.userId === userId && stat.subscriptionId === subscriptionId) || null
}

export async function createOrUpdateUsageStats(userId: string, subscriptionId: string, downloadCount: number): Promise<UsageStats> {
  const stats = await readUsageStats()
  const existingIndex = stats.findIndex(stat => 
    stat.userId === userId && stat.subscriptionId === subscriptionId
  )

  const now = new Date().toISOString()

  if (existingIndex >= 0) {
    // 更新现有记录
    stats[existingIndex] = {
      ...stats[existingIndex],
      downloadCount,
      updatedAt: now,
    }
  } else {
    // 创建新记录
    const newStat: UsageStats = {
      userId,
      subscriptionId,
      downloadCount,
      lastResetAt: now,
      createdAt: now,
      updatedAt: now,
    }
    stats.push(newStat)
  }

  await writeUsageStats(stats)
  return stats[existingIndex >= 0 ? existingIndex : stats.length - 1]
}

export async function incrementDownloadCount(userId: string): Promise<{
  success: boolean
  remainingDownloads: number
  message?: string
}> {
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
    await createOrUpdateUsageStats(userId, subscription.id, subscription.downloadCount + 1)
    await updateUserSubscription(subscription.id, {
      downloadCount: subscription.downloadCount + 1
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

  return {
    success: true,
    remainingDownloads: plan.downloadLimit - newDownloadCount
  }
}