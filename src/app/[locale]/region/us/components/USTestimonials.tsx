'use client';

import { Card, CardContent } from '@/components/ui/card';
import { Star, Quote, CheckCircle } from 'lucide-react';
import Image from 'next/image';
import { motion } from 'framer-motion';

interface Testimonial {
  id: string;
  name: string;
  title: string;
  company: string;
  avatar: string;
  rating: number;
  content: string;
  verified: boolean;
  industry: string;
}

const testimonials: Testimonial[] = [
  {
    id: '1',
    name: 'Sarah Johnson',
    title: 'Marketing Director',
    company: 'ShopStyle Co.',
    avatar: '/avatars/sarah.jpg',
    rating: 5,
    content: 'As an Amazon FBA seller, I need high-quality product images from Instagram influencers. This tool saves me hours every week. The bulk download feature is a game-changer!',
    verified: true,
    industry: 'E-commerce'
  },
  {
    id: '2',
    name: 'Michael Chen',
    title: 'Social Media Manager',
    company: 'TechGear USA',
    avatar: '/avatars/michael.jpg',
    rating: 5,
    content: 'Perfect for content curation! I manage 15+ brand accounts and this tool helps me quickly gather UGC content. The no-watermark feature is exactly what we needed.',
    verified: true,
    industry: 'Technology'
  },
  {
    id: '3',
    name: 'Emily Rodriguez',
    title: 'Creative Director',
    company: 'Fashion Forward LA',
    avatar: '/avatars/emily.jpg',
    rating: 5,
    content: 'We use this daily for mood boards and trend analysis. Being able to download Stories and Reels in HD quality helps us stay ahead of fashion trends.',
    verified: true,
    industry: 'Fashion'
  },
  {
    id: '4',
    name: 'David Thompson',
    title: 'Founder',
    company: 'Dropship Empire',
    avatar: '/avatars/david.jpg',
    rating: 5,
    content: 'Essential tool for product research! I find winning products on Instagram and download all media for my Shopify stores. ROI on the premium plan is incredible.',
    verified: true,
    industry: 'Dropshipping'
  },
  {
    id: '5',
    name: 'Lisa Park',
    title: 'Content Strategist',
    company: 'Brand Builders NYC',
    avatar: '/avatars/lisa.jpg',
    rating: 5,
    content: 'The speed and reliability are unmatched. We switched from our previous tool and haven\'t looked back. Customer support is also top-notch!',
    verified: true,
    industry: 'Marketing Agency'
  },
  {
    id: '6',
    name: 'James Wilson',
    title: 'E-commerce Manager',
    company: 'Outdoor Gear Pro',
    avatar: '/avatars/james.jpg',
    rating: 5,
    content: 'We use customer photos from Instagram for our product pages. This tool makes it easy to get permission and download content legally. Highly recommended!',
    verified: true,
    industry: 'Retail'
  }
];

export function USTestimonials() {
  return (
    <section className="py-20 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-4xl font-bold text-gray-900 mb-4"
          >
            Trusted by 100,000+ US Businesses
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-xl text-gray-600 max-w-3xl mx-auto"
          >
            See why e-commerce sellers, marketers, and content creators choose our Instagram downloader
          </motion.p>
        </div>

        {/* 统计数据 */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12 max-w-4xl mx-auto"
        >
          <div className="text-center">
            <div className="text-4xl font-bold text-blue-600">100K+</div>
            <div className="text-gray-600 mt-1">Active Users</div>
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold text-green-600">10M+</div>
            <div className="text-gray-600 mt-1">Downloads</div>
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold text-purple-600">4.9/5</div>
            <div className="text-gray-600 mt-1">Average Rating</div>
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold text-orange-600">24/7</div>
            <div className="text-gray-600 mt-1">US Support</div>
          </div>
        </motion.div>

        {/* 评价卡片网格 */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={testimonial.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Card className="h-full hover:shadow-lg transition-shadow duration-300">
                <CardContent className="p-6">
                  {/* 引号图标 */}
                  <Quote className="w-8 h-8 text-blue-500 opacity-20 mb-4" />
                  
                  {/* 评分 */}
                  <div className="flex items-center gap-1 mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>

                  {/* 评价内容 */}
                  <p className="text-gray-700 mb-6 leading-relaxed">
                    "{testimonial.content}"
                  </p>

                  {/* 用户信息 */}
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-semibold">
                      {testimonial.name.split(' ').map(n => n[0]).join('')}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <h4 className="font-semibold text-gray-900">{testimonial.name}</h4>
                        {testimonial.verified && (
                          <CheckCircle className="w-4 h-4 text-blue-500" />
                        )}
                      </div>
                      <p className="text-sm text-gray-600">
                        {testimonial.title} at {testimonial.company}
                      </p>
                      <p className="text-xs text-gray-500 mt-0.5">
                        {testimonial.industry}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* 底部CTA */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="text-center mt-12"
        >
          <p className="text-gray-600 mb-4">
            Join thousands of successful US businesses using our Instagram downloader
          </p>
          <div className="flex items-center justify-center gap-8">
            <div className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-green-500" />
              <span className="text-sm text-gray-700">30-Day Money Back Guarantee</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-green-500" />
              <span className="text-sm text-gray-700">Cancel Anytime</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-green-500" />
              <span className="text-sm text-gray-700">SSL Secured</span>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}