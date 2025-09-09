'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { ProtectedRoute } from '@/components/auth/protected-route'
import { useAuth } from '@/hooks/useAuth'
import { useI18n } from '@/lib/i18n/client'
import { User, Mail, Calendar, Shield } from 'lucide-react'

export default function ProfilePage() {
  const { user } = useAuth()
  const router = useRouter()
  const t = useI18n()
  const [isEditing, setIsEditing] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
  })

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

  return (
    <ProtectedRoute>
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold">{t('profile.pageTitle')}</h1>
            <p className="text-gray-600 mt-2">{t('profile.pageDescription')}</p>
          </div>

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

          {/* 操作区域 */}
          <Card>
            <CardHeader>
              <CardTitle className="text-red-600">{t('profile.dangerZone.title')}</CardTitle>
              <CardDescription>
{t('profile.dangerZone.description')}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="p-4 border border-red-200 rounded-lg bg-red-50">
                  <h4 className="font-medium text-red-800 mb-2">{t('profile.dangerZone.deleteAccount.title')}</h4>
                  <p className="text-sm text-red-600 mb-3">
                    {t('profile.dangerZone.deleteAccount.warning')}
                  </p>
                  <Button variant="destructive" size="sm">
{t('profile.dangerZone.deleteAccount.button')}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </ProtectedRoute>
  )
}