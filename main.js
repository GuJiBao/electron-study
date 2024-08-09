// 导入必要的Electron模块
const { app, BrowserWindow, nativeTheme, ipcMain } = require('electron');
const path = require('path');

// 定义默认窗口配置
const defaultWindowOptions = {
  width: 800,
  height: 600,
  minWidth: 400,
  minHeight: 300,
  center: true,
  titleBarStyle: 'hiddenInset',
  webPreferences: {
    preload: path.join(__dirname, 'preload.js'), // 预加载脚本路径，用于安全隔离主进程与渲染进程
    nodeIntegration: false, // 默认关闭Node集成，可根据项目需求开启
    contextIsolation: true, // 开启上下文隔离，增强安全性
    enableRemoteModule: false, // 关闭远程模块，增强安全性
    spellcheck: true, // 启用拼写检查
    devTools: process.env.NODE_ENV !== 'production', // 开发环境下启用开发者工具
  },
};

// 应用程序生命周期事件处理
app.whenReady().then(() => {
  ipcMain.handle('ping', () => 'ping')
  createWindow()
  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});


// 创建主窗口函数
function createWindow(customOptions = {}) {
  // 合并用户提供的自定义选项与默认窗口配置
  const windowOptions = { ...defaultWindowOptions, ...customOptions };

  // 创建主窗口
  const mainWindow = new BrowserWindow(windowOptions);

  // 加载应用入口HTML文件
  mainWindow.loadFile(path.join(__dirname, 'index.html'));

  // 开发环境下开启自动刷新
  if (process.env.NODE_ENV === 'development') {
    require('electron-reload')(__dirname, {
      electron: path.join(__dirname, '..', 'node_modules', '.bin', 'electron'),
    });
    mainWindow.webContents.on('did-frame-finish-load', () => {
      mainWindow.webContents.once('devtools-opened', () => {
        mainWindow.focus();
      });
      mainWindow.webContents.openDevTools({ mode: 'detach' });
    });
  }

  // 监听窗口关闭事件，释放资源
  mainWindow.on('closed', () => {
    mainWindow = null;
  });

  // 保持原生主题与应用程序主题一致（仅适用于macOS）
  if (process.platform === 'darwin') {
    nativeTheme.on('updated', () => {
      mainWindow.webContents.send('native-theme-updated', nativeTheme.shouldUseDarkColors);
    });
  }
}

// 导出启动方法供外部调用
module.exports = createWindow;