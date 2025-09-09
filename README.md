# Instagram 下载软件 - Next.js 版本

这是一个基于 Next.js 15 和 Instagram Looter API 构建的现代化 Instagram 内容下载工具。

## 📸 项目特色

- **🚀 现代技术栈**: Next.js 15 + React 19 + TypeScript
- **🎨 精美UI**: Framer Motion + Tailwind CSS + shadcn/ui 组件
- **🌍 国际化支持**: 支持中文、英文、日文、繁体中文
- **📱 响应式设计**: 完美适配各种设备尺寸
- **⚡ 高性能**: API 路由 + 服务器端渲染
- **🔒 类型安全**: 完整的 TypeScript 类型定义

## 🎯 核心功能

### Instagram 内容下载
- **帖子下载**: 支持图片和视频帖子的高清无水印下载
- **Stories 下载**: 匿名下载 Stories 内容（规划中）
- **Reels 下载**: 下载 Instagram Reels 短视频（规划中）
- **IGTV 下载**: 长视频内容下载（规划中）
- **Highlights 下载**: 用户精选集锦下载（规划中）
- **用户资料下载**: 头像和资料图片下载（规划中）

### 搜索功能
- **全局搜索**: 跨平台内容搜索
- **用户搜索**: 按用户名搜索
- **标签搜索**: 按标签搜索内容
- **位置搜索**: 按地理位置搜索

### API 集成
- **29个 Instagram Looter API 端点**: 完整的 Instagram 数据访问
- **智能错误处理**: 用户友好的错误提示
- **请求缓存**: 优化性能和 API 调用次数

## 🛠 技术架构

### 前端技术栈
- **Next.js 15**: App Router + React Server Components
- **React 19**: 最新版本的 React
- **TypeScript**: 完整类型安全
- **Tailwind CSS**: 实用优先的 CSS 框架
- **shadcn/ui**: 高质量组件库
- **Framer Motion**: 动画和交互效果
- **Lucide React**: 现代化图标库
- **next-international**: 国际化支持

### 后端服务
- **RapidAPI**: Instagram Looter API 服务
- **Next.js API Routes**: 服务器端 API 处理
- **环境变量**: 安全的配置管理

## 📁 项目结构

```
instagram-downloader-nextjs/
├── src/
│   ├── app/                      # Next.js App Router
│   │   ├── [locale]/            # 国际化路由
│   │   │   ├── page.tsx         # 首页
│   │   │   ├── download/        # 下载页面
│   │   │   │   ├── page.tsx     # 下载中心
│   │   │   │   └── post/        # 帖子下载
│   │   │   └── about/           # 关于页面
│   │   └── api/                 # API 路由
│   │       └── instagram/       # Instagram API 集成
│   │           ├── download/    # 下载端点
│   │           ├── user/        # 用户信息
│   │           └── search/      # 搜索功能
│   ├── components/              # React 组件
│   │   ├── ui/                  # shadcn/ui 组件
│   │   ├── navigation.tsx       # 导航组件
│   │   └── performance/         # 性能监控组件
│   └── lib/                     # 工具库
│       ├── api/                 # API 服务
│       │   └── instagram.ts     # Instagram API 封装
│       └── i18n/                # 国际化配置
│           ├── config.ts        # 配置文件
│           └── locales/         # 语言包
├── public/                      # 静态资源
├── .env.example                 # 环境变量示例
├── .env.local                   # 本地环境变量
└── README.md                    # 项目说明
```

## 🚀 快速开始

### 1. 环境准备

确保您的开发环境满足以下要求：
- Node.js 18.0 或更高版本
- npm 或 yarn 包管理器

### 2. 安装依赖

```bash
# 克隆项目
git clone [your-repo-url]
cd instagram-downloader-nextjs

# 安装依赖
npm install
# 或
yarn install
```

### 3. 环境配置

复制环境变量示例文件并配置：

```bash
cp .env.example .env.local
```

编辑 `.env.local` 文件，设置必要的环境变量：

```env
# RapidAPI Instagram Looter 配置
RAPIDAPI_KEY=your_rapidapi_key_here

# Next.js 配置
NEXT_PUBLIC_APP_URL=http://localhost:3000
NODE_ENV=development
```

**获取 RapidAPI Key:**
1. 访问 [RapidAPI](https://rapidapi.com/)
2. 注册并登录账户
3. 搜索 "Instagram Looter" API
4. 订阅相应的计划（有免费计划）
5. 复制 API Key 到环境变量

### 4. 启动开发服务器

```bash
npm run dev
# 或
yarn dev
```

访问 [http://localhost:3000](http://localhost:3000) 查看应用。

## 📋 API 端点说明

### Instagram Looter API 集成

项目集成了完整的 Instagram Looter API，包含以下分类：

#### 🧩 身份转换工具 (4个端点)
- `GET /user/username-by-id` - 通过用户ID获取用户名
- `GET /user/id-by-username` - 通过用户名获取用户ID
- `GET /media/shortcode-by-id` - 通过媒体ID获取短代码
- `GET /media/id-by-url` - 通过媒体URL获取媒体ID

#### 👤 用户信息服务 (11个端点)
- `GET /user/info` - 通过用户名获取用户信息
- `GET /user/info-v2` - 通过用户名获取用户信息V2
- `GET /user/info-by-id` - 通过用户ID获取用户信息
- `GET /user/info-by-id-v2` - 通过用户ID获取用户信息V2
- `GET /user/web-info` - 获取网页档案信息
- `GET /user/media-list` - 通过用户ID获取媒体列表
- `GET /user/media-list-v2` - 通过用户ID获取媒体列表V2
- `GET /user/reels` - 通过用户ID获取Reels
- `GET /user/tagged-media` - 通过用户ID获取被标记的媒体
- `GET /user/related-profiles` - 通过用户ID获取相关档案
- `GET /search/users` - 通过关键词搜索用户

#### 📸 媒体详情服务 (4个端点)
- `GET /media/info-by-url` - 通过URL获取媒体信息
- `GET /media/info-by-id` - 通过ID获取媒体信息
- `GET /media/download-link` - 🌟 **核心功能** 获取下载链接
- `GET /media/music-info` - 通过音乐ID获取音乐信息

#### 🔖 标签搜索 (2个端点)
- `GET /hashtag/media` - 通过标签获取媒体
- `GET /search/hashtags` - 通过关键词搜索标签

#### 🗺️ 位置数据 (5个端点)
- `GET /location/search` - 通过关键词搜索位置
- `GET /location/info` - 通过位置ID获取位置信息
- `GET /location/media` - 通过位置ID获取媒体
- `GET /location/cities` - 通过国家代码获取城市
- `GET /location/by-city` - 通过城市ID获取位置

#### 🔍 探索功能 (2个端点)
- `GET /explore/sections` - 获取探索分区列表
- `GET /explore/media` - 通过分区ID获取媒体

#### 🌐 全局搜索 (1个端点)
- `GET /search/global` - 通过关键词全局搜索

### 应用 API 路由

#### POST /api/instagram/download
核心下载端点，解析 Instagram URL 并获取下载信息。

**请求参数:**
```json
{
  "url": "https://www.instagram.com/p/ABC123..."
}
```

**响应格式:**
```json
{
  "success": true,
  "data": {
    "media": { "...": "媒体详情" },
    "download": {
      "download_url": "https://..."
    },
    "timestamp": "2025-09-09T..."
  }
}
```

#### POST /api/instagram/user
获取用户的所有媒体内容。

**请求参数:**
```json
{
  "username": "instagram_username"
}
```

#### POST /api/instagram/search
统一搜索端点，支持多种搜索类型。

**请求参数:**
```json
{
  "query": "搜索关键词",
  "type": "global|users|hashtags|locations"
}
```

## 🔧 开发指南

### 添加新的下载类型

1. 在 `src/lib/api/instagram.ts` 中添加相应的服务方法
2. 在 `src/app/api/instagram/` 下创建新的 API 路由
3. 在 `src/app/[locale]/download/` 下创建对应的前端页面
4. 更新导航和路由配置

### 国际化支持

项目使用 `next-international` 进行国际化：

1. 语言包位于 `src/lib/i18n/locales/`
2. 支持的语言：`zh-CN`, `zh-TW`, `en`, `ja`
3. 添加新的翻译键值对到相应语言文件

### 样式和组件

- 使用 Tailwind CSS 进行样式设计
- 组件库基于 shadcn/ui
- 动画效果使用 Framer Motion

## 📱 功能展示

### 首页
- 现代化的渐变背景设计
- 动态统计数据展示
- 功能特色卡片
- 支持的内容类型展示

### 下载中心
- 6种不同的下载类型选择
- 每个类型都有独特的视觉设计
- 清晰的功能说明和特性标签

### 帖子下载页面
- 交互式的链接输入表单
- 实时的下载状态反馈
- 清晰的错误提示和成功确认
- 下载链接的复制和打开功能

## 🎨 设计系统

### 颜色方案
- **主色调**: 蓝色到紫色的渐变 (`from-blue-600 to-purple-600`)
- **背景**: 浅色渐变 (`from-blue-50 via-indigo-50 to-purple-50`)
- **成功**: 绿色系 (`from-green-500 to-emerald-500`)
- **警告**: 橙红色系 (`from-orange-500 to-red-500`)

### 动画效果
- **页面进入**: 淡入 + 上移动画
- **卡片悬停**: 上移 + 缩放效果
- **加载状态**: 旋转动画
- **背景装饰**: 循环浮动动画

## 🔒 安全考虑

- 所有 API 密钥都通过环境变量管理
- 客户端不暴露敏感信息
- 输入验证和错误处理
- CORS 配置

## 📈 性能优化

- React Server Components 减少客户端 JavaScript
- 图像优化和懒加载
- API 响应缓存
- 代码分割和动态导入

## 🚀 部署指南

### Vercel 部署（推荐）

1. 将代码推送到 GitHub 仓库
2. 在 [Vercel](https://vercel.com) 中导入项目
3. 配置环境变量
4. 自动部署完成

### 其他平台

项目支持部署到任何支持 Next.js 的平台：
- Netlify
- Railway
- Render
- 自托管

## 🤝 贡献指南

1. Fork 本项目
2. 创建功能分支 (`git checkout -b feature/AmazingFeature`)
3. 提交变更 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 创建 Pull Request

## 📄 许可证

本项目采用 MIT 许可证 - 查看 [LICENSE](LICENSE) 文件了解详情。

## ⚠️ 免责声明

- 本工具仅供个人学习和研究使用
- 请遵守 Instagram 的服务条款和版权法律
- 下载的内容应仅用于个人用途，请尊重原创作者的权利
- 使用本工具产生的任何法律后果由用户自行承担

## 📞 技术支持

如果您遇到任何问题或需要帮助：

1. 查看本文档的常见问题部分
2. 检查 [Issues](https://github.com/your-repo/issues) 页面
3. 创建新的 Issue 详细描述问题

---

**🎉 感谢使用 Instagram 下载软件！**

本项目展示了现代化 Web 开发的最佳实践，包括完整的 TypeScript 支持、国际化、响应式设计和优秀的用户体验。希望对您的学习和开发有所帮助！