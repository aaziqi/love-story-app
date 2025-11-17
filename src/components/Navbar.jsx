import { motion } from "framer-motion";
import { Heart, Home, BookOpen, Camera, Settings, Moon, Sun } from "lucide-react";
import { useEffect, useState } from "react";
import { getUser, onAuthChange, signIn, signOut, signUp } from '../services/db'
import AuthModal from './AuthModal'

export default function Navbar({ currentPage, onPageChange, darkMode, toggleDarkMode }) {
  const [isOpen, setIsOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [authOpen, setAuthOpen] = useState(false);

  useEffect(() => {
    let sub
    ;(async () => {
      const u = await getUser()
      setUser(u)
      sub = onAuthChange(setUser)
    })()
    return () => {
      sub?.unsubscribe?.()
    }
  }, [])

  const navItems = [
    { id: "home", label: "首页", icon: Home },
    { id: "stories", label: "故事", icon: BookOpen },
    { id: "gallery", label: "相册", icon: Camera },
    { id: "settings", label: "设置", icon: Settings }
  ];

  return (
    <motion.nav
      className="fixed top-0 left-0 right-0 z-50 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-b border-pink-100 dark:border-gray-700"
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <motion.div
            className="flex items-center space-x-2"
            whileHover={{ scale: 1.05 }}
          >
            <Heart className="text-deepPink" size={28} fill="currentColor" />
            <span className="text-xl font-bold text-deepPink font-love">
              LoveDiary
            </span>
          </motion.div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <motion.button
                  key={item.id}
                  onClick={() => onPageChange(item.id)}
                  className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-colors duration-200 ${
                    currentPage === item.id
                      ? "text-deepPink bg-lightPink"
                      : "text-gray-600 hover:text-deepPink hover:bg-lightPink/50"
                  }`}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Icon size={18} />
                  <span className="font-medium">{item.label}</span>
                </motion.button>
              );
            })}
            
            {/* Theme Toggle */}
            <motion.button
              onClick={toggleDarkMode}
              className="p-2 rounded-lg text-gray-600 hover:text-deepPink hover:bg-lightPink/50 transition-colors duration-200"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              {darkMode ? <Sun size={20} /> : <Moon size={20} />}
            </motion.button>

            {user ? (
              <div className="flex items-center space-x-3">
                <span className="text-gray-600 text-sm">{user.email}</span>
                <motion.button
                  onClick={async () => { await signOut(); setUser(null) }}
                  className="px-3 py-2 rounded-lg bg-lightPink text-deepPink hover:bg-pink-200"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  退出登录
                </motion.button>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <motion.button
                  onClick={() => setAuthOpen(true)}
                  className="px-3 py-2 rounded-lg bg-deepPink text-white hover:bg-pink-600"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  登录 / 注册
                </motion.button>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <motion.button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 rounded-lg text-gray-600 hover:text-deepPink hover:bg-lightPink/50"
              whileTap={{ scale: 0.95 }}
            >
              <div className="w-6 h-6 flex flex-col justify-center items-center">
                <motion.span
                  className="w-5 h-0.5 bg-current mb-1"
                  animate={{ rotate: isOpen ? 45 : 0, y: isOpen ? 6 : 0 }}
                />
                <motion.span
                  className="w-5 h-0.5 bg-current mb-1"
                  animate={{ opacity: isOpen ? 0 : 1 }}
                />
                <motion.span
                  className="w-5 h-0.5 bg-current"
                  animate={{ rotate: isOpen ? -45 : 0, y: isOpen ? -6 : 0 }}
                />
              </div>
            </motion.button>
          </div>
        </div>

        {/* Mobile Navigation */}
        <motion.div
          className="md:hidden"
          initial={false}
          animate={{ height: isOpen ? "auto" : 0 }}
          style={{ overflow: "hidden" }}
        >
          <div className="py-4 space-y-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <motion.button
                  key={item.id}
                  onClick={() => {
                    onPageChange(item.id);
                    setIsOpen(false);
                  }}
                  className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors duration-200 ${
                    currentPage === item.id
                      ? "text-deepPink bg-lightPink"
                      : "text-gray-600 hover:text-deepPink hover:bg-lightPink/50"
                  }`}
                  whileHover={{ x: 5 }}
                >
                  <Icon size={20} />
                  <span className="font-medium">{item.label}</span>
                </motion.button>
              );
            })}
            <motion.button
              onClick={toggleDarkMode}
              className="w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-gray-600 hover:text-deepPink hover:bg-lightPink/50 transition-colors duration-200"
              whileHover={{ x: 5 }}
            >
              {darkMode ? <Sun size={20} /> : <Moon size={20} />}
              <span className="font-medium">
                {darkMode ? "浅色模式" : "深色模式"}
              </span>
            </motion.button>

            {user ? (
              <motion.button
                onClick={async () => { await signOut(); setUser(null) }}
                className="w-full flex items-center justify-center space-x-3 px-4 py-3 rounded-lg bg-lightPink text-deepPink hover:bg-pink-200"
                whileHover={{ x: 5 }}
              >
                退出登录
              </motion.button>
            ) : (
              <div className="grid grid-cols-1 gap-2">
                <motion.button
                  onClick={() => setAuthOpen(true)}
                  className="w-full px-4 py-3 rounded-lg bg-deepPink text-white hover:bg-pink-600"
                  whileHover={{ x: 5 }}
                >
                  登录 / 注册
                </motion.button>
              </div>
            )}
          </div>
        </motion.div>
        <AuthModal open={authOpen} onClose={() => setAuthOpen(false)} onAuthed={setUser} />
      </div>
    </motion.nav>
  );
}