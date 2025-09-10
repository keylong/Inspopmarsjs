#!/usr/bin/env ts-node

import mysql from 'mysql2/promise'
import { createClient } from '@supabase/supabase-js'
import * as dotenv from 'dotenv'

dotenv.config({ path: '.env.local' })

// MySQL 连接配置
const mysqlConfig = {
  host: process.env.MYSQL_HOST || 'localhost',
  user: process.env.MYSQL_USER || 'root',
  password: process.env.MYSQL_PASSWORD || '',
  database: process.env.MYSQL_DATABASE || 'your_database_name',
  port: parseInt(process.env.MYSQL_PORT || '3306')
}

// Supabase Admin 客户端
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!
const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
})

interface MySQLUser {
  id: number
  username: string
  password: string
  sex: string
  email: string
  phone: string
  value: number
  token: string
  buytype: number
  buydate: Date | null
  session: string
  downloading: string
  account: number
}

async function connectToMySQL() {
  try {
    const connection = await mysql.createConnection(mysqlConfig)
    console.log('✅ 成功连接到 MySQL 数据库')
    return connection
  } catch (error) {
    console.error('❌ MySQL 连接失败:', error)
    throw error
  }
}

async function getMySQLUsers(connection: mysql.Connection, testMode: boolean = false): Promise<MySQLUser[]> {
  try {
    const query = testMode ? 'SELECT * FROM user LIMIT 10' : 'SELECT * FROM user'
    const [rows] = await connection.execute(query)
    console.log(`✅ 从 MySQL 获取了 ${Array.isArray(rows) ? rows.length : 0} 个用户${testMode ? '（测试模式）' : ''}`)
    return rows as MySQLUser[]
  } catch (error) {
    console.error('❌ 获取 MySQL 用户数据失败:', error)
    throw error
  }
}

function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

function fixInvalidEmail(email: string, username: string): string {
  // 如果邮箱无效，生成一个假邮箱地址
  if (!isValidEmail(email)) {
    return `${username}@popmars.com`
  }
  return email
}


async function createSupabaseUser(user: MySQLUser, originalPassword: string) {
  try {
    // 修复无效邮箱
    const validEmail = fixInvalidEmail(user.email, user.username)
    const emailFixed = validEmail !== user.email
    
    if (emailFixed) {
      console.log(`🔧 修复无效邮箱: ${user.email} -> ${validEmail}`)
    }
    
    // 创建认证用户（使用明文密码，Supabase 会自动哈希）
    const { data: authData, error: authError } = await supabase.auth.admin.createUser({
      email: validEmail,
      password: originalPassword, // 使用明文密码
      email_confirm: true,
      user_metadata: {
        username: user.username,
        name: user.username,
        original_id: user.id,
        original_email: user.email
      }
    })

    if (authError) {
      throw authError
    }

    // 创建业务数据
    const { error: profileError } = await supabase
      .from('users')
      .insert({
        id: authData.user.id, // 使用 Supabase Auth 的 UUID
        email: validEmail,
        username: user.username,
        sex: user.sex,
        phone: user.phone,
        value: user.value,
        token: user.token,
        buytype: user.buytype,
        buydate: user.buydate,
        downloading: user.downloading,
        account: user.account,
        name: user.username,
        created_at: new Date(),
        updated_at: new Date()
      })

    if (profileError) {
      // 如果业务数据插入失败，删除已创建的认证用户
      await supabase.auth.admin.deleteUser(authData.user.id)
      throw profileError
    }
    
    return authData.user.id

  } catch (error) {
    console.error(`❌ 创建用户失败 ${user.username}:`, error)
    throw error
  }
}

async function migrateUsers(users: MySQLUser[], batchSize: number = 5, fastMode: boolean = false) {
  console.log(`\n开始迁移 ${users.length} 个用户...`)
  
  const results = {
    success: 0,
    failed: 0,
    errors: [] as Array<{ user: string, error: string }>
  }

  // 批量处理配置
  const BATCH_SIZE = batchSize // 并发数量
  const DELAY_MS = fastMode ? 10 : 50   // 快速模式减少延迟
  
  // 分批处理用户
  for (let i = 0; i < users.length; i += BATCH_SIZE) {
    const batch = users.slice(i, i + BATCH_SIZE)
    console.log(`📦 处理批次 ${Math.floor(i / BATCH_SIZE) + 1}/${Math.ceil(users.length / BATCH_SIZE)} (${batch.length} 个用户)`)
    
    // 并发处理当前批次
    const batchPromises = batch.map(async (user) => {
      try {
        // 验证必需字段
        if (!user.email || !user.password) {
          console.warn(`⚠️  跳过用户 ${user.username}: 缺少邮箱或密码`)
          results.failed++
          return
        }
        
        // 创建 Supabase 用户（传入明文密码）
        await createSupabaseUser(user, user.password)
        results.success++
        console.log(`✅ 成功迁移用户: ${user.username}`)
        
      } catch (error) {
        results.failed++
        const errorMessage = error instanceof Error ? error.message : String(error)
        results.errors.push({ 
          user: user.username || user.email, 
          error: errorMessage 
        })
        console.error(`❌ 用户 ${user.username} 迁移失败:`, errorMessage)
      }
    })
    
    // 等待当前批次完成
    await Promise.all(batchPromises)
    
    // 批次间延迟
    if (i + BATCH_SIZE < users.length) {
      await new Promise(resolve => setTimeout(resolve, DELAY_MS))
    }
  }

  return results
}

async function verifyMigration() {
  console.log('\n验证迁移结果...')
  
  try {
    // 检查 Supabase 中的用户数量
    const authUsersResponse = await supabase.auth.admin.listUsers({ page: 1, perPage: 1000 })
    const authCount = authUsersResponse.data.users.length
    
    const { count: profileCount, error } = await supabase
      .from('users')
      .select('*', { count: 'exact', head: true })

    if (error) {
      console.error('验证时出错:', error)
      return false
    }

    console.log(`📊 认证用户数量: ${authCount}`)
    console.log(`📊 用户资料数量: ${profileCount}`)
    
    return authCount === profileCount
    
  } catch (error) {
    console.error('验证过程出错:', error)
    return false
  }
}

async function main() {
  console.log('🚀 开始 MySQL 到 Supabase 数据迁移...\n')
  
  // 检查是否为测试模式
  const isTestMode = process.argv.includes('--test') || process.argv.includes('-t')
  if (isTestMode) {
    console.log('🧪 测试模式：只迁移前10个用户')
  }
  
  // 检查批量大小配置
  const batchSizeArg = process.argv.find(arg => arg.startsWith('--batch='))
  const batchSize = batchSizeArg ? parseInt(batchSizeArg.split('=')[1]) : 5
  console.log(`📦 批量大小设置: ${batchSize} 个并发用户`)
  
  // 检查是否为快速模式
  const isFastMode = process.argv.includes('--fast')
  if (isFastMode) {
    console.log('⚡ 快速模式：减少延迟时间')
  }
  
  let connection: mysql.Connection | null = null
  
  try {
    // 连接到 MySQL
    connection = await connectToMySQL()
    
    // 获取用户数据
    const users = await getMySQLUsers(connection, isTestMode)
    
    if (users.length === 0) {
      console.log('⚠️  没有找到需要迁移的用户')
      return
    }
    
    // 迁移用户
    const results = await migrateUsers(users, batchSize, isFastMode)
    
    // 验证迁移结果
    const isValid = await verifyMigration()
    
    // 输出最终结果
    console.log('\n' + '='.repeat(50))
    console.log('📈 迁移完成统计:')
    console.log(`✅ 成功: ${results.success}`)
    console.log(`❌ 失败: ${results.failed}`)
    console.log(`🔍 验证: ${isValid ? '通过' : '失败'}`)
    
    if (results.errors.length > 0) {
      console.log('\n❌ 失败详情:')
      results.errors.forEach(({ user, error }) => {
        console.log(`  - ${user}: ${error}`)
      })
    }
    
    console.log('='.repeat(50))
    
  } catch (error) {
    console.error('\n❌ 迁移过程中出现严重错误:', error)
  } finally {
    if (connection) {
      await connection.end()
      console.log('🔐 MySQL 连接已关闭')
    }
  }
}

// 运行迁移
if (require.main === module) {
  main().catch(console.error)
}

export { main as migrateMySQLToSupabase }