import { useState } from 'react';
import { motion } from 'framer-motion';
import { Download, Upload, RefreshCw, AlertCircle, CheckCircle } from 'lucide-react';
import { useStories, useGallery, useSettings } from '../hooks/useLocalStorage';

export default function DataSync() {
  const { stories } = useStories();
  const { photos } = useGallery();
  const { settings } = useSettings();
  const [isExporting, setIsExporting] = useState(false);
  const [isImporting, setIsImporting] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  // 导出所有数据
  const exportData = async () => {
    setIsExporting(true);
    try {
      const allData = {
        stories,
        photos,
        settings,
        exportDate: new Date().toISOString(),
        version: '1.0'
      };

      const dataStr = JSON.stringify(allData, null, 2);
      const dataBlob = new Blob([dataStr], { type: 'application/json' });
      const url = URL.createObjectURL(dataBlob);
      
      const link = document.createElement('a');
      link.href = url;
      link.download = `love-story-backup-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      setMessage({ type: 'success', text: '数据导出成功！文件已下载到您的设备。' });
    } catch (error) {
      setMessage({ type: 'error', text: '导出失败：' + error.message });
    } finally {
      setIsExporting(false);
      setTimeout(() => setMessage({ type: '', text: '' }), 3000);
    }
  };

  // 导入数据
  const importData = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    setIsImporting(true);
    const reader = new FileReader();
    
    reader.onload = (e) => {
      try {
        const importedData = JSON.parse(e.target.result);
        
        // 验证数据格式
        if (!importedData.stories || !importedData.photos || !importedData.settings) {
          throw new Error('数据格式不正确');
        }

        // 确认导入
        if (window.confirm('导入数据将覆盖当前所有数据，确定要继续吗？')) {
          // 保存到localStorage
          localStorage.setItem('love-diary-stories', JSON.stringify(importedData.stories));
          localStorage.setItem('love-diary-photos', JSON.stringify(importedData.photos));
          localStorage.setItem('love-diary-settings', JSON.stringify(importedData.settings));
          
          setMessage({ type: 'success', text: '数据导入成功！请刷新页面查看更新。' });
          
          // 3秒后自动刷新页面
          setTimeout(() => {
            window.location.reload();
          }, 3000);
        }
      } catch (error) {
        setMessage({ type: 'error', text: '导入失败：' + error.message });
      } finally {
        setIsImporting(false);
        event.target.value = ''; // 清空文件输入
        setTimeout(() => setMessage({ type: '', text: '' }), 3000);
      }
    };
    
    reader.readAsText(file);
  };

  return (
    <motion.div
      className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-md rounded-2xl p-6 shadow-lg border border-white/20 dark:border-gray-700/20"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="flex items-center mb-6">
        <RefreshCw className="w-6 h-6 text-blue-500 mr-3" />
        <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200">
          数据同步
        </h3>
      </div>

      <div className="space-y-4">
        {/* 说明文字 */}
        <div className="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-4">
          <div className="flex items-start space-x-3">
            <AlertCircle className="w-5 h-5 text-blue-500 mt-0.5 flex-shrink-0" />
            <div className="text-sm text-blue-700 dark:text-blue-300">
              <p className="font-medium mb-1">跨设备数据同步说明：</p>
              <p>由于应用使用本地存储，不同设备间的数据无法自动同步。您可以使用以下功能在设备间手动同步数据：</p>
            </div>
          </div>
        </div>

        {/* 导出数据 */}
        <motion.button
          onClick={exportData}
          disabled={isExporting}
          className="w-full flex items-center justify-center space-x-3 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white py-3 px-6 rounded-xl font-medium transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          {isExporting ? (
            <RefreshCw className="w-5 h-5 animate-spin" />
          ) : (
            <Download className="w-5 h-5" />
          )}
          <span>{isExporting ? '导出中...' : '导出数据到文件'}</span>
        </motion.button>

        {/* 导入数据 */}
        <div className="relative">
          <input
            type="file"
            accept=".json"
            onChange={importData}
            disabled={isImporting}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed"
            id="import-file"
          />
          <motion.label
            htmlFor="import-file"
            className="w-full flex items-center justify-center space-x-3 bg-gradient-to-r from-green-500 to-teal-600 hover:from-green-600 hover:to-teal-700 text-white py-3 px-6 rounded-xl font-medium transition-all duration-300 cursor-pointer disabled:opacity-50"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            {isImporting ? (
              <RefreshCw className="w-5 h-5 animate-spin" />
            ) : (
              <Upload className="w-5 h-5" />
            )}
            <span>{isImporting ? '导入中...' : '从文件导入数据'}</span>
          </motion.label>
        </div>

        {/* 使用说明 */}
        <div className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-4">
          <h4 className="font-medium text-gray-800 dark:text-gray-200 mb-2">使用方法：</h4>
          <ol className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
            <li>1. 在源设备上点击"导出数据到文件"下载备份文件</li>
            <li>2. 将备份文件传输到目标设备（如通过邮件、云盘等）</li>
            <li>3. 在目标设备上点击"从文件导入数据"选择备份文件</li>
            <li>4. 确认导入后页面将自动刷新显示同步的数据</li>
          </ol>
        </div>

        {/* 消息提示 */}
        {message.text && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`flex items-center space-x-2 p-3 rounded-xl ${
              message.type === 'success' 
                ? 'bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300' 
                : 'bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300'
            }`}
          >
            {message.type === 'success' ? (
              <CheckCircle className="w-5 h-5" />
            ) : (
              <AlertCircle className="w-5 h-5" />
            )}
            <span className="text-sm font-medium">{message.text}</span>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
}