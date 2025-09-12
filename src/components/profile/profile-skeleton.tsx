'use client'

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Crown, User, Shield, Key, Download, Clock, Mail, Calendar } from 'lucide-react'

export function ProfileSkeleton() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto">
        {/* 页面标题骨架 */}
        <div className="mb-8">
          <div className="flex items-center gap-3">
            <div className="h-8 w-48 bg-gray-200 rounded animate-pulse"></div>
            <div className="h-8 w-8 bg-gray-200 rounded-full animate-pulse"></div>
          </div>
          <div className="h-4 w-64 bg-gray-200 rounded mt-2 animate-pulse"></div>
          <div className="h-6 w-40 bg-gray-200 rounded-full mt-3 animate-pulse"></div>
        </div>

        {/* 会员状态卡片骨架 */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Crown className="w-5 h-5 mr-2 text-gray-300" />
              会员状态
            </CardTitle>
            <CardDescription>
              查看您的订阅状态和剩余权益
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {/* 主要会员状态 */}
              <div className="flex items-center justify-between py-3 px-4 rounded-lg bg-gradient-to-r from-gray-50 to-gray-100">
                <div className="flex items-center">
                  <Crown className="w-6 h-6 mr-3 text-gray-300" />
                  <div>
                    <p className="font-medium text-gray-900">订阅类型</p>
                    <p className="text-sm text-gray-600">当前会员等级</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <div className="h-6 w-20 bg-gray-200 rounded-full animate-pulse"></div>
                </div>
              </div>

              {/* 统计信息骨架 */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center justify-between py-3 px-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center">
                    <Download className="w-5 h-5 mr-2 text-gray-300" />
                    <span className="text-sm font-medium text-gray-700">剩余下载次数</span>
                  </div>
                  <div className="h-6 w-8 bg-gray-200 rounded animate-pulse"></div>
                </div>

                <div className="flex items-center justify-between py-3 px-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center">
                    <Clock className="w-5 h-5 mr-2 text-gray-300" />
                    <span className="text-sm font-medium text-gray-700">剩余天数</span>
                  </div>
                  <div className="h-6 w-16 bg-gray-200 rounded animate-pulse"></div>
                </div>
              </div>

              {/* 到期时间骨架 */}
              <div className="pt-3 border-t border-gray-200">
                <div className="flex items-center justify-between text-sm text-gray-600">
                  <span>到期时间</span>
                  <div className="h-4 w-24 bg-gray-200 rounded animate-pulse"></div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* API令牌卡片骨架 */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Key className="w-5 h-5 mr-2 text-gray-300" />
              API 令牌
            </CardTitle>
            <CardDescription>
              用于API访问的用户令牌，请妥善保管
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between py-3 px-4 bg-gray-50 rounded-lg">
                <div className="flex items-center flex-1">
                  <Key className="w-5 h-5 mr-3 text-gray-300 flex-shrink-0" />
                  <div className="flex-1">
                    <div className="font-mono text-sm bg-white px-3 py-2 rounded border min-w-0">
                      <div className="h-4 w-full bg-gray-200 rounded animate-pulse"></div>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">请勿泄露给他人</p>
                  </div>
                </div>
              </div>

              <div className="flex gap-2">
                <div className="h-8 w-16 bg-gray-200 rounded animate-pulse"></div>
                <div className="h-8 w-16 bg-gray-200 rounded animate-pulse"></div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 基本信息卡片骨架 */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center">
              <User className="w-5 h-5 mr-2 text-gray-300" />
              基本信息
            </CardTitle>
            <CardDescription>
              管理您的个人资料信息
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">姓名</label>
                <div className="h-10 w-full bg-gray-200 rounded animate-pulse"></div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">邮箱</label>
                <div className="h-10 w-full bg-gray-200 rounded animate-pulse"></div>
                <p className="text-xs text-gray-500">邮箱地址无法修改</p>
              </div>

              <div className="flex gap-2 pt-4">
                <div className="h-10 w-20 bg-gray-200 rounded animate-pulse"></div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 账户信息卡片骨架 */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Shield className="w-5 h-5 mr-2 text-gray-300" />
              账户信息
            </CardTitle>
            <CardDescription>
              查看您的账户详细信息
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between py-2 border-b">
                <div className="flex items-center">
                  <Mail className="w-4 h-4 mr-2 text-gray-500" />
                  <span className="text-sm font-medium">邮箱地址</span>
                </div>
                <div className="h-4 w-32 bg-gray-200 rounded animate-pulse"></div>
              </div>

              <div className="flex items-center justify-between py-2 border-b">
                <div className="flex items-center">
                  <User className="w-4 h-4 mr-2 text-gray-500" />
                  <span className="text-sm font-medium">用户ID</span>
                </div>
                <div className="h-4 w-24 bg-gray-200 rounded animate-pulse"></div>
              </div>

              <div className="flex items-center justify-between py-2">
                <div className="flex items-center">
                  <Calendar className="w-4 h-4 mr-2 text-gray-500" />
                  <span className="text-sm font-medium">注册日期</span>
                </div>
                <div className="h-4 w-20 bg-gray-200 rounded animate-pulse"></div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}