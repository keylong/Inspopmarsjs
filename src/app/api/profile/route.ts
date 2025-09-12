import { NextRequest, NextResponse } from 'next/server'
import { getCurrentUser } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { getMembershipStatus } from '@/lib/membership'

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

