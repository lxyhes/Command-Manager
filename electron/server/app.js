const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
const path = require('path');
const sqlite3 = require('sqlite3').verbose();
const fs = require('fs');

// 导入路由
const commandRoutes = require('./routes/commands');
const categoryRoutes = require('./routes/categories');
const { initializeSmartRoutes } = require('./routes/smart-commands');

function createServer() {
  return new Promise((resolve, reject) => {
    const app = express();
    const PORT = 9091;

    // 确保数据目录存在
    const dataDir = path.join(__dirname, '../data');
    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir, { recursive: true });
    }

    // 数据库初始化
    const dbPath = path.join(dataDir, 'commands.db');
    const db = new sqlite3.Database(dbPath, (err) => {
      if (err) {
        console.error('数据库连接失败:', err);
        reject(err);
        return;
      }
      console.log('数据库连接成功');

      // 创建表
      initDatabase(db, () => {
        // 将数据库实例添加到 app 中，供路由使用
        app.locals.db = db;
        setupRoutes();
      });
    });

    function setupRoutes() {
      // 中间件
      app.use(helmet({
        contentSecurityPolicy: false // 为了支持 Electron
      }));
      app.use(compression());
      app.use(cors());
      app.use(express.json());
      app.use(express.urlencoded({ extended: true }));

      // API 路由
      app.use('/api/commands', commandRoutes);
      app.use('/api/categories', categoryRoutes);
      app.use('/api/smart', initializeSmartRoutes(db));

      // 健康检查
      app.get('/api/health', (req, res) => {
        res.json({
          status: 'ok',
          timestamp: new Date().toISOString(),
          environment: process.env.NODE_ENV || 'production'
        });
      });

      // Web端访问 - 静态文件服务
      app.use(express.static(path.join(__dirname, '../public')));

      // 处理SPA路由 - 所有未匹配的请求返回index.html
      app.get('*', (req, res) => {
        res.sendFile(path.join(__dirname, '../public/index.html'));
      });

      // 错误处理中间件
      app.use((err, req, res, next) => {
        console.error('服务器错误:', err);
        res.status(500).json({
          error: '服务器内部错误',
          message: process.env.NODE_ENV === 'development' ? err.message : '请稍后重试'
        });
      });

      // 启动服务器
      const server = app.listen(PORT, 'localhost', (err) => {
        if (err) {
          reject(err);
        } else {
          console.log(`服务器运行在 http://localhost:${PORT}`);
          resolve(server);
        }
      });

      // 优雅关闭
      process.on('SIGTERM', () => {
        console.log('收到 SIGTERM 信号，正在关闭服务器...');
        server.close(() => {
          console.log('服务器已关闭');
          db.close();
          process.exit(0);
        });
      });
    }
  });
}

// 初始化数据库
function initDatabase(db, callback) {
  db.serialize(() => {
    // 创建分类表
    db.run(`
      CREATE TABLE IF NOT EXISTS categories (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL UNIQUE,
        description TEXT,
        color TEXT DEFAULT '#3B82F6',
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // 创建命令表
    db.run(`
      CREATE TABLE IF NOT EXISTS commands (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        command TEXT NOT NULL,
        description TEXT,
        category_id INTEGER,
        tags TEXT,
        is_favorite BOOLEAN DEFAULT 0,
        usage_count INTEGER DEFAULT 0,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (category_id) REFERENCES categories (id) ON DELETE SET NULL
      )
    `);

    // 创建索引
    db.run(`CREATE INDEX IF NOT EXISTS idx_commands_category ON commands(category_id)`);
    db.run(`CREATE INDEX IF NOT EXISTS idx_commands_favorite ON commands(is_favorite)`);
    db.run(`CREATE INDEX IF NOT EXISTS idx_commands_name ON commands(name)`);

    // 创建命令执行历史表（智能功能扩展）
    db.run(`
      CREATE TABLE IF NOT EXISTS command_execution_history (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        command_id INTEGER NOT NULL,
        session_id TEXT NOT NULL,
        context_data TEXT NOT NULL,
        executed_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        success BOOLEAN DEFAULT 1,
        execution_time INTEGER,
        error_message TEXT,
        FOREIGN KEY (command_id) REFERENCES commands (id) ON DELETE CASCADE
      )
    `);

    // 创建终端会话表（智能功能扩展）
    db.run(`
      CREATE TABLE IF NOT EXISTS terminal_sessions (
        id TEXT PRIMARY KEY,
        app_name TEXT NOT NULL,
        window_title TEXT NOT NULL,
        working_directory TEXT,
        last_active DATETIME DEFAULT CURRENT_TIMESTAMP,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // 创建智能功能相关索引
    db.run(`CREATE INDEX IF NOT EXISTS idx_history_command ON command_execution_history(command_id)`);
    db.run(`CREATE INDEX IF NOT EXISTS idx_history_session ON command_execution_history(session_id)`);
    db.run(`CREATE INDEX IF NOT EXISTS idx_history_time ON command_execution_history(executed_at)`);
    db.run(`CREATE INDEX IF NOT EXISTS idx_sessions_active ON terminal_sessions(last_active)`);
    db.run(`CREATE INDEX IF NOT EXISTS idx_sessions_app ON terminal_sessions(app_name)`);

    // 插入默认分类
    const defaultCategories = [
      ['Git', 'Git 版本控制命令', '#F59E0B'],
      ['Docker', 'Docker 容器命令', '#3B82F6'],
      ['系统管理', '系统管理相关命令', '#10B981'],
      ['开发工具', '开发工具相关命令', '#8B5CF6'],
      ['网络工具', '网络相关命令', '#EF4444']
    ];

    let completed = 0;
    const total = defaultCategories.length;

    if (total === 0) {
      console.log('数据库初始化完成');
      callback();
      return;
    }

    defaultCategories.forEach(([name, description, color]) => {
      db.run(
        `INSERT OR IGNORE INTO categories (name, description, color) VALUES (?, ?, ?)`,
        [name, description, color],
        function(err) {
          if (err) {
            console.error('插入默认分类失败:', err);
          }
          completed++;
          if (completed === total) {
            console.log('数据库初始化完成');
            callback();
          }
        }
      );
    });
  });
}

module.exports = createServer;