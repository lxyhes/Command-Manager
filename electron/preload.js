const { contextBridge, ipcRenderer } = require('electron');

// 向渲染进程暴露安全的 API
contextBridge.exposeInMainWorld('electronAPI', {
  // 应用信息
  getAppVersion: () => ipcRenderer.invoke('get-app-version'),
  
  // 窗口控制
  showWindow: () => ipcRenderer.invoke('show-window'),
  hideWindow: () => ipcRenderer.invoke('hide-window'),
  
  // 监听菜单事件
  onMenuNewCommand: (callback) => {
    ipcRenderer.on('menu-new-command', callback);
  },
  
  // 移除监听器
  removeAllListeners: (channel) => {
    ipcRenderer.removeAllListeners(channel);
  },
  
  // 平台信息
  platform: process.platform,
  
  // 剪贴板操作（通过主进程）
  writeToClipboard: (text) => ipcRenderer.invoke('write-to-clipboard', text),
  
  // 通知
  showNotification: (title, body) => ipcRenderer.invoke('show-notification', { title, body })
});

// 为开发环境暴露一些调试工具
if (process.env.NODE_ENV === 'development') {
  contextBridge.exposeInMainWorld('electronDev', {
    openDevTools: () => ipcRenderer.invoke('open-dev-tools')
  });
}
