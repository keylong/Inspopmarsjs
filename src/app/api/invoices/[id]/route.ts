import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { getInvoiceById } from '@/lib/invoice'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { success: false, error: '请先登录' },
        { status: 401 }
      )
    }

    const invoice = await getInvoiceById(params.id)
    
    if (!invoice) {
      return NextResponse.json(
        { success: false, error: '发票不存在' },
        { status: 404 }
      )
    }

    // 验证发票所有者
    if (invoice.userId !== session.user.id) {
      return NextResponse.json(
        { success: false, error: '无权访问此发票' },
        { status: 403 }
      )
    }
    
    return NextResponse.json({
      success: true,
      data: invoice,
    })
  } catch (error) {
    console.error('获取发票详情失败:', error)
    
    return NextResponse.json(
      { success: false, error: '获取发票详情失败' },
      { status: 500 }
    )
  }
}