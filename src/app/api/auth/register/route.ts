import { NextRequest, NextResponse } from 'next/server'
import { userAdmin } from '@/lib/supabase-admin'

export async function POST(req: NextRequest) {
  try {
    const { email, password, username, sex, phone } = await req.json()

    // 验证输入
    if (!email || !password || !username) {
      return NextResponse.json(
        { error: '邮箱、密码和用户名都是必填项' },
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

    // 验证用户名格式
    const usernameRegex = /^[a-zA-Z0-9_]{3,30}$/
    if (!usernameRegex.test(username)) {
      return NextResponse.json(
        { error: '用户名只能包含字母、数字和下划线，长度3-30个字符' },
        { status: 400 }
      )
    }

    // 检查邮箱是否已存在
    const existingEmailUser = await userAdmin.findByEmail(email)
    if (existingEmailUser) {
      return NextResponse.json(
        { error: '该邮箱已被注册' },
        { status: 400 }
      )
    }

    // 检查用户名是否已存在
    const existingUsernameUser = await userAdmin.findByUsername(username)
    if (existingUsernameUser) {
      return NextResponse.json(
        { error: '该用户名已被使用' },
        { status: 400 }
      )
    }

    // 创建用户（包含认证和业务数据）
    try {
      const { user, profile } = await userAdmin.createUser({
        email,
        password,
        username,
        sex: sex || null,
        phone: phone || null,
        value: 0,
        buytype: 0,
        buydate: null
      })

      return NextResponse.json(
        {
          message: '注册成功',
          user: {
            id: user.id,
            email: user.email,
            username: profile.username,
            name: profile.username,
            value: profile.value,
            buytype: profile.buytype,
          }
        },
        { status: 201 }
      )
    } catch (error: any) {
      console.error('注册错误:', error)
      
      // 处理 Supabase 特定错误
      if (error.message?.includes('User already registered')) {
        return NextResponse.json(
          { error: '该邮箱已被注册' },
          { status: 400 }
        )
      }
      
      return NextResponse.json(
        { error: '注册失败，请重试' },
        { status: 500 }
      )
    }

  } catch (error) {
    console.error('注册错误:', error)
    return NextResponse.json(
      { error: '注册失败，请重试' },
      { status: 500 }
    )
  }
}