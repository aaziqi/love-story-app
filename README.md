# 💖 LoveDiary — 恋爱记录册项目

## 🌈 项目简介
**LoveDiary** 是一个浪漫的网页应用，用于记录恋爱天数、分享故事、展示相册和纪念日等。  
用户可以通过网页随时查看恋爱进程，像翻阅一本充满回忆的相册。

✨ **设计目标**  
- 精致的视觉效果（参考 bienvillecapital.com / toolofna.com）
- 动态的页面动效
- 可在任意设备访问
- 自动计算恋爱天数
- 可添加故事和图片，成为属于两人的“爱情档案册”

---

## 🧩 功能模块

| 模块 | 描述 | 状态 |
|------|------|------|
| 💕 恋爱计时器 | 自动计算恋爱天数 | ✅ |
| 📖 故事记录 | 添加恋爱故事、图片 | ✅ |
| 🖼️ 相册墙 | 展示恋爱照片瀑布流 | ✅ |
| 📅 纪念日提醒 | 距离下一纪念日天数 | ✅ |
| 🌙 夜间主题 | 支持主题切换 | ✅ |
| ☁️ 数据存储 | LocalStorage / Firebase | 🚧 |
| 💬 留言板 | 双方留言互动 | 🚧 |
| 🌍 公网部署 | 部署到 Vercel | ✅ |

---

## ⚙️ 技术栈

| 分类 | 使用技术 | 说明 |
|------|-----------|------|
| 前端框架 | React + Vite | 快速构建与开发 |
| 样式系统 | TailwindCSS | 响应式与简洁样式 |
| 动效 | Framer Motion | 细腻动画 |
| 图标系统 | Lucide React / Lottie | 精美图标与动效 |
| 数据存储 | LocalStorage / Firebase | 本地或云同步 |
| 部署方案 | Vercel | 免费自动化部署 |

---

## 📁 目录结构

```
love-diary/
 ├── src/
 │   ├── components/
 │   │   ├── Timer.jsx
 │   │   ├── StoryCard.jsx
 │   │   ├── Gallery.jsx
 │   │   ├── Navbar.jsx
 │   │   ├── Footer.jsx
 │   │   └── ThemeToggle.jsx
 │   │
 │   ├── pages/
 │   │   ├── Home.jsx
 │   │   ├── GalleryPage.jsx
 │   │   ├── StoryPage.jsx
 │   │   └── SettingsPage.jsx
 │   │
 │   ├── hooks/
 │   │   └── useLoveTimer.js
 │   │
 │   ├── assets/
 │   │   ├── bg.mp3
 │   │   ├── hearts.json
 │   │   └── images/
 │   │
 │   ├── App.jsx
 │   ├── main.jsx
 │   └── index.css
 │
 ├── public/
 │   └── favicon.ico
 │
 ├── vercel.json
 ├── tailwind.config.js
 ├── postcss.config.js
 ├── vite.config.js
 ├── package.json
 └── README.md
```

---

## 💻 开发环境搭建

### 1️⃣ 初始化项目
```bash
npm create vite@latest love-diary -- --template react
cd love-diary
npm install
```

### 2️⃣ 安装依赖
```bash
npm install framer-motion lucide-react react-router-dom
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p
```

### 3️⃣ 配置 TailwindCSS
在 `tailwind.config.js` 中添加：
```js
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        lovePink: '#f5a3b5',
        softWhite: '#fff7f9'
      },
    },
  },
  plugins: [],
};
```

在 `index.css` 中加入：
```css
@tailwind base;
@tailwind components;
@tailwind utilities;
```

### 4️⃣ 启动本地服务
```bash
npm run dev
```
访问：[http://localhost:5173](http://localhost:5173)

---

## 🪄 核心功能示例

### `useLoveTimer.js`
```js
import { useEffect, useState } from "react";

export default function useLoveTimer(startDate) {
  const [days, setDays] = useState(0);

  useEffect(() => {
    const updateDays = () => {
      const start = new Date(startDate);
      const now = new Date();
      const diff = Math.floor((now - start) / (1000 * 60 * 60 * 24));
      setDays(diff);
    };
    updateDays();
    const timer = setInterval(updateDays, 1000 * 60 * 60);
    return () => clearInterval(timer);
  }, [startDate]);

  return days;
}
```

### `Timer.jsx`
```jsx
import useLoveTimer from "../hooks/useLoveTimer";
import { motion } from "framer-motion";

export default function Timer() {
  const days = useLoveTimer("2023-05-01");
  return (
    <motion.div
      className="text-center text-4xl font-bold text-lovePink"
      animate={{ scale: [1, 1.05, 1] }}
      transition={{ duration: 2, repeat: Infinity }}
    >
      ❤️ 我们已经相爱 {days} 天啦 ❤️
    </motion.div>
  );
}
```

---

## 🌍 部署到 Vercel

### 1️⃣ 添加 `vercel.json`
```json
{
  "rewrites": [
    { "source": "/(.*)", "destination": "/" }
  ]
}
```

### 2️⃣ 构建命令
- **Build Command**: `npm run build`  
- **Output Directory**: `dist`  
- **Framework Preset**: `Vite`

### 3️⃣ 部署步骤
```bash
git add .
git commit -m "init love diary project"
git push
```

登录 [Vercel Dashboard](https://vercel.com/)，导入该仓库后自动部署。  
访问结果示例：
```
https://love-diary.vercel.app/
```

---

## 🧑‍💻 开发规范

1. 使用函数式组件与 Hooks  
2. 组件命名：`PascalCase`（首字母大写）  
3. 样式全部使用 TailwindCSS  
4. 动效使用 Framer Motion  
5. 每个功能模块使用单独分支开发  
6. 提交规范：
   ```
   feat(timer): add love timer component
   fix(router): update route config
   ```

---

## 📅 开发阶段计划

| 阶段 | 目标 | 时间 |
|------|------|------|
| 第一阶段 | 构建基础框架 + 首页计时器 | 3 天 |
| 第二阶段 | 故事与相册模块 | 5 天 |
| 第三阶段 | 纪念日与主题系统 | 4 天 |
| 第四阶段 | 部署与优化视觉 | 2 天 |

---

## 🌸 未来拓展

| 模块 | 描述 |
|------|------|
| Firebase 云存储 | 实现登录与同步 |
| AI 自动回忆生成 | 自动生成恋爱纪念文字 |
| PWA 支持 | 离线访问 + 桌面图标 |
| 音乐播放器 | 背景音乐系统 |
| 分享功能 | 一键生成纪念海报 |

---

## ❤️ 致谢
感谢你的爱与陪伴，这个项目献给我们。  
“时光会褪去一切色彩，但爱会让回忆永恒。”

---

© 2025 LoveDiary Team | Design & Dev by Trae + Aaziqi
