#!/usr/bin/env node

/**
 * 部署前检查脚本
 * 验证应用程序的关键功能和配置
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('🚀 开始部署前检查...\n');

const checks = [];

// 检查必要的环境变量
function checkEnvironmentVariables() {
  console.log('🔐 检查环境变量...');
  
  const requiredEnvVars = [
    'RAPIDAPI_KEY',
    'NEXTAUTH_SECRET',
    'NEXTAUTH_URL',
    'DATABASE_URL'
  ];
  
  const missingVars = [];
  
  requiredEnvVars.forEach(varName => {
    if (!process.env[varName] && !process.env[`NEXT_PUBLIC_${varName}`]) {
      // 检查 .env.production 文件
      const envProdPath = path.join(__dirname, '../.env.production');
      if (fs.existsSync(envProdPath)) {
        const envContent = fs.readFileSync(envProdPath, 'utf8');
        if (!envContent.includes(varName)) {
          missingVars.push(varName);
        }
      } else {
        missingVars.push(varName);
      }
    }
  });
  
  if (missingVars.length > 0) {
    console.log(`❌ 缺少必要的环境变量: ${missingVars.join(', ')}`);
    return false;
  }
  
  console.log('✅ 环境变量检查通过');
  return true;
}

// 检查构建产物
function checkBuildArtifacts() {
  console.log('📦 检查构建产物...');
  
  const buildDir = path.join(__dirname, '../.next');
  if (!fs.existsSync(buildDir)) {
    console.log('❌ 构建目录不存在，请先运行 npm run build');
    return false;
  }
  
  // 检查关键文件
  const criticalFiles = [
    'static',
    'server',
    'BUILD_ID'
  ];
  
  for (const file of criticalFiles) {
    const filePath = path.join(buildDir, file);
    if (!fs.existsSync(filePath)) {
      console.log(`❌ 缺少构建文件: ${file}`);
      return false;
    }
  }
  
  console.log('✅ 构建产物检查通过');
  return true;
}

// 检查依赖项安全性
function checkDependencySecurity() {
  console.log('🛡️ 检查依赖项安全性...');
  
  try {
    execSync('npm audit --audit-level moderate', { stdio: 'pipe' });
    console.log('✅ 依赖项安全检查通过');
    return true;
  } catch (error) {
    console.log('⚠️ 发现安全漏洞，请运行 npm audit fix');
    console.log('🔍 继续部署前请检查安全报告');
    return false; // 在生产环境中可能要设为 false
  }
}

// 检查关键配置文件
function checkConfigurationFiles() {
  console.log('⚙️ 检查配置文件...');
  
  const configFiles = [
    { path: 'next.config.ts', required: true },
    { path: 'package.json', required: true },
    { path: 'tsconfig.json', required: true },
    { path: '.env.production', required: false },
    { path: 'vercel.json', required: false }
  ];
  
  for (const config of configFiles) {
    const configPath = path.join(__dirname, '../', config.path);
    if (!fs.existsSync(configPath)) {
      if (config.required) {
        console.log(`❌ 缺少必要的配置文件: ${config.path}`);
        return false;
      } else {
        console.log(`⚠️ 可选配置文件不存在: ${config.path}`);
      }
    }
  }
  
  console.log('✅ 配置文件检查通过');
  return true;
}

// 检查API端点可用性
async function checkApiEndpoints() {
  console.log('🌐 检查API端点...');
  
  // 这里应该检查关键的API端点
  // 由于是静态检查，我们只验证文件存在
  const apiRoutes = [
    'src/app/api/instagram/route.ts',
    'src/app/api/proxy/image/route.ts'
  ];
  
  for (const route of apiRoutes) {
    const routePath = path.join(__dirname, '../', route);
    if (!fs.existsSync(routePath)) {
      console.log(`❌ API路由文件不存在: ${route}`);
      return false;
    }
  }
  
  console.log('✅ API端点检查通过');
  return true;
}

// 检查数据库迁移状态
function checkDatabaseMigrations() {
  console.log('🗄️ 检查数据库迁移...');
  
  try {
    // 检查Prisma模式文件
    const prismaSchemaPath = path.join(__dirname, '../prisma/schema.prisma');
    if (!fs.existsSync(prismaSchemaPath)) {
      console.log('⚠️ Prisma schema文件不存在');
      return true; // 不是强制性的
    }
    
    // 检查是否有挂起的迁移
    execSync('npx prisma migrate status', { stdio: 'pipe' });
    console.log('✅ 数据库迁移检查通过');
    return true;
  } catch (error) {
    console.log('⚠️ 数据库迁移状态检查失败，请确保数据库同步');
    return false;
  }
}

// 检查静态资源
function checkStaticAssets() {
  console.log('🖼️ 检查静态资源...');
  
  const publicDir = path.join(__dirname, '../public');
  if (!fs.existsSync(publicDir)) {
    console.log('❌ public目录不存在');
    return false;
  }
  
  // 检查关键静态文件
  const criticalAssets = [
    'favicon.ico',
    'robots.txt'
  ];
  
  for (const asset of criticalAssets) {
    const assetPath = path.join(publicDir, asset);
    if (!fs.existsSync(assetPath)) {
      console.log(`⚠️ 缺少静态资源: ${asset}`);
    }
  }
  
  console.log('✅ 静态资源检查完成');
  return true;
}

// 主检查函数
async function runPreDeployChecks() {
  const checkResults = [
    checkEnvironmentVariables(),
    checkConfigurationFiles(),
    checkBuildArtifacts(),
    await checkApiEndpoints(),
    checkStaticAssets(),
    checkDependencySecurity(),
    // checkDatabaseMigrations(), // 可选，根据项目需求
  ];
  
  const passedChecks = checkResults.filter(result => result === true).length;
  const totalChecks = checkResults.length;
  
  console.log(`\n📊 检查结果: ${passedChecks}/${totalChecks} 项通过`);
  
  if (passedChecks === totalChecks) {
    console.log('🎉 所有检查通过！应用程序已准备好部署。');
    process.exit(0);
  } else {
    console.log('❌ 部署前检查失败，请修复上述问题后再次尝试。');
    process.exit(1);
  }
}

// 运行检查
runPreDeployChecks().catch(error => {
  console.error('💥 部署前检查过程中发生错误:', error.message);
  process.exit(1);
});