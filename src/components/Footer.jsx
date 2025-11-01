import { motion } from "framer-motion";
import { Heart, Github, Mail } from "lucide-react";

export default function Footer() {
  return (
    <motion.footer
      className="bg-gradient-to-r from-lightPink to-softWhite border-t border-pink-100 mt-20"
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center">
          {/* Logo */}
          <motion.div
            className="flex items-center justify-center space-x-2 mb-6"
            whileHover={{ scale: 1.05 }}
          >
            <Heart className="text-deepPink" size={32} fill="currentColor" />
            <span className="text-2xl font-bold text-deepPink font-love">
              LoveDiary
            </span>
            <Heart className="text-deepPink" size={32} fill="currentColor" />
          </motion.div>

          {/* 描述 */}
          <p className="text-gray-600 mb-8 max-w-2xl mx-auto leading-relaxed">
            记录每一个美好瞬间，珍藏属于我们的爱情故事。
            时光会褪去一切色彩，但爱会让回忆永恒。
          </p>

          {/* 社交链接 */}
          <div className="flex justify-center space-x-6 mb-8">
            <motion.a
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
              className="p-3 bg-white rounded-full shadow-md hover:shadow-lg transition-shadow text-gray-600 hover:text-deepPink"
              whileHover={{ scale: 1.1, y: -2 }}
              whileTap={{ scale: 0.95 }}
            >
              <Github size={20} />
            </motion.a>
            <motion.a
              href="mailto:love@example.com"
              className="p-3 bg-white rounded-full shadow-md hover:shadow-lg transition-shadow text-gray-600 hover:text-deepPink"
              whileHover={{ scale: 1.1, y: -2 }}
              whileTap={{ scale: 0.95 }}
            >
              <Mail size={20} />
            </motion.a>
          </div>

          {/* 爱心动画 */}
          <motion.div
            className="flex justify-center space-x-4 mb-6"
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            {[...Array(5)].map((_, i) => (
              <motion.div
                key={i}
                animate={{
                  y: [0, -10, 0],
                  rotate: [0, 10, -10, 0]
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  delay: i * 0.2
                }}
              >
                <Heart
                  className="text-lovePink"
                  size={16}
                  fill="currentColor"
                />
              </motion.div>
            ))}
          </motion.div>

          {/* 版权信息 */}
          <div className="border-t border-pink-200 pt-6">
            <p className="text-sm text-gray-500">
              © 2025 LoveDiary Team | Design & Dev by Trae + Aaziqi
            </p>
            <p className="text-xs text-gray-400 mt-2">
              Made with 💖 for eternal love
            </p>
          </div>
        </div>
      </div>
    </motion.footer>
  );
}