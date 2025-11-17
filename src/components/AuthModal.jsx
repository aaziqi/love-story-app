import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X } from 'lucide-react'
import { signIn, signUp, getUser } from '../services/db'

export default function AuthModal({ open, onClose, onAuthed }) {
  const [mode, setMode] = useState('login')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const submit = async () => {
    setLoading(true)
    setError('')
    try {
      if (mode === 'login') await signIn(email, password)
      else await signUp(email, password)
      const u = await getUser()
      onAuthed?.(u)
      onClose?.()
    } catch (e) {
      setError(e.message || 'Error')
    } finally {
      setLoading(false)
    }
  }

  return (
    <AnimatePresence>
      {open && (
        <motion.div className="fixed inset-0 z-50 flex items-center justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <div className="absolute inset-0 bg-black/40" onClick={onClose} />
          <motion.div
            initial={{ scale: 0.9, y: 20, opacity: 0 }}
            animate={{ scale: 1, y: 0, opacity: 1 }}
            exit={{ scale: 0.9, y: 20, opacity: 0 }}
            className="relative w-full max-w-md bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-xl"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200">
                {mode === 'login' ? '登录' : '注册'}
              </h3>
              <button className="p-2" onClick={onClose}><X className="w-5 h-5" /></button>
            </div>
            <div className="space-y-3">
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="邮箱"
                className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-800 dark:text-white"
              />
              <input
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="密码"
                className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-800 dark:text-white"
              />
              {error && <div className="text-sm text-red-600 dark:text-red-400">{error}</div>}
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={submit}
                disabled={loading}
                className="w-full bg-gradient-to-r from-pink-500 to-purple-600 text-white py-3 px-6 rounded-xl disabled:opacity-60"
              >
                {loading ? '处理中...' : (mode === 'login' ? '登录' : '注册')}
              </motion.button>
              <div className="text-sm text-gray-600 dark:text-gray-300 text-center">
                {mode === 'login' ? (
                  <button onClick={() => setMode('signup')} className="text-pink-600">没有账号？去注册</button>
                ) : (
                  <button onClick={() => setMode('login')} className="text-pink-600">已有账号？去登录</button>
                )}
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}