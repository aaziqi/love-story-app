import { useState, useEffect, lazy, Suspense } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import ErrorBoundary from "./components/ErrorBoundary";
const Home = lazy(() => import("./pages/Home"));
const StoryPage = lazy(() => import("./pages/StoryPage"));
const GalleryPage = lazy(() => import("./pages/GalleryPage"));
const SettingsPage = lazy(() => import("./pages/SettingsPage"));
import AuthPage from "./pages/AuthPage";
import { getUser, onAuthChange } from "./services/db";

function App() {
  const [currentPage, setCurrentPage] = useState("home");
  const [darkMode, setDarkMode] = useState(false);
  const [user, setUser] = useState(null);

  // 页面组件映射
  const pages = {
    home: Home,
    stories: StoryPage,
    gallery: GalleryPage,
    settings: SettingsPage
  };

  const CurrentPageComponent = pages[currentPage];

  // 页面切换动画配置
  const pageVariants = {
    initial: {
      opacity: 0,
      x: 100,
      scale: 0.95
    },
    in: {
      opacity: 1,
      x: 0,
      scale: 1
    },
    out: {
      opacity: 0,
      x: -100,
      scale: 0.95
    }
  };

  const pageTransition = {
    type: "tween",
    ease: "anticipate",
    duration: 0.5
  };

  // 处理页面切换
  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  // 切换主题
  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  // 应用主题类
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [darkMode]);

  useEffect(() => {
    let sub
    ;(async () => {
      const u = await getUser()
      setUser(u)
      sub = onAuthChange(setUser)
    })()
    return () => { sub?.unsubscribe?.() }
  }, [])

  if (!user) {
    return (
      <ErrorBoundary>
        <div className={`min-h-screen ${darkMode ? "dark" : ""}`}>
          <AuthPage onAuthed={setUser} />
        </div>
      </ErrorBoundary>
    );
  }

  return (
    <ErrorBoundary>
    <div className={`min-h-screen ${darkMode ? "dark" : ""}`}>
      {/* 背景装饰 */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        {/* 浮动爱心 */}
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute text-pink-200 opacity-30"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -30, 0],
              rotate: [0, 10, -10, 0],
              scale: [1, 1.2, 1]
            }}
            transition={{
              duration: 4 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 2
            }}
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
            </svg>
          </motion.div>
        ))}
      </div>

      {/* 导航栏 */}
      <Navbar
        currentPage={currentPage}
        onPageChange={handlePageChange}
        darkMode={darkMode}
        toggleDarkMode={toggleDarkMode}
      />

      {/* 主要内容区域 */}
      <main className="relative z-10 pt-16">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentPage}
            initial="initial"
            animate="in"
            exit="out"
            variants={pageVariants}
            transition={pageTransition}
          >
            <Suspense fallback={<div className="text-center py-12 text-gray-500">正在加载...</div>}>
              <CurrentPageComponent onPageChange={handlePageChange} />
            </Suspense>
          </motion.div>
        </AnimatePresence>
      </main>

      {/* 页脚 */}
      <Footer />

      {/* 返回顶部按钮 */}
      <motion.button
        className="fixed bottom-8 right-8 p-3 bg-deepPink text-white rounded-full shadow-lg hover:shadow-xl transition-shadow z-50"
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        initial={{ opacity: 0, y: 100 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1 }}
      >
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="m18 15-6-6-6 6"/>
        </svg>
      </motion.button>
    </div>
    </ErrorBoundary>
  );
}

export default App;