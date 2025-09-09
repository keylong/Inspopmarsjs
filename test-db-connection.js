const mysql = require('mysql2/promise');

async function testConnection() {
  try {
    const connection = await mysql.createConnection({
      host: '23.94.185.125',
      port: 3306,
      user: 'inspopmars',
      password: '2TzrErTYWTMrWMLY',
      database: 'inspopmars'
    });
    
    console.log('✅ MySQL连接成功！');
    
    // 测试查询
    const [rows] = await connection.execute('SELECT COUNT(*) as count FROM user');
    console.log('✅ 用户表记录数:', rows[0].count);
    
    const [sessionRows] = await connection.execute('SELECT COUNT(*) as count FROM session');
    console.log('✅ Session表记录数:', sessionRows[0].count);
    
    await connection.end();
    
  } catch (error) {
    console.error('❌ 数据库连接失败:', error.message);
    process.exit(1);
  }
}

testConnection();