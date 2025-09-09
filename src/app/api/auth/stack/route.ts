import { StackServerApp } from '@stackframe/stack'
import { NextRequest } from 'next/server'

const stackApp = new StackServerApp()

// Stack Auth API 处理器
export async function GET(req: NextRequest) {
  return await stackApp.handler(req)
}

export async function POST(req: NextRequest) {
  return await stackApp.handler(req)
}