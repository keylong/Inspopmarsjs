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
import { User, Mail, Calendar, Shield, Crown, Download, Key, Clock, Copy, Eye, EyeOff } from 'lucide-react'
import { PaymentModal } from '@/components/payment-modal'

export default function ProfilePage() {
  const { user } = useAuth()
  const router = useRouter()
  const params = useParams()
  const locale = params?.locale as string || 'zh-CN'
  const t = useI18n()
  const [isEditing, setIsEditing] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [userProfile, setUserProfile] = useState<any>(null)
  const [profileLoading, setProfileLoading] = useState(true)
  const [showToken, setShowToken] = useState(false)
  const [copySuccess, setCopySuccess] = useState(false)
  const [showPaymentModal, setShowPaymentModal] = useState(false)
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
  })

  // 获取用户完整资料信息
  useEffect(() => {
    const fetchUserProfile = async () => {
      if (!user?.id) return
      
      try {
        const response = await fetch('/api/profile')
        if (response.ok) {
          const data = await response.json()
          setUserProfile(data.user)
          setFormData({
            name: data.user.name || '',
            email: data.user.email || '',
          })
        }
      } catch (error) {
        console.error('获取用户资料失败:', error)
      } finally {
        setProfileLoading(false)
      }
    }

    fetchUserProfile()
  }, [user?.id])

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

  // 检查是否是超级年度会员
  const isSuperVip = userProfile?.membership?.typeName === '超级年度会员' && userProfile?.membership?.isActive

  // 格式化日期
  const formatDate = (date: string | null) => {
    if (!date) return '未设置'
    return new Date(date).toLocaleDateString('zh-CN')
  }

  // 复制令牌到剪贴板
  const copyTokenToClipboard = async () => {
    if (!userProfile?.token) return
    
    try {
      await navigator.clipboard.writeText(userProfile.token)
      setCopySuccess(true)
      setTimeout(() => setCopySuccess(false), 2000)
    } catch (error) {
      console.error('复制失败:', error)
      // 如果现代API不可用，使用传统方法
      const textArea = document.createElement('textarea')
      textArea.value = userProfile.token
      document.body.appendChild(textArea)
      textArea.select()
      try {
        document.execCommand('copy')
        setCopySuccess(true)
        setTimeout(() => setCopySuccess(false), 2000)
      } catch (fallbackError) {
        console.error('复制失败:', fallbackError)
      }
      document.body.removeChild(textArea)
    }
  }

  // 切换令牌显示状态
  const toggleTokenVisibility = () => {
    setShowToken(!showToken)
  }

  if (profileLoading) {
    return (
      <ProtectedRoute>
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-2xl mx-auto">
            <div className="animate-pulse">
              <div className="h-8 bg-gray-200 rounded mb-4"></div>
              <div className="h-4 bg-gray-200 rounded mb-8"></div>
              <div className="space-y-6">
                <div className="h-48 bg-gray-200 rounded"></div>
                <div className="h-48 bg-gray-200 rounded"></div>
                <div className="h-48 bg-gray-200 rounded"></div>
              </div>
            </div>
          </div>
        </div>
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
              {isSuperVip && (
                <div className="flex items-center">
                  <Crown className="w-8 h-8 text-yellow-500 animate-pulse" />
                  <span className="text-sm bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent font-bold ml-1">
                    超级VIP
                  </span>
                </div>
              )}
            </div>
            <p className="text-gray-600 mt-2">{t('profile.pageDescription')}</p>
            {isSuperVip && (
              <div className="mt-3 inline-flex items-center px-3 py-1 rounded-full bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-200">
                <Crown className="w-4 h-4 text-purple-600 mr-2" />
                <span className="text-sm text-purple-700 font-medium">尊贵的超级年度会员</span>
              </div>
            )}
          </div>

          {/* 会员状态卡片 */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Crown className="w-5 h-5 mr-2 text-yellow-500" />
                会员状态
              </CardTitle>
              <CardDescription>
                查看您的订阅状态和剩余权益
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className={`flex items-center justify-between py-3 px-4 rounded-lg ${
                  isSuperVip 
                    ? 'bg-gradient-to-r from-purple-50 via-pink-50 to-yellow-50 border border-purple-200' 
                    : 'bg-gradient-to-r from-blue-50 to-purple-50'
                }`}>
                  <div className="flex items-center">
                    <Crown className={`w-6 h-6 mr-3 ${
                      isSuperVip ? 'text-purple-600 animate-pulse' : 'text-yellow-500'
                    }`} />
                    <div>
                      <p className="font-medium text-gray-900">订阅类型</p>
                      <p className="text-sm text-gray-600">当前会员等级</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {isSuperVip && (
                      <Crown className="w-5 h-5 text-purple-600 animate-bounce" />
                    )}
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${getMembershipBadgeStyle(userProfile?.membership)}`}>
                      {userProfile?.membership?.typeName || '免费用户'}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center justify-between py-3 px-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center">
                      <Download className="w-5 h-5 mr-2 text-blue-500" />
                      <span className="text-sm font-medium text-gray-700">剩余下载次数</span>
                    </div>
                    <span className="text-lg font-bold text-blue-600">{userProfile?.value || 0}</span>
                  </div>

                  <div className="flex items-center justify-between py-3 px-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center">
                      <Clock className="w-5 h-5 mr-2 text-green-500" />
                      <span className="text-sm font-medium text-gray-700">剩余天数</span>
                    </div>
                    <span className="text-lg font-bold text-green-600">
                      {userProfile?.membership?.daysRemaining !== null 
                        ? `${userProfile?.membership?.daysRemaining} 天`
                        : '无限制'
                      }
                    </span>
                  </div>
                </div>

                {userProfile?.membership?.expiresAt && (
                  <div className="pt-3 border-t border-gray-200">
                    <div className="flex items-center justify-between text-sm text-gray-600">
                      <span>到期时间</span>
                      <span>{formatDate(userProfile.membership.expiresAt)}</span>
                    </div>
                  </div>
                )}

                {userProfile?.membership?.type === 'free' && (
                  <div className="pt-3 border-t border-gray-200">
                    <Button 
                      variant="default" 
                      size="sm" 
                      onClick={() => setShowPaymentModal(true)}
                      className="w-full"
                    >
                      升级到会员
                    </Button>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* API令牌卡片 */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Key className="w-5 h-5 mr-2 text-purple-500" />
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
                    <Key className="w-5 h-5 mr-3 text-purple-500 flex-shrink-0" />
                    <div className="flex-1">
                      <div className="font-mono text-sm bg-white px-3 py-2 rounded border min-w-0">
                        {userProfile?.token ? (
                          showToken ? (
                            <span className="text-gray-700 break-all">{userProfile.token}</span>
                          ) : (
                            <span className="text-gray-400">••••••••••••••••••••••••••••••••</span>
                          )
                        ) : (
                          <span className="text-gray-400">未设置</span>
                        )}
                      </div>
                      <p className="text-xs text-gray-500 mt-1">请勿泄露给他人</p>
                    </div>
                  </div>
                </div>

                {userProfile?.token && (
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={toggleTokenVisibility}
                      className="flex items-center gap-2"
                    >
                      {showToken ? (
                        <>
                          <EyeOff className="w-4 h-4" />
                          隐藏
                        </>
                      ) : (
                        <>
                          <Eye className="w-4 h-4" />
                          显示
                        </>
                      )}
                    </Button>
                    
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={copyTokenToClipboard}
                      className="flex items-center gap-2"
                      disabled={copySuccess}
                    >
                      <Copy className="w-4 h-4" />
                      {copySuccess ? '已复制!' : '复制'}
                    </Button>
                  </div>
                )}

                {!userProfile?.token && (
                  <div className="text-center py-4">
                    <p className="text-sm text-gray-500 mb-2">尚未生成API令牌</p>
                    <Button variant="outline" size="sm">
                      生成令牌
                    </Button>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

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