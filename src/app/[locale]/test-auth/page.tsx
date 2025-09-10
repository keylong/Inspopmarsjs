'use client'


import { useAuth } from '@/hooks/useAuth'
import { StackUserButton } from '@/components/auth/user-button'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import Link from 'next/link'

export default function TestAuthPage() {
  const { user, isAuthenticated, signOut } = useAuth()

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-3xl font-bold mb-8">Stack Auth 测试页面</h1>

      <div className="grid gap-6">
        {/* 认证状态卡片 */}
        <Card>
          <CardHeader>
            <CardTitle>认证状态</CardTitle>
            <CardDescription>当前用户的认证信息</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <span className="font-semibold">状态：</span>
                {isAuthenticated ? (
                  <span className="text-green-600 ml-2">✅ 已登录</span>
                ) : (
                  <span className="text-red-600 ml-2">❌ 未登录</span>
                )}
              </div>

              {user && (
                <>
                  <div>
                    <span className="font-semibold">用户 ID：</span>
                    <span className="ml-2">{user.id}</span>
                  </div>
                  <div>
                    <span className="font-semibold">邮箱：</span>
                    <span className="ml-2">{user.email}</span>
                  </div>
                  <div>
                    <span className="font-semibold">名称：</span>
                    <span className="ml-2">{user.name || '未设置'}</span>
                  </div>
                  <div>
                    <span className="font-semibold">邮箱验证：</span>
                    <span className="ml-2">
                      {user.emailVerified ? '✅ 已验证' : '⚠️ 未验证'}
                    </span>
                  </div>
                </>
              )}
            </div>
          </CardContent>
        </Card>

        {/* 操作按钮卡片 */}
        <Card>
          <CardHeader>
            <CardTitle>操作</CardTitle>
            <CardDescription>测试认证相关功能</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex gap-4">
              {isAuthenticated ? (
                <>
                  <StackUserButton />
                  <Button onClick={signOut} variant="outline">
                    登出
                  </Button>
                </>
              ) : (
                <>
                  <Link href="/auth/signin">
                    <Button>登录</Button>
                  </Link>
                  <Link href="/auth/signup">
                    <Button variant="outline">注册</Button>
                  </Link>
                </>
              )}
            </div>
          </CardContent>
        </Card>

        {/* 受保护路由测试 */}
        <Card>
          <CardHeader>
            <CardTitle>受保护路由测试</CardTitle>
            <CardDescription>测试需要认证的页面</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <Link href="/profile" className="block">
                <Button variant="link" className="p-0">
                  → 访问 /profile（需要登录）
                </Button>
              </Link>
              <Link href="/dashboard" className="block">
                <Button variant="link" className="p-0">
                  → 访问 /dashboard（需要登录）
                </Button>
              </Link>
              <Link href="/settings" className="block">
                <Button variant="link" className="p-0">
                  → 访问 /settings（需要登录）
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}