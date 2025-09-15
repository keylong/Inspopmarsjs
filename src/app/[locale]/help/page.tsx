'use client';


import { useI18n } from '@/lib/i18n/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Link from 'next/link';
import { 
  Download, 
  Instagram, 
  Video, 
  Image as ImageIcon, 
  Play, 
  Users, 
  Shield, 
  Zap,
  HelpCircle,
  MessageSquare,
  BookOpen,
  Search
} from 'lucide-react';

export default function HelpPage() {
  const t = useI18n();

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 to-purple-50 py-12">
      <div className="container mx-auto px-4 max-w-6xl">
        {/* 页面标题 */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            {t('help.title')}
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            {t('help.subtitle')}
          </p>
        </div>

        {/* 快速导航卡片 */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
          <Card className="hover:shadow-lg transition-all duration-300 cursor-pointer">
            <CardHeader className="text-center">
              <BookOpen className="h-12 w-12 text-pink-600 mx-auto mb-2" />
              <CardTitle className="text-lg">{t('help.quickStart.title')}</CardTitle>
              <CardDescription>{t('help.quickStart.description')}</CardDescription>
            </CardHeader>
          </Card>
          
          <Card className="hover:shadow-lg transition-all duration-300 cursor-pointer">
            <CardHeader className="text-center">
              <Download className="h-12 w-12 text-blue-600 mx-auto mb-2" />
              <CardTitle className="text-lg">{t('help.downloadGuide.title')}</CardTitle>
              <CardDescription>{t('help.downloadGuide.description')}</CardDescription>
            </CardHeader>
          </Card>
          
          <Card className="hover:shadow-lg transition-all duration-300 cursor-pointer">
            <CardHeader className="text-center">
              <HelpCircle className="h-12 w-12 text-green-600 mx-auto mb-2" />
              <CardTitle className="text-lg">{t('help.faq.title')}</CardTitle>
              <CardDescription>{t('help.faq.description')}</CardDescription>
            </CardHeader>
          </Card>
          
          <Card className="hover:shadow-lg transition-all duration-300 cursor-pointer">
            <CardHeader className="text-center">
              <MessageSquare className="h-12 w-12 text-purple-600 mx-auto mb-2" />
              <CardTitle className="text-lg">{t('help.contact.title')}</CardTitle>
              <CardDescription>{t('help.contact.description')}</CardDescription>
            </CardHeader>
          </Card>
        </div>

        {/* 主要内容区域 */}
        <Tabs defaultValue="quick-start" className="space-y-8">
          <TabsList className="grid w-full grid-cols-1 md:grid-cols-4 h-auto">
            <TabsTrigger value="quick-start" className="py-3">
              <BookOpen className="h-4 w-4 mr-2" />
              {t('help.tabs.quickStart')}
            </TabsTrigger>
            <TabsTrigger value="download-guide" className="py-3">
              <Download className="h-4 w-4 mr-2" />
              {t('help.tabs.downloadGuide')}
            </TabsTrigger>
            <TabsTrigger value="faq" className="py-3">
              <HelpCircle className="h-4 w-4 mr-2" />
              {t('help.tabs.faq')}
            </TabsTrigger>
            <TabsTrigger value="troubleshooting" className="py-3">
              <Search className="h-4 w-4 mr-2" />
              {t('help.tabs.troubleshooting')}
            </TabsTrigger>
          </TabsList>

          {/* 快速开始 */}
          <TabsContent value="quick-start">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Zap className="h-5 w-5 mr-2 text-yellow-600" />
                    {t('help.quickStart.step1.title')}
                  </CardTitle>
                  <CardDescription>{t('help.quickStart.step1.description')}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <p className="text-sm text-gray-600 mb-2">{t('help.quickStart.step1.example')}</p>
                      <code className="text-xs bg-white p-2 rounded border block">
                        https://www.instagram.com/p/ABC123/
                      </code>
                    </div>
                    <ul className="space-y-2 text-sm">
                      <li className="flex items-center">
                        <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                        {t('help.quickStart.step1.tip1')}
                      </li>
                      <li className="flex items-center">
                        <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                        {t('help.quickStart.step1.tip2')}
                      </li>
                    </ul>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Download className="h-5 w-5 mr-2 text-blue-600" />
                    {t('help.quickStart.step2.title')}
                  </CardTitle>
                  <CardDescription>{t('help.quickStart.step2.description')}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center space-x-4 p-4 bg-blue-50 rounded-lg">
                      <div className="flex-1">
                        <input 
                          type="text" 
                          placeholder={t('help.quickStart.step2.placeholder')}
                          className="w-full px-3 py-2 border rounded-md"
                          disabled
                        />
                      </div>
                      <Button disabled>
                        {t('common.download')}
                      </Button>
                    </div>
                    <p className="text-sm text-gray-600">{t('help.quickStart.step2.note')}</p>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* 支持的内容类型 */}
            <Card className="mt-8">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Instagram className="h-5 w-5 mr-2 text-pink-600" />
                  {t('help.supportedTypes.title')}
                </CardTitle>
                <CardDescription>{t('help.supportedTypes.description')}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                    <ImageIcon className="h-8 w-8 text-blue-600" />
                    <div>
                      <h4 className="font-medium">{t('help.supportedTypes.photos')}</h4>
                      <p className="text-sm text-gray-600">{t('help.supportedTypes.photosDesc')}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                    <Video className="h-8 w-8 text-red-600" />
                    <div>
                      <h4 className="font-medium">{t('help.supportedTypes.videos')}</h4>
                      <p className="text-sm text-gray-600">{t('help.supportedTypes.videosDesc')}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                    <Play className="h-8 w-8 text-purple-600" />
                    <div>
                      <h4 className="font-medium">{t('help.supportedTypes.stories')}</h4>
                      <p className="text-sm text-gray-600">{t('help.supportedTypes.storiesDesc')}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                    <Video className="h-8 w-8 text-green-600" />
                    <div>
                      <h4 className="font-medium">{t('help.supportedTypes.reels')}</h4>
                      <p className="text-sm text-gray-600">{t('help.supportedTypes.reelsDesc')}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                    <Video className="h-8 w-8 text-orange-600" />
                    <div>
                      <h4 className="font-medium">{t('help.supportedTypes.igtv')}</h4>
                      <p className="text-sm text-gray-600">{t('help.supportedTypes.igtvDesc')}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                    <Users className="h-8 w-8 text-indigo-600" />
                    <div>
                      <h4 className="font-medium">{t('help.supportedTypes.highlights')}</h4>
                      <p className="text-sm text-gray-600">{t('help.supportedTypes.highlightsDesc')}</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* 下载指南 */}
          <TabsContent value="download-guide">
            <div className="space-y-8">
              <Card>
                <CardHeader>
                  <CardTitle>{t('help.downloadGuide.stepByStep.title')}</CardTitle>
                  <CardDescription>{t('help.downloadGuide.stepByStep.description')}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    {[
                      {
                        title: t('help.downloadGuide.steps.step1.title'),
                        description: t('help.downloadGuide.steps.step1.description'),
                        tip: t('help.downloadGuide.steps.step1.tip')
                      },
                      {
                        title: t('help.downloadGuide.steps.step2.title'),
                        description: t('help.downloadGuide.steps.step2.description')
                      },
                      {
                        title: t('help.downloadGuide.steps.step3.title'),
                        description: t('help.downloadGuide.steps.step3.description')
                      },
                      {
                        title: t('help.downloadGuide.steps.step4.title'),
                        description: t('help.downloadGuide.steps.step4.description')
                      }
                    ].map((step, index) => (
                      <div key={index + 1} className="flex items-start space-x-4">
                        <div className="flex-shrink-0 w-8 h-8 bg-pink-600 text-white rounded-full flex items-center justify-center font-bold">
                          {index + 1}
                        </div>
                        <div className="flex-1">
                          <h4 className="font-medium text-lg mb-2">
                            {step.title}
                          </h4>
                          <p className="text-gray-600 mb-3">
                            {step.description}
                          </p>
                          {index === 0 && step.tip && (
                            <div className="bg-yellow-50 p-3 rounded-lg border-l-4 border-yellow-400">
                              <p className="text-sm text-yellow-800">
                                {step.tip}
                              </p>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Shield className="h-5 w-5 mr-2 text-green-600" />
                      {t('help.downloadGuide.tips.title')}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-3">
                      {[
                        t('help.downloadGuide.tips.tip1'),
                        t('help.downloadGuide.tips.tip2'),
                        t('help.downloadGuide.tips.tip3'),
                        t('help.downloadGuide.tips.tip4')
                      ].map((tip, index) => (
                        <li key={index} className="flex items-start space-x-2">
                          <span className="flex-shrink-0 w-1.5 h-1.5 bg-green-600 rounded-full mt-2"></span>
                          <span className="text-sm">{tip}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <HelpCircle className="h-5 w-5 mr-2 text-blue-600" />
                      {t('help.downloadGuide.limitations.title')}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-3">
                      {[
                        t('help.downloadGuide.limitations.item1'),
                        t('help.downloadGuide.limitations.item2'),
                        t('help.downloadGuide.limitations.item3')
                      ].map((limitation, index) => (
                        <li key={index} className="flex items-start space-x-2">
                          <span className="flex-shrink-0 w-1.5 h-1.5 bg-blue-600 rounded-full mt-2"></span>
                          <span className="text-sm">{limitation}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          {/* 常见问题 */}
          <TabsContent value="faq">
            <div className="space-y-6">
              {[
                { question: t('help.faq.items.q1.question'), answer: t('help.faq.items.q1.answer') },
                { question: t('help.faq.items.q2.question'), answer: t('help.faq.items.q2.answer') },
                { question: t('help.faq.items.q3.question'), answer: t('help.faq.items.q3.answer') },
                { question: t('help.faq.items.q4.question'), answer: t('help.faq.items.q4.answer') },
                { question: t('help.faq.items.q5.question'), answer: t('help.faq.items.q5.answer') },
                { question: t('help.faq.items.q6.question'), answer: t('help.faq.items.q6.answer') },
                { question: t('help.faq.items.q7.question'), answer: t('help.faq.items.q7.answer') },
                { question: t('help.faq.items.q8.question'), answer: t('help.faq.items.q8.answer') }
              ].map((faq, index) => (
                <Card key={index}>
                  <CardHeader>
                    <CardTitle className="text-lg">{faq.question}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600">{faq.answer}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* 故障排除 */}
          <TabsContent value="troubleshooting">
            <div className="space-y-8">
              <Card>
                <CardHeader>
                  <CardTitle>{t('help.troubleshooting.common.title')}</CardTitle>
                  <CardDescription>{t('help.troubleshooting.common.description')}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    {[
                      {
                        title: t('help.troubleshooting.problems.problem1.title'),
                        description: t('help.troubleshooting.problems.problem1.description'),
                        solution: t('help.troubleshooting.problems.problem1.solution')
                      },
                      {
                        title: t('help.troubleshooting.problems.problem2.title'),
                        description: t('help.troubleshooting.problems.problem2.description'),
                        solution: t('help.troubleshooting.problems.problem2.solution')
                      },
                      {
                        title: t('help.troubleshooting.problems.problem3.title'),
                        description: t('help.troubleshooting.problems.problem3.description'),
                        solution: t('help.troubleshooting.problems.problem3.solution')
                      },
                      {
                        title: t('help.troubleshooting.problems.problem4.title'),
                        description: t('help.troubleshooting.problems.problem4.description'),
                        solution: t('help.troubleshooting.problems.problem4.solution')
                      }
                    ].map((problem, index) => (
                      <div key={index} className="border-l-4 border-orange-400 bg-orange-50 p-4 rounded-r-lg">
                        <h4 className="font-medium text-orange-800 mb-2">
                          {problem.title}
                        </h4>
                        <p className="text-orange-700 text-sm mb-3">
                          {problem.description}
                        </p>
                        <div className="space-y-2">
                          <p className="text-sm font-medium text-orange-800">{t('help.troubleshooting.solution')}:</p>
                          <p className="text-sm text-orange-700">
                            {problem.solution}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>

        {/* 联系支持 */}
        <Card className="mt-12 bg-gradient-to-r from-pink-500 to-purple-600 text-white">
          <CardHeader>
            <CardTitle className="text-center text-2xl">{t('help.needMoreHelp.title')}</CardTitle>
            <CardDescription className="text-center text-pink-100 text-lg">
              {t('help.needMoreHelp.description')}
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center">
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/contact">
                <Button variant="secondary" className="w-full sm:w-auto">
                  <MessageSquare className="h-4 w-4 mr-2" />
                  {t('help.needMoreHelp.contactUs')}
                </Button>
              </Link>
              <Button variant="outline" className="w-full sm:w-auto bg-transparent border-white text-white hover:bg-white hover:text-pink-600">
                <Download className="h-4 w-4 mr-2" />
                {t('help.needMoreHelp.tryNow')}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}