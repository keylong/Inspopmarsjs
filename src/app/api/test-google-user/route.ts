import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST() {
  try {
    console.log('开始测试创建Google用户...')
    
    // 模拟Google用户数据
    const testGoogleUser = {
      email: `test-google-${Date.now()}@gmail.com`,
      name: 'Test Google User',
      image: 'https://lh3.googleusercontent.com/a/test-avatar.jpg',
      emailVerified: new Date(),
    }
    
    console.log('准备创建用户:', testGoogleUser)
    
    // 创建用户
    const newUser = await prisma.user.create({
      data: testGoogleUser
    })
    
    console.log('测试用户创建成功:', newUser)
    
    return NextResponse.json({
      success: true,
      message: '测试Google用户创建成功',
      user: newUser
    })
  } catch (error) {
    console.error('创建测试用户失败:', error)
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : '未知错误'
    }, { status: 500 })
  }
}