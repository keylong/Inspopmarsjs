#!/usr/bin/env tsx

import mysql from 'mysql2/promise'
import * as dotenv from 'dotenv'

dotenv.config({ path: '.env.local' })

const mysqlConfig = {
  host: process.env.MYSQL_HOST || 'localhost',
  user: process.env.MYSQL_USER || 'root',
  password: process.env.MYSQL_PASSWORD || '',
  database: process.env.MYSQL_DATABASE || '',
  port: parseInt(process.env.MYSQL_PORT || '3306')
}

async function testConnection() {
  console.log('🔗 测试 MySQL 连接...')
  console.log('配置信息:')
  console.log(`  主机: ${mysqlConfig.host}:${mysqlConfig.port}`)
  console.log(`  用户: ${mysqlConfig.user}`)
  console.log(`  数据库: ${mysqlConfig.database}`)
  console.log('  密码: [已隐藏]')
  
  try {
    // 测试连接
    const connection = await mysql.createConnection(mysqlConfig)
    console.log('✅ 成功连接到 MySQL 数据库!')
    
    // 测试查询用户表
    try {
      const [rows] = await connection.execute('SHOW TABLES LIKE "user"')
      if (Array.isArray(rows) && rows.length > 0) {
        console.log('✅ 找到用户表!')
        
        // 显示用户表结构
        const [columns] = await connection.execute('DESCRIBE user')
        console.log('\n📋 用户表结构:')
        console.table(columns)
        
        // 显示用户数量
        const [countResult] = await connection.execute('SELECT COUNT(*) as count FROM user')
        const count = Array.isArray(countResult) && countResult.length > 0 ? (countResult[0] as any).count : 0
        console.log(`\n👥 用户总数: ${count}`)
        
        if (count > 0) {
          // 显示前3个用户的示例数据
          const [sampleRows] = await connection.execute('SELECT id, username, email FROM user LIMIT 3')
          console.log('\n📊 示例用户数据:')
          console.table(sampleRows)
        }
        
      } else {
        console.log('⚠️  未找到 users 表!')
        
        // 显示所有表
        const [tables] = await connection.execute('SHOW TABLES')
        console.log('\n📋 数据库中的所有表:')
        console.table(tables)
      }
    } catch (error) {
      console.error('❌ 查询用户表时出错:', error)
    }
    
    await connection.end()
    console.log('\n🔐 连接已关闭')
    
  } catch (error: any) {
    console.error('❌ MySQL 连接失败!')
    
    if (error.code === 'ECONNREFUSED') {
      console.error('   原因: 连接被拒绝 - MySQL 服务可能未启动或主机/端口不正确')
    } else if (error.code === 'ER_ACCESS_DENIED_ERROR') {
      console.error('   原因: 用户名或密码错误')
    } else if (error.code === 'ER_BAD_DB_ERROR') {
      console.error('   原因: 数据库不存在')
    } else {
      console.error('   错误详情:', error.message)
    }
    
    console.log('\n💡 请检查 .env.local 文件中的 MySQL 配置:')
    console.log('   MYSQL_HOST=你的主机地址')
    console.log('   MYSQL_USER=你的用户名')
    console.log('   MYSQL_PASSWORD=你的密码')
    console.log('   MYSQL_DATABASE=你的数据库名')
    console.log('   MYSQL_PORT=端口号(默认3306)')
  }
}

if (require.main === module) {
  testConnection().catch(console.error)
}