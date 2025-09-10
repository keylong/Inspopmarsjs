'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { User, LogOut, Settings, Crown } from 'lucide-react'
import { useRouter } from 'next/navigation'

export function SupabaseUserButton() {
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [userProfile, setUserProfile] = useState<any>(null)
  const [mounted, setMounted] = useState(false)
  const router = useRouter()

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (!mounted) return

    const getCurrentUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      setUser(user)
      setLoading(false)
      
      // 如果用户存在，获取用户详细资料
      if (user) {
        fetchUserProfile()
      }
    }

    getCurrentUser()

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      console.log('Auth state changed:', event, session?.user?.email)
      
      // 立即更新用户状态
      setUser(session?.user || null)
      
      if (session?.user) {
        // 用户登录或会话更新
        fetchUserProfile()
      } else {
        // 用户登出
        setUserProfile(null)
      }
      
      // 如果是登录事件，确保UI更新
      if (event === 'SIGNED_IN') {
        setLoading(false)
      }
    })

    return () => subscription.unsubscribe()
  }, [mounted])

  const fetchUserProfile = async () => {
    try {
      const response = await fetch('/api/profile')
      if (response.ok) {
        const data = await response.json()
        setUserProfile(data.user)
      }
    } catch (error) {
      console.error('获取用户资料失败:', error)
    }
  }

  const handleSignOut = async () => {
    await supabase.auth.signOut()
  }

  if (loading) {
    return <div className="w-8 h-8 rounded-full bg-gray-200 animate-pulse" />
  }

  if (!user) {
    return (
      <Button 
        variant="outline" 
        size="sm" 
        onClick={() => router.push('/signin')}
      >
        登录
      </Button>
    )
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <div className="relative">
          <Button variant="ghost" className="relative h-8 w-8 rounded-full">
            <Avatar className={`h-8 w-8 ${mounted && userProfile?.membership?.typeName === '超级年度会员' && userProfile?.membership?.isActive ? 'ring-2 ring-yellow-400 ring-offset-1 ring-offset-background' : ''}`}>
              <AvatarImage src={user.user_metadata?.avatar_url} alt={user.email} />
              <AvatarFallback className={`font-semibold ${
                mounted && userProfile?.membership?.typeName === '超级年度会员' && userProfile?.membership?.isActive 
                  ? 'bg-gradient-to-r from-yellow-400 to-orange-500 text-white' 
                  : 'bg-primary text-primary-foreground'
              }`}>
                {(user.user_metadata?.name || user.email)?.[0]?.toUpperCase() || <User className="h-4 w-4" />}
              </AvatarFallback>
            </Avatar>
          </Button>
          {/* 超级VIP用户的皇冠显示在头像上方 */}
          {mounted && userProfile?.membership?.typeName === '超级年度会员' && userProfile?.membership?.isActive && (
            <div className="absolute -top-1 -right-1 animate-bounce">
              <div className="relative">
                {/* 皇冠背景光晕效果 */}
                <div className="absolute inset-0 rounded-full bg-yellow-400 opacity-20 blur-sm animate-pulse"></div>
                {/* 皇冠图标 */}
                <Crown className="w-4 h-4 text-yellow-500 drop-shadow-sm relative z-10 animate-pulse" />
              </div>
            </div>
          )}
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end" forceMount>
        <div className="flex items-center justify-start gap-2 p-2">
          <div className="flex flex-col space-y-1 leading-none">
            <div className="flex items-center gap-1">
              {mounted && userProfile?.membership?.typeName === '超级年度会员' && userProfile?.membership?.isActive && (
                <Crown className="w-4 h-4 text-yellow-500 animate-pulse" />
              )}
              <p className={`font-medium transition-all duration-300 hover:scale-105 ${
                mounted && userProfile?.membership?.typeName === '超级年度会员' && userProfile?.membership?.isActive
                  ? 'bg-gradient-to-r from-yellow-500 via-purple-600 to-pink-600 bg-clip-text text-transparent font-bold animate-pulse cursor-pointer'
                  : ''
              }`}>
                {user.user_metadata?.name || user.email}
              </p>
            </div>
            {mounted && userProfile?.membership?.typeName === '超级年度会员' && userProfile?.membership?.isActive && (
              <div className="flex items-center gap-1">
                <span className="text-xs bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent font-bold animate-pulse">
                  ✨ 超级VIP ✨
                </span>
              </div>
            )}
            <p className="text-xs text-muted-foreground">{user.email}</p>
          </div>
        </div>
        <DropdownMenuItem onClick={() => router.push('/profile')}>
          <Settings className="mr-2 h-4 w-4" />
          <span>个人资料</span>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={handleSignOut}>
          <LogOut className="mr-2 h-4 w-4" />
          <span>登出</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

// 为了兼容性，导出两个名称
export const StackUserButton = SupabaseUserButton
export const UserButtonComponent = SupabaseUserButton