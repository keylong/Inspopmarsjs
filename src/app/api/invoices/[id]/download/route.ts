import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { getInvoiceById, getInvoicePDFPath } from '@/lib/invoice'
import fs from 'fs/promises'

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

    // 获取PDF文件路径
    const pdfPath = await getInvoicePDFPath(params.id)
    if (!pdfPath) {
      return NextResponse.json(
        { success: false, error: '发票PDF不存在' },
        { status: 404 }
      )
    }

    // 读取PDF文件
    const pdfBuffer = await fs.readFile(pdfPath)
    
    // 返回PDF文件
    return new NextResponse(pdfBuffer, {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="invoice-${invoice.invoiceNumber}.pdf"`,
        'Content-Length': pdfBuffer.length.toString(),
      },
    })
  } catch (error) {
    console.error('下载发票失败:', error)
    
    return NextResponse.json(
      { success: false, error: '下载发票失败' },
      { status: 500 }
    )
  }
}