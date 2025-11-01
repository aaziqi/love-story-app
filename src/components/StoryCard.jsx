import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MapPin, Calendar, Heart, Edit2, Trash2, Save, X } from 'lucide-react';

export default function StoryCard({ story, index, onUpdate, onDelete }) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedStory, setEditedStory] = useState(story);
  const {
    title = "美好回忆",
    date = "2023-05-01",
    location = "某个浪漫的地方",
    content = "这是我们的美好回忆...",
    image = null,
    mood = "happy"
  } = story;

  const moodColors = {
    happy: 'from-yellow-400 to-orange-500',
    romantic: 'from-pink-400 to-red-500',
    excited: 'from-purple-400 to-pink-500',
    peaceful: 'from-blue-400 to-teal-500',
    grateful: 'from-green-400 to-blue-500'
  };

  const moodEmojis = {
    happy: '😊',
    romantic: '💕',
    excited: '🎉',
    peaceful: '😌',
    grateful: '🙏'
  };

  const handleSave = () => {
    onUpdate(story.id, editedStory);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditedStory(story);
    setIsEditing(false);
  };

  const handleDelete = () => {
    if (window.confirm('确定要删除这个故事吗？')) {
      onDelete(story.id);
    }
  };

  return (
    <motion.div
      className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden love-card relative group"
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      whileHover={{ scale: 1.02, y: -5 }}
    >
      {/* 编辑/删除按钮 */}
      <div className="absolute top-4 right-4 z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
        <div className="flex gap-2">
          {!isEditing ? (
            <>
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setIsEditing(true)}
                className="p-2 bg-blue-500 text-white rounded-full shadow-lg hover:bg-blue-600 transition-colors"
              >
                <Edit2 className="w-4 h-4" />
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={handleDelete}
                className="p-2 bg-red-500 text-white rounded-full shadow-lg hover:bg-red-600 transition-colors"
              >
                <Trash2 className="w-4 h-4" />
              </motion.button>
            </>
          ) : (
            <>
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={handleSave}
                className="p-2 bg-green-500 text-white rounded-full shadow-lg hover:bg-green-600 transition-colors"
              >
                <Save className="w-4 h-4" />
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={handleCancel}
                className="p-2 bg-gray-500 text-white rounded-full shadow-lg hover:bg-gray-600 transition-colors"
              >
                <X className="w-4 h-4" />
              </motion.button>
            </>
          )}
        </div>
      </div>
      {/* 心情背景 */}
      <div className={`h-2 bg-gradient-to-r ${moodColors[mood]}`} />
      
      {/* 图片 */}
      {image && (
        <motion.div
          className="relative h-48 overflow-hidden"
          whileHover={{ scale: 1.05 }}
        >
          <img
            src={image}
            alt={title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
        </motion.div>
      )}

      <div className="p-6">
        {/* 标题和心情 */}
        <div className="flex items-center justify-between mb-4">
          {isEditing ? (
            <input
              type="text"
              value={editedStory.title}
              onChange={(e) => setEditedStory(prev => ({ ...prev, title: e.target.value }))}
              className="text-xl font-bold text-gray-800 dark:text-white bg-transparent border-b-2 border-pink-300 focus:border-pink-500 outline-none flex-1 mr-4"
            />
          ) : (
            <h3 className="text-xl font-bold text-gray-800 dark:text-white font-love">{title}</h3>
          )}
          
          {isEditing ? (
            <select
              value={editedStory.mood}
              onChange={(e) => setEditedStory(prev => ({ ...prev, mood: e.target.value }))}
              className="px-3 py-1 rounded-full bg-gradient-to-r from-pink-400 to-red-500 text-white text-sm font-medium"
            >
              {Object.keys(moodColors).map(moodKey => (
                <option key={moodKey} value={moodKey} className="text-gray-800">
                  {moodEmojis[moodKey]} {moodKey}
                </option>
              ))}
            </select>
          ) : (
            <div className={`px-3 py-1 rounded-full bg-gradient-to-r ${moodColors[mood]} text-white text-sm font-medium flex items-center gap-1`}>
              <span>{moodEmojis[mood]}</span>
              <span className="capitalize">{mood}</span>
            </div>
          )}
        </div>

        {/* 日期和地点 */}
        <div className="flex items-center space-x-4 mb-4 text-sm text-gray-600 dark:text-gray-300">
          <div className="flex items-center space-x-1">
            <Calendar size={16} />
            {isEditing ? (
              <input
                type="date"
                value={editedStory.date}
                onChange={(e) => setEditedStory(prev => ({ ...prev, date: e.target.value }))}
                className="bg-transparent border-b border-gray-300 focus:border-pink-500 outline-none"
              />
            ) : (
              <span>{new Date(date).toLocaleDateString('zh-CN')}</span>
            )}
          </div>
          <div className="flex items-center space-x-1">
            <MapPin size={16} />
            {isEditing ? (
              <input
                type="text"
                value={editedStory.location || ''}
                onChange={(e) => setEditedStory(prev => ({ ...prev, location: e.target.value }))}
                placeholder="地点"
                className="bg-transparent border-b border-gray-300 focus:border-pink-500 outline-none w-24"
              />
            ) : (
              <span>{location}</span>
            )}
          </div>
        </div>

        {/* 内容 */}
        {isEditing ? (
          <textarea
            value={editedStory.content}
            onChange={(e) => setEditedStory(prev => ({ ...prev, content: e.target.value }))}
            className="w-full text-gray-700 dark:text-gray-300 leading-relaxed mb-4 bg-transparent border border-gray-300 dark:border-gray-600 rounded-lg p-3 focus:border-pink-500 outline-none resize-none"
            rows="4"
          />
        ) : (
          <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">{content}</p>
        )}

        {/* 爱心装饰 */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-pink-500">
            <Heart className="w-4 h-4 fill-current" />
            <span className="text-sm font-medium">珍贵回忆</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}