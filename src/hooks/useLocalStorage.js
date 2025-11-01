import { useState, useEffect } from 'react';

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

  const addStory = (newStory) => {
    const story = {
      ...newStory,
      id: Date.now(), // 简单的ID生成
      date: newStory.date || new Date().toISOString().split('T')[0]
    };
    setStories(prev => [story, ...prev]);
  };

  const updateStory = (id, updatedStory) => {
    setStories(prev => prev.map(story => 
      story.id === id ? { ...story, ...updatedStory } : story
    ));
  };

  const deleteStory = (id) => {
    setStories(prev => prev.filter(story => story.id !== id));
  };

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

  const addPhoto = (newPhoto) => {
    const photo = {
      ...newPhoto,
      id: Date.now(),
      date: newPhoto.date || new Date().toISOString().split('T')[0]
    };
    setPhotos(prev => [photo, ...prev]);
  };

  const deletePhoto = (id) => {
    setPhotos(prev => prev.filter(photo => photo.id !== id));
  };

  const updatePhoto = (id, updatedPhoto) => {
    setPhotos(prev => prev.map(photo => 
      photo.id === id ? { ...photo, ...updatedPhoto } : photo
    ));
  };

  return { photos, addPhoto, deletePhoto, updatePhoto };
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

  const updateSettings = (newSettings) => {
    setSettings(prev => ({ ...prev, ...newSettings }));
  };

  const updateNotifications = (notifications) => {
    setSettings(prev => ({ 
      ...prev, 
      notifications: { ...prev.notifications, ...notifications }
    }));
  };

  return { settings, updateSettings, updateNotifications };
};