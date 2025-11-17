import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { listMoodsRemote } from '../services/db'

export default function MoodHistory() {
  const [items, setItems] = useState([])
  useEffect(() => {
    ;(async () => {
      try {
        const data = await listMoodsRemote(10)
        if (data && data.length > 0) setItems(data)
        else {
          try {
            const raw = localStorage.getItem('love-moods')
            const arr = raw ? JSON.parse(raw) : []
            setItems(arr.slice(-10).reverse())
          } catch {}
        }
      } catch {
        try {
          const raw = localStorage.getItem('love-moods')
          const arr = raw ? JSON.parse(raw) : []
          setItems(arr.slice(-10).reverse())
        } catch {}
      }
    })()
  }, [])
  return (
    <motion.div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-md rounded-2xl p-6 shadow-lg border border-white/20 dark:border-gray-700/20"
      whileHover={{ scale: 1.02 }}
    >
      <h3 className="font-semibold text-gray-800 dark:text-gray-200 mb-4">最近心情</h3>
      <div className="space-y-3">
        {items.length === 0 ? (
          <div className="text-sm text-gray-500 dark:text-gray-400">暂无记录</div>
        ) : items.map((it, idx) => (
          <div key={idx} className="flex items-center space-x-3 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-xl">
            <span className="text-xl">{it.mood}</span>
            <div className="text-xs text-gray-500 dark:text-gray-400">
              {new Date(it.created_at).toLocaleString('zh-CN')}
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  )
}