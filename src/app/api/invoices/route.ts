import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { getUserInvoices } from '@/lib/invoice'

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { success: false, error: '请先登录' },
        { status: 401 }
      )
    }

    const invoices = await getUserInvoices(session.user.id)
    
    return NextResponse.json({
      success: true,
      data: invoices,
    })
  } catch (error) {
    console.error('获取发票列表失败:', error)
    
    return NextResponse.json(
      { success: false, error: '获取发票列表失败' },
      { status: 500 }
    )
  }
}