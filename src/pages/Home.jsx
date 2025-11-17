import { motion } from "framer-motion";
import { useState } from "react";
import { Heart, Calendar, Clock, Sparkles, Camera, BookOpen, Settings, CheckCircle } from "lucide-react";
import Timer from "../components/Timer";
import { useSettings } from "../hooks/useLocalStorage";
import MoodHistory from "../components/MoodHistory";
import { createMoodRemote } from "../services/db";
import { useMilestones } from "../hooks/useLocalStorage";

export default function Home({ onPageChange }) {
  const { settings } = useSettings();
  const [feedback, setFeedback] = useState("");
  const { milestones, addMilestone, deleteMilestone } = useMilestones();
  const [newMilestone, setNewMilestone] = useState({ date: "", event: "", emoji: "💕" });

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        delayChildren: 0.3,
        staggerChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100
      }
    }
  };

  const floatingVariants = {
    animate: {
      y: [-10, 10, -10],
      rotate: [0, 5, -5, 0],
      transition: {
        duration: 6,
        repeat: Infinity,
        ease: "easeInOut"
      }
    }
  };

  return (
    <motion.div
      className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-indigo-50 dark:from-gray-900 dark:via-purple-900 dark:to-indigo-900 relative overflow-hidden"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* 动态背景装饰 */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          className="absolute top-20 left-10 w-32 h-32 bg-pink-200/30 dark:bg-pink-500/20 rounded-full blur-xl"
          variants={floatingVariants}
          animate="animate"
        />
        <motion.div
          className="absolute top-40 right-20 w-24 h-24 bg-purple-200/30 dark:bg-purple-500/20 rounded-full blur-xl"
          variants={floatingVariants}
          animate="animate"
          style={{ animationDelay: "2s" }}
        />
        <motion.div
          className="absolute bottom-32 left-1/4 w-40 h-40 bg-indigo-200/30 dark:bg-indigo-500/20 rounded-full blur-xl"
          variants={floatingVariants}
          animate="animate"
          style={{ animationDelay: "4s" }}
        />
      </div>

      <div className="relative z-10 container mx-auto px-4 py-8">
        {/* 主要内容区域 - 窗口式布局 */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 h-full">
          
          {/* 左侧主窗口 */}
          <motion.div
            className="lg:col-span-8 space-y-6"
            variants={itemVariants}
          >
            {/* 欢迎卡片 */}
            <motion.div
              className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-md rounded-3xl p-8 shadow-xl border border-white/20 dark:border-gray-700/20"
              whileHover={{ scale: 1.02, y: -5 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <div className="flex items-center justify-between mb-6">
                <div>
                  <motion.h1
                    className="text-4xl font-bold bg-gradient-to-r from-pink-500 to-purple-600 bg-clip-text text-transparent mb-2"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.5 }}
                  >
                    我们的爱情故事
                  </motion.h1>
                  <motion.p
                    className="text-gray-600 dark:text-gray-300 text-lg"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.7 }}
                  >
                    记录每一个美好的瞬间
                  </motion.p>
                </div>
                <motion.div
                  className="relative"
                  whileHover={{ rotate: 360 }}
                  transition={{ duration: 0.6 }}
                >
                  <Heart className="w-16 h-16 text-pink-500 fill-current" />
                  <motion.div
                    className="absolute -top-2 -right-2 w-6 h-6 bg-yellow-400 rounded-full flex items-center justify-center"
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    <Sparkles className="w-3 h-3 text-white" />
                  </motion.div>
                </motion.div>
              </div>

              {/* 计时器区域 */}
              <div className="bg-gradient-to-r from-pink-100 to-purple-100 dark:from-pink-900/30 dark:to-purple-900/30 rounded-2xl p-6">
                <Timer startDate={settings?.dates?.startDate || "2023-05-01"} />
              </div>
            </motion.div>

            {/* 快速统计卡片 */}
            <motion.div
              className="grid grid-cols-1 md:grid-cols-2 gap-4"
              variants={itemVariants}
            >
              <motion.div
                className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-md rounded-2xl p-6 shadow-lg border border-white/20 dark:border-gray-700/20"
                whileHover={{ scale: 1.05 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <div className="flex items-center space-x-4">
                  <div className="p-3 bg-pink-100 dark:bg-pink-900/30 rounded-xl">
                    <Calendar className="w-6 h-6 text-pink-600 dark:text-pink-400" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-800 dark:text-gray-200">纪念日提醒</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">永不忘记重要日子</p>
                  </div>
                </div>
              </motion.div>

              <motion.div
                className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-md rounded-2xl p-6 shadow-lg border border-white/20 dark:border-gray-700/20"
                whileHover={{ scale: 1.05 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <div className="flex items-center space-x-4">
                  <div className="p-3 bg-purple-100 dark:bg-purple-900/30 rounded-xl">
                    <Clock className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-800 dark:text-gray-200">美好回忆</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">珍藏每个瞬间</p>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          </motion.div>

          {/* 右侧侧边栏 */}
          <motion.div
            className="lg:col-span-4 space-y-6"
            variants={itemVariants}
          >
            {/* 今日心情卡片 */}
            <motion.div
              className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-md rounded-2xl p-6 shadow-lg border border-white/20 dark:border-gray-700/20"
              whileHover={{ scale: 1.02 }}
            >
              <h3 className="font-semibold text-gray-800 dark:text-gray-200 mb-4 flex items-center">
                <Heart className="w-5 h-5 text-pink-500 mr-2" />
                今日心情
              </h3>
              <div className="space-y-3">
                {["💕", "🌟", "🌈", "🦋"].map((emoji, index) => (
                  <motion.button
                    key={index}
                    className="w-full p-3 text-left rounded-xl bg-gray-50 dark:bg-gray-700/50 hover:bg-pink-50 dark:hover:bg-pink-900/20 transition-colors"
                    whileHover={{ x: 5 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={async () => {
                      const labels = ["💕", "🌟", "🌈", "🦋"]
                      try { await createMoodRemote(labels[index]) } catch {}
                      try {
                        const raw = localStorage.getItem('love-moods')
                        const arr = raw ? JSON.parse(raw) : []
                        arr.push({ mood: labels[index], created_at: new Date().toISOString() })
                        localStorage.setItem('love-moods', JSON.stringify(arr))
                      } catch {}
                      setFeedback(`已记录今日心情`)
                      setTimeout(() => setFeedback(""), 2000)
                    }}
                  >
                    <span className="text-2xl mr-3">{emoji}</span>
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      {["甜蜜", "闪耀", "彩虹", "轻盈"][index]}
                    </span>
                  </motion.button>
                ))}
              </div>
            </motion.div>

            {/* 快速导航卡片 */}
            <motion.div
              className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-md rounded-2xl p-6 shadow-lg border border-white/20 dark:border-gray-700/20"
              whileHover={{ scale: 1.02 }}
            >
              <h3 className="font-semibold text-gray-800 dark:text-gray-200 mb-4">快速导航</h3>
              <div className="space-y-2">
                {[
                  { id: "stories", name: "爱情故事", icon: BookOpen, color: "pink" },
                  { id: "gallery", name: "照片相册", icon: Camera, color: "purple" },
                  { id: "settings", name: "个人设置", icon: Settings, color: "indigo" }
                ].map((item, index) => (
                  <motion.button
                    key={index}
                    className="w-full p-3 text-left rounded-xl bg-gray-50 dark:bg-gray-700/50 hover:bg-gradient-to-r hover:from-pink-50 hover:to-purple-50 dark:hover:from-pink-900/20 dark:hover:to-purple-900/20 transition-all duration-300"
                    whileHover={{ x: 5 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => onPageChange && onPageChange(item.id)}
                  >
                    <div className="flex items-center space-x-3">
                      <div className={`p-2 bg-${item.color}-100 dark:bg-${item.color}-900/30 rounded-lg`}>
                        <item.icon className={`w-4 h-4 text-${item.color}-600 dark:text-${item.color}-400`} />
                      </div>
                      <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        {item.name}
                      </span>
                    </div>
                  </motion.button>
                ))}
              </div>
            </motion.div>

            <MoodHistory />

            <motion.div
              className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-md rounded-2xl p-6 shadow-lg border border-white/20 dark:border-gray-700/20"
              whileHover={{ scale: 1.02 }}
            >
              <h3 className="font-semibold text-gray-800 dark:text-gray-200 mb-4">重要时刻</h3>
              <div className="space-y-3">
                {milestones.map((milestone) => (
                  <motion.div
                    key={milestone.id}
                    className="flex items-center space-x-3 p-3 bg-gradient-to-r from-pink-50 to-purple-50 dark:from-pink-900/20 dark:to-purple-900/20 rounded-xl"
                    whileHover={{ scale: 1.02 }}
                  >
                    <span className="text-xl">{milestone.emoji}</span>
                    <div className="flex-1">
                      <div className="text-sm font-medium text-gray-800 dark:text-gray-200">
                        {milestone.event}
                      </div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">
                        {new Date(milestone.date).toLocaleDateString('zh-CN')}
                      </div>
                    </div>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => deleteMilestone(milestone.id)}
                      className="px-2 py-1 text-xs rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200"
                    >
                      删除
                    </motion.button>
                  </motion.div>
                ))}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-2 mt-3">
                  <input
                    type="date"
                    value={newMilestone.date}
                    onChange={(e) => setNewMilestone({ ...newMilestone, date: e.target.value })}
                    className="px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-800 dark:text-white"
                  />
                  <input
                    type="text"
                    value={newMilestone.event}
                    onChange={(e) => setNewMilestone({ ...newMilestone, event: e.target.value })}
                    placeholder="事件"
                    className="px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-800 dark:text-white"
                  />
                  <select
                    value={newMilestone.emoji}
                    onChange={(e) => setNewMilestone({ ...newMilestone, emoji: e.target.value })}
                    className="px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-800 dark:text-white"
                  >
                    <option>💕</option>
                    <option>💍</option>
                    <option>🌟</option>
                    <option>🌈</option>
                  </select>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => {
                      if (!newMilestone.event) return
                      addMilestone(newMilestone)
                      setNewMilestone({ date: "", event: "", emoji: "💕" })
                    }}
                    className="px-3 py-2 rounded-lg bg-deepPink text-white"
                  >
                    添加
                  </motion.button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
        {feedback && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 flex items-center space-x-2 px-4 py-2 bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300 rounded-xl shadow"
          >
            <CheckCircle className="w-5 h-5" />
            <span className="text-sm">{feedback}</span>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
}