/**
 * 一次性脚本：修复已支付但状态为pending的订单
 * 使用方法：node fix-pending-orders.js
 */

const ADMIN_KEY = process.env.ADMIN_KEY || 'admin123'

async function fixPendingOrder(orderId) {
  try {
    console.log(`正在处理订单: ${orderId}`)
    
    const response = await fetch('http://localhost:3000/api/admin/confirm-payment', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        orderId: orderId,
        adminKey: ADMIN_KEY
      })
    })

    const result = await response.json()
    
    if (result.success) {
      console.log(`✅ 订单 ${orderId} 处理成功:`, result.message)
      console.log(`   用户ID: ${result.data?.userId}`)
      console.log(`   套餐ID: ${result.data?.planId}`)
    } else {
      console.error(`❌ 订单 ${orderId} 处理失败:`, result.error)
    }
  } catch (error) {
    console.error(`❌ 处理订单 ${orderId} 时出错:`, error.message)
  }
}

// 处理当前的pending订单
async function main() {
  console.log('=== 修复pending订单脚本 ===')
  
  const pendingOrderIds = [
    'order_1757838714435_xjrxc95wd', // ¥39.99 - 年度超级VIP (buytype: 2, value: 999999)
    'order_1757845957082_54wadzkgd', // 从日志中看到的另一个订单
    'order_1757845686060_d01xh1vea'  // 从日志中看到的另一个订单
  ]

  console.log(`准备处理 ${pendingOrderIds.length} 个pending订单...`)

  for (const orderId of pendingOrderIds) {
    await fixPendingOrder(orderId)
    // 间隔1秒避免请求过快
    await new Promise(resolve => setTimeout(resolve, 1000))
  }
  
  console.log('=== 脚本执行完成 ===')
  console.log('提示: 用户需要刷新页面或重新登录才能看到更新的会员状态')
}

main().catch(console.error)