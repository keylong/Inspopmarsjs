const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

// 定义需要生成的图标尺寸
const sizes = [
  72, 96, 128, 144, 152, 192, 384, 512,
  // Apple特殊尺寸
  180, 120, 167
];

// 创建一个基础的图标（使用纯色背景和文字）
async function generateBaseIcon() {
  const svg = `
    <svg width="512" height="512" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style="stop-color:#8B5CF6;stop-opacity:1" />
          <stop offset="100%" style="stop-color:#EC4899;stop-opacity:1" />
        </linearGradient>
      </defs>
      <rect width="512" height="512" rx="100" fill="url(#grad)"/>
      <text x="256" y="280" font-family="Arial, sans-serif" font-size="180" font-weight="bold" text-anchor="middle" fill="white">Ins</text>
      <text x="256" y="380" font-family="Arial, sans-serif" font-size="60" text-anchor="middle" fill="white">下载器</text>
    </svg>
  `;
  
  return Buffer.from(svg);
}

async function generateIcons() {
  try {
    // 确保输出目录存在
    const outputDir = path.join(__dirname, '../public/icons');
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }

    // 生成基础图标
    const baseIcon = await generateBaseIcon();
    
    // 生成各种尺寸的图标
    for (const size of sizes) {
      const outputPath = path.join(outputDir, `icon-${size}x${size}.png`);
      
      await sharp(baseIcon)
        .resize(size, size)
        .png()
        .toFile(outputPath);
      
      console.log(`✅ Generated ${size}x${size} icon`);
    }

    // 生成 Apple Touch Icon
    await sharp(baseIcon)
      .resize(180, 180)
      .png()
      .toFile(path.join(outputDir, 'apple-touch-icon.png'));
    console.log('✅ Generated Apple Touch Icon');

    // 生成 favicon
    await sharp(baseIcon)
      .resize(32, 32)
      .png()
      .toFile(path.join(outputDir, '../favicon.png'));
    console.log('✅ Generated favicon');

    console.log('\n🎉 All PWA icons generated successfully!');
  } catch (error) {
    console.error('Error generating icons:', error);
    process.exit(1);
  }
}

generateIcons();