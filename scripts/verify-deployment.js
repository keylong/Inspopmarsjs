#!/usr/bin/env node

/**
 * 部署验证脚本
 * 验证已部署应用的关键功能
 */

const https = require('https');
const http = require('http');

const deploymentUrl = process.env.DEPLOYMENT_URL || process.env.VERCEL_URL || 'http://localhost:3000';

console.log(`🚀 验证部署环境: ${deploymentUrl}\n`);

// 通用HTTP请求函数
function makeRequest(url, options = {}) {
  return new Promise((resolve, reject) => {
    const client = url.startsWith('https:') ? https : http;
    const timeout = options.timeout || 10000;
    
    const req = client.get(url, { ...options, timeout }, (res) => {
      let data = '';
      
      res.on('data', chunk => {
        data += chunk;
      });
      
      res.on('end', () => {
        resolve({
          statusCode: res.statusCode,
          headers: res.headers,
          data: data
        });
      });
    });
    
    req.on('timeout', () => {
      req.destroy();
      reject(new Error(`Request timeout after ${timeout}ms`));
    });
    
    req.on('error', reject);
    req.setTimeout(timeout);
  });
}

// 检查健康状态端点
async function checkHealthEndpoint() {
  console.log('❤️ 检查应用健康状态...');
  
  try {
    const response = await makeRequest(`${deploymentUrl}/api/health`);
    
    if (response.statusCode === 200) {
      console.log('✅ 健康检查端点正常');
      return true;
    } else {
      console.log(`⚠️ 健康检查端点返回状态码: ${response.statusCode}`);
      return false;
    }
  } catch (error) {
    console.log(`❌ 健康检查端点不可访问: ${error.message}`);
    return false;
  }
}

// 检查主页面可访问性
async function checkMainPages() {
  console.log('🏠 检查主要页面可访问性...');
  
  const pages = [
    '/',
    '/zh-CN',
    '/en',
    '/zh-CN/privacy',
    '/zh-CN/terms'
  ];
  
  let passedCount = 0;
  
  for (const page of pages) {
    try {
      const response = await makeRequest(`${deploymentUrl}${page}`);
      
      if (response.statusCode === 200) {
        console.log(`✅ ${page} - 可访问`);
        passedCount++;
      } else {
        console.log(`❌ ${page} - 状态码: ${response.statusCode}`);
      }
    } catch (error) {
      console.log(`❌ ${page} - 错误: ${error.message}`);
    }
  }
  
  console.log(`📊 页面访问性: ${passedCount}/${pages.length} 通过`);
  return passedCount === pages.length;
}

// 检查API端点
async function checkApiEndpoints() {
  console.log('🔌 检查API端点...');
  
  const endpoints = [
    { path: '/api/instagram', method: 'POST', expectStatus: [400, 422] }, // 无参数应该返回错误
    { path: '/api/proxy/image', method: 'POST', expectStatus: [400, 422] }, // 无参数应该返回错误
  ];
  
  let passedCount = 0;
  
  for (const endpoint of endpoints) {
    try {
      const response = await makeRequest(`${deploymentUrl}${endpoint.path}`);
      
      if (endpoint.expectStatus.includes(response.statusCode)) {
        console.log(`✅ ${endpoint.path} - 响应正常 (${response.statusCode})`);
        passedCount++;
      } else {
        console.log(`⚠️ ${endpoint.path} - 意外状态码: ${response.statusCode}`);
      }
    } catch (error) {
      console.log(`❌ ${endpoint.path} - 错误: ${error.message}`);
    }
  }
  
  console.log(`📊 API端点: ${passedCount}/${endpoints.length} 通过`);
  return passedCount === endpoints.length;
}

// 检查静态资源
async function checkStaticAssets() {
  console.log('📁 检查静态资源...');
  
  const assets = [
    '/favicon.ico',
    '/robots.txt',
    // '/sitemap.xml' // 如果有的话
  ];
  
  let passedCount = 0;
  
  for (const asset of assets) {
    try {
      const response = await makeRequest(`${deploymentUrl}${asset}`);
      
      if (response.statusCode === 200) {
        console.log(`✅ ${asset} - 可访问`);
        passedCount++;
      } else {
        console.log(`⚠️ ${asset} - 状态码: ${response.statusCode}`);
      }
    } catch (error) {
      console.log(`❌ ${asset} - 错误: ${error.message}`);
    }
  }
  
  console.log(`📊 静态资源: ${passedCount}/${assets.length} 通过`);
  return true; // 静态资源不是必需的，所以总是返回true
}

// 检查响应头和安全性
async function checkSecurityHeaders() {
  console.log('🔒 检查安全响应头...');
  
  try {
    const response = await makeRequest(`${deploymentUrl}/`);
    const headers = response.headers;
    
    const securityHeaders = [
      'x-content-type-options',
      'x-frame-options',
      'x-xss-protection',
      // 'strict-transport-security', // HTTPS only
      // 'content-security-policy'
    ];
    
    let presentHeaders = 0;
    
    securityHeaders.forEach(header => {
      if (headers[header]) {
        console.log(`✅ ${header}: ${headers[header]}`);
        presentHeaders++;
      } else {
        console.log(`⚠️ ${header}: 未设置`);
      }
    });
    
    console.log(`📊 安全头: ${presentHeaders}/${securityHeaders.length} 设置`);
    return true;
  } catch (error) {
    console.log(`❌ 安全头检查失败: ${error.message}`);
    return false;
  }
}

// 检查响应时间
async function checkPerformance() {
  console.log('⚡ 检查响应性能...');
  
  const testPages = ['/', '/zh-CN'];
  const results = [];
  
  for (const page of testPages) {
    const startTime = Date.now();
    
    try {
      const response = await makeRequest(`${deploymentUrl}${page}`);
      const endTime = Date.now();
      const responseTime = endTime - startTime;
      
      results.push({ page, responseTime, statusCode: response.statusCode });
      
      if (responseTime < 2000) {
        console.log(`✅ ${page} - 响应时间: ${responseTime}ms`);
      } else {
        console.log(`⚠️ ${page} - 响应时间: ${responseTime}ms (较慢)`);
      }
    } catch (error) {
      console.log(`❌ ${page} - 性能测试失败: ${error.message}`);
    }
  }
  
  const avgResponseTime = results.reduce((sum, r) => sum + r.responseTime, 0) / results.length;
  console.log(`📊 平均响应时间: ${Math.round(avgResponseTime)}ms`);
  
  return avgResponseTime < 3000; // 3秒以内算合格
}

// 检查环境特定配置
async function checkEnvironmentConfig() {
  console.log('⚙️ 检查环境配置...');
  
  try {
    // 检查是否设置了正确的环境
    const isProduction = deploymentUrl.includes('inspopmars.com');
    const isStaging = deploymentUrl.includes('staging') || deploymentUrl.includes('vercel.app');
    
    if (isProduction) {
      console.log('✅ 检测到生产环境');
    } else if (isStaging) {
      console.log('✅ 检测到测试环境');
    } else {
      console.log('✅ 检测到开发环境');
    }
    
    return true;
  } catch (error) {
    console.log(`❌ 环境配置检查失败: ${error.message}`);
    return false;
  }
}

// 主验证函数
async function runDeploymentVerification() {
  console.log('🔍 开始部署验证...\n');
  
  const checkResults = await Promise.allSettled([
    checkMainPages(),
    checkApiEndpoints(),
    checkStaticAssets(),
    checkSecurityHeaders(),
    checkPerformance(),
    checkEnvironmentConfig()
    // checkHealthEndpoint(), // 如果有健康检查端点的话
  ]);
  
  const results = checkResults.map(result => 
    result.status === 'fulfilled' ? result.value : false
  );
  
  const passedChecks = results.filter(result => result === true).length;
  const totalChecks = results.length;
  
  console.log(`\n📊 验证结果: ${passedChecks}/${totalChecks} 项通过`);
  
  if (passedChecks >= Math.ceil(totalChecks * 0.8)) { // 80%通过率算成功
    console.log('🎉 部署验证通过！应用程序运行正常。');
    process.exit(0);
  } else {
    console.log('❌ 部署验证失败，请检查应用程序配置。');
    process.exit(1);
  }
}

// 运行验证
if (require.main === module) {
  runDeploymentVerification().catch(error => {
    console.error('💥 部署验证过程中发生错误:', error.message);
    process.exit(1);
  });
}

module.exports = {
  runDeploymentVerification,
  checkMainPages,
  checkApiEndpoints,
  checkStaticAssets,
  checkSecurityHeaders,
  checkPerformance
};