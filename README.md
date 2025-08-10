# Command Manager - 企业级命令管理工具

<div align="center">

![Command Manager](https://img.shields.io/badge/Command-Manager-blue?style=for-the-badge)
![Electron](https://img.shields.io/badge/Electron-47848F?style=for-the-badge&logo=electron&logoColor=white)
![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)
![SQLite](https://img.shields.io/badge/SQLite-003B57?style=for-the-badge&logo=sqlite&logoColor=white)

一个功能完整、界面精美的桌面命令管理工具，帮助开发者高效管理和使用常用命令。

[功能特性](#-功能特性) • [快速开始](#-快速开始) • [使用说明](#-使用说明) • [技术栈](#-技术栈)

</div>

## ✨ 功能特性

### 🎯 核心功能
- **📋 命令管理** - 完整的增删改查操作，支持批量管理
- **🔍 智能搜索** - 实时搜索命令名称、内容和标签
- **📁 分类管理** - 16个预设分类 + 自定义分类创建
- **⭐ 收藏系统** - 收藏常用命令，快速访问
- **🕒 最近常用** - 智能显示最常用的命令，按使用次数排序
- **⚡ 一键复制** - 点击命令自动复制到剪贴板

### 🎨 用户体验
- **现代化设计** - 苹果风格的简洁界面，操作丝滑
- **流畅动画** - 秒级响应，所有操作都有平滑过渡
- **响应式布局** - 适配不同窗口大小
- **快捷键支持** - 丰富的键盘快捷键提高效率

### 📊 数据管理
- **导入导出** - 支持JSON格式的数据备份和恢复
- **使用统计** - 记录命令使用次数和最后使用时间
- **实时同步** - 所有操作实时更新界面和数据库

## 🚀 技术栈

### 桌面应用
- **Electron** - 跨平台桌面应用框架
- **Node.js** - 后端服务和主进程
- **SQLite** - 轻量级本地数据库

### 前端技术
- **HTML5 + CSS3** - 现代化前端技术
- **JavaScript ES6+** - 原生JavaScript，无框架依赖
- **CSS Grid & Flexbox** - 响应式布局

## 📁 项目结构

```
Command-Manager/
├── electron/                 # Electron主进程和后端服务
│   ├── main.js              # Electron主进程入口
│   ├── preload.js           # 预加载脚本
│   ├── server/              # Node.js后端服务
│   │   ├── app.js           # Express服务器
│   │   ├── routes/          # API路由
│   │   │   ├── commands.js  # 命令相关API
│   │   │   └── categories.js # 分类相关API
│   │   └── seed-data.js     # 初始数据
│   ├── data/                # 数据库文件
│   │   └── commands.db      # SQLite数据库
│   ├── assets/              # 应用图标和资源
│   ├── public/              # 前端静态文件
│   │   └── index.html       # 主页面
│   ├── package.json         # 项目配置
│   └── node_modules/        # 依赖包
├── web/                     # 前端源代码
│   ├── css/                 # 样式文件
│   ├── js/                  # JavaScript文件
│   └── assets/              # 前端资源
├── .gitignore              # Git忽略文件
└── README.md               # 项目文档
```

## 🚀 快速开始

### 环境要求
- Node.js 16.0 或更高版本
- npm 或 yarn 包管理器

### 安装和运行

1. **克隆项目**
   ```bash
   git clone https://github.com/lxyhes/Command-Manager.git
   cd Command-Manager
   ```

2. **安装依赖**
   ```bash
   cd electron
   npm install
   ```

3. **启动应用**
   ```bash
   npm start
   ```

### 开发模式

如果需要开发模式（热重载）：
```bash
npm run dev
```

### 构建应用

构建生产版本：
```bash
npm run build
```

## 📖 使用说明

### 基础操作

1. **添加命令**
   - 点击右上角的"+"按钮
   - 填写命令名称、内容和描述
   - 选择分类和标签
   - 点击保存

2. **搜索命令**
   - 在搜索框中输入关键词
   - 支持搜索命令名称、内容和标签
   - 实时显示搜索结果

3. **复制命令**
   - 点击任意命令卡片
   - 命令自动复制到剪贴板
   - 在终端中直接粘贴使用

4. **管理分类**
   - 点击左侧分类列表
   - 点击"新建分类"创建自定义分类
   - 选择颜色和图标

### 高级功能

- **收藏命令** - 点击星标图标收藏常用命令
- **最近常用** - 查看使用频率最高的命令
- **批量操作** - 支持批量删除和分类
- **数据导出** - 导出命令数据进行备份
- **快捷键** - 使用键盘快捷键提高效率

## 📊 内置命令库

应用预装了70个实用命令，涵盖以下领域：

| 分类 | 命令数量 | 说明 |
|------|----------|------|
| Node.js | 8个 | npm、yarn、项目管理 |
| Python | 7个 | pip、虚拟环境、包管理 |
| React | 5个 | 项目创建、构建、部署 |
| 数据库 | 7个 | MySQL、MongoDB、Redis |
| 服务器 | 7个 | Nginx、Apache、PM2 |
| 文件操作 | 8个 | 文件管理、权限、压缩 |
| 监控 | 5个 | 系统监控、性能分析 |
| 安全 | 5个 | SSL、防火墙、权限 |
| Web开发 | 5个 | 前端工具、构建工具 |
| 测试 | 6个 | 单元测试、集成测试 |
| Git | 1个 | 版本控制 |
| Docker | 1个 | 容器化 |
| 系统管理 | 1个 | 系统维护 |
| 网络工具 | 1个 | 网络诊断 |
| DevOps | 0个 | 运维工具（可自定义） |

## ⌨️ 快捷键

| 快捷键 | 功能 |
|--------|------|
| `Ctrl/Cmd + F` | 聚焦搜索框 |
| `Ctrl/Cmd + N` | 新建命令 |
| `Ctrl/Cmd + S` | 保存当前编辑 |
| `Esc` | 关闭模态框 |
| `Enter` | 确认操作 |
| `↑/↓` | 导航命令列表 |

## 🔧 配置说明

### 端口配置
- **后端服务**: 9091端口
- **前端界面**: 4001端口（开发模式）
- **Electron应用**: 桌面应用，无需端口

### 数据库配置
- **类型**: SQLite
- **位置**: `electron/data/commands.db`
- **自动创建**: 首次启动时自动创建数据库和表

### 自定义配置
可以通过修改 `electron/server/app.js` 来调整：
- 服务器端口
- 数据库路径
- API路由
- 中间件配置

## 🛠️ 开发指南

### 添加新功能

1. **后端API**
   ```javascript
   // electron/server/routes/commands.js
   router.post('/api/commands', (req, res) => {
     // 新增API逻辑
   });
   ```

2. **前端界面**
   ```javascript
   // electron/public/js/app.js
   function newFeature() {
     // 新功能实现
   }
   ```

3. **数据库操作**
   ```javascript
   // 使用SQLite进行数据操作
   db.run("INSERT INTO commands ...", callback);
   ```

### 调试模式

启用开发者工具：
```javascript
// electron/main.js
mainWindow.webContents.openDevTools();
```

### 构建配置

修改 `electron/package.json` 中的构建配置：
```json
{
  "build": {
    "appId": "com.example.command-manager",
    "productName": "Command Manager",
    "directories": {
      "output": "dist"
    }
  }
}
```

## 📱 截图展示

### 主界面
- 简洁的命令列表展示
- 实时搜索和过滤
- 分类导航和统计

### 命令管理
- 直观的命令编辑界面
- 丰富的分类和标签选择
- 实时预览和验证

### 数据管理
- 完整的导入导出功能
- 使用统计和分析
- 备份和恢复选项

## 🤝 贡献指南

欢迎贡献代码！请遵循以下步骤：

1. Fork 项目
2. 创建功能分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 打开 Pull Request

### 代码规范
- 使用 ESLint 进行代码检查
- 遵循 JavaScript Standard Style
- 添加适当的注释和文档
- 确保所有测试通过

## 📄 许可证

本项目采用 MIT 许可证 - 查看 [LICENSE](LICENSE) 文件了解详情。

## 🙏 致谢

- [Electron](https://electronjs.org/) - 跨平台桌面应用框架
- [Node.js](https://nodejs.org/) - JavaScript运行时
- [SQLite](https://sqlite.org/) - 轻量级数据库
- [Express](https://expressjs.com/) - Web应用框架

## 📞 联系方式

如果您有任何问题或建议，请通过以下方式联系：

- 📧 Email: [your-email@example.com]
- 🐛 Issues: [GitHub Issues](https://github.com/lxyhes/Command-Manager/issues)
- 💬 Discussions: [GitHub Discussions](https://github.com/lxyhes/Command-Manager/discussions)

---

<div align="center">

**⭐ 如果这个项目对您有帮助，请给它一个星标！**

Made with ❤️ by [lxyhes](https://github.com/lxyhes)

</div>
