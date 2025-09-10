'use client';


import { useState } from 'react';
import { useI18n } from '@/lib/i18n/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Mail, 
  MessageSquare, 
  Send, 
  Phone, 
  MapPin, 
  Clock,
  CheckCircle,
  AlertCircle,
  HelpCircle,
  Bug,
  Heart,
  Lightbulb
} from 'lucide-react';

export default function ContactPage() {
  const t = useI18n();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    category: '',
    message: ''
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.email || !formData.message) {
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setIsSubmitted(true);
        setFormData({
          name: '',
          email: '',
          subject: '',
          category: '',
          message: ''
        });
      } else {
        throw new Error('提交失败');
      }
    } catch (error) {
      console.error('联系表单提交错误:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const categoryIcons = {
    support: HelpCircle,
    bug: Bug,
    feedback: Heart,
    feature: Lightbulb,
    other: MessageSquare
  };

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 py-12">
        <div className="container mx-auto px-4 max-w-2xl">
          <Card className="text-center">
            <CardHeader>
              <div className="mx-auto mb-4">
                <CheckCircle className="h-16 w-16 text-green-600" />
              </div>
              <CardTitle className="text-3xl text-green-800">{t('contact.success.title')}</CardTitle>
              <CardDescription className="text-lg">{t('contact.success.description')}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <p className="text-gray-600">{t('contact.success.details')}</p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button onClick={() => setIsSubmitted(false)} variant="outline">
                    {t('contact.success.sendAnother')}
                  </Button>
                  <Button asChild>
                    <a href="/">{t('contact.success.backHome')}</a>
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 py-12">
      <div className="container mx-auto px-4 max-w-6xl">
        {/* 页面标题 */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            {t('contact.title')}
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            {t('contact.subtitle')}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* 联系方式卡片 */}
          <div className="lg:col-span-1 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <MessageSquare className="h-5 w-5 mr-2 text-blue-600" />
                  {t('contact.info.title')}
                </CardTitle>
                <CardDescription>{t('contact.info.description')}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center space-x-3">
                  <Mail className="h-5 w-5 text-gray-400" />
                  <div>
                    <p className="font-medium">{t('contact.info.email')}</p>
                    <p className="text-sm text-gray-600">support@inspopmars.com</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3">
                  <Clock className="h-5 w-5 text-gray-400" />
                  <div>
                    <p className="font-medium">{t('contact.info.hours')}</p>
                    <p className="text-sm text-gray-600">{t('contact.info.hoursDetail')}</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3">
                  <MapPin className="h-5 w-5 text-gray-400" />
                  <div>
                    <p className="font-medium">{t('contact.info.location')}</p>
                    <p className="text-sm text-gray-600">{t('contact.info.locationDetail')}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* 响应时间 */}
            <Card className="bg-gradient-to-r from-blue-500 to-purple-600 text-white">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Clock className="h-5 w-5 mr-2" />
                  {t('contact.responseTime.title')}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-blue-100">{t('contact.responseTime.urgent')}</span>
                    <span className="font-bold">&lt; 2 {t('contact.responseTime.hours')}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-blue-100">{t('contact.responseTime.normal')}</span>
                    <span className="font-bold">&lt; 24 {t('contact.responseTime.hours')}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-blue-100">{t('contact.responseTime.general')}</span>
                    <span className="font-bold">&lt; 48 {t('contact.responseTime.hours')}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* 联系表单 */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Send className="h-5 w-5 mr-2 text-green-600" />
                  {t('contact.form.title')}
                </CardTitle>
                <CardDescription>{t('contact.form.description')}</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* 姓名和邮箱 */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">{t('contact.form.name')} *</Label>
                      <Input
                        id="name"
                        placeholder={t('contact.form.namePlaceholder')}
                        value={formData.name}
                        onChange={(e) => handleInputChange('name', e.target.value)}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">{t('contact.form.email')} *</Label>
                      <Input
                        id="email"
                        type="email"
                        placeholder={t('contact.form.emailPlaceholder')}
                        value={formData.email}
                        onChange={(e) => handleInputChange('email', e.target.value)}
                        required
                      />
                    </div>
                  </div>

                  {/* 主题和类别 */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="subject">{t('contact.form.subject')}</Label>
                      <Input
                        id="subject"
                        placeholder={t('contact.form.subjectPlaceholder')}
                        value={formData.subject}
                        onChange={(e) => handleInputChange('subject', e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="category">{t('contact.form.category')}</Label>
                      <Select onValueChange={(value) => handleInputChange('category', value)}>
                        <SelectTrigger>
                          <SelectValue placeholder={t('contact.form.categoryPlaceholder')} />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="support">
                            <div className="flex items-center">
                              <HelpCircle className="h-4 w-4 mr-2" />
                              {t('contact.form.categories.support')}
                            </div>
                          </SelectItem>
                          <SelectItem value="bug">
                            <div className="flex items-center">
                              <Bug className="h-4 w-4 mr-2" />
                              {t('contact.form.categories.bug')}
                            </div>
                          </SelectItem>
                          <SelectItem value="feedback">
                            <div className="flex items-center">
                              <Heart className="h-4 w-4 mr-2" />
                              {t('contact.form.categories.feedback')}
                            </div>
                          </SelectItem>
                          <SelectItem value="feature">
                            <div className="flex items-center">
                              <Lightbulb className="h-4 w-4 mr-2" />
                              {t('contact.form.categories.feature')}
                            </div>
                          </SelectItem>
                          <SelectItem value="other">
                            <div className="flex items-center">
                              <MessageSquare className="h-4 w-4 mr-2" />
                              {t('contact.form.categories.other')}
                            </div>
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  {/* 消息内容 */}
                  <div className="space-y-2">
                    <Label htmlFor="message">{t('contact.form.message')} *</Label>
                    <Textarea
                      id="message"
                      placeholder={t('contact.form.messagePlaceholder')}
                      rows={6}
                      value={formData.message}
                      onChange={(e) => handleInputChange('message', e.target.value)}
                      required
                    />
                  </div>

                  {/* 提交按钮 */}
                  <div className="flex flex-col sm:flex-row gap-4">
                    <Button 
                      type="submit" 
                      className="flex-1"
                      disabled={isSubmitting || !formData.name || !formData.email || !formData.message}
                    >
                      {isSubmitting ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                          {t('contact.form.submitting')}
                        </>
                      ) : (
                        <>
                          <Send className="h-4 w-4 mr-2" />
                          {t('contact.form.submit')}
                        </>
                      )}
                    </Button>
                    <Button 
                      type="button" 
                      variant="outline" 
                      onClick={() => setFormData({ name: '', email: '', subject: '', category: '', message: '' })}
                    >
                      {t('contact.form.reset')}
                    </Button>
                  </div>

                  {/* 提示信息 */}
                  <div className="bg-blue-50 p-4 rounded-lg border-l-4 border-blue-400">
                    <div className="flex items-center">
                      <AlertCircle className="h-5 w-5 text-blue-600 mr-2" />
                      <p className="text-sm text-blue-800">
                        {t('contact.form.note')}
                      </p>
                    </div>
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* 快速帮助链接 */}
        <Card className="mt-12">
          <CardHeader>
            <CardTitle className="text-center">{t('contact.quickHelp.title')}</CardTitle>
            <CardDescription className="text-center">{t('contact.quickHelp.description')}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center space-y-3">
                <div className="mx-auto w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                  <HelpCircle className="h-6 w-6 text-blue-600" />
                </div>
                <h3 className="font-medium">{t('contact.quickHelp.faq.title')}</h3>
                <p className="text-sm text-gray-600">{t('contact.quickHelp.faq.description')}</p>
                <Button variant="outline" size="sm" asChild>
                  <a href="/help#faq">{t('contact.quickHelp.faq.button')}</a>
                </Button>
              </div>
              
              <div className="text-center space-y-3">
                <div className="mx-auto w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                  <MessageSquare className="h-6 w-6 text-green-600" />
                </div>
                <h3 className="font-medium">{t('contact.quickHelp.guide.title')}</h3>
                <p className="text-sm text-gray-600">{t('contact.quickHelp.guide.description')}</p>
                <Button variant="outline" size="sm" asChild>
                  <a href="/help">{t('contact.quickHelp.guide.button')}</a>
                </Button>
              </div>
              
              <div className="text-center space-y-3">
                <div className="mx-auto w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                  <Bug className="h-6 w-6 text-purple-600" />
                </div>
                <h3 className="font-medium">{t('contact.quickHelp.troubleshooting.title')}</h3>
                <p className="text-sm text-gray-600">{t('contact.quickHelp.troubleshooting.description')}</p>
                <Button variant="outline" size="sm" asChild>
                  <a href="/help#troubleshooting">{t('contact.quickHelp.troubleshooting.button')}</a>
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}