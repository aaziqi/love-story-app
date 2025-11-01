import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Heart, BookOpen, Sparkles } from 'lucide-react';
import StoryCard from '../components/StoryCard';
import { useStories } from '../hooks/useLocalStorage';

const StoryPage = () => {
  const { stories, addStory, updateStory, deleteStory } = useStories();
  const [showForm, setShowForm] = useState(false);
  const [newStory, setNewStory] = useState({
    title: '',
    date: new Date().toISOString().split('T')[0],
    location: '',
    content: '',
    mood: 'happy',
    image: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (newStory.title && newStory.content) {
      addStory(newStory);
      setNewStory({
        title: '',
        date: new Date().toISOString().split('T')[0],
        location: '',
        content: '',
        mood: 'happy',
        image: ''
      });
      setShowForm(false);
    }
  };

  const moodOptions = [
    { value: 'happy', label: '😊 开心', color: 'from-yellow-400 to-orange-500' },
    { value: 'romantic', label: '💕 浪漫', color: 'from-pink-400 to-red-500' },
    { value: 'excited', label: '🎉 兴奋', color: 'from-purple-400 to-pink-500' },
    { value: 'peaceful', label: '😌 平静', color: 'from-blue-400 to-teal-500' },
    { value: 'grateful', label: '🙏 感恩', color: 'from-green-400 to-blue-500' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-purple-900 py-8">
      <div className="max-w-6xl mx-auto px-4">
        {/* 页面标题 */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <div className="flex items-center justify-center gap-3 mb-4">
            <BookOpen className="w-8 h-8 text-pink-500" />
            <h1 className="text-4xl font-bold bg-gradient-to-r from-pink-500 to-purple-600 bg-clip-text text-transparent">
              爱情故事集
            </h1>
            <Sparkles className="w-8 h-8 text-purple-500" />
          </div>
          <p className="text-gray-600 dark:text-gray-300 text-lg">
            记录我们的美好时光，每一个瞬间都值得珍藏
          </p>
        </motion.div>

        {/* 添加故事按钮 */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex justify-center mb-8"
        >
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowForm(!showForm)}
            className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-pink-500 to-purple-600 text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-300"
          >
            <Plus className="w-5 h-5" />
            <span className="font-medium">添加新故事</span>
          </motion.button>
        </motion.div>

        {/* 添加故事表单 */}
        <AnimatePresence>
          {showForm && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mb-8 overflow-hidden"
            >
              <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 max-w-2xl mx-auto">
                <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-4 flex items-center gap-2">
                  <Heart className="w-5 h-5 text-pink-500" />
                  分享新的美好回忆
                </h3>
                
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        故事标题
                      </label>
                      <input
                        type="text"
                        value={newStory.title}
                        onChange={(e) => setNewStory(prev => ({ ...prev, title: e.target.value }))}
                        className="love-input w-full"
                        placeholder="给这个美好时刻起个名字..."
                        required
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        日期
                      </label>
                      <input
                        type="date"
                        value={newStory.date}
                        onChange={(e) => setNewStory(prev => ({ ...prev, date: e.target.value }))}
                        className="love-input w-full"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        地点
                      </label>
                      <input
                        type="text"
                        value={newStory.location}
                        onChange={(e) => setNewStory(prev => ({ ...prev, location: e.target.value }))}
                        className="love-input w-full"
                        placeholder="在哪里发生的呢？"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        心情
                      </label>
                      <select
                        value={newStory.mood}
                        onChange={(e) => setNewStory(prev => ({ ...prev, mood: e.target.value }))}
                        className="love-input w-full"
                      >
                        {moodOptions.map(option => (
                          <option key={option.value} value={option.value}>
                            {option.label}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      图片链接 (可选)
                    </label>
                    <input
                      type="url"
                      value={newStory.image}
                      onChange={(e) => setNewStory(prev => ({ ...prev, image: e.target.value }))}
                      className="love-input w-full"
                      placeholder="https://example.com/image.jpg"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      故事内容
                    </label>
                    <textarea
                      value={newStory.content}
                      onChange={(e) => setNewStory(prev => ({ ...prev, content: e.target.value }))}
                      className="love-input w-full h-32 resize-none"
                      placeholder="分享这个美好的回忆..."
                      required
                    />
                  </div>

                  <div className="flex gap-3 pt-4">
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      type="submit"
                      className="flex-1 love-button"
                    >
                      保存故事
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      type="button"
                      onClick={() => setShowForm(false)}
                      className="px-6 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                    >
                      取消
                    </motion.button>
                  </div>
                </form>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* 故事列表 */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <AnimatePresence>
            {stories.map((story, index) => (
              <StoryCard
                key={story.id}
                story={story}
                index={index}
                onUpdate={updateStory}
                onDelete={deleteStory}
              />
            ))}
          </AnimatePresence>
        </div>

        {/* 空状态 */}
        {stories.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-16"
          >
            <BookOpen className="w-16 h-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
            <h3 className="text-xl font-medium text-gray-500 dark:text-gray-400 mb-2">
              还没有故事
            </h3>
            <p className="text-gray-400 dark:text-gray-500">
              点击上方按钮，开始记录你们的美好时光吧！
            </p>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default StoryPage;