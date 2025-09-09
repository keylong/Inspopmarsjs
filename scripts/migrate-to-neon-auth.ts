/**
 * 数据迁移脚本：从 NextAuth 迁移到 Neon Auth (Stack Auth)
 * 
 * 注意：这个脚本需要在配置好 Stack Auth 环境变量后运行
 * 
 * 使用方法：
 * 1. 确保已配置 Stack Auth 环境变量
 * 2. 运行: npx tsx scripts/migrate-to-neon-auth.ts
 */

import { PrismaClient } from '@prisma/client'
import { StackServerApp } from '@stackframe/stack'

const prisma = new PrismaClient()
const stackApp = new StackServerApp({
  tokenStore: 'nextjs-cookie', // 或者其他适当的配置
  urls: {
    home: process.env.NEXTAUTH_URL || 'http://localhost:3000',
  },
})

async function migrateUsers() {
  console.log('🚀 开始迁移用户数据到 Neon Auth...')

  try {
    // 1. 从现有数据库读取所有用户
    const users = await prisma.user.findMany({
      include: {
        accounts: true,
      },
    })

    console.log(`📊 找到 ${users.length} 个用户需要迁移`)

    let successCount = 0
    let errorCount = 0

    // 2. 逐个迁移用户
    for (const user of users) {
      try {
        console.log(`正在迁移用户: ${user.email}`)

        // 检查是否是 OAuth 用户
        const oauthAccount = user.accounts.find(
          account => account.provider !== 'credentials'
        )

        if (oauthAccount) {
          // OAuth 用户 - Stack Auth 会在首次登录时自动创建
          console.log(`⚠️  ${user.email} 是 OAuth 用户，将在首次登录时自动迁移`)
          continue
        }

        // 邮箱密码用户 - 需要手动创建
        if (user.email && user.password) {
          // 注意：Stack Auth 不允许直接设置密码哈希
          // 需要用户重置密码或使用临时密码
          
          // 创建用户（不包含密码）
          const stackUser = await stackApp.createUser({
            primaryEmail: user.email,
            primaryEmailVerified: !!user.emailVerified,
            displayName: user.name || '',
            // profileImageUrl: user.image || undefined, // 可能不支持此属性
            clientMetadata: {
              migratedFrom: 'nextauth',
              originalId: user.id,
              migratedAt: new Date().toISOString(),
            },
          })

          console.log(`✅ 成功迁移用户: ${user.email} (Stack ID: ${stackUser.id})`)
          console.log(`   ⚠️  用户需要通过"忘记密码"功能重置密码`)
          
          successCount++
        } else {
          console.log(`⚠️  跳过用户 ${user.id}：缺少邮箱或密码`)
        }
      } catch (error) {
        console.error(`❌ 迁移用户 ${user.email} 失败:`, error)
        errorCount++
      }
    }

    // 3. 显示迁移结果
    console.log('\n📊 迁移完成!')
    console.log(`✅ 成功: ${successCount}`)
    console.log(`❌ 失败: ${errorCount}`)
    console.log(`⚠️  跳过: ${users.length - successCount - errorCount}`)

    // 4. 迁移后的注意事项
    console.log('\n📝 重要提醒:')
    console.log('1. OAuth 用户（Google/GitHub）将在首次登录时自动迁移')
    console.log('2. 邮箱密码用户需要使用"忘记密码"功能重置密码')
    console.log('3. 用户数据已同步到 neon_auth.users_sync 表')
    console.log('4. 建议保留原始用户表作为备份')

  } catch (error) {
    console.error('❌ 迁移过程出错:', error)
    process.exit(1)
  } finally {
    await prisma.$disconnect()
  }
}

// 运行迁移
migrateUsers().catch(console.error)