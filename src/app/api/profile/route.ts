import { NextRequest, NextResponse } from 'next/server'
import { getCurrentUser } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET(req: NextRequest) {
  try {
    console.log('Profile API: 开始获取当前用户...')
    const user = await getCurrentUser()
    console.log('Profile API: getCurrentUser 结果:', user)
    
    if (!user?.id) {
      console.log('Profile API: 用户认证失败，返回401')
      return NextResponse.json(
        { error: '未授权访问' },
        { status: 401 }
      )
    }

    // 从数据库获取完整的用户信息
    const userProfile = await prisma.user.findUnique({
      where: { id: user.id },
      select: {
        id: true,
        email: true,
        name: true,
        image: true,
        value: true,
        token: true,
        buytype: true,
        buydate: true,
        createdAt: true,
        username: true,
        phone: true,
      }
    })

    if (!userProfile) {
      return NextResponse.json(
        { error: '用户不存在' },
        { status: 404 }
      )
    }

    // 计算会员状态
    const membershipStatus = getMembershipStatus(userProfile.buytype, userProfile.buydate)

    return NextResponse.json({
      user: {
        ...userProfile,
        membership: membershipStatus
      }
    }, { status: 200 })

  } catch (error) {
    console.error('获取用户资料错误:', error)
    return NextResponse.json(
      { error: '获取失败，请重试' },
      { status: 500 }
    )
  }
}

// 计算会员状态的辅助函数
function getMembershipStatus(buytype: number, buydate: Date | null) {
  if (buytype === 0) {
    return {
      type: 'free',
      typeName: '免费用户',
      isActive: false,
      expiresAt: null,
      daysRemaining: null
    }
  }

  if (!buydate) {
    return {
      type: 'expired',
      typeName: '已过期',
      isActive: false,
      expiresAt: null,
      daysRemaining: 0
    }
  }

  // 计算到期时间
  const startDate = new Date(buydate)
  let expiresAt: Date
  let typeName: string

  if (buytype === 1) {
    // 月费：1个月有效
    expiresAt = new Date(startDate)
    expiresAt.setMonth(expiresAt.getMonth() + 1)
    typeName = '月度会员'
  } else if (buytype === 2) {
    // 年费：1年有效
    expiresAt = new Date(startDate)
    expiresAt.setFullYear(expiresAt.getFullYear() + 1)
    typeName = '年度会员'
  } else if (buytype === 3) {
    // 超级年费：1年有效
    expiresAt = new Date(startDate)
    expiresAt.setFullYear(expiresAt.getFullYear() + 1)
    typeName = '超级年度会员'
  } else {
    return {
      type: 'unknown',
      typeName: '未知类型',
      isActive: false,
      expiresAt: null,
      daysRemaining: null
    }
  }

  const now = new Date()
  const isActive = now < expiresAt
  const daysRemaining = Math.max(0, Math.ceil((expiresAt.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)))

  return {
    type: isActive ? 'active' : 'expired',
    typeName,
    isActive,
    expiresAt,
    daysRemaining
  }
}