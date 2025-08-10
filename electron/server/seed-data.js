const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const fs = require('fs');

// 确保数据目录存在
const dataDir = path.join(__dirname, '../data');
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

// 连接数据库
const dbPath = path.join(dataDir, 'commands.db');
const db = new sqlite3.Database(dbPath);

// 新增分类数据
const newCategories = [
  { name: 'Node.js', description: 'Node.js 开发相关命令', color: '#68a063' },
  { name: 'Python', description: 'Python 开发和包管理', color: '#3776ab' },
  { name: 'React', description: 'React 开发工具', color: '#61dafb' },
  { name: '数据库', description: '数据库操作命令', color: '#336791' },
  { name: '服务器', description: '服务器管理和部署', color: '#ff6b35' },
  { name: '监控', description: '系统监控和性能分析', color: '#28a745' },
  { name: '安全', description: '安全相关工具', color: '#dc3545' },
  { name: '文件操作', description: '文件和目录管理', color: '#6f42c1' },
  { name: 'Web开发', description: 'Web开发工具', color: '#fd7e14' },
  { name: '测试', description: '测试和调试工具', color: '#20c997' }
];

// 丰富的命令数据
const newCommands = [
  // Node.js 相关
  { name: '查看Node版本', command: 'node --version', description: '显示当前Node.js版本', category_name: 'Node.js', tags: 'node,版本' },
  { name: '查看npm版本', command: 'npm --version', description: '显示npm版本信息', category_name: 'Node.js', tags: 'npm,版本' },
  { name: '安装依赖', command: 'npm install', description: '安装package.json中的所有依赖', category_name: 'Node.js', tags: 'npm,安装' },
  { name: '全局安装包', command: 'npm install -g <package>', description: '全局安装npm包', category_name: 'Node.js', tags: 'npm,全局' },
  { name: '启动开发服务器', command: 'npm run dev', description: '启动开发环境服务器', category_name: 'Node.js', tags: 'npm,开发' },
  { name: '构建项目', command: 'npm run build', description: '构建生产版本', category_name: 'Node.js', tags: 'npm,构建' },
  { name: '查看npm脚本', command: 'npm run', description: '显示所有可用的npm脚本', category_name: 'Node.js', tags: 'npm,脚本' },
  { name: '清理npm缓存', command: 'npm cache clean --force', description: '强制清理npm缓存', category_name: 'Node.js', tags: 'npm,缓存' },

  // Python 相关
  { name: '查看Python版本', command: 'python --version', description: '显示Python版本', category_name: 'Python', tags: 'python,版本' },
  { name: '安装pip包', command: 'pip install <package>', description: '使用pip安装Python包', category_name: 'Python', tags: 'pip,安装' },
  { name: '查看已安装包', command: 'pip list', description: '显示所有已安装的Python包', category_name: 'Python', tags: 'pip,列表' },
  { name: '创建虚拟环境', command: 'python -m venv venv', description: '创建Python虚拟环境', category_name: 'Python', tags: 'python,虚拟环境' },
  { name: '激活虚拟环境', command: 'source venv/bin/activate', description: '激活Python虚拟环境', category_name: 'Python', tags: 'python,虚拟环境' },
  { name: '生成requirements', command: 'pip freeze > requirements.txt', description: '生成依赖文件', category_name: 'Python', tags: 'pip,依赖' },
  { name: '安装requirements', command: 'pip install -r requirements.txt', description: '从requirements.txt安装依赖', category_name: 'Python', tags: 'pip,依赖' },

  // React 相关
  { name: '创建React应用', command: 'npx create-react-app my-app', description: '使用Create React App创建新项目', category_name: 'React', tags: 'react,创建' },
  { name: '启动React开发服务器', command: 'npm start', description: '启动React开发服务器', category_name: 'React', tags: 'react,开发' },
  { name: '构建React应用', command: 'npm run build', description: '构建React生产版本', category_name: 'React', tags: 'react,构建' },
  { name: '运行React测试', command: 'npm test', description: '运行React测试套件', category_name: 'React', tags: 'react,测试' },
  { name: '弹出React配置', command: 'npm run eject', description: '弹出Create React App配置', category_name: 'React', tags: 'react,配置' },

  // 数据库相关
  { name: '连接MySQL', command: 'mysql -u root -p', description: '连接到MySQL数据库', category_name: '数据库', tags: 'mysql,连接' },
  { name: '导出MySQL数据库', command: 'mysqldump -u root -p database_name > backup.sql', description: '导出MySQL数据库', category_name: '数据库', tags: 'mysql,备份' },
  { name: '导入MySQL数据库', command: 'mysql -u root -p database_name < backup.sql', description: '导入MySQL数据库', category_name: '数据库', tags: 'mysql,恢复' },
  { name: '启动MongoDB', command: 'mongod', description: '启动MongoDB服务', category_name: '数据库', tags: 'mongodb,启动' },
  { name: '连接MongoDB', command: 'mongo', description: '连接到MongoDB', category_name: '数据库', tags: 'mongodb,连接' },
  { name: '启动Redis', command: 'redis-server', description: '启动Redis服务器', category_name: '数据库', tags: 'redis,启动' },
  { name: '连接Redis', command: 'redis-cli', description: '连接到Redis', category_name: '数据库', tags: 'redis,连接' },

  // 服务器相关
  { name: '查看端口占用', command: 'lsof -i :3000', description: '查看3000端口占用情况', category_name: '服务器', tags: '端口,网络' },
  { name: '杀死进程', command: 'kill -9 <PID>', description: '强制杀死指定进程', category_name: '服务器', tags: '进程,杀死' },
  { name: '查看系统负载', command: 'top', description: '实时查看系统进程和负载', category_name: '服务器', tags: '系统,负载' },
  { name: '查看内存使用', command: 'free -h', description: '查看内存使用情况', category_name: '服务器', tags: '内存,系统' },
  { name: '查看磁盘使用', command: 'df -h', description: '查看磁盘空间使用情况', category_name: '服务器', tags: '磁盘,空间' },
  { name: '启动Nginx', command: 'sudo nginx', description: '启动Nginx服务器', category_name: '服务器', tags: 'nginx,启动' },
  { name: '重启Nginx', command: 'sudo nginx -s reload', description: '重新加载Nginx配置', category_name: '服务器', tags: 'nginx,重启' },

  // 监控相关
  { name: '实时查看日志', command: 'tail -f /var/log/nginx/access.log', description: '实时查看Nginx访问日志', category_name: '监控', tags: '日志,nginx' },
  { name: '查看系统信息', command: 'uname -a', description: '显示系统详细信息', category_name: '监控', tags: '系统,信息' },
  { name: '查看网络连接', command: 'netstat -tulpn', description: '显示网络连接状态', category_name: '监控', tags: '网络,连接' },
  { name: '查看CPU信息', command: 'cat /proc/cpuinfo', description: '显示CPU详细信息', category_name: '监控', tags: 'cpu,硬件' },
  { name: '查看进程树', command: 'pstree', description: '以树形结构显示进程', category_name: '监控', tags: '进程,树形' },

  // 安全相关
  { name: '生成SSH密钥', command: 'ssh-keygen -t rsa -b 4096', description: '生成RSA SSH密钥对', category_name: '安全', tags: 'ssh,密钥' },
  { name: '复制SSH公钥', command: 'cat ~/.ssh/id_rsa.pub', description: '显示SSH公钥内容', category_name: '安全', tags: 'ssh,公钥' },
  { name: 'SSH连接服务器', command: 'ssh user@hostname', description: 'SSH连接到远程服务器', category_name: '安全', tags: 'ssh,连接' },
  { name: '查看登录日志', command: 'last', description: '查看用户登录历史', category_name: '安全', tags: '日志,登录' },
  { name: '更改文件权限', command: 'chmod 755 filename', description: '更改文件权限', category_name: '安全', tags: '权限,文件' },

  // 文件操作相关
  { name: '创建目录', command: 'mkdir -p path/to/directory', description: '递归创建目录', category_name: '文件操作', tags: '目录,创建' },
  { name: '复制文件', command: 'cp source destination', description: '复制文件或目录', category_name: '文件操作', tags: '复制,文件' },
  { name: '移动文件', command: 'mv source destination', description: '移动或重命名文件', category_name: '文件操作', tags: '移动,重命名' },
  { name: '删除文件', command: 'rm -rf directory', description: '递归删除目录和文件', category_name: '文件操作', tags: '删除,目录' },
  { name: '查找文件', command: 'find . -name "*.js"', description: '查找指定类型的文件', category_name: '文件操作', tags: '查找,文件' },
  { name: '文件内容搜索', command: 'grep -r "pattern" .', description: '在文件中搜索文本模式', category_name: '文件操作', tags: '搜索,文本' },
  { name: '压缩文件', command: 'tar -czf archive.tar.gz directory/', description: '创建压缩包', category_name: '文件操作', tags: '压缩,打包' },
  { name: '解压文件', command: 'tar -xzf archive.tar.gz', description: '解压tar.gz文件', category_name: '文件操作', tags: '解压,文件' },

  // Web开发相关
  { name: '启动HTTP服务器', command: 'python -m http.server 8000', description: '启动简单的HTTP服务器', category_name: 'Web开发', tags: 'http,服务器' },
  { name: '测试API接口', command: 'curl -X GET http://localhost:3000/api', description: '使用curl测试API', category_name: 'Web开发', tags: 'curl,api' },
  { name: 'POST请求测试', command: 'curl -X POST -H "Content-Type: application/json" -d \'{"key":"value"}\' http://localhost:3000/api', description: '发送POST请求', category_name: 'Web开发', tags: 'curl,post' },
  { name: '查看HTTP头', command: 'curl -I http://example.com', description: '只获取HTTP响应头', category_name: 'Web开发', tags: 'curl,头部' },
  { name: '下载文件', command: 'wget http://example.com/file.zip', description: '使用wget下载文件', category_name: 'Web开发', tags: 'wget,下载' },

  // 测试相关
  { name: '运行Jest测试', command: 'npm test', description: '运行Jest测试套件', category_name: '测试', tags: 'jest,测试' },
  { name: '测试覆盖率', command: 'npm test -- --coverage', description: '运行测试并生成覆盖率报告', category_name: '测试', tags: 'jest,覆盖率' },
  { name: '监听测试', command: 'npm test -- --watch', description: '监听文件变化并自动运行测试', category_name: '测试', tags: 'jest,监听' },
  { name: '运行特定测试', command: 'npm test -- --testNamePattern="pattern"', description: '运行匹配模式的测试', category_name: '测试', tags: 'jest,特定' },
  { name: 'ESLint检查', command: 'npx eslint .', description: '运行ESLint代码检查', category_name: '测试', tags: 'eslint,检查' },
  { name: '修复ESLint', command: 'npx eslint . --fix', description: '自动修复ESLint问题', category_name: '测试', tags: 'eslint,修复' }
];

function seedData() {
  console.log('开始添加分类和命令数据...');

  // 添加新分类
  const insertCategoryStmt = `INSERT OR IGNORE INTO categories (name, description, color) VALUES (?, ?, ?)`;

  let categoryCount = 0;

  function addCategories(index = 0) {
    if (index >= newCategories.length) {
      // 分类添加完成，开始添加命令
      addCommands();
      return;
    }

    const category = newCategories[index];
    db.run(insertCategoryStmt, [category.name, category.description, category.color], function(err) {
      if (err) {
        console.error(`添加分类失败 ${category.name}:`, err);
      } else {
        console.log(`添加分类: ${category.name}`);
        categoryCount++;
      }
      addCategories(index + 1);
    });
  }

  function addCommands() {
    // 获取所有分类ID映射
    db.all('SELECT id, name FROM categories', [], (err, categories) => {
      if (err) {
        console.error('获取分类失败:', err);
        db.close();
        return;
      }

      const categoryMap = {};
      categories.forEach(cat => {
        categoryMap[cat.name] = cat.id;
      });

      // 添加新命令
      const insertCommandStmt = `INSERT OR IGNORE INTO commands (name, command, description, category_id, tags, is_favorite, usage_count) VALUES (?, ?, ?, ?, ?, 0, 0)`;

      let commandCount = 0;
      let processedCommands = 0;

      function addCommand(index = 0) {
        if (index >= newCommands.length) {
          console.log('数据添加完成！');
          console.log(`总共添加了 ${categoryCount} 个分类和 ${commandCount} 个命令`);
          db.close();
          return;
        }

        const command = newCommands[index];
        const categoryId = categoryMap[command.category_name];

        if (categoryId) {
          db.run(insertCommandStmt, [
            command.name,
            command.command,
            command.description,
            categoryId,
            command.tags
          ], function(err) {
            if (err) {
              console.error(`添加命令失败 ${command.name}:`, err);
            } else {
              console.log(`添加命令: ${command.name}`);
              commandCount++;
            }
            processedCommands++;
            addCommand(index + 1);
          });
        } else {
          console.warn(`找不到分类 ${command.category_name}，跳过命令: ${command.name}`);
          processedCommands++;
          addCommand(index + 1);
        }
      }

      addCommand();
    });
  }

  addCategories();
}

// 运行数据填充
seedData();
