import { NextRequest, NextResponse } from 'next/server'

export async function GET(_request: NextRequest) {
  try {
    // 检查环境变量
    const databaseUrl = process.env.DATABASE_URL
    console.log('DATABASE_URL:', databaseUrl ? '已配置' : '未配置')
    console.log('NODE_ENV:', process.env.NODE_ENV)
    
    // 动态导入Prisma客户端
    const { PrismaClient } = await import('@prisma/client')
    const prisma = new PrismaClient()
    
    // 测试数据库连接
    const userCount = await prisma.user.count()
    const sessionCount = await prisma.session.count()
    
    await prisma.$disconnect()
    
    return NextResponse.json({
      success: true,
      message: '数据库连接成功',
      data: {
        userCount,
        sessionCount,
        timestamp: new Date().toISOString(),
        databaseUrl: databaseUrl ? databaseUrl.substring(0, 20) + '...' : '未配置'
      }
    })
  } catch (error) {
    console.error('数据库连接错误:', error)
    return NextResponse.json({
      success: false,
      message: '数据库连接失败',
      error: error instanceof Error ? error.message : '未知错误'
    }, { status: 500 })
  }
}