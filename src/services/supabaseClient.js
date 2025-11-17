import { createClient } from '@supabase/supabase-js'

function readRuntime() {
  try {
    const u = window.localStorage.getItem('love-supabase-url')
    const k = window.localStorage.getItem('love-supabase-anon')
    if (u && k) return { url: u, key: k }
  } catch {}
  return {
    url: import.meta.env.VITE_SUPABASE_URL,
    key: import.meta.env.VITE_SUPABASE_ANON_KEY
  }
}

export function getSupabase() {
  const { url, key } = readRuntime()
  if (!url || !key) return null
  return createClient(url, key)
}