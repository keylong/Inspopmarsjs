'use client'

// 强制动态渲染，避免预渲染错误
export const dynamic = 'force-dynamic';

import { useOptionalAuth } from '@/hooks/useAuth'

export default function TestAuthPage() {
  const { user, isLoading, isAuthenticated } = useOptionalAuth()

  if (isLoading) {
    return (
      <div className="min-h-screen p-8">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="h-32 bg-gray-200 rounded"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen p-8">
      <h1 className="text-2xl font-bold mb-4">Supabase Auth 测试页面</h1>
      
      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-lg font-semibold mb-2">认证状态</h2>
        {isAuthenticated && user ? (
          <div>
            <p className="text-green-600">✅ 已登录</p>
            <p>用户 ID: {user.id}</p>
            <p>邮箱: {user.email || '未设置'}</p>
            <p>名称: {user.name || '未设置'}</p>
            <p>头像: {user.image ? '已设置' : '未设置'}</p>
            <p>邮箱验证: {user.emailVerified ? '已验证' : '未验证'}</p>
          </div>
        ) : (
          <div>
            <p className="text-gray-600">未登录</p>
            <div className="mt-4 space-x-4">
              <a href="/signin" className="text-blue-600 hover:underline">
                登录
              </a>
              <a href="/signup" className="text-blue-600 hover:underline">
                注册
              </a>
            </div>
          </div>
        )}
      </div>
      
      <div className="mt-6 bg-gray-50 p-4 rounded">
        <h3 className="font-semibold mb-2">环境变量状态</h3>
        <ul className="text-sm space-y-1">
          <li>
            NEXT_PUBLIC_SUPABASE_URL: {process.env.NEXT_PUBLIC_SUPABASE_URL ? '✅ 已设置' : '❌ 未设置'}
          </li>
          <li>
            NEXT_PUBLIC_SUPABASE_ANON_KEY: {process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? '✅ 已设置' : '❌ 未设置'}
          </li>
        </ul>
      </div>
    </div>
  )
}