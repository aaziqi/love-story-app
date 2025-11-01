import { motion } from "framer-motion";
import Timer from "../components/Timer";
import { Heart, Calendar, Camera, BookOpen } from "lucide-react";
import { useSettings } from "../hooks/useLocalStorage";

export default function Home() {
  const { settings } = useSettings();
  const features = [
    {
      icon: Calendar,
      title: "恋爱计时器",
      description: "精确记录我们在一起的每一天",
      color: "text-pink-500"
    },
    {
      icon: BookOpen,
      title: "爱情故事",
      description: "记录属于我们的美好回忆",
      color: "text-purple-500"
    },
    {
      icon: Camera,
      title: "甜蜜相册",
      description: "珍藏每一个幸福瞬间",
      color: "text-blue-500"
    }
  ];

  const milestones = [
    { date: "2023-05-01", event: "我们相遇了", emoji: "💕" },
    { date: "2023-05-15", event: "第一次约会", emoji: "🌹" },
    { date: "2023-06-01", event: "确定关系", emoji: "💍" },
    { date: "2023-12-25", event: "第一个圣诞节", emoji: "🎄" }
  ];

  return (
    <div className="min-h-screen pt-20 pb-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* 欢迎区域 */}
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <motion.h1
            className="text-5xl md:text-7xl font-bold text-deepPink mb-6 font-love"
            animate={{ scale: [1, 1.02, 1] }}
            transition={{ duration: 3, repeat: Infinity }}
          >
            Welcome to Our Love Story
          </motion.h1>
          <motion.p
            className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.5 }}
          >
            这里记录着我们的爱情时光，每一个美好的瞬间都值得被永远珍藏。
            让我们一起回顾那些甜蜜的回忆，期待更多美好的未来。
          </motion.p>
        </motion.div>

        {/* 计时器 */}
        <div className="mb-20">
          <Timer startDate={settings?.dates?.startDate || "2023-05-01"} />
        </div>

        {/* 功能特色 */}
        <motion.div
          className="mb-20"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
        >
          <h2 className="text-3xl font-bold text-center text-gray-800 mb-12 font-love">
            我们的爱情档案
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <motion.div
                  key={feature.title}
                  className="love-card text-center group"
                  initial={{ opacity: 0, y: 50 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.2 }}
                  whileHover={{ scale: 1.05, y: -10 }}
                >
                  <motion.div
                    className={`inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-white to-lightPink mb-6 ${feature.color}`}
                    whileHover={{ rotate: 360 }}
                    transition={{ duration: 0.8 }}
                  >
                    <Icon size={32} />
                  </motion.div>
                  <h3 className="text-xl font-bold text-gray-800 mb-3">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    {feature.description}
                  </p>
                </motion.div>
              );
            })}
          </div>
        </motion.div>

        {/* 重要时刻 */}
        <motion.div
          className="love-card"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
        >
          <h2 className="text-3xl font-bold text-center text-gray-800 mb-12 font-love">
            重要时刻
          </h2>
          <div className="space-y-6">
            {milestones.map((milestone, index) => (
              <motion.div
                key={index}
                className="flex items-center space-x-6 p-4 bg-gradient-to-r from-white to-lightPink rounded-xl"
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ scale: 1.02, x: 10 }}
              >
                <div className="text-4xl">{milestone.emoji}</div>
                <div className="flex-1">
                  <div className="text-lg font-semibold text-gray-800">
                    {milestone.event}
                  </div>
                  <div className="text-sm text-gray-600">
                    {new Date(milestone.date).toLocaleDateString('zh-CN')}
                  </div>
                </div>
                <motion.div
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 2, repeat: Infinity, delay: index * 0.3 }}
                >
                  <Heart className="text-lovePink" size={24} fill="currentColor" />
                </motion.div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}