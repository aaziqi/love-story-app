import { useState } from 'react'
import { motion } from 'framer-motion'
import { Heart, Lock, Mail, Sparkles, CheckCircle, AlertCircle } from 'lucide-react'
import { signIn, signUp, getUser } from '../services/db'

export default function AuthPage({ onAuthed }) {
  const [mode, setMode] = useState('login')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const submit = async () => {
    setLoading(true)
    setError('')
    setSuccess('')
    try {
      if (mode === 'login') {
        await signIn(email, password)
        const u = await getUser()
        if (u) {
          setSuccess('登录成功')
          onAuthed?.(u)
        } else {
          setError('登录失败')
        }
      } else {
        const data = await signUp(email, password)
        if (data?.session && data?.user) {
          const u = await getUser()
          setSuccess('注册并登录成功')
          onAuthed?.(u)
        } else {
          setSuccess('注册成功，请前往邮箱完成验证后登录')
        }
      }
    } catch (e) {
      setError(e.message || 'Error')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-indigo-50 dark:from-gray-900 dark:via-purple-900 dark:to-indigo-900 relative overflow-hidden">
      <div className="absolute inset-0 overflow-hidden">
        <motion.div className="absolute top-20 left-10 w-32 h-32 bg-pink-200/30 dark:bg-pink-500/20 rounded-full blur-xl" animate={{ y: [-10, 10, -10], rotate: [0, 5, -5, 0] }} transition={{ duration: 6, repeat: Infinity }} />
        <motion.div className="absolute top-40 right-20 w-24 h-24 bg-purple-200/30 dark:bg-purple-500/20 rounded-full blur-xl" animate={{ y: [-10, 10, -10] }} transition={{ duration: 6, repeat: Infinity, delay: 1 }} />
        <motion.div className="absolute bottom-32 left-1/4 w-40 h-40 bg-indigo-200/30 dark:bg-indigo-500/20 rounded-full blur-xl" animate={{ y: [-10, 10, -10] }} transition={{ duration: 6, repeat: Infinity, delay: 2 }} />
      </div>

      <div className="relative z-10 container mx-auto px-4 py-16">
        <div className="text-center mb-10">
          <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ duration: 0.6 }} className="inline-flex items-center space-x-3">
            <Heart className="text-deepPink" size={36} fill="currentColor" />
            <span className="text-4xl font-bold text-deepPink font-love">LoveDiary</span>
          </motion.div>
          <div className="mt-4 text-gray-600 dark:text-gray-300">开启专属的爱情日记，与心爱的人共同记录</div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-md rounded-3xl p-8 shadow-xl border border-white/20 dark:border-gray-700/20">
            <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-6 flex items-center">
              <Sparkles className="mr-3 text-pink-500" />
              功能亮点
            </h2>
            <div className="space-y-4 text-gray-700 dark:text-gray-300">
              <div>• 云端同步，跨设备一致</div>
              <div>• 共享组，和 TA 同步记录</div>
              <div>• 相册与故事，永久收藏美好</div>
              <div>• 心情时间线，记录每一次悸动</div>
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-md rounded-3xl p-8 shadow-xl border border-white/20 dark:border-gray-700/20">
            <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-6 flex items-center">
              <Lock className="mr-3 text-pink-500" />
              {mode === 'login' ? '登录' : '注册'}
            </h2>
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <Mail className="w-5 h-5 text-gray-500" />
                <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="邮箱" className="flex-1 px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-800 dark:text-white" />
              </div>
              <div className="flex items-center space-x-3">
                <Lock className="w-5 h-5 text-gray-500" />
                <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="密码" className="flex-1 px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-800 dark:text-white" />
              </div>
              {error && <div className="text-sm text-red-600 dark:text-red-400">{error}</div>}
              {success && (
                <div className="flex items-center space-x-2 text-green-600 dark:text-green-400 text-sm">
                  <CheckCircle className="w-4 h-4" />
                  <span>{success}</span>
                </div>
              )}
              <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={submit} disabled={loading} className="w-full bg-gradient-to-r from-pink-500 to-purple-600 text-white py-3 px-6 rounded-xl disabled:opacity-60">
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
        </div>
      </div>
    </div>
  )
}