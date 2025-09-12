'use client';

import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, Zap, Shield, Star, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { motion } from 'framer-motion';

export function USHero() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-blue-50 via-white to-purple-50 py-20">
      {/* 背景装饰 */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-20 left-10 w-72 h-72 bg-blue-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob" />
        <div className="absolute top-40 right-10 w-72 h-72 bg-purple-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000" />
        <div className="absolute -bottom-8 left-40 w-72 h-72 bg-pink-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000" />
      </div>

      <div className="container mx-auto px-4">
        <div className="max-w-5xl mx-auto text-center">
          {/* 信任标识 */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="flex items-center justify-center gap-2 mb-6"
          >
            <Badge variant="secondary" className="px-3 py-1">
              <Shield className="w-3 h-3 mr-1" />
              100% Safe & Secure
            </Badge>
            <Badge variant="secondary" className="px-3 py-1">
              <Star className="w-3 h-3 mr-1" />
              Trusted by 100K+ US Businesses
            </Badge>
          </motion.div>

          {/* 主标题 */}
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-5xl md:text-6xl font-bold text-gray-900 mb-6"
          >
            The #1 Instagram Downloader
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600 block mt-2">
              for US E-commerce Sellers
            </span>
          </motion.h1>

          {/* 副标题 */}
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto"
          >
            Download high-quality Instagram content instantly. No watermarks, no hassle. 
            Perfect for Amazon FBA sellers, Shopify stores, and social media managers.
          </motion.p>

          {/* CTA按钮 */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="flex flex-col sm:flex-row gap-4 justify-center mb-12"
          >
            <Link href="/en/download">
              <Button size="lg" className="group px-8 py-6 text-lg">
                Start Free Download
                <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
              </Button>
            </Link>
            <Link href="#pricing">
              <Button size="lg" variant="outline" className="px-8 py-6 text-lg">
                View Premium Plans
              </Button>
            </Link>
          </motion.div>

          {/* 特性列表 */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto"
          >
            <div className="flex items-center justify-center gap-3">
              <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
              <span className="text-gray-700">No VPN Required in USA</span>
            </div>
            <div className="flex items-center justify-center gap-3">
              <Zap className="w-5 h-5 text-yellow-500 flex-shrink-0" />
              <span className="text-gray-700">Lightning Fast Downloads</span>
            </div>
            <div className="flex items-center justify-center gap-3">
              <Shield className="w-5 h-5 text-blue-500 flex-shrink-0" />
              <span className="text-gray-700">DMCA Compliant</span>
            </div>
          </motion.div>

          {/* 社会证明 */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.5 }}
            className="mt-12 pt-8 border-t border-gray-200"
          >
            <p className="text-sm text-gray-500 mb-4">Trusted by leading US companies</p>
            <div className="flex items-center justify-center gap-8 opacity-60 grayscale">
              <span className="text-lg font-semibold">Amazon Sellers</span>
              <span className="text-lg font-semibold">Shopify Plus</span>
              <span className="text-lg font-semibold">eBay PowerSellers</span>
              <span className="text-lg font-semibold">Etsy Creators</span>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}