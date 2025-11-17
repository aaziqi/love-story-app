import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { createGroup, joinGroup, leaveGroup, getGroupId } from '../services/db'

export default function GroupShare() {
  const [groupId, setGroupId] = useState(null)
  const [code, setCode] = useState('')
  const [busy, setBusy] = useState(false)
  const [msg, setMsg] = useState('')

  useEffect(() => {
    ;(async () => {
      const gid = await getGroupId()
      setGroupId(gid)
    })()
  }, [])

  const handleCreate = async () => {
    setBusy(true)
    setMsg('')
    try {
      const g = await createGroup()
      setMsg(`已创建共享组，邀请码：${g.code}`)
      const gid = await getGroupId()
      setGroupId(gid)
    } catch (e) {
      setMsg(e.message)
    } finally {
      setBusy(false)
    }
  }

  const handleJoin = async () => {
    if (!code) return
    setBusy(true)
    setMsg('')
    try {
      await joinGroup(code)
      setMsg('加入成功')
      const gid = await getGroupId()
      setGroupId(gid)
    } catch (e) {
      setMsg(e.message)
    } finally {
      setBusy(false)
    }
  }

  const handleLeave = async () => {
    setBusy(true)
    setMsg('')
    try {
      await leaveGroup()
      setMsg('已退出共享组')
      setGroupId(null)
    } catch (e) {
      setMsg(e.message)
    } finally {
      setBusy(false)
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6"
    >
      <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-6">共享设置</h2>
      <div className="space-y-4">
        {groupId ? (
          <div className="text-sm text-gray-700 dark:text-gray-300">已加入共享组</div>
        ) : (
          <div className="space-y-3">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              disabled={busy}
              onClick={handleCreate}
              className="w-full bg-gradient-to-r from-indigo-500 to-blue-600 text-white py-3 px-6 rounded-xl disabled:opacity-60"
            >
              创建共享组并生成邀请码
            </motion.button>
            <div className="flex items-center space-x-2">
              <input
                type="text"
                value={code}
                onChange={e => setCode(e.target.value)}
                placeholder="输入邀请码加入共享组"
                className="flex-1 px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-800 dark:text-white"
              />
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                disabled={busy}
                onClick={handleJoin}
                className="px-4 py-3 rounded-xl bg-teal-600 text-white disabled:opacity-60"
              >
                加入
              </motion.button>
            </div>
          </div>
        )}
        {groupId && (
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            disabled={busy}
            onClick={handleLeave}
            className="w-full bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-white py-3 px-6 rounded-xl disabled:opacity-60"
          >
            退出共享组
          </motion.button>
        )}
        {msg && <div className="text-sm text-pink-600 dark:text-pink-400">{msg}</div>}
      </div>
    </motion.div>
  )
}