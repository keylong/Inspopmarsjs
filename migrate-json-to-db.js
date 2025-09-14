#!/usr/bin/env node
/**
 * 数据迁移脚本：将JSON文件数据导入到PostgreSQL数据库
 * 使用方法: node migrate-json-to-db.js
 */

const { PrismaClient } = require('@prisma/client')
const fs = require('fs')
const path = require('path')

const prisma = new PrismaClient()

async function main() {
  try {
    console.log('🚀 开始数据迁移...')

    // 1. 迁移订阅套餐数据
    await migrateSubscriptionPlans()

    // 2. 迁移支付订单数据  
    await migratePaymentOrders()

    console.log('✅ 数据迁移完成！')
  } catch (error) {
    console.error('❌ 数据迁移失败:', error)
    throw error
  } finally {
    await prisma.$disconnect()
  }
}

async function migrateSubscriptionPlans() {
  try {
    const plansFile = path.join(__dirname, 'data', 'subscription-plans.json')
    
    if (!fs.existsSync(plansFile)) {
      console.log('📄 subscription-plans.json 不存在，跳过...')
      return
    }

    const plansData = JSON.parse(fs.readFileSync(plansFile, 'utf-8'))
    console.log(`📋 找到 ${plansData.length} 个订阅套餐`)

    for (const plan of plansData) {
      try {
        await prisma.subscriptionPlan.upsert({
          where: { id: plan.id },
          update: {
            name: plan.name,
            nameEn: plan.nameEn,
            description: plan.description,
            descriptionEn: plan.descriptionEn,
            price: parseFloat(plan.price),
            currency: plan.currency,
            duration: plan.duration,
            features: plan.features,
            featuresEn: plan.featuresEn,
            downloadLimit: plan.downloadLimit,
            stripeProductId: plan.stripeProductId,
            stripePriceId: plan.stripePriceId,
            alipayProductId: plan.alipayProductId,
            isActive: plan.isActive,
            sortOrder: plan.sortOrder,
            updatedAt: new Date()
          },
          create: {
            id: plan.id,
            name: plan.name,
            nameEn: plan.nameEn,
            description: plan.description,
            descriptionEn: plan.descriptionEn,
            price: parseFloat(plan.price),
            currency: plan.currency,
            duration: plan.duration,
            features: plan.features,
            featuresEn: plan.featuresEn || null,
            downloadLimit: plan.downloadLimit,
            stripeProductId: plan.stripeProductId,
            stripePriceId: plan.stripePriceId,
            alipayProductId: plan.alipayProductId,
            isActive: plan.isActive,
            sortOrder: plan.sortOrder,
            createdAt: plan.createdAt ? new Date(plan.createdAt) : new Date(),
            updatedAt: plan.updatedAt ? new Date(plan.updatedAt) : new Date()
          }
        })
        
        console.log(`✓ 套餐迁移成功: ${plan.name} (${plan.id})`)
      } catch (error) {
        console.error(`✗ 套餐迁移失败: ${plan.id}`, error.message)
      }
    }

    console.log('✅ 订阅套餐迁移完成')
  } catch (error) {
    console.error('❌ 订阅套餐迁移失败:', error)
  }
}

async function migratePaymentOrders() {
  try {
    const ordersFile = path.join(__dirname, 'data', 'payment-orders.json')
    
    if (!fs.existsSync(ordersFile)) {
      console.log('📄 payment-orders.json 不存在，跳过...')
      return
    }

    const ordersData = JSON.parse(fs.readFileSync(ordersFile, 'utf-8'))
    console.log(`💳 找到 ${ordersData.length} 个支付订单`)

    for (const order of ordersData) {
      try {
        // 检查用户是否存在
        const userExists = await prisma.user.findUnique({
          where: { id: order.userId }
        })

        if (!userExists) {
          console.log(`⚠️ 用户不存在，跳过订单: ${order.id} (用户: ${order.userId})`)
          continue
        }

        // 检查套餐是否存在
        const planExists = await prisma.subscriptionPlan.findUnique({
          where: { id: order.planId }
        })

        if (!planExists) {
          console.log(`⚠️ 套餐不存在，跳过订单: ${order.id} (套餐: ${order.planId})`)
          continue
        }

        await prisma.paymentOrder.upsert({
          where: { id: order.id },
          update: {
            amount: parseFloat(order.amount),
            currency: order.currency,
            paymentMethod: order.paymentMethod,
            status: order.status,
            paymentIntentId: order.paymentIntentId,
            alipayTradeNo: order.alipayTradeNo,
            metadata: order.metadata,
            paidAt: order.paidAt ? new Date(order.paidAt) : null,
            updatedAt: new Date()
          },
          create: {
            id: order.id,
            userId: order.userId,
            planId: order.planId,
            amount: parseFloat(order.amount),
            currency: order.currency,
            paymentMethod: order.paymentMethod,
            status: order.status,
            paymentIntentId: order.paymentIntentId,
            alipayTradeNo: order.alipayTradeNo,
            metadata: order.metadata,
            paidAt: order.paidAt ? new Date(order.paidAt) : null,
            createdAt: order.createdAt ? new Date(order.createdAt) : new Date(),
            updatedAt: order.updatedAt ? new Date(order.updatedAt) : new Date()
          }
        })
        
        console.log(`✓ 订单迁移成功: ${order.id} (${order.status})`)
      } catch (error) {
        console.error(`✗ 订单迁移失败: ${order.id}`, error.message)
      }
    }

    console.log('✅ 支付订单迁移完成')
  } catch (error) {
    console.error('❌ 支付订单迁移失败:', error)
  }
}

// 错误处理
process.on('unhandledRejection', (error) => {
  console.error('❌ 未处理的Promise拒绝:', error)
  process.exit(1)
})

// 运行迁移
main()
  .then(() => {
    console.log('🎉 所有数据迁移完成！')
    process.exit(0)
  })
  .catch((error) => {
    console.error('💥 迁移过程中发生错误:', error)
    process.exit(1)
  })