#!/usr/bin/env tsx
/**
 * Stripe产品和价格设置脚本
 * 用于在Stripe中创建产品和价格，并更新本地数据库
 */

import Stripe from 'stripe'
import fs from 'fs/promises'
import path from 'path'
import dotenv from 'dotenv'

// 加载环境变量
dotenv.config()

// 初始化Stripe
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
  apiVersion: '2025-08-27.basil',
})

// 订阅套餐配置
const SUBSCRIPTION_PLANS = [
  {
    id: 'basic-monthly',
    name: '基础月度套餐',
    nameEn: 'Basic Monthly',
    description: '每月100次下载，支持图片和视频',
    descriptionEn: '100 downloads per month, supports images and videos',
    price: 999, // 分为单位（$9.99）
    currency: 'usd',
    interval: 'month' as Stripe.PriceCreateParams.Recurring.Interval,
    features: [
      '每月100次下载',
      '图片视频下载',
      '标准画质',
      '邮件支持'
    ],
    featuresEn: [
      '100 downloads/month',
      'Image & video download',
      'Standard quality',
      'Email support'
    ],
    metadata: {
      downloadLimit: '100',
      planId: 'basic-monthly'
    }
  },
  {
    id: 'pro-monthly',
    name: '专业月度套餐',
    nameEn: 'Pro Monthly',
    description: '每月500次下载，高清画质，批量下载',
    descriptionEn: '500 downloads per month, HD quality, batch download',
    price: 1999, // $19.99
    currency: 'usd',
    interval: 'month' as Stripe.PriceCreateParams.Recurring.Interval,
    features: [
      '每月500次下载',
      '高清画质',
      '批量下载',
      '优先支持'
    ],
    featuresEn: [
      '500 downloads/month',
      'HD quality',
      'Batch download',
      'Priority support'
    ],
    metadata: {
      downloadLimit: '500',
      planId: 'pro-monthly'
    }
  },
  {
    id: 'unlimited-monthly',
    name: '无限月度套餐',
    nameEn: 'Unlimited Monthly',
    description: '无限下载，最高画质，API访问',
    descriptionEn: 'Unlimited downloads, highest quality, API access',
    price: 3999, // $39.99
    currency: 'usd',
    interval: 'month' as Stripe.PriceCreateParams.Recurring.Interval,
    features: [
      '无限下载',
      '最高画质',
      'API访问',
      '24/7支持'
    ],
    featuresEn: [
      'Unlimited downloads',
      'Highest quality',
      'API access',
      '24/7 support'
    ],
    metadata: {
      downloadLimit: '-1',
      planId: 'unlimited-monthly'
    }
  },
  {
    id: 'yearly-vip',
    name: '年度VIP会员',
    nameEn: 'Yearly VIP',
    description: '一年无限下载，最高画质，所有功能',
    descriptionEn: 'One year unlimited downloads, highest quality, all features',
    price: 9999, // $99.99
    currency: 'usd',
    interval: 'year' as Stripe.PriceCreateParams.Recurring.Interval,
    features: [
      '无限下载',
      '最高画质',
      'API访问',
      '24/7支持',
      '优先新功能体验'
    ],
    featuresEn: [
      'Unlimited downloads',
      'Highest quality',
      'API access',
      '24/7 support',
      'Early access to new features'
    ],
    metadata: {
      downloadLimit: '-1',
      planId: 'yearly-vip'
    }
  }
]

async function createOrUpdateProduct(plan: typeof SUBSCRIPTION_PLANS[0]) {
  try {
    console.log(`处理产品: ${plan.name}...`)
    
    // 搜索现有产品
    const existingProducts = await stripe.products.list({
      limit: 100,
    })
    
    let product = existingProducts.data.find(p => 
      p.metadata?.planId === plan.id
    )
    
    if (!product) {
      // 创建新产品
      product = await stripe.products.create({
        name: plan.nameEn,
        description: plan.descriptionEn,
        metadata: {
          planId: plan.id,
          nameZh: plan.name,
          descriptionZh: plan.description,
        },
      })
      console.log(`  ✅ 创建产品: ${product.id}`)
    } else {
      // 更新现有产品
      product = await stripe.products.update(product.id, {
        name: plan.nameEn,
        description: plan.descriptionEn,
        metadata: {
          planId: plan.id,
          nameZh: plan.name,
          descriptionZh: plan.description,
        },
      })
      console.log(`  ✅ 更新产品: ${product.id}`)
    }
    
    // 搜索现有价格
    const existingPrices = await stripe.prices.list({
      product: product.id,
      limit: 100,
    })
    
    let price = existingPrices.data.find(p => 
      p.unit_amount === plan.price &&
      p.currency === plan.currency &&
      p.recurring?.interval === plan.interval
    )
    
    if (!price) {
      // 创建新价格
      price = await stripe.prices.create({
        product: product.id,
        unit_amount: plan.price,
        currency: plan.currency,
        recurring: {
          interval: plan.interval,
        },
        metadata: plan.metadata,
      })
      console.log(`  ✅ 创建价格: ${price.id}`)
    } else {
      console.log(`  ⏭️  价格已存在: ${price.id}`)
    }
    
    return {
      productId: product.id,
      priceId: price.id,
    }
  } catch (error) {
    console.error(`处理产品 ${plan.name} 时出错:`, error)
    throw error
  }
}

async function updateLocalDatabase(planUpdates: Record<string, { productId: string; priceId: string }>) {
  const dataPath = path.join(process.cwd(), 'data', 'subscription-plans.json')
  
  try {
    // 读取现有数据
    const data = await fs.readFile(dataPath, 'utf-8')
    const plans = JSON.parse(data)
    
    // 更新Stripe IDs
    const updatedPlans = plans.map((plan: any) => {
      const update = planUpdates[plan.id]
      if (update) {
        return {
          ...plan,
          stripeProductId: update.productId,
          stripePriceId: update.priceId,
        }
      }
      return plan
    })
    
    // 添加年度VIP套餐（如果不存在）
    const hasYearlyVip = updatedPlans.some((p: any) => p.id === 'yearly-vip')
    if (!hasYearlyVip && planUpdates['yearly-vip']) {
      const yearlyPlan = SUBSCRIPTION_PLANS.find(p => p.id === 'yearly-vip')!
      updatedPlans.push({
        id: 'yearly-vip',
        name: yearlyPlan.name,
        nameEn: yearlyPlan.nameEn,
        description: yearlyPlan.description,
        descriptionEn: yearlyPlan.descriptionEn,
        price: yearlyPlan.price / 100, // 转换为美元
        currency: 'USD',
        duration: 'yearly',
        features: yearlyPlan.features,
        featuresEn: yearlyPlan.featuresEn,
        downloadLimit: -1,
        stripeProductId: planUpdates['yearly-vip'].productId,
        stripePriceId: planUpdates['yearly-vip'].priceId,
        isActive: true,
        sortOrder: 4,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      })
    }
    
    // 写回文件
    await fs.writeFile(dataPath, JSON.stringify(updatedPlans, null, 2))
    console.log('\n✅ 本地数据库已更新')
  } catch (error) {
    console.error('更新本地数据库失败:', error)
    throw error
  }
}

async function main() {
  if (!process.env.STRIPE_SECRET_KEY) {
    console.error('❌ 错误: STRIPE_SECRET_KEY 环境变量未设置')
    process.exit(1)
  }
  
  console.log('🚀 开始设置Stripe产品和价格...\n')
  
  const planUpdates: Record<string, { productId: string; priceId: string }> = {}
  
  for (const plan of SUBSCRIPTION_PLANS) {
    try {
      const result = await createOrUpdateProduct(plan)
      planUpdates[plan.id] = result
    } catch (error) {
      console.error(`❌ 处理失败: ${plan.name}`)
      process.exit(1)
    }
  }
  
  console.log('\n📝 更新本地数据库...')
  await updateLocalDatabase(planUpdates)
  
  console.log('\n🎉 Stripe产品设置完成！')
  console.log('\n产品和价格ID汇总:')
  Object.entries(planUpdates).forEach(([planId, { productId, priceId }]) => {
    console.log(`  ${planId}:`)
    console.log(`    Product ID: ${productId}`)
    console.log(`    Price ID: ${priceId}`)
  })
}

// 运行脚本
main().catch(error => {
  console.error('脚本执行失败:', error)
  process.exit(1)
})