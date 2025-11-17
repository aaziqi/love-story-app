import { getSupabase } from './supabaseClient'

export async function getUser() {
  const supabase = getSupabase()
  if (!supabase) return null
  const { data } = await supabase.auth.getUser()
  return data?.user || null
}

export async function getGroupId() {
  const supabase = getSupabase()
  if (!supabase) return null
  const user = await getUser()
  if (!user) return null
  const { data, error } = await supabase
    .from('group_members')
    .select('group_id')
    .eq('user_id', user.id)
    .limit(1)
  if (error) return null
  return data && data[0] ? data[0].group_id : null
}

async function getScope() {
  const user = await getUser()
  if (!user) return null
  const gid = await getGroupId()
  if (gid) return { field: 'group_id', value: gid, user }
  return { field: 'user_id', value: user.id, user }
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
  const { data, error } = await supabase.auth.signUp({ email, password, options: { emailRedirectTo: typeof window !== 'undefined' ? window.location.origin : undefined } })
  if (error) throw error
  return data
}

export async function signOut() {
  const supabase = getSupabase()
  if (!supabase) return
  const { error } = await supabase.auth.signOut()
  if (error) throw error
}

export async function signInWithProvider(provider) {
  const supabase = getSupabase()
  if (!supabase) throw new Error('Supabase 未配置')
  const { error } = await supabase.auth.signInWithOAuth({ provider, options: { redirectTo: typeof window !== 'undefined' ? window.location.origin : undefined } })
  if (error) throw error
}

export async function fetchStories() {
  const supabase = getSupabase()
  if (!supabase) return null
  const scope = await getScope()
  if (!scope) return null
  const { data, error } = await supabase
    .from('stories')
    .select('*')
    .eq(scope.field, scope.value)
    .order('date', { ascending: false })
  if (error) throw error
  return data || []
}

export async function createStoryRemote(story) {
  const supabase = getSupabase()
  if (!supabase) return null
  const scope = await getScope()
  if (!scope) return null
  const row = { ...story, [scope.field]: scope.value }
  const { data, error } = await supabase.from('stories').insert(row).select().single()
  if (error) throw error
  return data
}

export async function updateStoryRemote(id, updates) {
  const supabase = getSupabase()
  if (!supabase) return null
  const scope = await getScope()
  if (!scope) return null
  const { data, error } = await supabase
    .from('stories')
    .update(updates)
    .eq('id', id)
    .eq(scope.field, scope.value)
    .select()
    .single()
  if (error) throw error
  return data
}

export async function deleteStoryRemote(id) {
  const supabase = getSupabase()
  if (!supabase) return null
  const scope = await getScope()
  if (!scope) return null
  const { error } = await supabase
    .from('stories')
    .delete()
    .eq('id', id)
    .eq(scope.field, scope.value)
  if (error) throw error
  return true
}

export async function fetchPhotos() {
  const supabase = getSupabase()
  if (!supabase) return null
  const scope = await getScope()
  if (!scope) return null
  const { data, error } = await supabase
    .from('photos')
    .select('*')
    .eq(scope.field, scope.value)
    .order('date', { ascending: false })
  if (error) throw error
  return data || []
}

export async function createPhotoRemote(photo) {
  const supabase = getSupabase()
  if (!supabase) return null
  const scope = await getScope()
  if (!scope) return null
  const row = { ...photo, [scope.field]: scope.value }
  const { data, error } = await supabase.from('photos').insert(row).select().single()
  if (error) throw error
  return data
}

export async function updatePhotoRemote(id, updates) {
  const supabase = getSupabase()
  if (!supabase) return null
  const scope = await getScope()
  if (!scope) return null
  const { data, error } = await supabase
    .from('photos')
    .update(updates)
    .eq('id', id)
    .eq(scope.field, scope.value)
    .select()
    .single()
  if (error) throw error
  return data
}

export async function deletePhotoRemote(id) {
  const supabase = getSupabase()
  if (!supabase) return null
  const scope = await getScope()
  if (!scope) return null
  const { error } = await supabase
    .from('photos')
    .delete()
    .eq('id', id)
    .eq(scope.field, scope.value)
  if (error) throw error
  return true
}

export async function fetchSettingsRemote() {
  const supabase = getSupabase()
  if (!supabase) return null
  const scope = await getScope()
  if (!scope) return null
  const { data, error } = await supabase
    .from('settings')
    .select('*')
    .eq(scope.field, scope.value)
    .maybeSingle()
  if (error) throw error
  return data || null
}

export async function updateSettingsRemote(settings) {
  const supabase = getSupabase()
  if (!supabase) return null
  const scope = await getScope()
  if (!scope) return null
  const row = { ...settings, [scope.field]: scope.value }
  const { data, error } = await supabase.from('settings').upsert(row).select().single()
  if (error) throw error
  return data
}

export async function upsertStories(items) {
  const supabase = getSupabase()
  if (!supabase) return null
  const scope = await getScope()
  if (!scope) return null
  const rows = items.map(i => ({ ...i, [scope.field]: scope.value }))
  const { error } = await supabase.from('stories').upsert(rows)
  if (error) throw error
  return true
}

export async function upsertPhotos(items) {
  const supabase = getSupabase()
  if (!supabase) return null
  const scope = await getScope()
  if (!scope) return null
  const rows = items.map(i => ({ ...i, [scope.field]: scope.value }))
  const { error } = await supabase.from('photos').upsert(rows)
  if (error) throw error
  return true
}

export async function createGroup() {
  const supabase = getSupabase()
  if (!supabase) return null
  const user = await getUser()
  if (!user) return null
  const code = cryptoRandom()
  const { data: g, error: ge } = await supabase.from('groups').insert({ code }).select().single()
  if (ge) throw ge
  const { error: me } = await supabase.from('group_members').insert({ group_id: g.id, user_id: user.id })
  if (me) throw me
  return g
}

export async function joinGroup(code) {
  const supabase = getSupabase()
  if (!supabase) return null
  const user = await getUser()
  if (!user) return null
  const { data: g, error } = await supabase.from('groups').select('*').eq('code', code).single()
  if (error) throw error
  const { error: me } = await supabase.from('group_members').insert({ group_id: g.id, user_id: user.id })
  if (me) throw me
  return g
}

export async function leaveGroup() {
  const supabase = getSupabase()
  if (!supabase) return null
  const user = await getUser()
  if (!user) return null
  const gid = await getGroupId()
  if (!gid) return true
  const { error } = await supabase.from('group_members').delete().eq('group_id', gid).eq('user_id', user.id)
  if (error) throw error
  return true
}

function cryptoRandom(len = 8) {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'
  let s = ''
  for (let i = 0; i < len; i++) {
    s += chars[Math.floor(Math.random() * chars.length)]
  }
  return s
}

export async function createMoodRemote(mood) {
  const supabase = getSupabase()
  if (!supabase) return null
  const scope = await getScope()
  if (!scope) return null
  const row = { mood, created_at: new Date().toISOString(), [scope.field]: scope.value }
  const { data, error } = await supabase.from('moods').insert(row).select().single()
  if (error) throw error
  return data
}

export async function listMoodsRemote(limit = 10) {
  const supabase = getSupabase()
  if (!supabase) return []
  const scope = await getScope()
  if (!scope) return []
  const { data, error } = await supabase
    .from('moods')
    .select('*')
    .eq(scope.field, scope.value)
    .order('created_at', { ascending: false })
    .limit(limit)
  if (error) throw error
  return data || []
}

export async function uploadPhotoFile(file) {
  const supabase = getSupabase()
  if (!supabase) return null
  const scope = await getScope()
  if (!scope) return null
  const safeName = (file?.name || 'photo').normalize('NFKC').replace(/[^\w\.\-]+/g, '_')
  const ts = new Date().toISOString().replace(/[:\.]/g, '-')
  const filePath = `${scope.value}/${ts}-${safeName}`
  const { error: ue } = await supabase.storage.from('photos').upload(filePath, file, { upsert: false, contentType: file?.type || 'application/octet-stream', cacheControl: '3600' })
  if (ue) throw ue
  const { data: pub } = supabase.storage.from('photos').getPublicUrl(filePath)
  const url = pub?.publicUrl
  const photo = { url, title: file.name.split('.')[0], date: new Date().toISOString().split('T')[0] }
  const created = await createPhotoRemote(photo)
  return created
}

export async function uploadMilestoneImage(file) {
  const supabase = getSupabase()
  if (!supabase) return null
  const scope = await getScope()
  if (!scope) return null
  const filePath = `milestones/${scope.value}/${Date.now()}-${file.name}`
  const { error: ue } = await supabase.storage.from('photos').upload(filePath, file, { upsert: false })
  if (ue) throw ue
  const { data: pub } = supabase.storage.from('photos').getPublicUrl(filePath)
  return pub?.publicUrl || null
}

export async function uploadStoryImage(file) {
  const supabase = getSupabase()
  if (!supabase) return null
  const scope = await getScope()
  if (!scope) return null
  const safeName = (file?.name || 'story').normalize('NFKC').replace(/[^\w\.\-]+/g, '_')
  const ts = new Date().toISOString().replace(/[:\.]/g, '-')
  const filePath = `stories/${scope.value}/${ts}-${safeName}`
  const { error: ue } = await supabase.storage.from('photos').upload(filePath, file, { upsert: false, contentType: file?.type || 'application/octet-stream', cacheControl: '3600' })
  if (ue) throw ue
  const { data: pub } = supabase.storage.from('photos').getPublicUrl(filePath)
  return pub?.publicUrl || null
}

export async function fetchMilestones() {
  const supabase = getSupabase()
  if (!supabase) return null
  const scope = await getScope()
  if (!scope) return null
  const { data, error } = await supabase
    .from('milestones')
    .select('*')
    .eq(scope.field, scope.value)
    .order('date', { ascending: false })
  if (error) throw error
  return data || []
}

export async function createMilestoneRemote(m) {
  const supabase = getSupabase()
  if (!supabase) return null
  const scope = await getScope()
  if (!scope) return null
  const row = { ...m, [scope.field]: scope.value }
  const { data, error } = await supabase.from('milestones').insert(row).select().single()
  if (error) throw error
  return data
}

export async function updateMilestoneRemote(id, updates) {
  const supabase = getSupabase()
  if (!supabase) return null
  const scope = await getScope()
  if (!scope) return null
  const { data, error } = await supabase
    .from('milestones')
    .update(updates)
    .eq('id', id)
    .eq(scope.field, scope.value)
    .select()
    .single()
  if (error) throw error
  return data
}

export async function deleteMilestoneRemote(id) {
  const supabase = getSupabase()
  if (!supabase) return null
  const scope = await getScope()
  if (!scope) return null
  const { error } = await supabase
    .from('milestones')
    .delete()
    .eq('id', id)
    .eq(scope.field, scope.value)
  if (error) throw error
  return true
}
