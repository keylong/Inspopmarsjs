import { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Instagram Stories 下载器 - 免费下载 Instagram Stories',
  description: '专业的 Instagram Stories 下载工具，支持匿名下载 Stories 图片和视频，无浏览记录，批量保存。',
  keywords: 'Instagram Stories下载,Stories图片下载,Stories视频下载,匿名下载Stories',
};

export default function InstagramStoriesDownloadPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50">
      <div className="container mx-auto px-4 py-8">
        {/* 面包屑导航 */}
        <nav className="text-sm mb-8">
          <Link href="/" className="text-blue-600 hover:underline">首页</Link>
          <span className="mx-2 text-gray-400">/</span>
          <span className="text-gray-600">Instagram Stories下载</span>
        </nav>

        {/* 头部区域 */}
        <header className="text-center max-w-4xl mx-auto mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Instagram Stories 下载器
          </h1>
          <p className="text-xl text-gray-600 mb-8 leading-relaxed">
            匿名下载 Instagram Stories 图片和视频，无需登录，不留浏览记录
          </p>
          
          {/* 特性标签 */}
          <div className="flex flex-wrap justify-center gap-2 mb-8">
            <span className="px-3 py-1 bg-pink-100 text-pink-800 rounded-full text-sm font-medium">
              匿名下载
            </span>
            <span className="px-3 py-1 bg-pink-100 text-pink-800 rounded-full text-sm font-medium">
              无浏览记录
            </span>
            <span className="px-3 py-1 bg-pink-100 text-pink-800 rounded-full text-sm font-medium">
              批量保存
            </span>
            <span className="px-3 py-1 bg-pink-100 text-pink-800 rounded-full text-sm font-medium">
              高清画质
            </span>
          </div>
        </header>

        {/* 下载表单区域 */}
        <main className="max-w-2xl mx-auto mb-16">
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <div className="mb-6">
              <label htmlFor="instagram-username" className="block text-sm font-medium text-gray-700 mb-2">
                Instagram 用户名或 Stories 链接
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  id="instagram-username"
                  placeholder="输入Instagram用户名或Stories链接..."
                  className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                />
                <button className="px-6 py-3 bg-gradient-to-r from-pink-600 to-purple-600 text-white font-semibold rounded-lg hover:from-pink-700 hover:to-purple-700 transition-colors">
                  下载
                </button>
              </div>
            </div>
            
            <div className="text-center text-sm text-gray-500">
              <p>支持下载用户的所有 Stories 内容，包括图片和视频</p>
            </div>
          </div>
        </main>

        {/* 使用步骤 */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            如何使用Instagram Stories下载器？
          </h2>
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <div className="text-center">
              <div className="w-16 h-16 bg-pink-600 text-white rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-4">
                1
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                输入用户名
              </h3>
              <p className="text-gray-600">
                输入要下载 Stories 的 Instagram 用户名或直接粘贴 Stories 链接
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-pink-600 text-white rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-4">
                2
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                获取 Stories
              </h3>
              <p className="text-gray-600">
                系统将自动获取该用户当前所有可用的 Stories 内容
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-pink-600 text-white rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-4">
                3
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                批量下载
              </h3>
              <p className="text-gray-600">
                选择想要下载的 Stories，支持批量下载所有内容
              </p>
            </div>
          </div>
        </section>

        {/* 功能特色 */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            Instagram Stories 下载器特色功能
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
            <div className="bg-white rounded-lg p-6 shadow-sm border">
              <div className="w-8 h-8 text-pink-500 mb-3">👤</div>
              <h3 className="font-semibold text-gray-900 mb-2">匿名下载</h3>
              <p className="text-gray-600 text-sm">
                无需登录 Instagram 账号即可下载 Stories，保护您的隐私。
              </p>
            </div>
            <div className="bg-white rounded-lg p-6 shadow-sm border">
              <div className="w-8 h-8 text-pink-500 mb-3">🔒</div>
              <h3 className="font-semibold text-gray-900 mb-2">无浏览记录</h3>
              <p className="text-gray-600 text-sm">
                下载 Stories 不会留下任何浏览痕迹，对方无法知道您查看过。
              </p>
            </div>
            <div className="bg-white rounded-lg p-6 shadow-sm border">
              <div className="w-8 h-8 text-pink-500 mb-3">📦</div>
              <h3 className="font-semibold text-gray-900 mb-2">批量保存</h3>
              <p className="text-gray-600 text-sm">
                支持一次性下载用户所有的 Stories 内容，节省时间。
              </p>
            </div>
            <div className="bg-white rounded-lg p-6 shadow-sm border">
              <div className="w-8 h-8 text-pink-500 mb-3">🎯</div>
              <h3 className="font-semibold text-gray-900 mb-2">高清画质</h3>
              <p className="text-gray-600 text-sm">
                保持 Stories 原始画质，下载高清图片和视频。
              </p>
            </div>
            <div className="bg-white rounded-lg p-6 shadow-sm border">
              <div className="w-8 h-8 text-pink-500 mb-3">⚡</div>
              <h3 className="font-semibold text-gray-900 mb-2">实时更新</h3>
              <p className="text-gray-600 text-sm">
                自动获取最新的 Stories 内容，确保不错过任何更新。
              </p>
            </div>
            <div className="bg-white rounded-lg p-6 shadow-sm border">
              <div className="w-8 h-8 text-pink-500 mb-3">🌍</div>
              <h3 className="font-semibold text-gray-900 mb-2">全球可用</h3>
              <p className="text-gray-600 text-sm">
                支持全球所有地区的 Instagram Stories 下载。
              </p>
            </div>
          </div>
        </section>

        {/* 常见问题 */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            常见问题解答
          </h2>
          <div className="max-w-4xl mx-auto space-y-6">
            <div className="bg-white rounded-lg p-6 shadow-sm border">
              <h3 className="font-semibold text-gray-900 mb-2">
                下载 Stories 会被发现吗？
              </h3>
              <p className="text-gray-600">
                不会。我们的工具采用匿名下载技术，不会在对方的 Stories 查看记录中留下任何痕迹。
              </p>
            </div>
            <div className="bg-white rounded-lg p-6 shadow-sm border">
              <h3 className="font-semibold text-gray-900 mb-2">
                可以下载私人账号的 Stories 吗？
              </h3>
              <p className="text-gray-600">
                只能下载公开账号的 Stories。私人账号需要关注后才能查看其 Stories 内容。
              </p>
            </div>
            <div className="bg-white rounded-lg p-6 shadow-sm border">
              <h3 className="font-semibold text-gray-900 mb-2">
                Stories 过期了还能下载吗？
              </h3>
              <p className="text-gray-600">
                不能。Stories 在 Instagram 上过期后（24小时后），我们的工具也无法获取和下载这些内容。
              </p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}