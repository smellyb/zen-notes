# 📌 桌面便签 (Desktop Sticky Notes)

轻量优雅的桌面便签与长条待办工具，支持自由拖拽缩放、条状/卡片双形态、一键防误触锁定与多色彩主题。

---

## 🚀 如何打包生成 Windows `.exe` 文件

本项目已完整配置 **Electron** 与 **electron-builder**，支持一键打包生成两种 Windows 程序：
1. **免安装绿色单文件版（Portable `.exe`）**：双击即可直接运行，无需安装，即开即用。
2. **标准安装包版（Setup Installer `.exe`）**：支持创建桌面快捷方式与开始菜单。

### 本地一键打包步骤：

1. **拉取代码并进入目录**：
   ```bash
   git clone <你的GitHub仓库地址>
   cd desktop-sticky-notes
   ```

2. **安装依赖**：
   ```bash
   npm install
   ```

3. **执行一键打包命令**：
   ```bash
   npm run build:exe
   ```

4. **获取 `.exe` 文件**：
   打包完成后，在项目根目录的 **`release/`** 文件夹中即可找到生成的 `.exe` 文件：
   - 📦 `桌面便签 1.0.0.exe`（绿色便携版，直接双击运行）
   - 💻 `桌面便签 Setup 1.0.0.exe`（Windows 安装向导版）

---

## ⚡ 自动打包（通过 GitHub Actions）

如果你希望直接在 GitHub 上自动生成并下载 `.exe`，无需在自己电脑配置编译环境：
1. 将项目推送到 GitHub。
2. 项目内已配置 GitHub Actions 自动构建工作流。
3. 进入 GitHub 仓库的 **Actions** 标签页，或打一个 Release Tag，GitHub 将会自动为你云端编译并提供 `.exe` 文件的直接下载链接！

---

## 🛠️ 本地开发预览

```bash
# 启动网页版开发服务
npm run dev

# 或在本地桌面窗口中启动预览
npm run electron:dev
```
