#!/usr/bin/env node

const { performance } = require('perf_hooks');
const fs = require('fs');
const path = require('path');

/**
 * 性能测试工具
 * 用于测试和基准测试 Next.js 应用的性能
 */

class PerformanceTester {
  constructor() {
    this.results = {};
    this.startTime = null;
    this.endTime = null;
  }

  /**
   * 开始性能测试
   */
  startTest(testName) {
    console.log(`🚀 开始测试: ${testName}`);
    this.startTime = performance.now();
    this.results[testName] = {
      startTime: this.startTime,
      metrics: {},
    };
  }

  /**
   * 结束性能测试
   */
  endTest(testName) {
    this.endTime = performance.now();
    if (this.results[testName]) {
      this.results[testName].endTime = this.endTime;
      this.results[testName].duration = this.endTime - this.results[testName].startTime;
      console.log(`✅ 测试完成: ${testName} (${this.results[testName].duration.toFixed(2)}ms)`);
    }
  }

  /**
   * 记录指标
   */
  recordMetric(testName, metricName, value) {
    if (this.results[testName]) {
      this.results[testName].metrics[metricName] = value;
    }
  }

  /**
   * 测试构建性能
   */
  async testBuildPerformance() {
    this.startTest('build');
    
    const { exec } = require('child_process');
    const { promisify } = require('util');
    const execAsync = promisify(exec);
    
    try {
      // 清理之前的构建
      await execAsync('rm -rf .next');
      
      const buildStart = performance.now();
      console.log('📦 开始构建...');
      
      const { stdout, stderr } = await execAsync('npm run build');
      
      const buildEnd = performance.now();
      const buildTime = buildEnd - buildStart;
      
      this.recordMetric('build', 'buildTime', buildTime);
      this.recordMetric('build', 'buildOutput', stdout);
      
      // 分析构建输出
      const buildSizeMatch = stdout.match(/Total Size:\s+(\d+\.?\d*\s*[KMGT]?B)/);
      if (buildSizeMatch) {
        this.recordMetric('build', 'totalSize', buildSizeMatch[1]);
      }
      
      // 检查 .next 目录大小
      const nextDirSize = await this.getDirectorySize('.next');
      this.recordMetric('build', 'nextDirSize', `${(nextDirSize / 1024 / 1024).toFixed(2)} MB`);
      
      console.log(`📊 构建时间: ${(buildTime / 1000).toFixed(2)}s`);
      console.log(`📁 .next 目录大小: ${(nextDirSize / 1024 / 1024).toFixed(2)} MB`);
      
    } catch (error) {
      console.error('❌ 构建失败:', error);
      this.recordMetric('build', 'error', error.message);
    }
    
    this.endTest('build');
  }

  /**
   * 测试包大小
   */
  async testBundleSize() {
    this.startTest('bundle-size');
    
    try {
      const chunksDir = path.join('.next', 'static', 'chunks');
      
      if (fs.existsSync(chunksDir)) {
        const chunks = fs.readdirSync(chunksDir);
        let totalSize = 0;
        const chunkSizes = {};
        
        for (const chunk of chunks) {
          if (chunk.endsWith('.js')) {
            const chunkPath = path.join(chunksDir, chunk);
            const stats = fs.statSync(chunkPath);
            chunkSizes[chunk] = stats.size;
            totalSize += stats.size;
          }
        }
        
        this.recordMetric('bundle-size', 'totalChunkSize', `${(totalSize / 1024).toFixed(2)} KB`);
        this.recordMetric('bundle-size', 'chunkCount', chunks.filter(c => c.endsWith('.js')).length);
        this.recordMetric('bundle-size', 'largestChunk', this.findLargestChunk(chunkSizes));
        
        console.log(`📦 总chunk大小: ${(totalSize / 1024).toFixed(2)} KB`);
        console.log(`🧩 chunk数量: ${chunks.filter(c => c.endsWith('.js')).length}`);
        
        // 检查是否有过大的chunk
        const largeChunks = Object.entries(chunkSizes)
          .filter(([, size]) => size > 244 * 1024) // 244KB 是推荐的最大初始chunk大小
          .map(([name, size]) => `${name}: ${(size / 1024).toFixed(2)} KB`);
        
        if (largeChunks.length > 0) {
          console.warn('⚠️  发现过大的chunk:', largeChunks);
          this.recordMetric('bundle-size', 'largeChunks', largeChunks);
        }
        
      } else {
        console.warn('⚠️  未找到chunks目录，请先运行构建');
      }
      
    } catch (error) {
      console.error('❌ 包大小分析失败:', error);
      this.recordMetric('bundle-size', 'error', error.message);
    }
    
    this.endTest('bundle-size');
  }

  /**
   * 测试启动性能
   */
  async testStartupPerformance() {
    this.startTest('startup');
    
    const { spawn } = require('child_process');
    
    return new Promise((resolve) => {
      console.log('🚀 启动应用服务器...');
      
      const startTime = performance.now();
      const server = spawn('npm', ['run', 'start'], {
        stdio: 'pipe',
        detached: true,
      });
      
      let startupComplete = false;
      
      server.stdout.on('data', (data) => {
        const output = data.toString();
        
        if (output.includes('Ready') && !startupComplete) {
          startupComplete = true;
          const startupTime = performance.now() - startTime;
          
          this.recordMetric('startup', 'startupTime', startupTime);
          console.log(`⚡ 启动时间: ${(startupTime / 1000).toFixed(2)}s`);
          
          // 清理进程
          process.kill(-server.pid);
          
          this.endTest('startup');
          resolve();
        }
      });
      
      server.stderr.on('data', (data) => {
        console.error('启动错误:', data.toString());
      });
      
      // 超时保护
      setTimeout(() => {
        if (!startupComplete) {
          console.warn('⚠️  启动超时');
          this.recordMetric('startup', 'timeout', true);
          process.kill(-server.pid);
          this.endTest('startup');
          resolve();
        }
      }, 30000); // 30秒超时
    });
  }

  /**
   * 运行基准测试
   */
  async runBenchmarks() {
    console.log('🏃 开始运行性能基准测试...\n');
    
    // 构建性能测试
    await this.testBuildPerformance();
    console.log('');
    
    // 包大小测试
    await this.testBundleSize();
    console.log('');
    
    // 启动性能测试
    await this.testStartupPerformance();
    console.log('');
    
    // 生成报告
    this.generateReport();
  }

  /**
   * 生成性能报告
   */
  generateReport() {
    const reportData = {
      timestamp: new Date().toISOString(),
      results: this.results,
      summary: this.generateSummary(),
      recommendations: this.generateRecommendations(),
    };
    
    // 保存报告到文件
    const reportPath = path.join('reports', `performance-${Date.now()}.json`);
    
    // 确保报告目录存在
    if (!fs.existsSync('reports')) {
      fs.mkdirSync('reports');
    }
    
    fs.writeFileSync(reportPath, JSON.stringify(reportData, null, 2));
    
    console.log('📊 性能报告');
    console.log('='.repeat(50));
    
    // 显示摘要
    Object.entries(this.results).forEach(([testName, result]) => {
      console.log(`\n${testName.toUpperCase()}:`);
      if (result.duration) {
        console.log(`  ⏱️  执行时间: ${(result.duration / 1000).toFixed(2)}s`);
      }
      
      Object.entries(result.metrics || {}).forEach(([metric, value]) => {
        if (typeof value === 'string' || typeof value === 'number') {
          console.log(`  📈 ${metric}: ${value}`);
        }
      });
    });
    
    console.log(`\n📁 详细报告保存至: ${reportPath}`);
    console.log('\n' + '='.repeat(50));
  }

  /**
   * 生成性能摘要
   */
  generateSummary() {
    const summary = {};
    
    Object.entries(this.results).forEach(([testName, result]) => {
      summary[testName] = {
        status: result.error ? 'failed' : 'passed',
        duration: result.duration,
        keyMetrics: Object.keys(result.metrics || {}).length,
      };
    });
    
    return summary;
  }

  /**
   * 生成优化建议
   */
  generateRecommendations() {
    const recommendations = [];
    
    // 基于测试结果生成建议
    if (this.results['bundle-size']?.metrics?.largeChunks?.length > 0) {
      recommendations.push({
        type: 'bundle-optimization',
        message: '发现过大的JavaScript块，建议启用代码分割优化',
        impact: 'high',
      });
    }
    
    if (this.results['build']?.duration > 60000) { // 超过60秒
      recommendations.push({
        type: 'build-optimization',
        message: '构建时间较长，建议检查依赖项和启用增量构建',
        impact: 'medium',
      });
    }
    
    if (this.results['startup']?.metrics?.startupTime > 5000) { // 超过5秒
      recommendations.push({
        type: 'startup-optimization',
        message: '应用启动时间较长，建议优化服务器启动逻辑',
        impact: 'medium',
      });
    }
    
    return recommendations;
  }

  /**
   * 获取目录大小
   */
  async getDirectorySize(dirPath) {
    let size = 0;
    
    if (!fs.existsSync(dirPath)) {
      return 0;
    }
    
    const files = fs.readdirSync(dirPath);
    
    for (const file of files) {
      const filePath = path.join(dirPath, file);
      const stats = fs.statSync(filePath);
      
      if (stats.isDirectory()) {
        size += await this.getDirectorySize(filePath);
      } else {
        size += stats.size;
      }
    }
    
    return size;
  }

  /**
   * 找到最大的chunk
   */
  findLargestChunk(chunkSizes) {
    const largest = Object.entries(chunkSizes)
      .reduce((max, [name, size]) => size > max.size ? { name, size } : max, 
               { name: '', size: 0 });
    
    return `${largest.name}: ${(largest.size / 1024).toFixed(2)} KB`;
  }
}

// 运行测试
if (require.main === module) {
  const tester = new PerformanceTester();
  tester.runBenchmarks().catch(console.error);
}

module.exports = PerformanceTester;