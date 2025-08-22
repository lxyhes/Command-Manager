# robotjs macOS 辅助功能权限设置指南

## 问题描述

您的应用使用了 `robotjs` 库来自动执行键盘操作（粘贴命令到终端），但在 macOS 上需要授予辅助功能权限才能正常工作。

## 症状

- 命令选择后无法自动粘贴到终端
- 需要手动按 Cmd+V 粘贴命令
- 应用可能显示 "robotjs未正确加载，请检查辅助功能权限" 的错误

## 解决方案

### 方法一：通过系统设置授予权限

1. 打开 **系统设置** (System Settings)
2. 进入 **隐私与安全性** (Privacy & Security)
3. 选择 **辅助功能** (Accessibility)
4. 点击左下角的 🔒 图标解锁设置（需要输入密码）
5. 点击 **+** 按钮添加应用
6. 找到并选择您的应用（通常在 `/Applications` 目录或开发构建位置）
7. 确保应用旁边的复选框被选中
8. 重启应用

### 方法二：通过终端命令授予权限（推荐开发者）

```bash
# 查看当前已授予辅助功能权限的应用
sqlite3 ~/Library/Application\ Support/com.apple.TCC/TCC.db "SELECT * FROM access WHERE service = 'kTCCServiceAccessibility';"

# 授予权限（需要替换为实际应用路径）
sudo sqlite3 ~/Library/Application\ Support/com.apple.TCC/TCC.db "INSERT INTO access VALUES('kTCCServiceAccessibility','你的应用BundleID',0,1,1,NULL,NULL,NULL,'UNUSED',NULL,0,1541440109);"
```

### 方法三：重新安装应用

有时删除应用并重新安装可以触发系统提示授予权限。

## 验证权限是否生效

运行以下命令检查权限状态：

```bash
# 检查是否有应用被授予辅助功能权限
osascript -e 'tell application "System Events" to get the name of every process whose accessibility access is true'
```

如果输出为空或没有包含您的应用，说明权限尚未授予。

## 备用方案

如果无法授予权限，应用会自动切换到备用模式：
- 命令会被复制到剪贴板
- 显示通知提示手动粘贴
- 提供更明确的用户指导

## 技术支持

如果以上方法都无法解决问题，请检查：
1. macOS 版本是否支持辅助功能API
2. 应用是否签名（未签名的应用可能有权限限制）
3. 系统完整性保护(SIP)状态

---
*最后更新: 2025年*