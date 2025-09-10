import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(request: NextRequest) {
  try {
    console.log('开始同步Google用户...')
    
    const userData = await request.json()
    console.log('接收到的用户数据:', userData)
    
    if (!userData.email) {
      return NextResponse.json({
        success: false,
        error: '缺少用户邮箱'
      }, { status: 400 })
    }

    // 检查用户是否已存在
    const existingUser = await prisma.user.findUnique({
      where: { email: userData.email }
    })

    if (existingUser) {
      console.log('用户已存在，更新用户信息:', userData.email)
      
      // 更新用户信息（主要是头像）
      const updatedUser = await prisma.user.update({
        where: { email: userData.email },
        data: {
          name: userData.name || existingUser.name,
          image: userData.image || existingUser.image,
        }
      })

      return NextResponse.json({
        success: true,
        message: '用户信息已更新',
        user: updatedUser
      })
    } else {
      console.log('创建新的Google用户:', userData.email)
      
      // 创建新用户
      const newUser = await prisma.user.create({
        data: {
          email: userData.email,
          name: userData.name,
          image: userData.image,
          emailVerified: new Date(), // Google用户默认已验证
        }
      })

      console.log('新用户创建成功:', newUser)

      return NextResponse.json({
        success: true,
        message: '新用户创建成功',
        user: newUser
      })
    }
  } catch (error) {
    console.error('同步Google用户失败:', error)
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : '未知错误'
    }, { status: 500 })
  }
}