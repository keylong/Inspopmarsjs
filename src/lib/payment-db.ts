import fs from 'fs/promises'
import path from 'path'
import {
  SubscriptionPlan,
  UserSubscription,
  PaymentOrder,
  UsageStats
} from '@/types/payment'

// 操作结果接口
interface OperationResult<T = any> {
  success: boolean;
  data?: T;
  error?: string;
}

// 统计信息接口
interface DatabaseStats {
  plans: number;
  subscriptions: number;
  orders: number;
  usageRecords: number;
  lastUpdate: string;
}

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
  const currentTime = new Date().toISOString();
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
      createdAt: currentTime,
      updatedAt: currentTime,
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
      createdAt: currentTime,
      updatedAt: currentTime,
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
      createdAt: currentTime,
      updatedAt: currentTime,
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
  try {
    const subscriptions = await readUserSubscriptions()
    const currentTime = new Date().toISOString()
    
    const newSubscription: UserSubscription = {
      id: `sub_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      ...subscription,
      createdAt: currentTime,
      updatedAt: currentTime,
    }

    subscriptions.push(newSubscription)
    await writeUserSubscriptions(subscriptions)
    
    console.log(`创建用户订阅成功: ${newSubscription.id}`);
    return newSubscription
  } catch (error) {
    console.error('创建用户订阅失败:', error);
    throw new Error(`创建订阅失败: ${error instanceof Error ? error.message : String(error)}`);
  }
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
  try {
    const orders = await readPaymentOrders()
    const currentTime = new Date().toISOString()
    
    const newOrder: PaymentOrder = {
      id: `order_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      ...order,
      createdAt: currentTime,
      updatedAt: currentTime,
    }

    orders.push(newOrder)
    await writePaymentOrders(orders)
    
    console.log(`创建支付订单成功: ${newOrder.id}`);
    return newOrder
  } catch (error) {
    console.error('创建支付订单失败:', error);
    throw new Error(`创建订单失败: ${error instanceof Error ? error.message : String(error)}`);
  }
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
  try {
    if (!userId?.trim() || !subscriptionId?.trim()) {
      throw new Error('用户ID和订阅ID不能为空');
    }
    
    if (downloadCount < 0) {
      throw new Error('下载次数不能为负数');
    }
    
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
      console.log(`更新使用统计成功: ${userId} - ${subscriptionId}`);
    } else {
      // 创建新记录
      const newStat: UsageStats = {
        userId: userId.trim(),
        subscriptionId: subscriptionId.trim(),
        downloadCount,
        lastResetAt: now,
        createdAt: now,
        updatedAt: now,
      }
      stats.push(newStat)
      console.log(`创建使用统计成功: ${userId} - ${subscriptionId}`);
    }

    await writeUsageStats(stats)
    return stats[existingIndex >= 0 ? existingIndex : stats.length - 1]
  } catch (error) {
    console.error('创建或更新使用统计失败:', error);
    throw new Error(`使用统计操作失败: ${error instanceof Error ? error.message : String(error)}`);
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
      const newDownloadCount = subscription.downloadCount + 1;
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

    const remaining = plan.downloadLimit - newDownloadCount;
    console.log(`用户 ${userId} 下载次数增加，剩余: ${remaining}`);

    return {
      success: true,
      remainingDownloads: remaining
    }
  } catch (error) {
    console.error('增加下载次数失败:', error);
    return {
      success: false,
      remainingDownloads: 0,
      message: `操作失败: ${error instanceof Error ? error.message : String(error)}`
    }
  }
}

// ===== 数据库统计和维护 =====

/**
 * 获取数据库统计信息
 */
export async function getDatabaseStats(): Promise<DatabaseStats> {
  try {
    const [plans, subscriptions, orders, stats] = await Promise.all([
      getSubscriptionPlans(),
      readUserSubscriptions(),
      readPaymentOrders(),
      readUsageStats()
    ]);

    return {
      plans: plans.length,
      subscriptions: subscriptions.length,
      orders: orders.length,
      usageRecords: stats.length,
      lastUpdate: new Date().toISOString()
    };
  } catch (error) {
    console.error('获取数据库统计失败:', error);
    return {
      plans: 0,
      subscriptions: 0,
      orders: 0,
      usageRecords: 0,
      lastUpdate: new Date().toISOString()
    };
  }
}

/**
 * 清理过期数据
 */
export async function cleanupExpiredData(): Promise<OperationResult<{ cleaned: number }>> {
  try {
    const subscriptions = await readUserSubscriptions();
    const currentDate = new Date();
    
    // 找出过期的订阅
    let cleanedCount = 0;
    const activeSubscriptions = subscriptions.filter(sub => {
      const isExpired = new Date(sub.currentPeriodEnd) < currentDate && sub.status === 'active';
      if (isExpired) {
        cleanedCount++;
        console.log(`标记过期订阅: ${sub.id} (用户: ${sub.userId})`);
        // 更新状态而不是删除
        sub.status = 'expired';
        sub.updatedAt = currentDate.toISOString();
        return true;
      }
      return true;
    });

    await writeUserSubscriptions(activeSubscriptions);

    console.log(`清理完成，标记了 ${cleanedCount} 个过期订阅`);
    
    return {
      success: true,
      data: { cleaned: cleanedCount }
    };
  } catch (error) {
    console.error('清理过期数据失败:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : String(error)
    };
  }
}