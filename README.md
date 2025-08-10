# 快速命令管理工具

一个可以快速选择和复制常用命令到剪贴板的工具。

## 功能特性

- 📋 命令管理：添加、编辑、删除常用命令
- 🔍 快速搜索：支持命令名称和内容搜索
- 📁 分类管理：按类别组织命令
- ⚡ 一键复制：选中命令自动复制到剪贴板
- 🎨 现代化UI：参照苹果系统设计，操作流畅
- ⌨️ 快捷键支持：提高操作效率

## 技术栈

### 后端
- Node.js + Express
- MySQL 8.0
- 端口：9091

### 前端
- React + TypeScript
- Tailwind CSS
- 端口：4001

## 项目结构

```
├── backend/          # 后端代码
│   ├── src/
│   │   ├── controllers/
│   │   ├── models/
│   │   ├── routes/
│   │   └── utils/
│   ├── package.json
│   └── server.js
├── frontend/         # 前端代码
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── hooks/
│   │   └── utils/
│   ├── package.json
│   └── public/
└── database/         # 数据库脚本
    └── init.sql
```

## 快速开始

1. 启动数据库
2. 安装依赖并启动后端：`cd backend && npm install && npm start`
3. 安装依赖并启动前端：`cd frontend && npm install && npm start`
4. 访问 http://localhost:4001

## 使用说明

1. 添加常用命令到系统中
2. 使用搜索功能快速找到需要的命令
3. 点击命令即可自动复制到剪贴板
4. 在任意终端中粘贴使用
