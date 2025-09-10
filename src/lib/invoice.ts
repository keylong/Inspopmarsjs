import jsPDF from 'jspdf'
import fs from 'fs/promises'
import path from 'path'
import { Invoice, PaymentOrder } from '@/types/payment'
import { getPaymentOrderById } from './payment-db'
import { getUserById } from '@/lib/auth'
import { getSubscriptionPlanById } from './payment-db'

// 发票数据存储路径
const INVOICES_FILE = path.join(process.cwd(), 'data', 'invoices.json')
const INVOICES_DIR = path.join(process.cwd(), 'data', 'invoices')

// 确保发票目录存在
async function ensureInvoicesDir() {
  try {
    await fs.access(INVOICES_DIR)
  } catch {
    await fs.mkdir(INVOICES_DIR, { recursive: true })
  }
}

// 读取发票数据
async function readInvoices(): Promise<Invoice[]> {
  try {
    const data = await fs.readFile(INVOICES_FILE, 'utf-8')
    return JSON.parse(data)
  } catch {
    return []
  }
}

// 写入发票数据
async function writeInvoices(invoices: Invoice[]): Promise<void> {
  await fs.writeFile(INVOICES_FILE, JSON.stringify(invoices, null, 2), 'utf-8')
}

/**
 * 生成发票编号
 */
function generateInvoiceNumber(): string {
  const now = new Date()
  const year = now.getFullYear()
  const month = (now.getMonth() + 1).toString().padStart(2, '0')
  const day = now.getDate().toString().padStart(2, '0')
  const time = now.getTime().toString().slice(-6) // 取时间戳后6位
  
  return `INV-${year}${month}${day}-${time}`
}

/**
 * 创建发票
 */
export async function createInvoice(orderId: string): Promise<Invoice> {
  const order = await getPaymentOrderById(orderId)
  if (!order || order.status !== 'paid') {
    throw new Error('订单不存在或未支付')
  }

  const user = await getUserById(order.userId)
  if (!user) {
    throw new Error('用户不存在')
  }

  const plan = await getSubscriptionPlanById(order.planId)
  if (!plan) {
    throw new Error('套餐不存在')
  }

  const invoices = await readInvoices()
  
  // 检查是否已存在发票
  const existingInvoice = invoices.find(inv => inv.orderId === orderId)
  if (existingInvoice) {
    return existingInvoice
  }

  const invoiceNumber = generateInvoiceNumber()
  const now = new Date()
  const tax = order.amount * 0.1 // 10% 税率
  const totalAmount = order.amount + tax

  const newInvoice: Invoice = {
    id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
    userId: order.userId,
    orderId: orderId,
    invoiceNumber,
    amount: order.amount,
    currency: order.currency,
    tax,
    totalAmount,
    status: 'paid',
    issuedAt: now.toISOString(),
    dueAt: now.toISOString(), // 已支付，所以到期日等于开票日
    ...(order.paidAt && { paidAt: order.paidAt }),
    createdAt: now.toISOString(),
    updatedAt: now.toISOString(),
  }

  // 生成PDF发票
  const pdfPath = await generateInvoicePDF(newInvoice, order, user, plan)
  newInvoice.downloadUrl = `/api/invoices/${newInvoice.id}/download`

  invoices.push(newInvoice)
  await writeInvoices(invoices)

  return newInvoice
}

/**
 * 生成发票PDF
 */
async function generateInvoicePDF(
  invoice: Invoice,
  order: PaymentOrder,
  user: any,
  plan: any
): Promise<string> {
  await ensureInvoicesDir()

  const doc = new jsPDF()
  const pageWidth = doc.internal.pageSize.width
  
  // 设置字体
  doc.setFont('helvetica')
  
  // 标题
  doc.setFontSize(24)
  doc.text('INVOICE', pageWidth / 2, 30, { align: 'center' })
  
  // 发票编号和日期
  doc.setFontSize(12)
  doc.text(`Invoice Number: ${invoice.invoiceNumber}`, 20, 50)
  doc.text(`Issue Date: ${new Date(invoice.issuedAt).toLocaleDateString()}`, 20, 60)
  doc.text(`Due Date: ${new Date(invoice.dueAt).toLocaleDateString()}`, 20, 70)
  
  // 公司信息
  doc.setFontSize(14)
  doc.text('From:', 20, 90)
  doc.setFontSize(12)
  doc.text('Instagram Downloader', 20, 105)
  doc.text('popmars.com', 20, 115)
  doc.text('support@popmars.com', 20, 125)
  
  // 客户信息
  doc.setFontSize(14)
  doc.text('Bill To:', 120, 90)
  doc.setFontSize(12)
  doc.text(user.name, 120, 105)
  doc.text(user.email, 120, 115)
  
  // 分割线
  doc.line(20, 140, pageWidth - 20, 140)
  
  // 服务项目表头
  doc.setFontSize(12)
  doc.text('Description', 20, 160)
  doc.text('Amount', pageWidth - 60, 160)
  
  // 分割线
  doc.line(20, 165, pageWidth - 20, 165)
  
  // 服务项目
  doc.text(`${plan.name} Subscription`, 20, 180)
  doc.text(`${order.currency} ${order.amount.toFixed(2)}`, pageWidth - 60, 180)
  
  // 税费
  doc.text('Tax (10%)', 20, 195)
  doc.text(`${invoice.currency} ${invoice.tax.toFixed(2)}`, pageWidth - 60, 195)
  
  // 分割线
  doc.line(20, 205, pageWidth - 20, 205)
  
  // 总计
  doc.setFontSize(14)
  doc.text('Total', 20, 220)
  doc.text(`${invoice.currency} ${invoice.totalAmount.toFixed(2)}`, pageWidth - 60, 220)
  
  // 支付状态
  doc.setFontSize(12)
  doc.text('Payment Status: PAID', 20, 240)
  if (invoice.paidAt) {
    doc.text(`Paid Date: ${new Date(invoice.paidAt).toLocaleDateString()}`, 20, 250)
  }
  
  // 支付方式
  const paymentMethodText = order.paymentMethod === 'stripe' ? 'Credit Card (Stripe)' : 'Alipay'
  doc.text(`Payment Method: ${paymentMethodText}`, 20, 260)
  
  // 保存PDF
  const fileName = `invoice-${invoice.invoiceNumber}.pdf`
  const filePath = path.join(INVOICES_DIR, fileName)
  
  const pdfBuffer = Buffer.from(doc.output('arraybuffer'))
  await fs.writeFile(filePath, pdfBuffer)
  
  return filePath
}

/**
 * 获取发票
 */
export async function getInvoiceById(id: string): Promise<Invoice | null> {
  const invoices = await readInvoices()
  return invoices.find(invoice => invoice.id === id) || null
}

/**
 * 获取用户的所有发票
 */
export async function getUserInvoices(userId: string): Promise<Invoice[]> {
  const invoices = await readInvoices()
  return invoices.filter(invoice => invoice.userId === userId)
}

/**
 * 获取发票PDF文件路径
 */
export async function getInvoicePDFPath(invoiceId: string): Promise<string | null> {
  const invoice = await getInvoiceById(invoiceId)
  if (!invoice) {
    return null
  }
  
  const fileName = `invoice-${invoice.invoiceNumber}.pdf`
  const filePath = path.join(INVOICES_DIR, fileName)
  
  try {
    await fs.access(filePath)
    return filePath
  } catch {
    // 文件不存在，重新生成
    const order = await getPaymentOrderById(invoice.orderId)
    if (!order) return null
    
    const user = await getUserById(invoice.userId)
    if (!user) return null
    
    const plan = await getSubscriptionPlanById(order.planId)
    if (!plan) return null
    
    return await generateInvoicePDF(invoice, order, user, plan)
  }
}