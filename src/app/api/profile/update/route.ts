import { NextRequest, NextResponse } from 'next/server'
import { getCurrentUser } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function PUT(req: NextRequest) {
  try {
    const user = await getCurrentUser()
    
    if (!user?.id) {
      return NextResponse.json(
        { error: '未授权访问' },
        { status: 401 }
      )
    }

    const { name } = await req.json()

    // 验证输入
    if (!name || name.trim().length === 0) {
      return NextResponse.json(
        { error: '姓名不能为空' },
        { status: 400 }
      )
    }

    if (name.length > 50) {
      return NextResponse.json(
        { error: '姓名不能超过50个字符' },
        { status: 400 }
      )
    }

    // 更新用户信息
    const updatedUser = await prisma.user.update({
      where: { id: user.id },
      data: { name: name.trim() }
    })

    if (!updatedUser) {
      return NextResponse.json(
        { error: '用户不存在' },
        { status: 404 }
      )
    }

    // 返回更新后的用户信息（不包含密码）
    const userWithoutPassword = {
      id: updatedUser.id,
      email: updatedUser.email,
      name: updatedUser.name,
      image: updatedUser.image,
    }
    return NextResponse.json(
      { 
        message: '资料更新成功',
        user: userWithoutPassword 
      },
      { status: 200 }
    )

  } catch (error) {
    console.error('更新用户资料错误:', error)
    return NextResponse.json(
      { error: '更新失败，请重试' },
      { status: 500 }
    )
  }
}