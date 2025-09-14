import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(request: NextRequest) {
  try {
    console.log('开始同步OAuth用户...')
    
    const userData = await request.json()
    console.log('接收到的用户数据:', userData)
    
    if (!userData.email || !userData.id) {
      return NextResponse.json({
        success: false,
        error: '缺少用户ID或邮箱'
      }, { status: 400 })
    }

    const provider = userData.provider || 'unknown'
    console.log('OAuth提供商:', provider)

    // 先通过 Supabase Auth ID 查找
    let existingUser = await prisma.user.findUnique({
      where: { id: userData.id }
    })

    // 如果没找到，再通过 email 查找（兼容旧数据）
    if (!existingUser) {
      existingUser = await prisma.user.findUnique({
        where: { email: userData.email }
      })
    }

    if (existingUser) {
      console.log('用户已存在，更新用户信息:', userData.email)
      
      // 如果用户存在但 ID 不匹配，更新 ID（处理旧数据迁移）
      const updateData: any = {
        name: userData.name || existingUser.name,
        image: userData.image || existingUser.image,
      }
      
      // 如果旧用户的 ID 与 Supabase Auth ID 不同，需要更新
      if (existingUser.id !== userData.id) {
        console.log('更新用户 ID 以匹配 Supabase Auth:', userData.id)
        // 先删除旧记录，再创建新记录（因为 ID 是主键）
        await prisma.user.delete({
          where: { id: existingUser.id }
        })
        
        const newUser = await prisma.user.create({
          data: {
            id: userData.id, // 使用 Supabase Auth 的 ID
            email: userData.email,
            name: userData.name || existingUser.name,
            image: userData.image || existingUser.image,
            emailVerified: existingUser.emailVerified || new Date(),
            password: existingUser.password,
            username: existingUser.username,
            sex: existingUser.sex,
            phone: existingUser.phone,
            value: existingUser.value,
            token: existingUser.token,
            buytype: existingUser.buytype,
            buydate: existingUser.buydate,
            downloading: existingUser.downloading,
            account: existingUser.account,
            createdAt: existingUser.createdAt,
          }
        })
        
        return NextResponse.json({
          success: true,
          message: `${provider}用户ID已同步并更新`,
          user: newUser
        })
      } else {
        // ID 已经匹配，只更新其他信息
        const updatedUser = await prisma.user.update({
          where: { id: userData.id },
          data: updateData
        })

        return NextResponse.json({
          success: true,
          message: `${provider}用户信息已更新`,
          user: updatedUser
        })
      }
    } else {
      console.log(`创建新的${provider}用户:`, userData.email)
      
      // 创建新用户，使用 Supabase Auth 提供的 ID
      const newUser = await prisma.user.create({
        data: {
          id: userData.id, // 使用 Supabase Auth 的 ID
          email: userData.email,
          name: userData.name,
          image: userData.image,
          emailVerified: new Date(), // OAuth用户默认已验证
        }
      })

      console.log('新用户创建成功:', newUser)

      return NextResponse.json({
        success: true,
        message: `新${provider}用户创建成功`,
        user: newUser
      })
    }
  } catch (error) {
    console.error('同步OAuth用户失败:', error)
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : '未知错误'
    }, { status: 500 })
  }
}