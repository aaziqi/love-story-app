import { motion } from "framer-motion";
import { Heart } from "lucide-react";
import useLoveTimer from "../hooks/useLoveTimer";

export default function Timer({ startDate = "2023-05-01" }) {
  const { days, hours, minutes, seconds } = useLoveTimer(startDate);

  const timeUnits = [
    { label: "天", value: days, color: "text-deepPink" },
    { label: "小时", value: hours, color: "text-lovePink" },
    { label: "分钟", value: minutes, color: "text-pink-400" },
    { label: "秒", value: seconds, color: "text-pink-300" }
  ];

  return (
    <motion.div
      className="love-card text-center max-w-4xl mx-auto"
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
    >
      <motion.div
        className="flex items-center justify-center mb-6"
        animate={{ scale: [1, 1.1, 1] }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        <Heart className="text-deepPink mr-2" size={32} fill="currentColor" />
        <h1 className="text-3xl font-bold text-deepPink font-love">
          我们的爱情时光
        </h1>
        <Heart className="text-deepPink ml-2" size={32} fill="currentColor" />
      </motion.div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        {timeUnits.map((unit, index) => (
          <motion.div
            key={unit.label}
            className="love-card bg-gradient-to-br from-white to-lightPink"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            whileHover={{ scale: 1.05 }}
          >
            <motion.div
              className={`text-4xl font-bold ${unit.color} mb-2`}
              animate={{ scale: [1, 1.05, 1] }}
              transition={{ duration: 1.5, repeat: Infinity, delay: index * 0.2 }}
            >
              {unit.value}
            </motion.div>
            <div className="text-gray-600 font-semibold">{unit.label}</div>
          </motion.div>
        ))}
      </div>

      <motion.p
        className="text-xl text-gray-700 font-love"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 0.5 }}
      >
        💕 我们已经相爱了 <span className="text-deepPink font-bold">{days}</span> 天啦！💕
      </motion.p>
    </motion.div>
  );
}