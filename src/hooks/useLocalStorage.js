import { useState, useEffect } from 'react';
import {
  fetchStories,
  createStoryRemote,
  updateStoryRemote,
  deleteStoryRemote,
  fetchPhotos,
  createPhotoRemote,
  updatePhotoRemote,
  deletePhotoRemote,
  fetchSettingsRemote,
  updateSettingsRemote
} from '../services/db'
import { getSupabase } from '../services/supabaseClient'
import {
  fetchMilestones,
  createMilestoneRemote,
  updateMilestoneRemote,
  deleteMilestoneRemote
} from '../services/db'

// 通用的 localStorage hook
export const useLocalStorage = (key, initialValue) => {
  // 获取初始值
  const [storedValue, setStoredValue] = useState(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error(`Error reading localStorage key "${key}":`, error);
      return initialValue;
    }
  });

  // 设置值的函数
  const setValue = (value) => {
    try {
      // 允许传入函数来更新值
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      window.localStorage.setItem(key, JSON.stringify(valueToStore));
    } catch (error) {
      console.error(`Error setting localStorage key "${key}":`, error);
    }
  };

  return [storedValue, setValue];
};

// 专门用于故事数据的 hook
export const useStories = () => {
  const initialStories = [
    {
      id: 1,
      title: "第一次相遇",
      date: "2023-01-15",
      location: "咖啡厅",
      content: "那天阳光正好，我们在咖啡厅里第一次相遇。你点了一杯拿铁，我点了美式咖啡。我们聊了很久，从书籍到电影，从梦想到生活。那一刻，我知道我遇到了特别的人。",
      mood: "happy",
      image: "https://images.unsplash.com/photo-1511920170033-f8396924c348?w=400"
    },
    {
      id: 2,
      title: "第一次约会",
      date: "2023-01-22",
      location: "公园",
      content: "我们在公园里散步，看着夕阳西下。你说你喜欢这样安静的时光，我说我也是。我们在湖边坐下，看着天空慢慢变暗，星星一颗颗出现。",
      mood: "romantic",
      image: "https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?w=400"
    }
  ];

  const [stories, setStories] = useLocalStorage('love-diary-stories', initialStories);

  useEffect(() => {
    let mounted = true
    ;(async () => {
      try {
        const remote = await fetchStories()
        if (remote && mounted) {
          setStories(remote)
        }
      } catch {}
    })()
    const supabase = getSupabase()
    let channel
    ;(async () => {
      if (supabase) {
        channel = supabase.channel('stories-feed').on('postgres_changes', { event: '*', schema: 'public', table: 'stories' }, () => {
          ;(async () => { try { const remote = await fetchStories(); if (remote) setStories(remote) } catch {} })()
        }).subscribe()
      }
    })()
    return () => {
      mounted = false
      channel?.unsubscribe?.()
    }
  }, [])

  const addStory = async (newStory) => {
    const story = {
      ...newStory,
      date: newStory.date || new Date().toISOString().split('T')[0]
    }
    try {
      const created = await createStoryRemote(story)
      if (created) {
        setStories(prev => [created, ...prev])
        return
      }
    } catch {}
    const local = { ...story, id: Date.now() }
    setStories(prev => [local, ...prev])
  }

  const updateStory = async (id, updatedStory) => {
    try {
      const updated = await updateStoryRemote(id, updatedStory)
      if (updated) {
        setStories(prev => prev.map(story => story.id === id ? { ...story, ...updated } : story))
        return
      }
    } catch {}
    setStories(prev => prev.map(story => story.id === id ? { ...story, ...updatedStory } : story))
  }

  const deleteStory = async (id) => {
    try {
      const ok = await deleteStoryRemote(id)
      if (ok) {
        setStories(prev => prev.filter(story => story.id !== id))
        return
      }
    } catch {}
    setStories(prev => prev.filter(story => story.id !== id))
  }

  return { stories, addStory, updateStory, deleteStory };
};

// 专门用于相册数据的 hook
export const useGallery = () => {
  const initialPhotos = [
    {
      id: 1,
      url: "https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?w=800",
      title: "美好时光",
      date: "2023-01-15"
    },
    {
      id: 2,
      url: "https://images.unsplash.com/photo-1511920170033-f8396924c348?w=800",
      title: "浪漫晚餐",
      date: "2023-02-14"
    },
    {
      id: 3,
      url: "https://images.unsplash.com/photo-1518621012382-9e7706a0f2eb?w=800",
      title: "海边漫步",
      date: "2023-03-20"
    },
    {
      id: 4,
      url: "https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=800",
      title: "山顶日出",
      date: "2023-04-10"
    }
  ];

  const [photos, setPhotos] = useLocalStorage('love-diary-photos', initialPhotos);

  useEffect(() => {
    let mounted = true
    ;(async () => {
      try {
        const remote = await fetchPhotos()
        if (remote && mounted) {
          setPhotos(remote)
        }
      } catch {}
    })()
    const supabase = getSupabase()
    let channel
    ;(async () => {
      if (supabase) {
        channel = supabase.channel('photos-feed').on('postgres_changes', { event: '*', schema: 'public', table: 'photos' }, () => {
          ;(async () => { try { const remote = await fetchPhotos(); if (remote) setPhotos(remote) } catch {} })()
        }).subscribe()
      }
    })()
    return () => {
      mounted = false
      channel?.unsubscribe?.()
    }
  }, [])

  const appendLocalPhoto = (newPhoto) => {
    const tempId = Date.now()
    const local = { ...newPhoto, id: tempId, pending: true }
    setPhotos(prev => [local, ...prev])
    return tempId
  }

  const removeLocalOnly = (id) => {
    setPhotos(prev => prev.filter(p => p.id !== id))
  }

  const confirmPhoto = (tempId, remotePhoto) => {
    setPhotos(prev => {
      const withoutTemp = prev.filter(p => p.id !== tempId)
      return [remotePhoto, ...withoutTemp]
    })
  }

  const addPhoto = async (newPhoto) => {
    const photo = {
      ...newPhoto,
      date: newPhoto.date || new Date().toISOString().split('T')[0]
    }
    try {
      const created = await createPhotoRemote(photo)
      if (created) {
        setPhotos(prev => [created, ...prev])
        return
      }
    } catch {}
    const local = { ...photo, id: Date.now() }
    setPhotos(prev => [local, ...prev])
  }

  const deletePhoto = async (id) => {
    try {
      const ok = await deletePhotoRemote(id)
      if (ok) {
        setPhotos(prev => prev.filter(photo => photo.id !== id))
        return
      }
    } catch {}
    setPhotos(prev => prev.filter(photo => photo.id !== id))
  }

  const updatePhoto = async (id, updatedPhoto) => {
    try {
      const updated = await updatePhotoRemote(id, updatedPhoto)
      if (updated) {
        setPhotos(prev => prev.map(photo => photo.id === id ? { ...photo, ...updated } : photo))
        return
      }
    } catch {}
    setPhotos(prev => prev.map(photo => photo.id === id ? { ...photo, ...updatedPhoto } : photo))
  }

  return { photos, addPhoto, deletePhoto, updatePhoto, appendLocalPhoto, removeLocalOnly, confirmPhoto };
};

// 专门用于设置数据的 hook
export const useSettings = () => {
  const initialSettings = {
    partner1Name: "小明",
    partner2Name: "小红",
    dates: {
      startDate: "2023-01-15",
      anniversary: "2024-01-15"
    },
    theme: {
      color: "pink",
      darkMode: false
    },
    notifications: {
      anniversaryReminder: true,
      monthlyReminder: false,
      weeklyReminder: false
    }
  };

  const [settings, setSettings] = useLocalStorage('love-diary-settings', initialSettings);

  useEffect(() => {
    let mounted = true
    ;(async () => {
      try {
        const remote = await fetchSettingsRemote()
        if (remote && mounted) {
          setSettings(prev => ({ ...prev, ...remote }))
        }
      } catch {}
    })()
    return () => {
      mounted = false
    }
  }, [])

  const updateSettings = async (newSettings) => {
    const next = typeof newSettings === 'function' ? newSettings(settings) : newSettings
    try {
      const updated = await updateSettingsRemote({ ...settings, ...next })
      if (updated) {
        setSettings(prev => ({ ...prev, ...updated }))
        return
      }
    } catch {}
    setSettings(prev => ({ ...prev, ...next }))
  }

  const updateNotifications = async (notifications) => {
    const next = { notifications: { ...settings.notifications, ...notifications } }
    try {
      const updated = await updateSettingsRemote({ ...settings, ...next })
      if (updated) {
        setSettings(prev => ({ ...prev, ...updated }))
        return
      }
    } catch {}
    setSettings(prev => ({ ...prev, ...next }))
  }

  return { settings, updateSettings, updateNotifications };
};

export const useMilestones = () => {
  const initialMilestones = [
    { id: 1, date: '2023-05-01', event: '我们相遇了', emoji: '💕' },
    { id: 2, date: '2023-06-01', event: '确定关系', emoji: '💍' }
  ]
  const [milestones, setMilestones] = useLocalStorage('love-diary-milestones', initialMilestones)

  useEffect(() => {
    let mounted = true
    ;(async () => {
      try {
        const remote = await fetchMilestones()
        if (remote && mounted) setMilestones(remote)
      } catch {}
    })()
    return () => { mounted = false }
  }, [])

  const addMilestone = async (m) => {
    const item = { ...m, date: m.date || new Date().toISOString().split('T')[0] }
    try {
      const created = await createMilestoneRemote(item)
      if (created) { setMilestones(prev => [created, ...prev]); return }
    } catch {}
    const local = { ...item, id: Date.now() }
    setMilestones(prev => [local, ...prev])
  }

  const updateMilestone = async (id, updates) => {
    try {
      const updated = await updateMilestoneRemote(id, updates)
      if (updated) { setMilestones(prev => prev.map(x => x.id === id ? { ...x, ...updated } : x)); return }
    } catch {}
    setMilestones(prev => prev.map(x => x.id === id ? { ...x, ...updates } : x))
  }

  const deleteMilestone = async (id) => {
    try {
      const ok = await deleteMilestoneRemote(id)
      if (ok) { setMilestones(prev => prev.filter(x => x.id !== id)); return }
    } catch {}
    setMilestones(prev => prev.filter(x => x.id !== id))
  }

  return { milestones, addMilestone, updateMilestone, deleteMilestone }
}