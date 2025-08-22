const { app, BrowserWindow, Menu, Tray, globalShortcut, ipcMain, shell } = require('electron');
const path = require('path');
const fs = require('fs');
const isDev = process.env.NODE_ENV === 'development';

// 导入后端服务器
const createServer = require('./server/app');

// 导入新功能模块
const WindowDetector = require('./window-detector');
const FloatingPanel = require('./floating-panel');
const ContextAnalyzer = require('./context-analyzer');

let mainWindow;
let tray;
let server;
let windowDetector;
let floatingPanel;
let commandsCache = [];

// 创建主窗口
function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    minWidth: 800,
    minHeight: 600,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      enableRemoteModule: false,
      preload: path.join(__dirname, 'preload.js')
    },
    titleBarStyle: 'hiddenInset', // macOS 样式
    show: false, // 先不显示，等加载完成后再显示
    icon: path.join(__dirname, 'assets/icon.svg') // 应用图标
  });

  // 加载应用
  mainWindow.loadFile(path.join(__dirname, 'public/index.html'));
  if (isDev) {
    mainWindow.webContents.openDevTools();
  }

  // 窗口准备好后显示
  mainWindow.once('ready-to-show', () => {
    mainWindow.show();
  });

  // 窗口关闭时隐藏到托盘而不是退出
  mainWindow.on('close', (event) => {
    if (!app.isQuiting) {
      event.preventDefault();
      mainWindow.hide();
    }
  });

  // 处理外部链接
  mainWindow.webContents.setWindowOpenHandler(({ url }) => {
    shell.openExternal(url);
    return { action: 'deny' };
  });
}

// 创建系统托盘 - 暂时禁用
function createTray() {
  // 暂时注释掉托盘功能，避免图标文件不存在的错误
  console.log('托盘功能暂时禁用');
  /*
  const trayIcon = path.join(__dirname, 'assets/tray-icon.png');
  tray = new Tray(trayIcon);

  const contextMenu = Menu.buildFromTemplate([
    {
      label: '显示主窗口',
      click: () => {
        mainWindow.show();
        mainWindow.focus();
      }
    },
    {
      label: '重新加载',
      click: () => {
        mainWindow.reload();
      }
    },
    { type: 'separator' },
    {
      label: '退出',
      click: () => {
        app.isQuiting = true;
        app.quit();
      }
    }
  ]);

  tray.setContextMenu(contextMenu);
  tray.setToolTip('命令管理工具');

  // 双击托盘图标显示窗口
  tray.on('double-click', () => {
    mainWindow.show();
    mainWindow.focus();
  });
  */
}

// 创建应用菜单
function createMenu() {
  const template = [
    {
      label: '文件',
      submenu: [
        {
          label: '新建命令',
          accelerator: 'CmdOrCtrl+N',
          click: () => {
            mainWindow.webContents.send('menu-new-command');
          }
        },
        { type: 'separator' },
        {
          label: '退出',
          accelerator: process.platform === 'darwin' ? 'Cmd+Q' : 'Ctrl+Q',
          click: () => {
            app.isQuiting = true;
            app.quit();
          }
        }
      ]
    },
    {
      label: '编辑',
      submenu: [
        { role: 'undo', label: '撤销' },
        { role: 'redo', label: '重做' },
        { type: 'separator' },
        { role: 'cut', label: '剪切' },
        { role: 'copy', label: '复制' },
        { role: 'paste', label: '粘贴' },
        { role: 'selectall', label: '全选' }
      ]
    },
    {
      label: '查看',
      submenu: [
        { role: 'reload', label: '重新加载' },
        { role: 'forceReload', label: '强制重新加载' },
        { role: 'toggleDevTools', label: '开发者工具' },
        { type: 'separator' },
        { role: 'resetZoom', label: '实际大小' },
        { role: 'zoomIn', label: '放大' },
        { role: 'zoomOut', label: '缩小' },
        { type: 'separator' },
        { role: 'togglefullscreen', label: '全屏' }
      ]
    },
    {
      label: '窗口',
      submenu: [
        { role: 'minimize', label: '最小化' },
        { role: 'close', label: '关闭' }
      ]
    }
  ];

  // macOS 特殊处理
  if (process.platform === 'darwin') {
    template.unshift({
      label: app.getName(),
      submenu: [
        { role: 'about', label: '关于' },
        { type: 'separator' },
        { role: 'services', label: '服务' },
        { type: 'separator' },
        { role: 'hide', label: '隐藏' },
        { role: 'hideothers', label: '隐藏其他' },
        { role: 'unhide', label: '显示全部' },
        { type: 'separator' },
        { role: 'quit', label: '退出' }
      ]
    });
  }

  const menu = Menu.buildFromTemplate(template);
  Menu.setApplicationMenu(menu);
}

// 启动后端服务器
async function startServer() {
  try {
    server = await createServer();
    console.log('后端服务器已启动在端口 9091');
  } catch (error) {
    console.error('启动后端服务器失败:', error);
  }
}

// 初始化智能功能
function initializeSmartFeatures() {
  // 创建窗口检测器
  windowDetector = new WindowDetector();

  // 创建悬浮面板
  floatingPanel = new FloatingPanel();

  // 创建上下文分析器
  contextAnalyzer = new ContextAnalyzer();

  // 监听终端激活事件
  windowDetector.on('terminalActivated', async (window) => {
    console.log(`🎯 终端激活: ${window.owner.name} - ${window.title}`);
    
    // 分析当前终端上下文
    const context = await contextAnalyzer.analyzeTerminalContext(window);
    console.log('📊 终端上下文分析:', context);
    
    // 缓存当前上下文用于智能推荐
    currentTerminalContext = context;
    
    // 自动刷新命令缓存（基于上下文）
    await refreshCommandsCacheWithContext(context);
  });

  windowDetector.on('terminalDeactivated', (window) => {
    console.log('📱 终端失去焦点');
    // 隐藏悬浮面板
    if (floatingPanel.isVisible) {
      floatingPanel.hide();
    }
    // 清空上下文缓存
    currentTerminalContext = null;
  });

  // 监听窗口标题变化（用于实时上下文更新）
  windowDetector.on('windowTitleChanged', async (window) => {
    if (windowDetector.isTerminalActive) {
      const context = await contextAnalyzer.analyzeTerminalContext(window);
      currentTerminalContext = context;
      console.log('🔄 窗口标题更新，重新分析上下文:', context);
    }
  });

  // 开始监控
  windowDetector.startMonitoring();

  console.log('🚀 智能功能已初始化（增强版）');
}

// 加载命令数据
async function loadCommands() {
  try {
    const response = await fetch('http://localhost:9091/api/commands');
    if (response.ok) {
      const result = await response.json();
      if (result.success) {
        commandsCache = result.data;
        console.log(`📚 已加载 ${commandsCache.length} 个命令`);
      } else {
        console.error('❌ API返回失败:', result.error);
        commandsCache = [];
      }
    } else {
      console.error('❌ HTTP请求失败:', response.status);
      commandsCache = [];
    }
  } catch (error) {
    console.error('❌ 加载命令失败:', error.message);
    commandsCache = [];
  }
}

// 刷新命令缓存
async function refreshCommandsCache() {
  await loadCommands();
  console.log('🔄 命令缓存已刷新');
}

// 基于上下文刷新命令缓存
async function refreshCommandsCacheWithContext(context) {
  if (context && context.commandType) {
    console.log(`🎯 基于上下文刷新命令: ${context.commandType}`);
    // 这里可以根据上下文类型进行智能过滤或排序
    await refreshCommandsCache();
  } else {
    await refreshCommandsCache();
  }
}

// 读取更新日志
function readChangelog() {
  try {
    const changelogPath = path.join(__dirname, '..', 'CHANGELOG.md');
    if (fs.existsSync(changelogPath)) {
      const content = fs.readFileSync(changelogPath, 'utf8');
      // 提取版本信息和主要更新
      const versionMatch = content.match(/## v([\d.]+)/);
      const featuresMatch = content.match(/### ✨ 新增功能\s+([\s\S]*?)(?=###|##|$)/);
      
      if (versionMatch && featuresMatch) {
        return {
          version: versionMatch[1],
          features: featuresMatch[1].trim()
        };
      }
    }
  } catch (error) {
    console.error('❌ 读取更新日志失败:', error.message);
  }
  return null;
}

// 显示更新日志信息
function showChangelogInfo() {
  const changelog = readChangelog();
  if (changelog) {
    console.log('📋 系统更新日志:');
    console.log(`  版本: v${changelog.version}`);
    console.log('  主要更新:');
    console.log(changelog.features);
    console.log('📖 完整更新日志请查看 CHANGELOG.md 文件');
  } else {
    console.log('ℹ️ 更新日志文件不存在或格式不正确');
  }
}

// 应用准备就绪
app.whenReady().then(async () => {
  await startServer();
  createWindow();
  createTray();
  createMenu();
  
  // 显示更新日志信息
  showChangelogInfo();

  // 初始化智能功能
  initializeSmartFeatures();

  // 延迟加载命令数据，等服务器完全启动
  setTimeout(async () => {
    await loadCommands();
  }, 1000);

  // 注册全局快捷键
  globalShortcut.register('CommandOrControl+Shift+C', () => {
    if (mainWindow.isVisible()) {
      mainWindow.hide();
    } else {
      mainWindow.show();
      mainWindow.focus();
    }
  });

  // 注册悬浮面板快捷键
  globalShortcut.register('CommandOrControl+Shift+Space', async () => {
    console.log('🎯 快捷键触发悬浮面板');

    // 刷新命令缓存
    await refreshCommandsCache();

    // 显示悬浮面板
    floatingPanel.toggle(commandsCache);
  });

  // 注册智能检测快捷键（仅在终端激活时有效）
  globalShortcut.register('CommandOrControl+Shift+K', async () => {
    const terminalStatus = windowDetector.getTerminalStatus();

    if (terminalStatus.isActive) {
      console.log('🎯 终端智能面板触发');
      await refreshCommandsCache();
      floatingPanel.show(commandsCache);
    } else {
      console.log('⚠️ 当前不在终端环境，快捷键无效');
    }
  });

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    } else {
      mainWindow.show();
    }
  });
});

// 所有窗口关闭时
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

// 应用退出前清理
app.on('before-quit', () => {
  app.isQuiting = true;
  globalShortcut.unregisterAll();

  // 清理智能功能
  if (windowDetector) {
    windowDetector.stopMonitoring();
  }

  if (floatingPanel) {
    floatingPanel.destroy();
  }

  if (server) {
    server.close();
  }
});

// IPC 通信处理
ipcMain.handle('get-app-version', () => {
  return app.getVersion();
});

// 获取更新日志信息
ipcMain.handle('get-changelog', () => {
  return readChangelog();
});

ipcMain.handle('show-window', () => {
  mainWindow.show();
  mainWindow.focus();
});

ipcMain.handle('hide-window', () => {
  mainWindow.hide();
});

// 悬浮面板相关IPC
ipcMain.on('command-selected', (event, command) => {
  console.log(`📋 用户选择命令: ${command.name}`);

  if (floatingPanel) {
    floatingPanel.selectCommand(command);
  }

  // 更新命令使用统计
  updateCommandUsage(command.id);
});

ipcMain.on('hide-panel', () => {
  if (floatingPanel) {
    floatingPanel.hide();
  }
});

// 智能功能相关IPC
ipcMain.handle('get-terminal-status', () => {
  if (windowDetector) {
    return windowDetector.getTerminalStatus();
  }
  return { isActive: false, window: null };
});

ipcMain.handle('show-floating-panel', async () => {
  await refreshCommandsCache();
  if (floatingPanel) {
    floatingPanel.show(commandsCache);
  }
});

ipcMain.handle('refresh-commands', async () => {
  await refreshCommandsCache();
  return commandsCache;
});

// 更新命令使用统计
async function updateCommandUsage(commandId) {
  try {
    await fetch(`http://localhost:9091/api/commands/${commandId}/use`, {
      method: 'POST'
    });
    console.log(`📊 更新命令使用统计: ${commandId}`);
  } catch (error) {
    console.error('❌ 更新使用统计失败:', error.message);
  }
}
