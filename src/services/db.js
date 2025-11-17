import { getSupabase } from './supabaseClient'

export async function getUser() {
  const supabase = getSupabase()
  if (!supabase) return null
  const { data } = await supabase.auth.getUser()
  return data?.user || null
}

export function onAuthChange(callback) {
  const supabase = getSupabase()
  if (!supabase) return null
  const { data } = supabase.auth.onAuthStateChange((_event, session) => {
    callback(session?.user || null)
  })
  return data?.subscription
}

export async function signIn(email, password) {
  const supabase = getSupabase()
  if (!supabase) throw new Error('Supabase 未配置')
  const { error } = await supabase.auth.signInWithPassword({ email, password })
  if (error) throw error
  return getUser()
}

export async function signUp(email, password) {
  const supabase = getSupabase()
  if (!supabase) throw new Error('Supabase 未配置')
  const { error } = await supabase.auth.signUp({ email, password })
  if (error) throw error
  return getUser()
}

export async function signOut() {
  const supabase = getSupabase()
  if (!supabase) return
  const { error } = await supabase.auth.signOut()
  if (error) throw error
}

export async function fetchStories() {
  const supabase = getSupabase()
  if (!supabase) return null
  const user = await getUser()
  if (!user) return null
  const { data, error } = await supabase
    .from('stories')
    .select('*')
    .eq('user_id', user.id)
    .order('date', { ascending: false })
  if (error) throw error
  return data || []
}

export async function createStoryRemote(story) {
  const supabase = getSupabase()
  if (!supabase) return null
  const user = await getUser()
  if (!user) return null
  const row = { ...story, user_id: user.id }
  const { data, error } = await supabase.from('stories').insert(row).select().single()
  if (error) throw error
  return data
}

export async function updateStoryRemote(id, updates) {
  const supabase = getSupabase()
  if (!supabase) return null
  const user = await getUser()
  if (!user) return null
  const { data, error } = await supabase
    .from('stories')
    .update(updates)
    .eq('id', id)
    .eq('user_id', user.id)
    .select()
    .single()
  if (error) throw error
  return data
}

export async function deleteStoryRemote(id) {
  const supabase = getSupabase()
  if (!supabase) return null
  const user = await getUser()
  if (!user) return null
  const { error } = await supabase
    .from('stories')
    .delete()
    .eq('id', id)
    .eq('user_id', user.id)
  if (error) throw error
  return true
}

export async function fetchPhotos() {
  const supabase = getSupabase()
  if (!supabase) return null
  const user = await getUser()
  if (!user) return null
  const { data, error } = await supabase
    .from('photos')
    .select('*')
    .eq('user_id', user.id)
    .order('date', { ascending: false })
  if (error) throw error
  return data || []
}

export async function createPhotoRemote(photo) {
  const supabase = getSupabase()
  if (!supabase) return null
  const user = await getUser()
  if (!user) return null
  const row = { ...photo, user_id: user.id }
  const { data, error } = await supabase.from('photos').insert(row).select().single()
  if (error) throw error
  return data
}

export async function updatePhotoRemote(id, updates) {
  const supabase = getSupabase()
  if (!supabase) return null
  const user = await getUser()
  if (!user) return null
  const { data, error } = await supabase
    .from('photos')
    .update(updates)
    .eq('id', id)
    .eq('user_id', user.id)
    .select()
    .single()
  if (error) throw error
  return data
}

export async function deletePhotoRemote(id) {
  const supabase = getSupabase()
  if (!supabase) return null
  const user = await getUser()
  if (!user) return null
  const { error } = await supabase
    .from('photos')
    .delete()
    .eq('id', id)
    .eq('user_id', user.id)
  if (error) throw error
  return true
}

export async function fetchSettingsRemote() {
  const supabase = getSupabase()
  if (!supabase) return null
  const user = await getUser()
  if (!user) return null
  const { data, error } = await supabase
    .from('settings')
    .select('*')
    .eq('user_id', user.id)
    .single()
  if (error && error.code !== 'PGRST116') throw error
  return data || null
}

export async function updateSettingsRemote(settings) {
  const supabase = getSupabase()
  if (!supabase) return null
  const user = await getUser()
  if (!user) return null
  const row = { ...settings, user_id: user.id }
  const { data, error } = await supabase.from('settings').upsert(row).select().single()
  if (error) throw error
  return data
}

export async function upsertStories(items) {
  const supabase = getSupabase()
  if (!supabase) return null
  const user = await getUser()
  if (!user) return null
  const rows = items.map(i => ({ ...i, user_id: user.id }))
  const { error } = await supabase.from('stories').upsert(rows)
  if (error) throw error
  return true
}

export async function upsertPhotos(items) {
  const supabase = getSupabase()
  if (!supabase) return null
  const user = await getUser()
  if (!user) return null
  const rows = items.map(i => ({ ...i, user_id: user.id }))
  const { error } = await supabase.from('photos').upsert(rows)
  if (error) throw error
  return true
}