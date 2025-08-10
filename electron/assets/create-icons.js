const fs = require('fs');
const path = require('path');

// 创建一个简单的Canvas图标生成器
function createIcon(size, filename) {
  // 这里我们创建一个简单的base64编码的PNG图标
  // 在实际项目中，您可能想要使用更专业的图标生成工具
  
  const canvas = `
<svg width="${size}" height="${size}" viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#667eea"/>
      <stop offset="100%" style="stop-color:#764ba2"/>
    </linearGradient>
  </defs>
  <rect x="32" y="32" width="448" height="448" rx="96" fill="url(#bg)"/>
  <rect x="80" y="120" width="352" height="272" rx="16" fill="#1f2937"/>
  <rect x="80" y="120" width="352" height="40" rx="16" fill="#4b5563"/>
  <rect x="80" y="144" width="352" height="16" fill="#4b5563"/>
  <circle cx="104" cy="140" r="6" fill="#ef4444"/>
  <circle cx="128" cy="140" r="6" fill="#f59e0b"/>
  <circle cx="152" cy="140" r="6" fill="#10b981"/>
  <rect x="96" y="180" width="120" height="8" rx="4" fill="#10b981" opacity="0.8"/>
  <rect x="96" y="200" width="160" height="8" rx="4" fill="#3b82f6" opacity="0.8"/>
  <rect x="96" y="220" width="100" height="8" rx="4" fill="#f59e0b" opacity="0.8"/>
  <path d="M248 320L216 352H232L200 384L232 352H216L248 320Z" fill="#fbbf24"/>
</svg>`;

  console.log(`创建 ${size}x${size} 图标: ${filename}`);
  
  // 在实际应用中，您需要使用适当的库来转换SVG到PNG
  // 这里我们只是保存SVG文件作为示例
  fs.writeFileSync(path.join(__dirname, filename), canvas);
}

// 创建不同尺寸的图标
createIcon(16, 'icon-16.svg');
createIcon(32, 'icon-32.svg');
createIcon(64, 'icon-64.svg');
createIcon(128, 'icon-128.svg');
createIcon(256, 'icon-256.svg');
createIcon(512, 'icon-512.svg');

console.log('图标创建完成！');
console.log('注意：这些是SVG文件。在生产环境中，您需要将它们转换为PNG格式。');
console.log('推荐使用 electron-icon-builder 或类似工具来生成所有需要的图标格式。');
