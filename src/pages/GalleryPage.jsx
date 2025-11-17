import React, { useState } from 'react';
import { motion } from "framer-motion";
import Gallery from "../components/Gallery";
import { Camera, Heart, Upload, Image as ImageIcon } from "lucide-react";
import { useGallery } from '../hooks/useLocalStorage';
import { uploadPhotoFile } from '../services/db';

export default function GalleryPage() {
  const { photos, addPhoto, updatePhoto, deletePhoto, appendLocalPhoto, removeLocalOnly } = useGallery();
  const [isUploading, setIsUploading] = useState(false);

  const handleFileUpload = async (event) => {
    const files = Array.from(event.target.files)
    if (files.length === 0) return
    setIsUploading(true)
    try {
      for (const file of files) {
        if (!file.type.startsWith('image/')) continue
        const reader = new FileReader()
        reader.onload = (e) => {
          const tempPhoto = {
            url: e.target.result,
            title: file.name.split('.')[0],
            description: '美好回忆',
            date: new Date().toISOString().split('T')[0]
          }
          const tempId = appendLocalPhoto(tempPhoto)
          ;(async () => {
            try {
              await uploadPhotoFile(file)
              removeLocalOnly(tempId)
            } catch {}
          })()
        }
        reader.readAsDataURL(file)
      }
    } finally {
      setIsUploading(false)
    }
  };

  // 计算统计数据
  const totalPhotos = photos.length;
  const monthsCount = new Set(photos.map(photo => 
    new Date(photo.date).toISOString().slice(0, 7)
  )).size;
  const memoriesCount = photos.length;

  return (
    <div className="min-h-screen pt-20 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* 页面标题 */}
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <div className="flex items-center justify-center mb-6">
            <Camera className="text-deepPink mr-3" size={40} />
            <h1 className="text-4xl md:text-5xl font-bold text-deepPink font-love">
              甜蜜相册
            </h1>
            <Heart className="text-deepPink ml-3" size={40} fill="currentColor" />
          </div>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            珍藏每一个幸福瞬间，让美好的回忆永远闪闪发光
          </p>
        </motion.div>

        {/* 上传按钮 */}
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <div className="relative">
            <input
              type="file"
              multiple
              accept="image/*"
              onChange={handleFileUpload}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              id="photo-upload"
            />
            <motion.label
              htmlFor="photo-upload"
              className="love-button inline-flex items-center space-x-2 cursor-pointer"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {isUploading ? <span>上传中...</span> : (<>
                <Upload size={20} />
                <span>上传新照片</span>
              </>)}
            </motion.label>
          </div>
        </motion.div>

        {/* 统计信息 */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <div className="love-card text-center">
            <div className="text-3xl font-bold text-deepPink mb-2">{totalPhotos}</div>
            <div className="text-gray-600">张照片</div>
          </div>
          <div className="love-card text-center">
            <div className="text-3xl font-bold text-lovePink mb-2">{monthsCount}</div>
            <div className="text-gray-600">个月份</div>
          </div>
          <div className="love-card text-center">
            <div className="text-3xl font-bold text-pink-400 mb-2">{memoriesCount}</div>
            <div className="text-gray-600">份回忆</div>
          </div>
        </motion.div>

        {/* 相册组件 */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
        >
          {photos.length > 0 ? (
            <Gallery 
              photos={photos}
              onUpdatePhoto={updatePhoto}
              onDeletePhoto={deletePhoto}
            />
          ) : (
            <div className="text-center py-20">
              <ImageIcon className="w-24 h-24 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-600 mb-2">
                还没有照片
              </h3>
              <p className="text-gray-500 mb-6">
                上传第一张照片，开始记录美好时光
              </p>
              <label
                htmlFor="photo-upload"
                className="love-button inline-flex items-center space-x-2 cursor-pointer"
              >
                <Upload size={20} />
                <span>上传照片</span>
              </label>
            </div>
          )}
        </motion.div>

        {/* 爱心装饰 */}
        <motion.div
          className="flex justify-center mt-16"
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ duration: 3, repeat: Infinity }}
        >
          <div className="flex space-x-4">
            {[...Array(7)].map((_, i) => (
              <motion.div
                key={i}
                animate={{
                  y: [0, -20, 0],
                  rotate: [0, 10, -10, 0]
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  delay: i * 0.3
                }}
              >
                <Heart
                  className="text-lovePink opacity-60"
                  size={20}
                  fill="currentColor"
                />
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}