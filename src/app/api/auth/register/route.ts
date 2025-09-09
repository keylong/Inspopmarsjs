import { NextRequest, NextResponse } from 'next/server'
import { createUser, getUserByEmail } from '@/lib/db'

export async function POST(req: NextRequest) {
  try {
    const { email, password, name } = await req.json()

    // 验证输入
    if (!email || !password || !name) {
      return NextResponse.json(
        { error: '邮箱、密码和姓名都是必填项' },
        { status: 400 }
      )
    }

    // 验证邮箱格式
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: '邮箱格式不正确' },
        { status: 400 }
      )
    }

    // 验证密码强度
    if (password.length < 6) {
      return NextResponse.json(
        { error: '密码至少需要6个字符' },
        { status: 400 }
      )
    }

    // 检查用户是否已存在
    const existingUser = await getUserByEmail(email)
    if (existingUser) {
      return NextResponse.json(
        { error: '该邮箱已被注册' },
        { status: 400 }
      )
    }

    // 创建新用户
    const user = await createUser({
      email,
      password,
      name,
      provider: 'credentials',
    })

    // 返回成功响应（不包含密码）
    const userWithoutPassword = {
      id: user.id,
      email: user.email,
      name: user.name,
      avatar: user.avatar,
      provider: user.provider,
      providerId: user.providerId,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    }
    return NextResponse.json(
      { 
        message: '注册成功',
        user: userWithoutPassword 
      },
      { status: 201 }
    )

  } catch (error) {
    console.error('注册错误:', error)
    return NextResponse.json(
      { error: '注册失败，请重试' },
      { status: 500 }
    )
  }
}