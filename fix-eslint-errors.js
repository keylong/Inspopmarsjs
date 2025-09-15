#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// 定义需要修复的文件和规则
const fixes = [
  // 修复未使用的变量 - 添加下划线前缀
  {
    file: 'src/app/api/test-db/route.ts',
    find: 'export async function GET(request: Request)',
    replace: 'export async function GET(_request: Request)'
  },
  {
    file: 'src/components/download/download-page-wrapper.tsx',
    find: '  acceptedTypes = [],',
    replace: '  _acceptedTypes = [],'
  },
  {
    file: 'src/components/download/download-page-wrapper.tsx', 
    find: '  requireAuth = false,',
    replace: '  _requireAuth = false,'
  },
  {
    file: 'src/components/download/download-page-wrapper.tsx',
    find: '  enableBatch = false,',
    replace: '  _enableBatch = false,'
  },
  {
    file: 'src/components/download/progress-indicator.tsx',
    find: 'const spring = useSpring(value, config)',
    replace: 'const spring = useSpring(value, _config)'
  },
  {
    file: 'src/components/download/result-display.tsx',
    find: '  onDownloadSelected,',
    replace: '  _onDownloadSelected,'
  },
  // 修复 catch 块中未使用的错误变量
  {
    file: 'src/app/api/proxy/image/route.ts',
    find: '  } catch (e) {',
    replace: '  } catch {'
  },
  {
    file: 'src/components/download/media-preview-modal.tsx',
    find: '      } catch (err) {',
    replace: '      } catch {'
  },
  // 注释掉未使用的导入
  {
    file: 'src/app/[locale]/privacy/privacy-client.tsx',
    find: 'interface SectionContent {',
    replace: '// interface SectionContent {'
  },
  {
    file: 'src/app/[locale]/privacy/privacy-client.tsx',
    find: '  title: string\n  content: string\n}',
    replace: '//   title: string\n//   content: string\n// }'
  },
  {
    file: 'src/app/api/payment/checkout/route.ts',
    find: 'interface CreateCheckoutSessionRequest {',
    replace: '// interface CreateCheckoutSessionRequest {'
  },
  {
    file: 'src/components/__tests__/language-switcher.test.tsx',
    find: "import { render, fireEvent, screen } from '@testing-library/react'",
    replace: "import { render, screen } from '@testing-library/react'"
  },
  {
    file: 'src/components/download/media-preview-modal.tsx',
    find: '  Pause,',
    replace: '  // Pause,'
  },
  {
    file: 'src/components/download/media-preview-modal.tsx',
    find: '  Volume2,',
    replace: '  // Volume2,'
  },
  {
    file: 'src/components/download/media-preview-modal.tsx',
    find: '  VolumeX,',
    replace: '  // VolumeX,'
  },
  {
    file: 'src/components/download/resolution-selector.tsx',
    find: '  Check,',
    replace: '  // Check,'
  },
  {
    file: 'src/components/download/result-display.tsx',
    find: 'import { motion, AnimatePresence } from \'framer-motion\'',
    replace: 'import { motion } from \'framer-motion\''
  },
  {
    file: 'src/components/download/result-display.tsx',
    find: '  Share2,',
    replace: '  // Share2,'
  },
  {
    file: 'src/components/download/result-display.tsx',
    find: '  ChevronLeft,',
    replace: '  // ChevronLeft,'
  },
  {
    file: 'src/components/download/result-display.tsx',
    find: '  ChevronRight,',
    replace: '  // ChevronRight,'
  },
  {
    file: 'src/components/download/result-display.tsx',
    find: '  Grid3X3,',
    replace: '  // Grid3X3,'
  },
  {
    file: 'src/components/download/result-display.tsx',
    find: 'import { ResolutionSelector } from \'./resolution-selector\'',
    replace: '// import { ResolutionSelector } from \'./resolution-selector\''
  },
  // 修复 a 标签为 Link
  {
    file: 'src/app/test-auth/page.tsx',
    find: '<a href="/signin/"',
    replace: '<Link href="/signin"'
  },
  {
    file: 'src/app/test-auth/page.tsx',
    find: '<a href="/signup/"',
    replace: '<Link href="/signup"'
  },
  {
    file: 'src/app/test-auth/page.tsx',
    find: '</a>',
    replace: '</Link>'
  }
];

// 执行修复
fixes.forEach(fix => {
  const filePath = path.join(process.cwd(), fix.file);
  
  try {
    let content = fs.readFileSync(filePath, 'utf-8');
    
    if (content.includes(fix.find)) {
      content = content.replace(fix.find, fix.replace);
      fs.writeFileSync(filePath, content, 'utf-8');
      console.log(`✅ Fixed: ${fix.file}`);
    } else {
      console.log(`⚠️  Pattern not found in ${fix.file}: ${fix.find.substring(0, 50)}...`);
    }
  } catch (error) {
    console.error(`❌ Error processing ${fix.file}:`, error.message);
  }
});

// 额外的修复：添加 Link 导入到 test-auth/page.tsx
const testAuthPath = path.join(process.cwd(), 'src/app/test-auth/page.tsx');
let testAuthContent = fs.readFileSync(testAuthPath, 'utf-8');
if (!testAuthContent.includes("import Link from 'next/link'")) {
  testAuthContent = testAuthContent.replace(
    "'use client'",
    "'use client'\n\nimport Link from 'next/link'"
  );
  fs.writeFileSync(testAuthPath, testAuthContent, 'utf-8');
  console.log('✅ Added Link import to test-auth/page.tsx');
}

// 修复 monitoring/stats/route.ts 中的未使用变量
const statsPath = path.join(process.cwd(), 'src/app/api/monitoring/stats/route.ts');
let statsContent = fs.readFileSync(statsPath, 'utf-8');
statsContent = statsContent.replace(
  'const { timestamp, count } = row',
  'const { count } = row'
);
fs.writeFileSync(statsPath, statsContent, 'utf-8');
console.log('✅ Fixed unused timestamp in monitoring/stats/route.ts');

// 修复 monitoring/errors/route.ts 中的未使用变量
const errorsPath = path.join(process.cwd(), 'src/app/api/monitoring/errors/route.ts');
let errorsContent = fs.readFileSync(errorsPath, 'utf-8');
errorsContent = errorsContent.replace(
  'const severity = getSeverity(error)',
  '// const severity = getSeverity(error)'
);
fs.writeFileSync(errorsPath, errorsContent, 'utf-8');
console.log('✅ Fixed unused severity in monitoring/errors/route.ts');

// 修复 media-preview-modal.tsx 中的 toggleMute
const mediaPath = path.join(process.cwd(), 'src/components/download/media-preview-modal.tsx');
let mediaContent = fs.readFileSync(mediaPath, 'utf-8');
mediaContent = mediaContent.replace(
  'const toggleMute = ()',
  '// const toggleMute = ()'
);
// 注释掉整个函数
mediaContent = mediaContent.replace(
  /const toggleMute = \(\) => \{[\s\S]*?setIsMuted\(!isMuted\)\s*\}/,
  '// const toggleMute = () => {\n  //   setIsMuted(!isMuted)\n  // }'
);
fs.writeFileSync(mediaPath, mediaContent, 'utf-8');
console.log('✅ Fixed unused toggleMute in media-preview-modal.tsx');

console.log('\n✨ ESLint 错误修复完成！');
console.log('运行 npm run lint 查看剩余的错误。');