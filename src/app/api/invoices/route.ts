import { NextRequest, NextResponse } from 'next/server'
import { getCurrentUser } from '@/lib/auth'
import { getUserInvoices } from '@/lib/invoice'

export async function GET(_request: NextRequest) {
  try {
    const user = await getCurrentUser()
    
    if (!user?.id) {
      return NextResponse.json(
        { success: false, error: '请先登录' },
        { status: 401 }
      )
    }

    const invoices = await getUserInvoices(user.id)
    
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