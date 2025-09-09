import { stackApp } from '@/lib/stack-auth'
import { NextRequest } from 'next/server'

// Stack Auth API 处理器
export async function GET(req: NextRequest) {
  return await stackApp.handler(req)
}

export async function POST(req: NextRequest) {
  return await stackApp.handler(req)
}