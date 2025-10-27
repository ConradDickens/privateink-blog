export default function DemoPage() {
  return (
    <div className="min-h-screen p-8 bg-background">
      <h1 className="text-4xl font-bold mb-8 text-text">样式测试 Demo</h1>
      
      {/* 测试1: 基础颜色 */}
      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-4 text-text">1. 基础颜色测试</h2>
        <div className="flex gap-4 flex-wrap">
          <div className="w-32 h-32 bg-primary rounded-xl flex items-center justify-center text-white font-bold">
            Primary
          </div>
          <div className="w-32 h-32 bg-secondary rounded-xl flex items-center justify-center text-white font-bold">
            Secondary
          </div>
          <div className="w-32 h-32 bg-accent rounded-xl flex items-center justify-center text-white font-bold">
            Accent
          </div>
          <div className="w-32 h-32 bg-surface rounded-xl flex items-center justify-center text-text font-bold border">
            Surface
          </div>
        </div>
      </section>

      {/* 测试2: 渐变 */}
      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-4 text-text">2. 渐变效果测试</h2>
        <div className="flex gap-4 flex-wrap">
          <div className="w-64 h-32 bg-gradient-to-r from-primary to-secondary rounded-xl flex items-center justify-center text-white font-bold">
            Primary → Secondary
          </div>
          <div className="w-64 h-32 bg-gradient-to-br from-primary to-secondary rounded-xl flex items-center justify-center text-white font-bold">
            Diagonal Gradient
          </div>
        </div>
      </section>

      {/* 测试3: 毛玻璃 */}
      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-4 text-text">3. 毛玻璃效果测试</h2>
        <div className="relative p-8 bg-gradient-to-r from-primary to-secondary rounded-2xl">
          <div className="backdrop-blur-glass bg-surface-glass border border-white/20 p-6 rounded-xl">
            <h3 className="text-xl font-bold mb-2 text-text">毛玻璃卡片</h3>
            <p className="text-textSecondary">
              这个卡片应该有半透明背景和背景模糊效果
            </p>
          </div>
        </div>
      </section>

      {/* 测试4: 按钮 */}
      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-4 text-text">4. 按钮样式测试</h2>
        <div className="flex gap-4 flex-wrap">
          <button className="px-8 py-4 rounded-xl bg-gradient-to-r from-primary to-secondary text-white font-semibold shadow-lg hover:opacity-90 transition-opacity">
            渐变按钮
          </button>
          <button className="px-8 py-4 rounded-xl backdrop-blur-glass bg-surface-glass border border-white/20 font-semibold hover:bg-surface transition-colors">
            毛玻璃按钮
          </button>
          <button className="px-8 py-4 rounded-xl bg-primary text-white font-semibold shadow-md hover:bg-secondary transition-colors">
            纯色按钮
          </button>
        </div>
      </section>

      {/* 测试5: 文字颜色 */}
      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-4 text-text">5. 文字颜色测试</h2>
        <div className="space-y-2">
          <p className="text-text text-lg">
            主要文字颜色 (text-text) - 应该是深色或浅色，取决于主题
          </p>
          <p className="text-textSecondary text-lg">
            次要文字颜色 (text-textSecondary) - 应该是灰色
          </p>
          <p className="text-primary text-lg font-semibold">
            强调文字颜色 (text-primary) - 应该是紫色
          </p>
        </div>
      </section>

      {/* 测试6: 间距 */}
      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-4 text-text">6. 间距测试</h2>
        <div className="bg-surface p-8 rounded-2xl">
          <div className="space-y-6">
            <div className="bg-primary/20 p-6 rounded-lg">
              间距 p-6 (24px)
            </div>
            <div className="bg-secondary/20 p-8 rounded-lg">
              间距 p-8 (32px)
            </div>
            <div className="bg-accent/20 p-10 rounded-lg">
              间距 p-10 (40px)
            </div>
          </div>
        </div>
      </section>

      {/* 调试信息 */}
      <section className="mb-12 bg-surface p-6 rounded-xl border">
        <h2 className="text-2xl font-semibold mb-4 text-text">调试信息</h2>
        <div className="font-mono text-sm text-textSecondary space-y-2">
          <p>✅ 如果看到紫色渐变 → CSS 变量和渐变类生效</p>
          <p>✅ 如果看到毛玻璃效果 → backdrop-filter 支持</p>
          <p>✅ 如果按钮有阴影和动画 → 过渡效果正常</p>
          <p>✅ 如果文字清晰可读 → 颜色对比度正确</p>
          <p>✅ 如果卡片间距宽松 → 布局系统正常</p>
        </div>
      </section>

      <div className="text-center py-8">
        <a 
          href="/" 
          className="inline-block px-8 py-4 rounded-xl bg-gradient-to-r from-primary to-secondary text-white font-semibold shadow-lg hover:opacity-90 transition-opacity"
        >
          返回首页
        </a>
      </div>
    </div>
  );
}

