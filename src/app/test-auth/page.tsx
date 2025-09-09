'use client';

import { useUser } from '@stackframe/stack';

export default function TestAuthPage() {
  // 测试 Stack Auth 集成
  try {
    const user = useUser();
    
    return (
      <div className="min-h-screen p-8">
        <h1 className="text-2xl font-bold mb-4">Stack Auth 测试页面</h1>
        
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-2">认证状态</h2>
          {user ? (
            <div>
              <p className="text-green-600">✅ 已登录</p>
              <p>用户 ID: {user.id}</p>
              <p>邮箱: {user.primaryEmail || '未设置'}</p>
              <p>名称: {user.displayName || '未设置'}</p>
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
              NEXT_PUBLIC_STACK_PROJECT_ID: {process.env.NEXT_PUBLIC_STACK_PROJECT_ID ? '✅ 已设置' : '❌ 未设置'}
            </li>
            <li>
              NEXT_PUBLIC_STACK_PUBLISHABLE_CLIENT_KEY: {process.env.NEXT_PUBLIC_STACK_PUBLISHABLE_CLIENT_KEY ? '✅ 已设置' : '❌ 未设置'}
            </li>
          </ul>
        </div>
      </div>
    );
  } catch (error) {
    return (
      <div className="min-h-screen p-8">
        <h1 className="text-2xl font-bold mb-4 text-red-600">Stack Auth 错误</h1>
        <div className="bg-red-50 p-6 rounded-lg">
          <p className="text-red-800">错误信息：</p>
          <pre className="mt-2 text-sm">{String(error)}</pre>
          <p className="mt-4 text-sm text-gray-600">
            这通常意味着 Stack Auth 没有正确配置。请检查 StackProvider 是否已添加到应用根部。
          </p>
        </div>
      </div>
    );
  }
}