import { NextRequest, NextResponse } from 'next/server'
import { getSubscriptionPlans } from '@/lib/payment-db'
import { GetPlansResponse } from '@/types/payment'

export async function GET(request: NextRequest) {
  try {
    const plans = await getSubscriptionPlans()
    
    const response: GetPlansResponse = {
      success: true,
      data: plans,
    }
    
    return NextResponse.json(response)
  } catch (error) {
    console.error('获取订阅套餐失败:', error)
    
    const response: GetPlansResponse = {
      success: false,
      error: '获取订阅套餐失败',
    }
    
    return NextResponse.json(response, { status: 500 })
  }
}