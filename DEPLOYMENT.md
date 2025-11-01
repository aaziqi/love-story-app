# 💖 LoveDiary 部署指南

## Vercel 部署步骤

### 1. 准备工作
- 确保项目已推送到 GitHub 仓库
- 注册 Vercel 账号 (https://vercel.com)

### 2. 部署到 Vercel

#### 方法一：通过 Vercel 网站部署
1. 登录 Vercel 控制台
2. 点击 "New Project"
3. 选择你的 GitHub 仓库
4. Vercel 会自动检测到这是一个 Vite 项目
5. 点击 "Deploy" 开始部署

#### 方法二：通过 Vercel CLI 部署
```bash
# 安装 Vercel CLI
npm i -g vercel

# 登录 Vercel
vercel login

# 部署项目
vercel

# 部署到生产环境
vercel --prod
```

### 3. 环境变量配置（如需要）
在 Vercel 项目设置中添加环境变量：
- `NODE_ENV=production`

### 4. 自定义域名（可选）
在 Vercel 项目设置的 "Domains" 部分添加自定义域名

## GitHub Pages 部署步骤

### 1. 安装 gh-pages
```bash
npm install --save-dev gh-pages
```

### 2. 修改 package.json
在 scripts 中添加：
```json
{
  "scripts": {
    "predeploy": "npm run build",
    "deploy": "gh-pages -d dist"
  }
}
```

### 3. 部署
```bash
npm run deploy
```

### 4. 配置 GitHub Pages
1. 进入 GitHub 仓库设置
2. 找到 "Pages" 部分
3. 选择 "gh-pages" 分支作为源

## 项目特性
- ✨ 响应式设计，支持移动端和桌面端
- 🎨 优雅的动画效果和过渡
- 🌙 深色/浅色主题切换
- 📱 PWA 支持（可添加到主屏幕）
- 💝 浪漫的爱情记录功能

## 技术栈
- React 18
- Vite
- TailwindCSS
- Framer Motion
- Lucide React

## 本地开发
```bash
# 安装依赖
npm install

# 启动开发服务器
npm run dev

# 构建项目
npm run build

# 预览构建结果
npm run preview
```