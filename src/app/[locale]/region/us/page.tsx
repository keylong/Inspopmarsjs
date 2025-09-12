import { Metadata } from 'next';
import { generateUSSEOMetadata, generateUSStructuredData } from './lib/us-seo';
import { USHero } from './components/USHero';
import { USTestimonials } from './components/USTestimonials';
import { USPricing } from './components/USPricing';
import { LocalBusinessStructuredData } from '@/components/seo/structured-data';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, Shield, Zap, Globe, CreditCard, Users, Star, TrendingUp, Award } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

// 生成页面元数据
export async function generateMetadata(): Promise<Metadata> {
  return generateUSSEOMetadata();
}

// 初始化分析追踪（客户端组件）
function USAnalyticsInitializer() {
  'use client';
  
  if (typeof window !== 'undefined') {
    import('./lib/us-analytics').then(({ initUSAnalytics, trackUSPageView }) => {
      initUSAnalytics();
      trackUSPageView('US Landing Page');
    });
  }
  
  return null;
}

export default function USRegionPage() {
  const structuredData = generateUSStructuredData();
  
  return (
    <>
      {/* SEO结构化数据 */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <LocalBusinessStructuredData region="us" />
      
      {/* 分析追踪初始化 */}
      <USAnalyticsInitializer />
      
      {/* Hero区域 - 使用定制化组件 */}
      <USHero />
      
      {/* 信任指标 */}
      <section className="py-12 bg-white border-b">
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap items-center justify-center gap-8 md:gap-16">
            <div className="flex items-center gap-2">
              <TrendingUp className="w-6 h-6 text-green-600" />
              <div>
                <div className="text-2xl font-bold">251%</div>
                <div className="text-sm text-gray-600">Growth Rate</div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Award className="w-6 h-6 text-blue-600" />
              <div>
                <div className="text-2xl font-bold">#1</div>
                <div className="text-sm text-gray-600">In USA Market</div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Star className="w-6 h-6 text-yellow-500" />
              <div>
                <div className="text-2xl font-bold">4.9/5</div>
                <div className="text-sm text-gray-600">10K+ Reviews</div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Shield className="w-6 h-6 text-purple-600" />
              <div>
                <div className="text-2xl font-bold">SSL</div>
                <div className="text-sm text-gray-600">Secured</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 核心功能 */}
      <section className="py-16 bg-gradient-to-b from-gray-50 to-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Built for US E-commerce Success
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Specialized features designed for Amazon FBA sellers, Shopify store owners, and social media managers
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-6 max-w-6xl mx-auto">
            <Card className="border-2 hover:border-blue-500 transition-colors">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Globe className="w-5 h-5 mr-2 text-blue-600" />
                  No VPN Required
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-4">
                  Works seamlessly across all 50 US states without any VPN or proxy requirements.
                </p>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-center">
                    <CheckCircle className="w-4 h-4 mr-2 text-green-500" />
                    Direct US server access
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="w-4 h-4 mr-2 text-green-500" />
                    No geo-restrictions
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="w-4 h-4 mr-2 text-green-500" />
                    100% legal compliance
                  </li>
                </ul>
              </CardContent>
            </Card>
            
            <Card className="border-2 hover:border-blue-500 transition-colors">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Zap className="w-5 h-5 mr-2 text-yellow-500" />
                  Lightning Fast CDN
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-4">
                  Powered by US-based CloudFlare CDN for maximum download speeds.
                </p>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-center">
                    <CheckCircle className="w-4 h-4 mr-2 text-green-500" />
                    Average 2.3s download time
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="w-4 h-4 mr-2 text-green-500" />
                    99.9% uptime guarantee
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="w-4 h-4 mr-2 text-green-500" />
                    Parallel processing
                  </li>
                </ul>
              </CardContent>
            </Card>
            
            <Card className="border-2 hover:border-blue-500 transition-colors">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Shield className="w-5 h-5 mr-2 text-green-600" />
                  Enterprise Security
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-4">
                  Bank-level encryption and full compliance with US data protection laws.
                </p>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-center">
                    <CheckCircle className="w-4 h-4 mr-2 text-green-500" />
                    CCPA compliant
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="w-4 h-4 mr-2 text-green-500" />
                    DMCA protected
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="w-4 h-4 mr-2 text-green-500" />
                    SSL/TLS encryption
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* 使用场景 */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
            Perfect for Your Business Needs
          </h2>
          
          <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            <div className="bg-gradient-to-br from-blue-50 to-purple-50 p-8 rounded-xl">
              <h3 className="text-2xl font-bold mb-4 text-blue-900">
                For E-commerce Sellers
              </h3>
              <ul className="space-y-3">
                <li className="flex items-start">
                  <CheckCircle className="w-5 h-5 mr-3 text-blue-600 mt-0.5" />
                  <div>
                    <strong>Product Research:</strong> Download competitor product photos and videos
                  </div>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="w-5 h-5 mr-3 text-blue-600 mt-0.5" />
                  <div>
                    <strong>UGC Collection:</strong> Save customer reviews and testimonials
                  </div>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="w-5 h-5 mr-3 text-blue-600 mt-0.5" />
                  <div>
                    <strong>Influencer Content:</strong> Download sponsored content for ads
                  </div>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="w-5 h-5 mr-3 text-blue-600 mt-0.5" />
                  <div>
                    <strong>Trend Analysis:</strong> Monitor trending products and styles
                  </div>
                </li>
              </ul>
            </div>
            
            <div className="bg-gradient-to-br from-green-50 to-yellow-50 p-8 rounded-xl">
              <h3 className="text-2xl font-bold mb-4 text-green-900">
                For Content Creators
              </h3>
              <ul className="space-y-3">
                <li className="flex items-start">
                  <CheckCircle className="w-5 h-5 mr-3 text-green-600 mt-0.5" />
                  <div>
                    <strong>Content Curation:</strong> Build mood boards and inspiration galleries
                  </div>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="w-5 h-5 mr-3 text-green-600 mt-0.5" />
                  <div>
                    <strong>Competitor Analysis:</strong> Anonymous story viewing and monitoring
                  </div>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="w-5 h-5 mr-3 text-green-600 mt-0.5" />
                  <div>
                    <strong>Batch Processing:</strong> Download multiple posts simultaneously
                  </div>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="w-5 h-5 mr-3 text-green-600 mt-0.5" />
                  <div>
                    <strong>API Integration:</strong> Automate your workflow with our API
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* 客户评价 - 使用定制化组件 */}
      <USTestimonials />

      {/* 价格方案 - 使用定制化组件 */}
      <USPricing />

      {/* FAQ区域 */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4 max-w-4xl">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
            Frequently Asked Questions
          </h2>
          
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Is this service legal in the United States?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Yes, our service is 100% legal and compliant with US laws. We only allow downloading 
                  of public content and strongly encourage users to respect copyright and obtain 
                  necessary permissions for commercial use.
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Do you store my download history?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  No, we prioritize your privacy. We don&apos;t store any download history, personal 
                  information, or track your usage. All downloads are processed in real-time and 
                  immediately discarded from our servers.
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>What payment methods do you accept?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  We accept all major US payment methods including Visa, Mastercard, American Express, 
                  PayPal, and Stripe. All transactions are secured with 256-bit SSL encryption.
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Is there a free trial available?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Yes! Our basic plan is free forever with 10 downloads per day. You can also try 
                  our Professional plan risk-free with our 30-day money-back guarantee.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* 最终CTA */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div className="container mx-auto px-4 text-center max-w-4xl">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Ready to Supercharge Your Business?
          </h2>
          <p className="text-xl mb-8 opacity-90">
            Join 100,000+ US businesses using our Instagram downloader to grow their online presence
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
            <Link href="/en/download">
              <Button size="lg" className="bg-white text-blue-600 hover:bg-gray-100 px-8 py-6 text-lg">
                Start Free Download
              </Button>
            </Link>
            <Link href="#pricing">
              <Button size="lg" variant="outline" className="text-white border-white hover:bg-white/10 px-8 py-6 text-lg">
                View Premium Plans
              </Button>
            </Link>
          </div>
          
          <div className="flex items-center justify-center gap-6 text-sm opacity-80">
            <span className="flex items-center gap-1">
              <CheckCircle className="w-4 h-4" />
              No credit card required
            </span>
            <span className="flex items-center gap-1">
              <CheckCircle className="w-4 h-4" />
              30-day money back
            </span>
            <span className="flex items-center gap-1">
              <CheckCircle className="w-4 h-4" />
              Cancel anytime
            </span>
          </div>
        </div>
      </section>
    </>
  );
}