import { NextRequest, NextResponse } from 'next/server'
import { getCurrentUser } from '@/lib/auth'
import { getUserCheckinStatus, performCheckin } from '@/lib/checkin'

// 获取签到状态
export async function GET(_request: NextRequest) {
  try {
    const user = await getCurrentUser()
    
    if (!user?.id) {
      return NextResponse.json({
        success: false,
        error: '请先登录'
      }, { status: 401 })
    }

    const checkinStatus = await getUserCheckinStatus(user.id)
    
    return NextResponse.json({
      success: true,
      data: checkinStatus
    })
  } catch (error) {
    console.error('获取签到状态API错误:', error)
    return NextResponse.json({
      success: false,
      error: '服务器错误'
    }, { status: 500 })
  }
}

// 执行签到
export async function POST(_request: NextRequest) {
  try {
    const user = await getCurrentUser()
    
    if (!user?.id) {
      return NextResponse.json({
        success: false,
        error: '请先登录'
      }, { status: 401 })
    }

    const result = await performCheckin(user.id)
    
    if (result.success) {
      return NextResponse.json({
        success: true,
        data: {
          reward: result.reward,
          consecutiveDays: result.consecutiveDays,
          message: result.message
        }
      })
    } else {
      return NextResponse.json({
        success: false,
        error: result.message
      }, { status: 400 })
    }
  } catch (error) {
    console.error('签到API错误:', error)
    return NextResponse.json({
      success: false,
      error: '签到失败，请稍后重试'
    }, { status: 500 })
  }
}