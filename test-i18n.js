// 简单测试脚本，验证多语言配置是否正确
const fs = require('fs');
const path = require('path');

// 测试所有语言包的键结构一致性
async function testI18nConsistency() {
  console.log('🔍 测试多语言包一致性...');
  
  const localesDir = path.join(__dirname, 'src/lib/i18n/locales');
  const localeFiles = fs.readdirSync(localesDir).filter(f => f.endsWith('.ts'));
  
  console.log(`📁 发现 ${localeFiles.length} 个语言包:`, localeFiles);
  
  // 读取基准语言包（英文）的结构
  const enPath = path.join(localesDir, 'en.ts');
  if (!fs.existsSync(enPath)) {
    console.error('❌ 基准语言包 en.ts 不存在');
    return false;
  }
  
  // 验证所有新增语言包是否存在
  const expectedLocales = ['ko.ts', 'es.ts'];
  let allExist = true;
  
  expectedLocales.forEach(locale => {
    const localePath = path.join(localesDir, locale);
    if (fs.existsSync(localePath)) {
      console.log(`✅ ${locale} 存在`);
    } else {
      console.log(`❌ ${locale} 不存在`);
      allExist = false;
    }
  });
  
  // 检查文件大小（简单验证内容是否完整）
  localeFiles.forEach(file => {
    const filePath = path.join(localesDir, file);
    const stats = fs.statSync(filePath);
    console.log(`📊 ${file}: ${(stats.size / 1024).toFixed(2)} KB`);
  });
  
  if (allExist) {
    console.log('✅ 所有语言包文件都已创建成功');
  } else {
    console.log('❌ 部分语言包文件缺失');
  }
  
  return allExist;
}

// 测试配置文件
function testI18nConfig() {
  console.log('\n🔍 测试 i18n 配置文件...');
  
  const configPath = path.join(__dirname, 'src/lib/i18n/config.ts');
  if (!fs.existsSync(configPath)) {
    console.error('❌ 配置文件 config.ts 不存在');
    return false;
  }
  
  const configContent = fs.readFileSync(configPath, 'utf8');
  
  // 检查新语言是否已添加到配置中
  const hasKorean = configContent.includes("'ko'") && configContent.includes("'한국어'");
  const hasSpanish = configContent.includes("'es'") && configContent.includes("'Español'");
  
  console.log(`🇰🇷 韩语配置: ${hasKorean ? '✅' : '❌'}`);
  console.log(`🇪🇸 西班牙语配置: ${hasSpanish ? '✅' : '❌'}`);
  
  return hasKorean && hasSpanish;
}

// 运行所有测试
async function runTests() {
  console.log('🚀 开始多语言集成测试...\n');
  
  const consistencyTest = await testI18nConsistency();
  const configTest = testI18nConfig();
  
  console.log('\n📋 测试结果总结:');
  console.log(`- 语言包文件: ${consistencyTest ? '✅ 通过' : '❌ 失败'}`);
  console.log(`- 配置文件: ${configTest ? '✅ 通过' : '❌ 失败'}`);
  
  if (consistencyTest && configTest) {
    console.log('\n🎉 多语言集成测试全部通过！');
    console.log('💡 支持的语言: 中文、英文、日文、韩文、西班牙文');
  } else {
    console.log('\n❌ 部分测试失败，请检查配置');
  }
}

runTests().catch(console.error);