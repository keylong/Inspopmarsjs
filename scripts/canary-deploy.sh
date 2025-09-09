#!/bin/bash

# Instagram Downloader - Canary Deployment Script
# 用于灰度发布和流量切换

set -e

CANARY_PERCENTAGE=${1:-10}  # 默认 10% 流量
MONITORING_DURATION=${2:-300}  # 默认监控 5 分钟

echo "🐤 Starting canary deployment with ${CANARY_PERCENTAGE}% traffic..."

# 验证参数
if ! [[ "$CANARY_PERCENTAGE" =~ ^[0-9]+$ ]] || [ "$CANARY_PERCENTAGE" -lt 1 ] || [ "$CANARY_PERCENTAGE" -gt 100 ]; then
    echo "❌ Invalid canary percentage. Must be between 1-100."
    exit 1
fi

# 部署到 Preview 环境
echo "🚀 Deploying canary version..."
vercel --yes > deployment.log 2>&1
PREVIEW_URL=$(grep -o 'https://[^[:space:]]*\.vercel\.app' deployment.log | head -n1)

if [ -z "$PREVIEW_URL" ]; then
    echo "❌ Failed to get preview URL from deployment"
    cat deployment.log
    exit 1
fi

echo "✅ Canary deployed to: $PREVIEW_URL"

# 基础健康检查
echo "🏥 Running health checks..."
health_check() {
    local url=$1
    local response=$(curl -s -o /dev/null -w "%{http_code}" "$url" || echo "000")
    echo "$response"
}

# 检查主页
if [ "$(health_check "$PREVIEW_URL")" != "200" ]; then
    echo "❌ Health check failed for home page"
    exit 1
fi

# 检查下载页面
if [ "$(health_check "$PREVIEW_URL/download")" != "200" ]; then
    echo "❌ Health check failed for download page"
    exit 1
fi

# 检查 API 端点
if [ "$(health_check "$PREVIEW_URL/api/health")" != "200" ]; then
    echo "❌ Health check failed for API endpoint"
    exit 1
fi

echo "✅ All health checks passed"

# 流量分配确认
echo "🎯 Traffic allocation plan:"
echo "  Canary (${PREVIEW_URL}): ${CANARY_PERCENTAGE}%"
echo "  Production (https://ins.popmars.com): $((100-CANARY_PERCENTAGE))%"
echo ""

read -p "🔄 Apply traffic split configuration? (y/N): " -n 1 -r
echo
if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo "❌ Canary deployment cancelled."
    exit 1
fi

# 创建流量分配配置 (这里使用 Vercel 的 Edge Config 或者 A/B Testing)
cat > canary-config.json << EOF
{
  "canaryDeployment": {
    "enabled": true,
    "percentage": ${CANARY_PERCENTAGE},
    "canaryUrl": "${PREVIEW_URL}",
    "productionUrl": "https://ins.popmars.com",
    "startTime": "$(date -u +"%Y-%m-%dT%H:%M:%SZ")",
    "duration": ${MONITORING_DURATION}
  },
  "rollbackTriggers": {
    "errorRateThreshold": 5.0,
    "responseTimeThreshold": 3000,
    "availabilityThreshold": 99.0
  }
}
EOF

echo "📊 Starting monitoring period (${MONITORING_DURATION}s)..."

# 监控循环
monitor_metrics() {
    local start_time=$(date +%s)
    local end_time=$((start_time + MONITORING_DURATION))
    
    while [ $(date +%s) -lt $end_time ]; do
        local current_time=$(date +%s)
        local elapsed=$((current_time - start_time))
        local remaining=$((end_time - current_time))
        
        echo "⏱️  Monitoring... ${elapsed}s elapsed, ${remaining}s remaining"
        
        # 检查关键指标
        local canary_status=$(health_check "$PREVIEW_URL")
        local prod_status=$(health_check "https://ins.popmars.com")
        
        if [ "$canary_status" != "200" ]; then
            echo "🚨 ALERT: Canary health check failed (HTTP $canary_status)"
            echo "🔴 Initiating emergency rollback..."
            rollback_deployment
            exit 1
        fi
        
        if [ "$prod_status" != "200" ]; then
            echo "🚨 ALERT: Production health check failed (HTTP $prod_status)"
        fi
        
        echo "   Canary: HTTP $canary_status ✅"
        echo "   Production: HTTP $prod_status ✅"
        
        sleep 30
    done
}

# 回滚函数
rollback_deployment() {
    echo "🔄 Executing rollback..."
    
    # 停用流量分配
    cat > canary-config.json << EOF
{
  "canaryDeployment": {
    "enabled": false,
    "rollbackTime": "$(date -u +"%Y-%m-%dT%H:%M:%SZ")",
    "reason": "Health check failure"
  }
}
EOF
    
    echo "✅ Rollback completed. All traffic restored to production."
}

# 执行监控
monitor_metrics

# 监控完成后的决策
echo "📊 Monitoring period completed. Analyzing results..."

read -p "🎯 Promote canary to full production? (y/N): " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    echo "🚀 Promoting canary to production..."
    
    # 完整部署
    vercel --prod --yes
    
    # 停用金丝雀配置
    cat > canary-config.json << EOF
{
  "canaryDeployment": {
    "enabled": false,
    "promotedTime": "$(date -u +"%Y-%m-%dT%H:%M:%SZ")",
    "finalStatus": "promoted"
  }
}
EOF
    
    echo "✅ Canary successfully promoted to production!"
    echo "🔗 Production URL: https://ins.popmars.com"
else
    echo "🔄 Keeping canary deployment active for extended testing..."
fi

# 清理
rm -f deployment.log

echo "🎉 Canary deployment process completed!"
echo ""
echo "📈 Next steps:"
echo "1. Monitor production metrics"
echo "2. Verify user experience"
echo "3. Check analytics data"
echo "4. Update monitoring dashboards"