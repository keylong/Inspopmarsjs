'use client'

import { useState, useEffect } from 'react'
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
import { useAuth } from '@/lib/auth-context'

export function SupabaseUserButton() {
  const { user, userProfile, isLoading, signOut } = useAuth()
  const [mounted, setMounted] = useState(false)
  const router = useRouter()

  useEffect(() => {
    setMounted(true)
  }, [])

  if (isLoading) {
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
            <Avatar className={`h-8 w-8 ${mounted && userProfile?.buytype != null && userProfile.buytype >= 2 && userProfile?.membership?.isActive ? 'ring-2 ring-yellow-400 ring-offset-1 ring-offset-background' : ''}`}>
              <AvatarImage src={user.image} alt={user.email} />
              <AvatarFallback className={`font-semibold ${
                mounted && userProfile?.buytype != null && userProfile.buytype >= 2 && userProfile?.membership?.isActive 
                  ? 'bg-gradient-to-r from-yellow-400 to-orange-500 text-white' 
                  : 'bg-primary text-primary-foreground'
              }`}>
                {(user.name || user.email)?.[0]?.toUpperCase() || <User className="h-4 w-4" />}
              </AvatarFallback>
            </Avatar>
          </Button>
          {/* VIP用户的皇冠显示在头像上方 (buytype >= 2) */}
          {mounted && userProfile?.buytype != null && userProfile.buytype >= 2 && userProfile?.membership?.isActive && (
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
              {mounted && userProfile?.buytype != null && userProfile.buytype >= 2 && userProfile?.membership?.isActive && (
                <Crown className="w-4 h-4 text-yellow-500 animate-pulse" />
              )}
              <p className={`font-medium transition-all duration-300 hover:scale-105 ${
                mounted && userProfile?.buytype != null && userProfile.buytype >= 2 && userProfile?.membership?.isActive
                  ? 'bg-gradient-to-r from-yellow-500 via-purple-600 to-pink-600 bg-clip-text text-transparent font-bold animate-pulse cursor-pointer'
                  : ''
              }`}>
                {user.name || user.email}
              </p>
            </div>
            {mounted && userProfile?.buytype != null && userProfile.buytype >= 2 && userProfile?.membership?.isActive && (
              <div className="flex items-center gap-1">
                <span className="text-xs bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent font-bold animate-pulse">
                  ✨ {userProfile?.membership?.typeName} ✨
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
        <DropdownMenuItem onClick={signOut}>
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