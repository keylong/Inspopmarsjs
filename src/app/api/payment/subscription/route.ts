import { NextRequest, NextResponse } from 'next/server'
import { getCurrentUser } from '@/lib/auth'
import { getUserSubscription, getSubscriptionPlanById } from '@/lib/payment-db-prisma'
import { GetSubscriptionResponse } from '@/types/payment'

export async function GET(_request: NextRequest) {
  try {
    const user = await getCurrentUser()
    
    if (!user?.id) {
      const response: GetSubscriptionResponse = {
        success: false,
        error: '请先登录',
      }
      return NextResponse.json(response, { status: 401 })
    }

    const subscription = await getUserSubscription(user.id)
    let plan = null
    
    if (subscription) {
      plan = await getSubscriptionPlanById(subscription.planId)
    }

    // 计算使用情况
    const usage = {
      downloadCount: subscription?.downloadCount || 0,
      downloadLimit: plan?.downloadLimit || 0,
      remainingDownloads: plan?.downloadLimit === -1 
        ? -1 
        : Math.max(0, (plan?.downloadLimit || 0) - (subscription?.downloadCount || 0)),
    }

    const response: GetSubscriptionResponse = {
      success: true,
      data: {
        subscription,
        plan,
        usage,
      },
    }
    
    return NextResponse.json(response)
  } catch (error) {
    console.error('获取订阅信息失败:', error)
    
    const response: GetSubscriptionResponse = {
      success: false,
      error: '获取订阅信息失败',
    }
    
    return NextResponse.json(response, { status: 500 })
  }
}