import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Settings, Heart, User, Calendar, Palette, Bell, Save, Check } from 'lucide-react';
import { useSettings } from '../hooks/useLocalStorage';
import DataSync from '../components/DataSync';

const SettingsPage = () => {
  const { settings, updateSettings } = useSettings();
  const [localSettings, setLocalSettings] = useState(settings || {});
  const [saveStatus, setSaveStatus] = useState('saved'); // 'saved', 'saving', 'unsaved'
  const [supabaseUrl, setSupabaseUrl] = useState('');
  const [supabaseAnon, setSupabaseAnon] = useState('');

  // 当settings加载完成后，更新localSettings
  useEffect(() => {
    if (settings) {
      setLocalSettings(settings);
    }
  }, [settings]);

  useEffect(() => {
    try {
      setSupabaseUrl(localStorage.getItem('love-supabase-url') || '')
      setSupabaseAnon(localStorage.getItem('love-supabase-anon') || '')
    } catch {}
  }, [])

  // 监听设置变化并自动保存
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (JSON.stringify(localSettings) !== JSON.stringify(settings)) {
        setSaveStatus('saving');
        updateSettings(localSettings);
        setTimeout(() => setSaveStatus('saved'), 500);
      }
    }, 1000); // 1秒后自动保存

    return () => clearTimeout(timeoutId);
  }, [localSettings, settings, updateSettings]);

  // 检测是否有未保存的更改
  useEffect(() => {
    if (JSON.stringify(localSettings) !== JSON.stringify(settings)) {
      setSaveStatus('unsaved');
    }
  }, [localSettings, settings]);

  const handleInputChange = (field, value) => {
    setLocalSettings(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleNestedInputChange = (parent, field, value) => {
    setLocalSettings(prev => ({
      ...prev,
      [parent]: {
        ...(prev?.[parent] || {}),
        [field]: value
      }
    }));
  };

  const themeColors = [
    { name: '粉色', value: 'pink', color: 'bg-pink-500' },
    { name: '紫色', value: 'purple', color: 'bg-purple-500' },
    { name: '蓝色', value: 'blue', color: 'bg-blue-500' },
    { name: '绿色', value: 'green', color: 'bg-green-500' },
    { name: '橙色', value: 'orange', color: 'bg-orange-500' },
    { name: '红色', value: 'red', color: 'bg-red-500' }
  ];

  const SaveStatusIndicator = () => {
    switch (saveStatus) {
      case 'saving':
        return (
          <div className="flex items-center gap-2 text-blue-600 dark:text-blue-400">
            <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
            <span className="text-sm">保存中...</span>
          </div>
        );
      case 'saved':
        return (
          <div className="flex items-center gap-2 text-green-600 dark:text-green-400">
            <Check className="w-4 h-4" />
            <span className="text-sm">已保存</span>
          </div>
        );
      case 'unsaved':
        return (
          <div className="flex items-center gap-2 text-orange-600 dark:text-orange-400">
            <Save className="w-4 h-4" />
            <span className="text-sm">有未保存的更改</span>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-purple-900 py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* 页面标题 */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-4xl font-bold text-gray-800 dark:text-white mb-4">
            <Settings className="inline-block mr-3 text-pink-500" />
            设置中心
          </h1>
          <p className="text-gray-600 dark:text-gray-300 text-lg">
            个性化你的爱情日记
          </p>
          <div className="mt-4">
            <SaveStatusIndicator />
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* 基本信息 */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6"
          >
            <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-6 flex items-center">
              <User className="mr-3 text-pink-500" />
              基本信息
            </h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  你的名字
                </label>
                <input
                  type="text"
                  value={localSettings?.partner1Name || ''}
                  onChange={(e) => handleInputChange('partner1Name', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-800 dark:text-white transition-all duration-200"
                  placeholder="输入你的名字"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  TA的名字
                </label>
                <input
                  type="text"
                  value={localSettings?.partner2Name || ''}
                  onChange={(e) => handleInputChange('partner2Name', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-800 dark:text-white transition-all duration-200"
                  placeholder="输入TA的名字"
                />
              </div>
            </div>
          </motion.div>

          {/* 重要日期 */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6"
          >
            <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-6 flex items-center">
              <Calendar className="mr-3 text-pink-500" />
              重要日期
            </h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  恋爱开始日期
                </label>
                <input
                  type="date"
                  value={localSettings?.dates?.startDate || ''}
                  onChange={(e) => handleNestedInputChange('dates', 'startDate', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-800 dark:text-white transition-all duration-200"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  纪念日
                </label>
                <input
                  type="date"
                  value={localSettings?.dates?.anniversary || ''}
                  onChange={(e) => handleNestedInputChange('dates', 'anniversary', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-800 dark:text-white transition-all duration-200"
                />
              </div>
            </div>
          </motion.div>

          {/* 主题设置 */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6"
          >
            <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-6 flex items-center">
              <Palette className="mr-3 text-pink-500" />
              主题设置
            </h2>
            
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                  主题颜色
                </label>
                <div className="grid grid-cols-3 gap-3">
                  {themeColors.map((theme) => (
                    <motion.button
                      key={theme.value}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => handleNestedInputChange('theme', 'color', theme.value)}
                      className={`p-3 rounded-lg border-2 transition-all duration-200 ${
                        localSettings?.theme?.color === theme.value
                          ? 'border-pink-500 bg-pink-50 dark:bg-pink-900/20'
                          : 'border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500'
                      }`}
                    >
                      <div className={`w-8 h-8 ${theme.color} rounded-full mx-auto mb-2`}></div>
                      <div className="text-sm text-gray-700 dark:text-gray-300">{theme.name}</div>
                    </motion.button>
                  ))}
                </div>
              </div>
              
              <div>
                <label className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    深色模式
                  </span>
                  <motion.button
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleNestedInputChange('theme', 'darkMode', !localSettings?.theme?.darkMode)}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200 ${
                      localSettings?.theme?.darkMode ? 'bg-pink-500' : 'bg-gray-300 dark:bg-gray-600'
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-200 ${
                        localSettings?.theme?.darkMode ? 'translate-x-6' : 'translate-x-1'
                      }`}
                    />
                  </motion.button>
                </label>
              </div>
            </div>
          </motion.div>

          {/* 通知设置 */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6"
          >
            <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-6 flex items-center">
              <Bell className="mr-3 text-pink-500" />
              通知设置
            </h2>
            
            <div className="space-y-4">
              <label className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  纪念日提醒
                </span>
                <motion.button
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleNestedInputChange('notifications', 'anniversaryReminder', !localSettings?.notifications?.anniversaryReminder)}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200 ${
                    localSettings?.notifications?.anniversaryReminder ? 'bg-pink-500' : 'bg-gray-300 dark:bg-gray-600'
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-200 ${
                      localSettings?.notifications?.anniversaryReminder ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </motion.button>
              </label>
              
              <label className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  每月纪念日提醒
                </span>
                <motion.button
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleNestedInputChange('notifications', 'monthlyReminder', !localSettings?.notifications?.monthlyReminder)}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200 ${
                    localSettings?.notifications?.monthlyReminder ? 'bg-pink-500' : 'bg-gray-300 dark:bg-gray-600'
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-200 ${
                      localSettings?.notifications?.monthlyReminder ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </motion.button>
              </label>
            </div>
          </motion.div>

          {/* 云同步设置 */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.55 }}
            className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6"
          >
            <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-6 flex items-center">
              <Settings className="mr-3 text-pink-500" />
              云同步设置
            </h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Supabase URL</label>
                <input
                  type="text"
                  value={supabaseUrl}
                  onChange={(e) => setSupabaseUrl(e.target.value)}
                  placeholder="https://xxxxx.supabase.co"
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-800 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Anon Public Key</label>
                <input
                  type="password"
                  value={supabaseAnon}
                  onChange={(e) => setSupabaseAnon(e.target.value)}
                  placeholder="eyJhbGciOi..."
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-800 dark:text-white"
                />
              </div>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => {
                  try {
                    localStorage.setItem('love-supabase-url', supabaseUrl)
                    localStorage.setItem('love-supabase-anon', supabaseAnon)
                    alert('已保存，请重新登录以启用云同步')
                  } catch (e) {
                    alert('保存失败：' + e.message)
                  }
                }}
                className="w-full bg-gradient-to-r from-pink-500 to-purple-600 text-white py-3 px-6 rounded-xl"
              >
                保存云端配置
              </motion.button>
            </div>
          </motion.div>

          {/* 数据同步 */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
          >
            <DataSync />
          </motion.div>
        </div>

        {/* 装饰性爱心 */}
        <div className="fixed inset-0 pointer-events-none overflow-hidden">
          {[...Array(5)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute text-pink-200 dark:text-pink-800"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
              }}
              animate={{
                y: [-20, -40, -20],
                rotate: [0, 360],
                scale: [1, 1.2, 1],
              }}
              transition={{
                duration: 4 + Math.random() * 2,
                repeat: Infinity,
                delay: Math.random() * 2,
              }}
            >
              <Heart size={12 + Math.random() * 6} fill="currentColor" />
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;