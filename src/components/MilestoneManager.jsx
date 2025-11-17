import { useEffect, useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import { useMilestones } from '../hooks/useLocalStorage'
import { uploadMilestoneImage } from '../services/db'

export default function MilestoneManager() {
  const { milestones, addMilestone, updateMilestone, deleteMilestone } = useMilestones()
  const [form, setForm] = useState({ date: '', event: '', emoji: '💕', tags: '' })
  const [file, setFile] = useState(null)
  const [query, setQuery] = useState('')
  const list = useMemo(() => {
    if (!query) return milestones
    const q = query.toLowerCase()
    return milestones.filter(m => (m.event || '').toLowerCase().includes(q))
  }, [milestones, query])
  const [editingId, setEditingId] = useState(null)
  const [editData, setEditData] = useState({ date: '', event: '', emoji: '💕' })

  useEffect(() => {
    if (editingId) {
      const m = milestones.find(x => x.id === editingId)
      if (m) setEditData({ date: m.date || '', event: m.event || '', emoji: m.emoji || '💕' })
    }
  }, [editingId, milestones])

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6"
    >
      <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-6">重要时刻管理</h2>
      <div className="grid grid-cols-1 md:grid-cols-5 gap-3 mb-4">
        <input type="date" value={form.date} onChange={e => setForm({ ...form, date: e.target.value })} className="px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-800 dark:text-white" />
        <input type="text" value={form.event} onChange={e => setForm({ ...form, event: e.target.value })} placeholder="事件" className="px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-800 dark:text-white" />
        <select value={form.emoji} onChange={e => setForm({ ...form, emoji: e.target.value })} className="px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-800 dark:text-white">
          <option>💕</option>
          <option>💍</option>
          <option>🌟</option>
          <option>🌈</option>
        </select>
        <input type="text" value={form.tags} onChange={e => setForm({ ...form, tags: e.target.value })} placeholder="标签，逗号分隔" className="px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-800 dark:text-white" />
        <div className="grid grid-cols-2 gap-2">
          <input type="file" accept="image/*" onChange={e => setFile(e.target.files[0] || null)} className="px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-800 dark:text-white" />
          <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={async () => { if (!form.event) return; let image_url = null; if (file) { try { image_url = await uploadMilestoneImage(file) } catch {} } const tags = form.tags ? form.tags.split(',').map(t => t.trim()).filter(Boolean) : []; await addMilestone({ date: form.date, event: form.event, emoji: form.emoji, image_url, tags }); setForm({ date: '', event: '', emoji: '💕', tags: '' }); setFile(null) }} className="px-3 py-2 rounded-lg bg-deepPink text-white">添加</motion.button>
        </div>
      </div>
      <div className="flex items-center mb-4">
        <input value={query} onChange={e => setQuery(e.target.value)} placeholder="搜索事件" className="flex-1 px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-800 dark:text-white" />
      </div>
      <div className="space-y-3">
        {list.map(m => (
          <motion.div key={m.id} whileHover={{ scale: 1.01 }} className="p-3 rounded-xl bg-gradient-to-r from-pink-50 to-purple-50 dark:from-pink-900/20 dark:to-purple-900/20">
            {editingId === m.id ? (
              <div className="grid grid-cols-1 md:grid-cols-5 gap-2 items-center">
                <select value={editData.emoji} onChange={e => setEditData({ ...editData, emoji: e.target.value })} className="px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-800 dark:text-white">
                  <option>💕</option>
                  <option>💍</option>
                  <option>🌟</option>
                  <option>🌈</option>
                </select>
                <input type="text" value={editData.event} onChange={e => setEditData({ ...editData, event: e.target.value })} className="px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-800 dark:text-white" />
                <input type="date" value={editData.date} onChange={e => setEditData({ ...editData, date: e.target.value })} className="px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-800 dark:text-white" />
                <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} onClick={() => { updateMilestone(m.id, editData); setEditingId(null) }} className="px-3 py-2 rounded-lg bg-teal-600 text-white">保存</motion.button>
                <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} onClick={() => setEditingId(null)} className="px-3 py-2 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-white">取消</motion.button>
              </div>
            ) : (
              <div className="flex items-center">
                {m.image_url ? (
                  <img src={m.image_url} alt="milestone" className="w-16 h-16 rounded-lg object-cover mr-3" />
                ) : (
                  <span className="text-xl mr-3">{m.emoji}</span>
                )}
                <div className="flex-1">
                  <div className="text-sm font-medium text-gray-800 dark:text-gray-200">{m.event}</div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">{new Date(m.date).toLocaleDateString('zh-CN')}</div>
                  {Array.isArray(m.tags) && m.tags.length > 0 && (
                    <div className="mt-2 flex flex-wrap gap-2">
                      {m.tags.map((t, i) => (
                        <span key={i} className="px-2 py-1 text-xs rounded-full bg-pink-100 text-pink-700 dark:bg-pink-900/30 dark:text-pink-300">{t}</span>
                      ))}
                    </div>
                  )}
                </div>
                <div className="flex items-center space-x-2">
                  <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} onClick={() => setEditingId(m.id)} className="px-2 py-1 text-xs rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200">编辑</motion.button>
                  <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} onClick={() => deleteMilestone(m.id)} className="px-2 py-1 text-xs rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200">删除</motion.button>
                </div>
              </div>
            )}
          </motion.div>
        ))}
        {list.length === 0 && (
          <div className="text-sm text-gray-500 dark:text-gray-400">暂无重要时刻</div>
        )}
      </div>
    </motion.div>
  )
}