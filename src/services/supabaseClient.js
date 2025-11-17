import { createClient } from '@supabase/supabase-js'

function readRuntime() {
  try {
    const uRaw = window.localStorage.getItem('love-supabase-url')
    const kRaw = window.localStorage.getItem('love-supabase-anon')
    const u = (uRaw || '').trim()
    const k = (kRaw || '').trim()
    if (u && k && /^https?:\/\//.test(u)) return { url: u, key: k }
  } catch {}
  const envU = (import.meta.env.VITE_SUPABASE_URL || '').trim()
  const envK = (import.meta.env.VITE_SUPABASE_ANON_KEY || '').trim()
  return { url: envU, key: envK }
}

export function getSupabase() {
  const { url, key } = readRuntime()
  if (!url || !key) return null
  if (!/^https?:\/\//.test(url)) return null
  try {
    return createClient(url, key)
  } catch {
    return null
  }
}