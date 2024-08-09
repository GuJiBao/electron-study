// 文件名：electron-utils.js

// 导入必要的Electron模块
const { dialog, Notification, BrowserWindow } = require('electron');

/**
 * 封装打开文件对话框的公共方法
 * @param {string} title 对话框标题
 * @param {string[]} filters 文件类型过滤器，如 [{name: 'Images', extensions: ['jpg', 'png', 'gif']}]
 * @returns {Promise<string>} 返回选定文件的路径，未选择则返回空字符串
 */
async function openFileDialog(title, filters) {
  const result = await dialog.showOpenDialog({
    title,
    filters,
    properties: ['openFile'],
  });

  return result.canceled ? '' : result.filePaths[0];
}

/**
 * 封装显示通知的公共方法
 * @param {string} title 通知标题
 * @param {string} body 通知内容
 * @returns {Notification} 返回创建的通知对象
 */
function showNotification(title, body) {
  const notification = new Notification({ title, body });
  notification.show();
  return notification;
}

/**
 * 封装获取当前窗口尺寸的公共方法
 * @returns {{width: number, height: number}} 返回包含窗口宽度和高度的对象
 */
function getWindowSize() {
  const window = BrowserWindow.getFocusedWindow();
  if (window) {
    const { width, height } = window.getBounds();
    return { width, height };
  } else {
    throw new Error('No focused window found.');
  }
}

module.exports = {
  openFileDialog,
  showNotification,
  getWindowSize,
};