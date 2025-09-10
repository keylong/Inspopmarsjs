'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';

export function AdTest() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkUser = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        setUser(user);
        console.log('当前用户状态:', user ? '已登录' : '未登录');
        console.log('用户信息:', user);
      } catch (error) {
        console.error('检查用户状态失败:', error);
      } finally {
        setLoading(false);
      }
    };

    checkUser();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user || null);
      console.log('登录状态改变:', event, session?.user ? '已登录' : '未登录');
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  if (loading) {
    return (
      <div className="p-4 bg-yellow-100 border border-yellow-400 rounded-md">
        <p className="text-yellow-700">正在检查登录状态...</p>
      </div>
    );
  }

  return (
    <div className={`p-4 border rounded-md ${user ? 'bg-red-100 border-red-400' : 'bg-green-100 border-green-400'}`}>
      <h3 className="font-bold mb-2">广告显示测试</h3>
      <p className={`font-semibold ${user ? 'text-red-700' : 'text-green-700'}`}>
        状态: {user ? '已登录 - 不显示广告' : '未登录 - 显示广告'}
      </p>
      <p className={`text-sm mt-1 ${user ? 'text-red-600' : 'text-green-600'}`}>
        AdSense 脚本: {user ? '❌ 未加载' : '✅ 已加载'}
      </p>
      {user && (
        <p className="text-sm text-red-600 mt-2">
          用户邮箱: {user.email}
        </p>
      )}
      
      {/* 模拟广告区域 */}
      <div className="mt-4 p-3 border-2 border-dashed border-gray-400 rounded-md text-center">
        {user ? (
          <p className="text-gray-500">🚫 已登录用户 - 广告被隐藏</p>
        ) : (
          <p className="text-blue-600">📢 未登录用户 - 这里会显示广告</p>
        )}
      </div>
    </div>
  );
}