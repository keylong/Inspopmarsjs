'use client'


import React, { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { ProtectedRoute } from '@/components/auth/protected-route'
import { useAuth } from '@/hooks/useAuth'
import { useI18n } from '@/lib/i18n/client'
import { User, Mail, Calendar, Shield, Crown } from 'lucide-react'
import { PaymentModal } from '@/components/payment-modal'
import { ProfileSkeleton } from '@/components/profile/profile-skeleton'
import { MembershipCard } from '@/components/profile/membership-card'
import { ApiTokenCard } from '@/components/profile/api-token-card'

export default function ProfilePage() {
  const { user, userProfile, refreshProfile } = useAuth()
  const router = useRouter()
  const params = useParams()
  const locale = params?.locale as string || 'zh-CN'
  const t = useI18n()
  const [isEditing, setIsEditing] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [profileLoading, setProfileLoading] = useState(true)
  const [showPaymentModal, setShowPaymentModal] = useState(false)
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
  })

  // 使用 Context 中的 userProfile，如果没有则触发一次获取
  useEffect(() => {
    if (userProfile) {
      // Context 中已有数据，直接使用
      setFormData({
        name: userProfile.name || user?.name || '',
        email: userProfile.email || user?.email || '',
      })
      setProfileLoading(false)
    } else if (user?.id) {
      // 没有 profile 数据但已登录，调用刷新
      refreshProfile().finally(() => {
        setProfileLoading(false)
      })
    } else {
      setProfileLoading(false)
    }
  }, [userProfile, user, refreshProfile])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')
    setSuccess('')

    try {
      const response = await fetch('/api/profile/update', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        setError(data.error || t('profile.basicInfo.updateError'))
      } else {
        setSuccess(t('profile.basicInfo.updateSuccess'))
        setIsEditing(false)
        // 刷新页面或重新获取用户信息
        router.refresh()
      }
    } catch {
      setError(t('profile.basicInfo.updateError'))
    } finally {
      setIsLoading(false)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value,
    }))
  }

  const handleCancel = () => {
    setFormData({
      name: user?.name || '',
      email: user?.email || '',
    })
    setIsEditing(false)
    setError('')
    setSuccess('')
  }

  // 获取会员状态显示的颜色和样式
  const getMembershipBadgeStyle = (membership: any) => {
    if (!membership || membership.type === 'free') {
      return 'bg-gray-100 text-gray-700'
    }
    if (membership.type === 'expired') {
      return 'bg-red-100 text-red-700'
    }
    if (membership.type === 'active') {
      // 超级年度会员特殊样式
      if (membership.typeName === '超级年度会员') {
        return 'bg-gradient-to-r from-purple-100 to-pink-100 text-purple-800 border border-purple-200'
      }
      return 'bg-green-100 text-green-700'
    }
    return 'bg-gray-100 text-gray-700'
  }

  // 检查是否是VIP会员 (buytype >= 2)
  const isVip = userProfile?.buytype !== undefined && userProfile.buytype >= 2 && userProfile?.membership?.isActive

  if (profileLoading) {
    return (
      <ProtectedRoute>
        <ProfileSkeleton />
      </ProtectedRoute>
    )
  }

  return (
    <ProtectedRoute>
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <div className="mb-8">
            <div className="flex items-center gap-3">
              <h1 className="text-3xl font-bold">{t('profile.pageTitle')}</h1>
              {isVip && (
                <div className="flex items-center animate-fadeIn">
                  <Crown className="w-8 h-8 text-yellow-500 animate-pulse" />
                  <span className="text-sm bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent font-bold ml-1">
                    VIP
                  </span>
                </div>
              )}
            </div>
            <p className="text-gray-600 mt-2">{t('profile.pageDescription')}</p>
            {isVip && (
              <div className="mt-3 inline-flex items-center px-3 py-1 rounded-full bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-200 animate-slideInFromBottom">
                <Crown className="w-4 h-4 text-purple-600 mr-2" />
                <span className="text-sm text-purple-700 font-medium">尊贵的{userProfile?.membership?.typeName}</span>
              </div>
            )}
          </div>

          {/* 会员状态卡片 */}
          <MembershipCard 
            data={userProfile}
            isLoading={false}
            onUpgrade={() => setShowPaymentModal(true)}
          />

          {/* API令牌卡片 */}
          <ApiTokenCard 
            token={userProfile?.token || null}
            isLoading={false}
          />

          {/* 基本信息卡片 */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="flex items-center">
                <User className="w-5 h-5 mr-2" />
{t('profile.basicInfo.title')}
              </CardTitle>
              <CardDescription>
{t('profile.basicInfo.description')}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {error && (
                <Alert variant="destructive" className="mb-4">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              {success && (
                <Alert className="mb-4">
                  <AlertDescription>{success}</AlertDescription>
                </Alert>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <label htmlFor="name" className="text-sm font-medium">
                    {t('profile.basicInfo.nameLabel')}
                  </label>
                  <Input
                    id="name"
                    name="name"
                    type="text"
                    value={formData.name}
                    onChange={handleInputChange}
                    disabled={!isEditing || isLoading}
                    placeholder={t('profile.basicInfo.namePlaceholder')}
                  />
                </div>

                <div className="space-y-2">
                  <label htmlFor="email" className="text-sm font-medium">
                    {t('profile.basicInfo.emailLabel')}
                  </label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    disabled={true}
                    className="bg-gray-50"
                  />
                  <p className="text-xs text-gray-500">
                    {t('profile.basicInfo.emailNote')}
                  </p>
                </div>

                <div className="flex gap-2 pt-4">
                  {isEditing ? (
                    <>
                      <Button type="submit" disabled={isLoading}>
                        {isLoading ? t('profile.basicInfo.savingButton') : t('profile.basicInfo.saveButton')}
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        onClick={handleCancel}
                        disabled={isLoading}
                      >
{t('profile.basicInfo.cancelButton')}
                      </Button>
                    </>
                  ) : (
                    <Button
                      type="button"
                      onClick={() => setIsEditing(true)}
                    >
{t('profile.basicInfo.editButton')}
                    </Button>
                  )}
                </div>
              </form>
            </CardContent>
          </Card>

          {/* 账户信息卡片 */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Shield className="w-5 h-5 mr-2" />
{t('profile.accountInfo.title')}
              </CardTitle>
              <CardDescription>
{t('profile.accountInfo.description')}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between py-2 border-b">
                  <div className="flex items-center">
                    <Mail className="w-4 h-4 mr-2 text-gray-500" />
                    <span className="text-sm font-medium">{t('profile.accountInfo.email')}</span>
                  </div>
                  <span className="text-sm text-gray-600">{user?.email}</span>
                </div>

                <div className="flex items-center justify-between py-2 border-b">
                  <div className="flex items-center">
                    <User className="w-4 h-4 mr-2 text-gray-500" />
                    <span className="text-sm font-medium">{t('profile.accountInfo.userId')}</span>
                  </div>
                  <span className="text-sm text-gray-600 font-mono">{user?.id}</span>
                </div>

                <div className="flex items-center justify-between py-2">
                  <div className="flex items-center">
                    <Calendar className="w-4 h-4 mr-2 text-gray-500" />
                    <span className="text-sm font-medium">{t('profile.accountInfo.registrationDate')}</span>
                  </div>
                  <span className="text-sm text-gray-600">
                    {new Date().toLocaleDateString('zh-CN')}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* 支付弹窗 */}
          <PaymentModal 
            isOpen={showPaymentModal} 
            onClose={() => setShowPaymentModal(false)}
            locale={locale}
          />

        </div>
      </div>
    </ProtectedRoute>
  )
}