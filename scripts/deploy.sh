#!/bin/bash

# Instagram Downloader - Production Deployment Script
# 用于自动化部署到 Vercel 生产环境

set -e

echo "🚀 Starting deployment to production..."

# 检查必要的工具
command -v vercel >/dev/null 2>&1 || { echo "❌ Vercel CLI not found. Install with: npm i -g vercel"; exit 1; }
command -v node >/dev/null 2>&1 || { echo "❌ Node.js not found"; exit 1; }
command -v npm >/dev/null 2>&1 || { echo "❌ npm not found"; exit 1; }

# 环境检查
if [ ! -f ".env.local" ]; then
    echo "❌ .env.local file not found. Please create environment configuration."
    exit 1
fi

# 清理缓存
echo "🧹 Cleaning build cache..."
rm -rf .next
rm -rf node_modules/.cache

# 安装依赖
echo "📦 Installing dependencies..."
npm ci --production=false

# 运行测试 (如果存在)
if [ -f "package.json" ] && grep -q "\"test\"" package.json; then
    echo "🧪 Running tests..."
    npm test
fi

# 代码质量检查
echo "🔍 Running linting..."
npm run lint

# 类型检查
echo "📝 Running type check..."
npx tsc --noEmit

# 构建检查
echo "🏗️ Testing build..."
npm run build

# 部署前确认
read -p "🔄 Ready to deploy to production. Continue? (y/N): " -n 1 -r
echo
if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo "❌ Deployment cancelled."
    exit 1
fi

# 部署到 Vercel
echo "🚀 Deploying to Vercel..."
vercel --prod --yes

# 部署后验证
echo "✅ Deployment completed!"
echo ""
echo "🔗 Production URL: https://ins.popmars.com"
echo "📊 Vercel Dashboard: https://vercel.com/dashboard"
echo ""
echo "🎯 Next steps:"
echo "1. Update DNS records if needed"
echo "2. Monitor deployment metrics"
echo "3. Test all critical user flows"
echo "4. Verify analytics tracking"