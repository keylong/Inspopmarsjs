import { NextRequest, NextResponse } from 'next/server'
import { createUser, getUserByEmail } from '@/lib/auth'
import { supabase } from '@/lib/supabase'

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

    // 在 Supabase Auth 中注册用户
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          name: name,
        }
      }
    })

    if (authError) {
      console.error('Supabase 注册错误:', authError)
      return NextResponse.json(
        { error: authError.message === 'User already registered' ? '该邮箱已被注册' : '注册失败，请重试' },
        { status: 400 }
      )
    }

    // 在数据库中创建用户记录
    try {
      const user = await createUser({
        email,
        name,
        provider: 'email',
      })

      return NextResponse.json(
        { 
          message: '注册成功，请检查邮箱进行验证',
          user: {
            id: user.id,
            email: user.email,
            name: user.name,
            image: user.image,
          }
        },
        { status: 201 }
      )
    } catch (error) {
      // 如果数据库创建失败，清理 Supabase 用户
      if (authData.user) {
        await supabase.auth.admin.deleteUser(authData.user.id)
      }
      throw error
    }

  } catch (error) {
    console.error('注册错误:', error)
    return NextResponse.json(
      { error: '注册失败，请重试' },
      { status: 500 }
    )
  }
}