// 支付网关配置脚本
import { configurePaymentGateway, getPaymentGatewayConfig } from '@/lib/payment-gateway'

async function setupPaymentGateway() {
  console.log('正在配置支付网关...')
  
  try {
    const config = getPaymentGatewayConfig()
    
    console.log('支付网关配置:')
    console.log('- 网关地址:', config.gatewayUrl)
    console.log('- 回调地址:', config.callbackUrl)
    console.log('- API密钥已配置:', config.apiKey ? '是' : '否')
    
    if (!config.apiKey) {
      console.error('❌ 请先配置 PAYMENT_GATEWAY_API_KEY 环境变量')
      return
    }
    
    await configurePaymentGateway()
    console.log('✅ 支付网关配置完成')
    
  } catch (error) {
    console.error('❌ 配置支付网关失败:', error)
  }
}

// 如果直接运行此脚本
if (require.main === module) {
  setupPaymentGateway()
}

export { setupPaymentGateway }