import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { X, Heart, Download, Share2, Trash2, Edit2, Save } from "lucide-react";

export default function Gallery({ photos = [], onDeletePhoto, onUpdatePhoto }) {
  const [selectedPhoto, setSelectedPhoto] = useState(null);
  const [editingPhoto, setEditingPhoto] = useState(null);
  const [editTitle, setEditTitle] = useState('');

  const handleEdit = (photo) => {
    setEditingPhoto(photo.id);
    setEditTitle(photo.title);
  };

  const handleSaveEdit = (photo) => {
    onUpdatePhoto(photo.id, { ...photo, title: editTitle });
    setEditingPhoto(null);
    setEditTitle('');
  };

  const handleCancelEdit = () => {
    setEditingPhoto(null);
    setEditTitle('');
  };

  const handleDelete = (photo) => {
    if (window.confirm('确定要删除这张照片吗？')) {
      onDeletePhoto(photo.id);
      if (selectedPhoto?.id === photo.id) {
        setSelectedPhoto(null);
      }
    }
  };

  // 示例照片数据
  const defaultPhotos = [
    {
      id: 1,
      url: "https://images.unsplash.com/photo-1518568814500-bf0f8d125f46?w=400",
      title: "第一次约会",
      date: "2023-05-01",
      description: "那个美好的开始"
    },
    {
      id: 2,
      url: "https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?w=400",
      title: "海边漫步",
      date: "2023-06-15",
      description: "夕阳下的浪漫"
    },
    {
      id: 3,
      url: "https://images.unsplash.com/photo-1511988617509-a57c8a288659?w=400",
      title: "生日惊喜",
      date: "2023-07-20",
      description: "最甜蜜的时刻"
    },
    {
      id: 4,
      url: "https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=400",
      title: "旅行回忆",
      date: "2023-08-10",
      description: "一起看世界"
    },
    {
      id: 5,
      url: "https://images.unsplash.com/photo-1522673607200-164d1b6ce486?w=400",
      title: "温馨时光",
      date: "2023-09-05",
      description: "平凡中的幸福"
    },
    {
      id: 6,
      url: "https://images.unsplash.com/photo-1518621736915-f3b1c41bfd00?w=400",
      title: "节日庆祝",
      date: "2023-10-01",
      description: "共度佳节"
    }
  ];

  const displayPhotos = photos.length > 0 ? photos : defaultPhotos;

  return (
    <div className="max-w-7xl mx-auto">
      {/* 相册网格 */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <AnimatePresence>
          {displayPhotos.map((photo, index) => (
            <motion.div
              key={photo.id}
              className="love-card overflow-hidden cursor-pointer group relative"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ scale: 1.05 }}
              onClick={() => setSelectedPhoto(photo)}
            >
              <div className="relative overflow-hidden">
                <img
                  src={photo.url}
                  alt={photo.title}
                  className="w-full h-64 object-cover transition-transform duration-300 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                
                {/* 管理按钮 */}
                <div className="absolute top-4 left-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10">
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleEdit(photo);
                    }}
                    className="p-2 bg-blue-500 text-white rounded-full shadow-lg hover:bg-blue-600 transition-colors"
                  >
                    <Edit2 size={16} />
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDelete(photo);
                    }}
                    className="p-2 bg-red-500 text-white rounded-full shadow-lg hover:bg-red-600 transition-colors"
                  >
                    <Trash2 size={16} />
                  </motion.button>
                </div>

                {/* 悬浮信息 */}
                <div className="absolute bottom-0 left-0 right-0 p-4 text-white transform translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                  {editingPhoto === photo.id ? (
                    <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
                      <input
                        type="text"
                        value={editTitle}
                        onChange={(e) => setEditTitle(e.target.value)}
                        className="flex-1 px-2 py-1 text-sm border border-gray-300 rounded bg-white text-gray-800 focus:outline-none focus:border-pink-500"
                      />
                      <button
                        onClick={() => handleSaveEdit(photo)}
                        className="p-1 text-green-400 hover:text-green-300"
                      >
                        <Save size={16} />
                      </button>
                      <button
                        onClick={handleCancelEdit}
                        className="p-1 text-gray-400 hover:text-gray-300"
                      >
                        <X size={16} />
                      </button>
                    </div>
                  ) : (
                    <>
                      <h3 className="font-bold text-lg mb-1">{photo.title}</h3>
                      <p className="text-sm opacity-90">{photo.description}</p>
                      <p className="text-xs opacity-75 mt-1">
                        {new Date(photo.date).toLocaleDateString('zh-CN')}
                      </p>
                    </>
                  )}
                </div>

                {/* 爱心装饰 */}
                <motion.div
                  className="absolute top-4 right-4 text-white opacity-0 group-hover:opacity-100"
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                >
                  <Heart size={24} fill="currentColor" />
                </motion.div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* 照片查看器 */}
      {selectedPhoto && (
        <motion.div
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setSelectedPhoto(null)}
        >
          <motion.div
            className="relative max-w-4xl max-h-full bg-white rounded-2xl overflow-hidden"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* 关闭按钮 */}
            <button
              onClick={() => setSelectedPhoto(null)}
              className="absolute top-4 right-4 z-10 p-2 bg-black/50 text-white rounded-full hover:bg-black/70 transition-colors"
            >
              <X size={20} />
            </button>

            {/* 操作按钮 */}
            <div className="absolute top-4 left-4 z-10 flex space-x-2">
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => handleEdit(selectedPhoto)}
                className="p-2 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition-colors"
              >
                <Edit2 size={20} />
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => handleDelete(selectedPhoto)}
                className="p-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
              >
                <Trash2 size={20} />
              </motion.button>
              <button className="p-2 bg-black/50 text-white rounded-full hover:bg-black/70 transition-colors">
                <Download size={20} />
              </button>
              <button className="p-2 bg-black/50 text-white rounded-full hover:bg-black/70 transition-colors">
                <Share2 size={20} />
              </button>
            </div>

            {/* 图片 */}
            <img
              src={selectedPhoto.url}
              alt={selectedPhoto.title}
              className="w-full h-auto max-h-[70vh] object-contain"
            />

            {/* 图片信息 */}
            <div className="p-6 bg-gradient-to-t from-white to-lightPink">
              <h2 className="text-2xl font-bold text-gray-800 mb-2 font-love">
                {selectedPhoto.title}
              </h2>
              <p className="text-gray-600 mb-2">{selectedPhoto.description}</p>
              <p className="text-sm text-gray-500">
                📅 {new Date(selectedPhoto.date).toLocaleDateString('zh-CN')}
              </p>
            </div>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
}