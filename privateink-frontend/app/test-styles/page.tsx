export default function TestStylesPage() {
  return (
    <div style={{ minHeight: '100vh', padding: '2rem' }}>
      <h1 style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: '2rem' }}>
        CSS 样式测试
      </h1>

      {/* 测试变量 */}
      <div style={{ marginBottom: '3rem' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: '600', marginBottom: '1rem' }}>
          1. CSS 变量测试
        </h2>
        <div style={{ 
          backgroundColor: 'var(--color-primary)', 
          color: 'white', 
          padding: '1rem',
          marginBottom: '0.5rem'
        }}>
          Primary Color: var(--color-primary)
        </div>
        <div style={{ 
          backgroundColor: 'var(--color-secondary)', 
          color: 'white', 
          padding: '1rem',
          marginBottom: '0.5rem'
        }}>
          Secondary Color: var(--color-secondary)
        </div>
        <div style={{ 
          backgroundColor: 'var(--color-surface)', 
          padding: '1rem',
          marginBottom: '0.5rem'
        }}>
          Surface Color: var(--color-surface)
        </div>
      </div>

      {/* 测试Tailwind类 */}
      <div style={{ marginBottom: '3rem' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: '600', marginBottom: '1rem' }}>
          2. Tailwind 工具类测试
        </h2>
        <div className="bg-primary text-white p-4 mb-2 rounded-lg">
          bg-primary (应该是紫色背景)
        </div>
        <div className="bg-secondary text-white p-4 mb-2 rounded-lg">
          bg-secondary (应该是深紫色背景)
        </div>
        <div className="text-text p-4 mb-2">
          text-text (应该是深色或浅色文字，取决于主题)
        </div>
        <div className="text-textSecondary p-4 mb-2">
          text-textSecondary (应该是次要文字颜色)
        </div>
      </div>

      {/* 测试毛玻璃效果 */}
      <div style={{ marginBottom: '3rem', position: 'relative' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: '600', marginBottom: '1rem' }}>
          3. 毛玻璃效果测试
        </h2>
        <div style={{ 
          background: 'linear-gradient(135deg, #a855f7 0%, #6366f1 100%)',
          padding: '2rem',
          borderRadius: '1rem',
          position: 'relative'
        }}>
          <div className="backdrop-blur-glass bg-surface-glass border border-white/20 p-8 rounded-2xl">
            <h3 className="text-2xl font-bold mb-4">毛玻璃卡片</h3>
            <p>这里应该有毛玻璃效果 (backdrop-blur + 半透明背景)</p>
          </div>
        </div>
      </div>

      {/* 测试渐变按钮 */}
      <div style={{ marginBottom: '3rem' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: '600', marginBottom: '1rem' }}>
          4. 渐变按钮测试
        </h2>
        <button className="px-8 py-4 rounded-xl bg-gradient-to-r from-primary to-secondary text-white font-semibold shadow-lg hover:opacity-90 transition-opacity">
          渐变按钮 (应该是紫色渐变)
        </button>
      </div>

      {/* 调试信息 */}
      <div style={{ marginBottom: '3rem', padding: '1rem', backgroundColor: '#f0f0f0', borderRadius: '0.5rem' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: '600', marginBottom: '1rem' }}>
          5. 调试信息
        </h2>
        <pre style={{ fontSize: '0.875rem', whiteSpace: 'pre-wrap', wordBreak: 'break-all' }}>
          {JSON.stringify({
            '检查项': {
              'CSS变量是否定义': '检查浏览器开发者工具 Elements > Computed > --color-primary',
              'backdrop-filter支持': '检查浏览器开发者工具 Elements > Computed > backdrop-filter',
              'Tailwind类是否生成': '检查 .bg-primary 是否有对应的CSS规则',
            }
          }, null, 2)}
        </pre>
      </div>
    </div>
  );
}
