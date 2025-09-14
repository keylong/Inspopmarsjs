/**
 * 简化的支付处理逻辑
 * 直接更新用户的 buytype 和 buydate，不使用复杂的订阅系统
 */

import { prisma } from '@/lib/prisma'

// 套餐类型映射
interface PlanMapping {
  buytype: number
  duration: number // 天数
  downloadLimit: number // 下载次数，-1表示无限
}

// 套餐配置映射
const PLAN_MAPPING: Record<string, PlanMapping> = {
  'basic-monthly': {
    buytype: 1, // 月度会员
    duration: 30,
    downloadLimit: 500
  },
  'pro-monthly': {
    buytype: 2, // 年度会员(显示为一年VIP)
    duration: 365,
    downloadLimit: 5000
  },
  'unlimited-monthly': {
    buytype: 2, // 年度会员(显示为年度超级VIP，但给予超大下载额度)
    duration: 365,
    downloadLimit: 999999 // 超大额度，几乎等同无限
  }
}

/**
 * 处理支付成功 - 简化版本
 * @param params 支付参数
 */
export async function processSimplePayment(params: {
  userId: string
  planId: string
  orderId: string
  paymentId: string
  amount: number
}): Promise<void> {
  const { userId, planId, orderId, paymentId, amount } = params

  console.log(`=== 开始处理简化支付成功 ===`)
  console.log(`用户ID: ${userId}`)
  console.log(`套餐ID: ${planId}`)
  console.log(`订单ID: ${orderId}`)

  // 获取套餐配置
  const planConfig = PLAN_MAPPING[planId]
  if (!planConfig) {
    throw new Error(`未找到套餐配置: ${planId}`)
  }

  const now = new Date()

  try {
    // 更新用户的会员信息
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        buytype: planConfig.buytype,
        buydate: now,
        value: planConfig.downloadLimit, // 直接使用配置的下载次数
        updatedAt: now
      }
    })

    console.log(`✅ 用户会员信息更新成功:`)
    console.log(`  - buytype: ${planConfig.buytype}`)
    console.log(`  - buydate: ${now.toISOString()}`)
    console.log(`  - value: ${updatedUser.value}`)

    // 记录支付日志到数据库
    await logPaymentSuccess({
      userId,
      planId,
      orderId,
      paymentId,
      amount,
      buytype: planConfig.buytype
    })

    console.log(`🎉 简化支付处理完成`)

  } catch (error) {
    console.error('简化支付处理失败:', error)
    throw error
  }
}

/**
 * 记录支付成功日志
 */
async function logPaymentSuccess(params: {
  userId: string
  planId: string
  orderId: string
  paymentId: string
  amount: number
  buytype: number
}): Promise<void> {
  try {
    // 这里可以创建一个简单的支付日志表
    // 由于没有看到具体的日志表结构，暂时使用 console 记录
    const logEntry = {
      timestamp: new Date().toISOString(),
      type: 'PAYMENT_SUCCESS',
      ...params
    }
    
    console.log('💾 支付日志记录:', JSON.stringify(logEntry, null, 2))
    
    // TODO: 如果需要持久化日志，可以创建一个 payment_logs 表
    
  } catch (error) {
    console.error('记录支付日志失败:', error)
    // 日志记录失败不应该影响主流程
  }
}

/**
 * 获取套餐显示名称
 */
export function getPlanDisplayName(planId: string): string {
  const names: Record<string, string> = {
    'basic-monthly': '一个月 VIP会员',
    'pro-monthly': '一年 VIP会员', 
    'unlimited-monthly': '年度超级VIP'
  }
  
  return names[planId] || planId
}

/**
 * 获取套餐类型说明
 */
export function getPlanTypeDescription(buytype: number): string {
  const descriptions: Record<number, string> = {
    0: '免费用户',
    1: '月度会员',
    2: '年度会员',
    3: '终身会员'
  }
  
  return descriptions[buytype] || '未知类型'
}