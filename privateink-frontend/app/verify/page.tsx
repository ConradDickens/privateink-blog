import Link from 'next/link';

export default function VerifyPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/10 via-background to-secondary/10">
      {/* 顶部间距测试 */}
      <div className="h-24 bg-primary/5 flex items-center justify-center">
        <span className="text-2xl font-bold">← 24高度的顶部栏 (h-24 = 96px) →</span>
      </div>

      {/* 主要内容 - 大间距 */}
      <div className="container mx-auto px-6 py-16">
        <div className="max-w-4xl mx-auto space-y-12">
          
          {/* 标题部分 - 测试垂直间距 */}
          <div className="text-center space-y-8">
            <div className="inline-block bg-gradient-to-r from-primary to-secondary p-6 rounded-2xl">
              <h1 className="text-5xl font-bold text-white">
                样式验证页面
              </h1>
            </div>
            
            <p className="text-2xl text-text">
              如果你看到了清晰的间距和布局，说明样式已生效！
            </p>
          </div>

          {/* 间距测试卡片 */}
          <div className="bg-surface-glass backdrop-blur-glass border border-white/20 rounded-2xl p-8 space-y-6">
            <h2 className="text-3xl font-bold text-primary">✅ 间距测试</h2>
            
            <div className="space-y-4">
              <div className="bg-primary/10 p-6 rounded-lg">
                <p className="text-lg">这个卡片有 p-6 (24px) 的内边距</p>
              </div>
              
              <div className="bg-secondary/10 p-8 rounded-lg">
                <p className="text-lg">这个卡片有 p-8 (32px) 的内边距</p>
              </div>
              
              <div className="bg-accent/10 p-10 rounded-lg">
                <p className="text-lg">这个卡片有 p-10 (40px) 的内边距</p>
              </div>
            </div>
          </div>

          {/* Grid 布局测试 */}
          <div className="bg-surface-glass backdrop-blur-glass border border-white/20 rounded-2xl p-8 space-y-6">
            <h2 className="text-3xl font-bold text-primary">✅ Grid 布局测试</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              <div className="bg-primary rounded-xl p-6 text-white text-center">
                <div className="text-4xl mb-4">1</div>
                <p>Grid 项目 1</p>
              </div>
              
              <div className="bg-secondary rounded-xl p-6 text-white text-center">
                <div className="text-4xl mb-4">2</div>
                <p>Grid 项目 2</p>
              </div>
              
              <div className="bg-accent rounded-xl p-6 text-white text-center">
                <div className="text-4xl mb-4">3</div>
                <p>Grid 项目 3</p>
              </div>
              
              <div className="bg-primary rounded-xl p-6 text-white text-center">
                <div className="text-4xl mb-4">4</div>
                <p>Grid 项目 4</p>
              </div>
            </div>
            
            <p className="text-textSecondary">
              ↑ 这4个卡片之间有 gap-8 (32px) 的间隔
            </p>
          </div>

          {/* 按钮测试 */}
          <div className="bg-surface-glass backdrop-blur-glass border border-white/20 rounded-2xl p-8 space-y-6">
            <h2 className="text-3xl font-bold text-primary">✅ 按钮测试</h2>
            
            <div className="flex flex-wrap gap-6">
              <button className="px-10 py-4 rounded-xl bg-gradient-to-r from-primary to-secondary text-white font-semibold shadow-lg hover:opacity-90 transition-opacity">
                渐变按钮 (px-10 py-4)
              </button>
              
              <button className="px-8 py-3 rounded-lg bg-primary text-white font-medium shadow-md">
                标准按钮 (px-8 py-3)
              </button>
              
              <button className="px-6 py-2 rounded-md bg-accent text-white">
                小按钮 (px-6 py-2)
              </button>
            </div>
          </div>

          {/* 对比说明 */}
          <div className="bg-gradient-to-r from-primary/20 to-secondary/20 rounded-2xl p-8 space-y-4">
            <h2 className="text-2xl font-bold text-text">🎯 验证要点</h2>
            
            <ul className="space-y-3 text-lg text-text">
              <li className="flex items-start gap-3">
                <span className="text-2xl">✅</span>
                <span>卡片之间有明显的垂直间距（space-y-12 = 48px）</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-2xl">✅</span>
                <span>Grid 项目之间有间隙（gap-8 = 32px）</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-2xl">✅</span>
                <span>按钮有充足的内边距（px-10 py-4）</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-2xl">✅</span>
                <span>紫色渐变效果清晰可见</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-2xl">✅</span>
                <span>毛玻璃效果半透明</span>
              </li>
            </ul>
          </div>

          {/* 导航按钮 */}
          <div className="flex justify-center gap-6 pt-8">
            <Link
              href="/"
              className="px-8 py-4 rounded-xl bg-gradient-to-r from-primary to-secondary text-white font-semibold shadow-lg hover:opacity-90 transition-opacity"
            >
              返回首页
            </Link>
            
            <Link
              href="/explore"
              className="px-8 py-4 rounded-xl backdrop-blur-glass bg-surface-glass border border-white/20 font-semibold hover:bg-surface transition-colors"
            >
              浏览博客
            </Link>
          </div>
        </div>
      </div>

      {/* 底部间距测试 */}
      <div className="h-24 bg-primary/5 flex items-center justify-center mt-16">
        <span className="text-2xl font-bold">← 底部栏，上方有 mt-16 (64px) 间距 →</span>
      </div>
    </div>
  );
}

