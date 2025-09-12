'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Check, X, Zap, Crown, Rocket } from 'lucide-react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { useState } from 'react';

interface PricingPlan {
  id: string;
  name: string;
  description: string;
  price: {
    monthly: number;
    yearly: number;
  };
  currency: string;
  features: {
    text: string;
    included: boolean;
  }[];
  cta: string;
  popular?: boolean;
  icon: React.ReactNode;
  savings?: string;
}

const pricingPlans: PricingPlan[] = [
  {
    id: 'free',
    name: 'Starter',
    description: 'Perfect for trying out our service',
    price: {
      monthly: 0,
      yearly: 0
    },
    currency: 'USD',
    features: [
      { text: '10 downloads per day', included: true },
      { text: 'Standard quality', included: true },
      { text: 'Basic support', included: true },
      { text: 'No watermark removal', included: false },
      { text: 'Bulk download', included: false },
      { text: 'Priority processing', included: false },
      { text: 'API access', included: false }
    ],
    cta: 'Start Free',
    icon: <Zap className="w-6 h-6" />
  },
  {
    id: 'premium',
    name: 'Professional',
    description: 'Best for e-commerce sellers & marketers',
    price: {
      monthly: 19,
      yearly: 190
    },
    currency: 'USD',
    features: [
      { text: 'Unlimited downloads', included: true },
      { text: 'HD quality guaranteed', included: true },
      { text: 'Priority support 24/7', included: true },
      { text: 'No watermarks', included: true },
      { text: 'Bulk download (up to 100)', included: true },
      { text: 'Priority processing', included: true },
      { text: 'API access', included: false }
    ],
    cta: 'Go Professional',
    popular: true,
    icon: <Crown className="w-6 h-6" />,
    savings: 'Save $38/year'
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    description: 'For agencies and large teams',
    price: {
      monthly: 49,
      yearly: 490
    },
    currency: 'USD',
    features: [
      { text: 'Everything in Professional', included: true },
      { text: '4K quality downloads', included: true },
      { text: 'Dedicated account manager', included: true },
      { text: 'Custom watermark removal', included: true },
      { text: 'Unlimited bulk download', included: true },
      { text: 'Fastest processing speed', included: true },
      { text: 'Full API access', included: true }
    ],
    cta: 'Contact Sales',
    icon: <Rocket className="w-6 h-6" />,
    savings: 'Save $98/year'
  }
];

export function USPricing() {
  const [billingPeriod, setBillingPeriod] = useState<'monthly' | 'yearly'>('monthly');

  return (
    <section id="pricing" className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-4xl font-bold text-gray-900 mb-4"
          >
            Simple, Transparent Pricing
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-xl text-gray-600 max-w-3xl mx-auto mb-8"
          >
            Choose the perfect plan for your business. All plans include SSL security and US-based support.
          </motion.p>

          {/* 计费周期切换 */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="inline-flex items-center p-1 bg-gray-100 rounded-lg"
          >
            <button
              onClick={() => setBillingPeriod('monthly')}
              className={`px-4 py-2 rounded-md transition-all ${
                billingPeriod === 'monthly' 
                  ? 'bg-white text-gray-900 shadow-sm' 
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Monthly
            </button>
            <button
              onClick={() => setBillingPeriod('yearly')}
              className={`px-4 py-2 rounded-md transition-all ${
                billingPeriod === 'yearly' 
                  ? 'bg-white text-gray-900 shadow-sm' 
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Yearly
              <Badge variant="secondary" className="ml-2 bg-green-100 text-green-700">
                Save 20%
              </Badge>
            </button>
          </motion.div>
        </div>

        {/* 价格卡片 */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {pricingPlans.map((plan, index) => (
            <motion.div
              key={plan.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className={plan.popular ? 'relative' : ''}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-0 right-0 flex justify-center z-10">
                  <Badge className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-1">
                    MOST POPULAR
                  </Badge>
                </div>
              )}
              
              <Card className={`h-full ${plan.popular ? 'border-blue-500 border-2 shadow-xl' : ''}`}>
                <CardHeader>
                  <div className="flex items-center justify-between mb-4">
                    <div className={`p-2 rounded-lg ${
                      plan.popular ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-600'
                    }`}>
                      {plan.icon}
                    </div>
                    {billingPeriod === 'yearly' && plan.savings && (
                      <Badge variant="secondary" className="bg-green-100 text-green-700">
                        {plan.savings}
                      </Badge>
                    )}
                  </div>
                  <CardTitle className="text-2xl">{plan.name}</CardTitle>
                  <CardDescription>{plan.description}</CardDescription>
                  <div className="mt-4">
                    <span className="text-4xl font-bold">
                      ${billingPeriod === 'monthly' ? plan.price.monthly : Math.floor(plan.price.yearly / 12)}
                    </span>
                    <span className="text-gray-600 ml-2">
                      {plan.price.monthly === 0 ? '' : `/${billingPeriod === 'monthly' ? 'month' : 'month'}`}
                    </span>
                    {billingPeriod === 'yearly' && plan.price.yearly > 0 && (
                      <div className="text-sm text-gray-500 mt-1">
                        Billed ${plan.price.yearly} annually
                      </div>
                    )}
                  </div>
                </CardHeader>
                
                <CardContent>
                  <ul className="space-y-3">
                    {plan.features.map((feature, idx) => (
                      <li key={idx} className="flex items-start gap-3">
                        {feature.included ? (
                          <Check className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                        ) : (
                          <X className="w-5 h-5 text-gray-300 flex-shrink-0 mt-0.5" />
                        )}
                        <span className={feature.included ? 'text-gray-700' : 'text-gray-400'}>
                          {feature.text}
                        </span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
                
                <CardFooter>
                  <Link href={plan.id === 'enterprise' ? '/en/contact' : '/en/subscription'} className="w-full">
                    <Button 
                      className="w-full" 
                      variant={plan.popular ? 'default' : 'outline'}
                      size="lg"
                    >
                      {plan.cta}
                    </Button>
                  </Link>
                </CardFooter>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* 信任标识 */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="mt-16 text-center"
        >
          <div className="flex flex-wrap items-center justify-center gap-8 mb-8">
            <div className="flex items-center gap-2">
              <Check className="w-5 h-5 text-green-500" />
              <span className="text-gray-700">No setup fees</span>
            </div>
            <div className="flex items-center gap-2">
              <Check className="w-5 h-5 text-green-500" />
              <span className="text-gray-700">Cancel anytime</span>
            </div>
            <div className="flex items-center gap-2">
              <Check className="w-5 h-5 text-green-500" />
              <span className="text-gray-700">30-day money back</span>
            </div>
            <div className="flex items-center gap-2">
              <Check className="w-5 h-5 text-green-500" />
              <span className="text-gray-700">Secure payment</span>
            </div>
          </div>
          
          {/* 支付方式图标 */}
          <div className="flex items-center justify-center gap-4 opacity-60">
            <span className="text-sm text-gray-600">Accepted payments:</span>
            <span className="font-semibold">Visa</span>
            <span className="font-semibold">Mastercard</span>
            <span className="font-semibold">PayPal</span>
            <span className="font-semibold">Stripe</span>
          </div>
        </motion.div>
      </div>
    </section>
  );
}