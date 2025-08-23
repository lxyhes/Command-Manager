# 🌐 Web端访问指南

## 功能说明

现在您的命令管理工具支持Web端访问！您可以通过浏览器直接访问应用界面，方便调试和查看问题。

## 🚀 快速启动

### 方法一：使用启动脚本（推荐）
```bash
# 进入项目目录
cd /Users/hb/Downloads/快速把命令放入到需要执行的地方

# 启动Web服务器
node start-web.js
```

### 方法二：直接运行Electron后端
```bash
# 进入electron目录
cd electron

# 启动后端服务（会自动启动Web服务）
npm start
```

## 📊 访问地址

启动成功后，可以通过以下地址访问：

- **Web界面**: http://localhost:9091
- **API接口**: http://localhost:9091/api
- **健康检查**: http://localhost:9091/api/health

## 🔧 功能特性

### ✅ 已支持的Web功能
1. **命令管理** - 查看、搜索、筛选所有命令
2. **分类管理** - 浏览和管理命令分类
3. **收藏功能** - 标记和查看收藏的命令
4. **使用统计** - 查看命令使用次数
5. **实时搜索** - 快速搜索命令内容
6. **响应式设计** - 支持桌面和移动端

### ⚡ 智能环境检测
- **Electron环境**: 自动使用 `localhost:9091/api`
- **Web环境**: 自动使用当前域名 `/api`
- **无缝切换**: 同一套代码支持两种环境

## 🐛 调试技巧

### 查看网络请求
1. 打开浏览器开发者工具（F12）
2. 切换到 Network 标签页
3. 观察API请求状态和响应

### 检查JavaScript错误
1. 查看 Console 标签页的错误信息
2. 注意红色错误信息和警告

### 验证API连接
```bash
# 测试API健康状态
curl http://localhost:9091/api/health

# 测试命令列表API
curl http://localhost:9091/api/commands

# 测试分类API
curl http://localhost:9091/api/categories
```

## 🛠️ 技术实现

### 后端修改
- 添加了静态文件服务中间件
- 支持SPA路由（所有未匹配请求返回index.html）
- 保持API路由不变

### 前端修改
- 自动检测运行环境（Electron vs Web）
- 动态设置API基础URL
- 保持功能一致性

### 文件结构
```
项目根目录/
├── electron/           # Electron应用
│   ├── server/         # 后端服务器
│   ├── public/         # 前端静态文件
│   └── main.js         # 主进程
├── start-web.js        # Web启动脚本
└── WEB_ACCESS_GUIDE.md # 本指南
```

## ❓ 常见问题

### Q: Web端和Electron端有什么区别？
A: 功能完全一致，只是运行环境不同。Web端更适合调试和快速查看。

### Q: 数据是共享的吗？
A: 是的，两者使用同一个SQLite数据库文件 (`electron/data/commands.db`)。

### Q: 可以同时运行Web和Electron吗？
A: 可以！Web端运行在9091端口，Electron桌面应用是独立的。

### Q: 如何停止Web服务？
A: 在终端中按 `Ctrl+C` 即可停止服务。

## 📞 技术支持

如果遇到问题，请检查：
1. 端口9091是否被占用
2. 数据库文件权限是否正确
3. Node.js版本是否兼容

享受Web端访问的便利吧！🎉