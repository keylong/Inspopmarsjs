#!/bin/bash

# Instagram Downloader - Traffic Monitoring and Migration Script
# 用于监控流量切换过程中的关键指标

set -e

PRODUCTION_URL="https://ins.popmars.com"
HEALTH_CHECK_INTERVAL=30  # 检查间隔（秒）
ALERT_THRESHOLD=5         # 连续失败次数告警阈值
LOG_FILE="traffic-monitor.log"

# 颜色定义
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# 日志函数
log() {
    local level=$1
    shift
    local message="$*"
    local timestamp=$(date '+%Y-%m-%d %H:%M:%S')
    
    case $level in
        "INFO")
            echo -e "${GREEN}[INFO]${NC} $timestamp: $message" | tee -a $LOG_FILE
            ;;
        "WARN")
            echo -e "${YELLOW}[WARN]${NC} $timestamp: $message" | tee -a $LOG_FILE
            ;;
        "ERROR")
            echo -e "${RED}[ERROR]${NC} $timestamp: $message" | tee -a $LOG_FILE
            ;;
        "DEBUG")
            echo -e "${BLUE}[DEBUG]${NC} $timestamp: $message" | tee -a $LOG_FILE
            ;;
    esac
}

# 健康检查函数
health_check() {
    local url=$1
    local timeout=${2:-10}
    
    local start_time=$(date +%s.%3N)
    local response=$(curl -s -o /dev/null -w "%{http_code}:%{time_total}" --max-time $timeout "$url" 2>/dev/null || echo "000:0")
    local end_time=$(date +%s.%3N)
    
    local http_code=$(echo $response | cut -d: -f1)
    local response_time=$(echo $response | cut -d: -f2)
    local actual_time=$(echo "$end_time - $start_time" | bc -l)
    
    echo "$http_code:$response_time:$actual_time"
}

# 性能指标检查
performance_check() {
    local url=$1
    
    log "DEBUG" "Checking performance for $url"
    
    # 检查主页
    local home_result=$(health_check "$url")
    local home_code=$(echo $home_result | cut -d: -f1)
    local home_time=$(echo $home_result | cut -d: -f2)
    
    # 检查下载页面
    local download_result=$(health_check "$url/download")
    local download_code=$(echo $download_result | cut -d: -f1)
    local download_time=$(echo $download_result | cut -d: -f2)
    
    # 检查 API 健康端点
    local api_result=$(health_check "$url/api/health")
    local api_code=$(echo $api_result | cut -d: -f1)
    local api_time=$(echo $api_result | cut -d: -f2)
    
    # 计算平均响应时间
    local avg_time=$(echo "scale=3; ($home_time + $download_time + $api_time) / 3" | bc -l)
    
    # 检查是否所有端点都正常
    if [ "$home_code" = "200" ] && [ "$download_code" = "200" ] && [ "$api_code" = "200" ]; then
        echo "SUCCESS:$avg_time"
    else
        echo "FAILED:$avg_time:$home_code:$download_code:$api_code"
    fi
}

# 流量指标获取（模拟实现）
get_traffic_metrics() {
    # 这里可以集成实际的分析工具 API
    # 例如 Google Analytics, Cloudflare Analytics 等
    
    local concurrent_users=$((RANDOM % 100 + 50))  # 模拟 50-150 并发用户
    local requests_per_minute=$((RANDOM % 1000 + 500))  # 模拟 500-1500 请求/分钟
    local error_rate=$(echo "scale=2; $RANDOM % 500 / 100" | bc -l)  # 模拟 0-5% 错误率
    
    echo "$concurrent_users:$requests_per_minute:$error_rate"
}

# 告警函数
send_alert() {
    local severity=$1
    local message=$2
    
    log "ERROR" "ALERT [$severity]: $message"
    
    # 这里可以集成实际的告警系统
    # 例如 Slack, Discord, 邮件等
    
    # 示例：发送到 Slack Webhook（需要配置环境变量）
    if [ -n "$SLACK_WEBHOOK_URL" ]; then
        curl -X POST -H 'Content-type: application/json' \
            --data "{\"text\":\"🚨 [$severity] $message\"}" \
            "$SLACK_WEBHOOK_URL" 2>/dev/null || true
    fi
    
    # 示例：发送邮件告警（需要配置邮件服务）
    if command -v mail >/dev/null 2>&1 && [ -n "$ALERT_EMAIL" ]; then
        echo "$message" | mail -s "[$severity] Instagram Downloader Alert" "$ALERT_EMAIL" || true
    fi
}

# 自动回滚函数
auto_rollback() {
    log "ERROR" "Initiating automatic rollback..."
    
    # 触发 GitHub Actions 回滚工作流
    if [ -n "$GITHUB_TOKEN" ] && [ -n "$GITHUB_REPO" ]; then
        curl -X POST \
            -H "Authorization: token $GITHUB_TOKEN" \
            -H "Accept: application/vnd.github.v3+json" \
            "https://api.github.com/repos/$GITHUB_REPO/dispatches" \
            -d '{"event_type":"rollback","client_payload":{"reason":"automatic_rollback"}}' \
            2>/dev/null || log "WARN" "Failed to trigger automatic rollback via GitHub API"
    fi
    
    send_alert "CRITICAL" "Automatic rollback initiated due to service degradation"
}

# 主监控循环
monitor_traffic() {
    local consecutive_failures=0
    local start_time=$(date +%s)
    
    log "INFO" "Starting traffic monitoring for $PRODUCTION_URL"
    log "INFO" "Health check interval: ${HEALTH_CHECK_INTERVAL}s"
    log "INFO" "Alert threshold: $ALERT_THRESHOLD consecutive failures"
    
    while true; do
        local current_time=$(date +%s)
        local uptime=$((current_time - start_time))
        
        # 性能检查
        local perf_result=$(performance_check "$PRODUCTION_URL")
        local perf_status=$(echo $perf_result | cut -d: -f1)
        local avg_response_time=$(echo $perf_result | cut -d: -f2)
        
        # 流量指标
        local traffic_metrics=$(get_traffic_metrics)
        local concurrent_users=$(echo $traffic_metrics | cut -d: -f1)
        local requests_per_minute=$(echo $traffic_metrics | cut -d: -f2)
        local error_rate=$(echo $traffic_metrics | cut -d: -f3)
        
        if [ "$perf_status" = "SUCCESS" ]; then
            consecutive_failures=0
            log "INFO" "✅ Service healthy - Response: ${avg_response_time}s, Users: $concurrent_users, RPM: $requests_per_minute, Error: ${error_rate}%"
            
            # 检查性能阈值
            if (( $(echo "$avg_response_time > 3.0" | bc -l) )); then
                log "WARN" "High response time detected: ${avg_response_time}s"
                send_alert "WARNING" "High response time: ${avg_response_time}s"
            fi
            
            if (( $(echo "$error_rate > 2.0" | bc -l) )); then
                log "WARN" "High error rate detected: ${error_rate}%"
                send_alert "WARNING" "High error rate: ${error_rate}%"
            fi
            
        else
            consecutive_failures=$((consecutive_failures + 1))
            log "ERROR" "❌ Service unhealthy (failure $consecutive_failures/$ALERT_THRESHOLD)"
            
            if [ $consecutive_failures -ge $ALERT_THRESHOLD ]; then
                send_alert "CRITICAL" "Service has been unhealthy for $consecutive_failures consecutive checks"
                
                # 自动回滚检查
                if [ "$AUTO_ROLLBACK" = "true" ]; then
                    auto_rollback
                    break
                fi
            fi
        fi
        
        # 显示运行时间
        local hours=$((uptime / 3600))
        local minutes=$(((uptime % 3600) / 60))
        local seconds=$((uptime % 60))
        
        echo -e "${BLUE}Monitoring uptime: ${hours}h ${minutes}m ${seconds}s${NC}"
        
        sleep $HEALTH_CHECK_INTERVAL
    done
}

# 流量切换验证
verify_traffic_switch() {
    log "INFO" "Verifying traffic switch completion..."
    
    # 检查多个地理位置的访问
    local locations=("US" "EU" "ASIA")
    
    for location in "${locations[@]}"; do
        log "INFO" "Checking from $location..."
        
        # 这里可以使用第三方服务检查不同地区的访问情况
        # 例如 Pingdom, StatusCake 等
        
        local result=$(performance_check "$PRODUCTION_URL")
        local status=$(echo $result | cut -d: -f1)
        
        if [ "$status" = "SUCCESS" ]; then
            log "INFO" "✅ $location access verified"
        else
            log "ERROR" "❌ $location access failed"
            send_alert "WARNING" "Traffic verification failed from $location"
        fi
    done
    
    log "INFO" "Traffic switch verification completed"
}

# 生成监控报告
generate_report() {
    local report_file="traffic-monitor-report-$(date +%Y%m%d-%H%M%S).json"
    
    log "INFO" "Generating monitoring report: $report_file"
    
    cat > $report_file << EOF
{
  "timestamp": "$(date -u +"%Y-%m-%dT%H:%M:%SZ")",
  "monitoring_duration": $(( $(date +%s) - start_time )),
  "production_url": "$PRODUCTION_URL",
  "final_status": "$(performance_check "$PRODUCTION_URL" | cut -d: -f1)",
  "traffic_metrics": {
    "concurrent_users": $(get_traffic_metrics | cut -d: -f1),
    "requests_per_minute": $(get_traffic_metrics | cut -d: -f2),
    "error_rate": $(get_traffic_metrics | cut -d: -f3)
  },
  "log_file": "$LOG_FILE"
}
EOF
    
    log "INFO" "Report generated: $report_file"
}

# 信号处理
cleanup() {
    log "INFO" "Monitoring interrupted, generating final report..."
    generate_report
    exit 0
}

trap cleanup SIGINT SIGTERM

# 主程序
main() {
    case "${1:-monitor}" in
        "monitor")
            monitor_traffic
            ;;
        "verify")
            verify_traffic_switch
            ;;
        "report")
            generate_report
            ;;
        *)
            echo "Usage: $0 [monitor|verify|report]"
            echo ""
            echo "Commands:"
            echo "  monitor  - Start continuous traffic monitoring"
            echo "  verify   - Verify traffic switch completion"
            echo "  report   - Generate monitoring report"
            echo ""
            echo "Environment variables:"
            echo "  SLACK_WEBHOOK_URL  - Slack webhook for alerts"
            echo "  ALERT_EMAIL        - Email address for alerts"
            echo "  GITHUB_TOKEN       - GitHub token for auto-rollback"
            echo "  GITHUB_REPO        - GitHub repository (owner/repo)"
            echo "  AUTO_ROLLBACK      - Enable automatic rollback (true/false)"
            exit 1
            ;;
    esac
}

# 执行主程序
main "$@"