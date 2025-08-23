#!/usr/bin/env node

// 使用electron目录下的依赖
const electronPath = require.resolve('./electron/package.json');
const electronDir = require('path').dirname(electronPath);

// 修改模块解析路径
require('module').Module._initPaths();
require('module').Module._nodeModulePaths.push(require('path').join(electronDir, 'node_modules'));

const express = require('express');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 9091;

// 确保数据目录存在
const dataDir = path.join(__dirname, 'electron/data');
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

// 导入后端服务器
const createServer = require('./electron/server/app');

// 启动服务器
async function startWebServer() {
  try {
    const server = await createServer();
    console.log('🚀 Web服务器已启动');
    console.log('📊 访问地址: http://localhost:' + PORT);
    console.log('🔧 API地址: http://localhost:' + PORT + '/api');
    console.log('📋 前端界面: http://localhost:' + PORT);
    console.log('💡 按 Ctrl+C 停止服务');
    
    return server;
  } catch (error) {
    console.error('❌ 启动服务器失败:', error);
    process.exit(1);
  }
}

// 处理优雅关闭
process.on('SIGINT', () => {
  console.log('\n🛑 正在关闭服务器...');
  process.exit(0);
});

// 启动服务
startWebServer();