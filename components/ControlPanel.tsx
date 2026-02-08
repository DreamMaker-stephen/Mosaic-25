import React, { useRef } from 'react';
import { Download, Trash2, UploadCloud, Settings, AlertCircle } from 'lucide-react';
import { GridConfig } from '../types';

interface ControlPanelProps {
  config: GridConfig;
  setConfig: React.Dispatch<React.SetStateAction<GridConfig>>;
  onBatchUpload: (files: FileList) => void;
  onClearAll: () => void;
  onExport: () => void;
  isExporting: boolean;
  filledCount: number;
}

const ControlPanel: React.FC<ControlPanelProps> = ({
  config,
  setConfig,
  onBatchUpload,
  onClearAll,
  onExport,
  isExporting,
  filledCount
}) => {
  const batchInputRef = useRef<HTMLInputElement>(null);

  const handleGapChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setConfig(prev => ({ ...prev, gap: parseInt(e.target.value) || 0 }));
  };

  const handleBatchFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      onBatchUpload(e.target.files);
    }
    if (batchInputRef.current) batchInputRef.current.value = '';
  };

  return (
    <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-xl p-6 h-fit sticky top-6 shadow-xl">
      <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
        <Settings size={20} className="text-blue-400" />
        设置 / Controls
      </h2>

      {/* Batch Upload */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-slate-400 mb-2">批量上传 / Batch Upload</label>
        <button
          onClick={() => batchInputRef.current?.click()}
          className="w-full py-3 px-4 bg-slate-700 hover:bg-slate-600 text-white rounded-lg flex items-center justify-center gap-2 transition-colors border border-slate-600"
        >
          <UploadCloud size={18} />
          <span>上传多张图片 (Upload Multiple)</span>
        </button>
        <input
          type="file"
          multiple
          ref={batchInputRef}
          className="hidden"
          accept="image/*"
          onChange={handleBatchFileChange}
        />
        <p className="text-xs text-slate-500 mt-2">
          选择多张图片自动填充空位。
          <br/>
          Select multiple files to auto-fill empty slots.
        </p>
      </div>

      <hr className="border-slate-700 my-6" />

      {/* Configuration */}
      <div className="mb-6 space-y-4">
        <div>
          <label className="flex justify-between text-sm font-medium text-slate-400 mb-2">
            <span>间距 / Grid Gap (px)</span>
            <span className="text-white">{config.gap}px</span>
          </label>
          <input
            type="range"
            min="0"
            max="50"
            value={config.gap}
            onChange={handleGapChange}
            className="w-full h-2 bg-slate-600 rounded-lg appearance-none cursor-pointer accent-blue-500"
          />
        </div>
        
        <div>
           <label className="block text-sm font-medium text-slate-400 mb-2">背景色 / Background</label>
           <div className="flex gap-2">
             {['#000000', '#ffffff', '#1e293b'].map(color => (
               <button
                key={color}
                onClick={() => setConfig(prev => ({ ...prev, backgroundColor: color }))}
                className={`w-8 h-8 rounded-full border-2 ${config.backgroundColor === color ? 'border-blue-500 scale-110' : 'border-slate-600'} transition-all`}
                style={{ backgroundColor: color }}
               />
             ))}
           </div>
        </div>
      </div>

      <hr className="border-slate-700 my-6" />

      {/* Actions */}
      <div className="space-y-3">
        <button
          onClick={onExport}
          disabled={isExporting || filledCount === 0}
          className={`w-full py-3 px-4 rounded-lg flex items-center justify-center gap-2 font-semibold transition-all shadow-lg
            ${isExporting || filledCount === 0 
              ? 'bg-slate-700 text-slate-500 cursor-not-allowed' 
              : 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white hover:shadow-blue-500/25'}
          `}
        >
          {isExporting ? (
            <div className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full" />
          ) : (
            <Download size={20} />
          )}
          <span>{isExporting ? '生成中... / Generating...' : '导出图片 (Export Image)'}</span>
        </button>

        <button
          onClick={onClearAll}
          disabled={filledCount === 0}
          className="w-full py-3 px-4 bg-transparent hover:bg-red-900/20 text-red-400 hover:text-red-300 rounded-lg flex items-center justify-center gap-2 transition-colors border border-transparent hover:border-red-900/50"
        >
          <Trash2 size={18} />
          <span>清空所有 / Clear All</span>
        </button>
      </div>

      <div className="mt-4 flex items-start gap-2 text-xs text-slate-500 bg-slate-900/50 p-3 rounded-lg">
        <AlertCircle size={14} className="shrink-0 mt-0.5" />
        <p>所有图片均在本地浏览器处理，不会上传到服务器。<br/>Images are processed locally. No data is uploaded.</p>
      </div>
    </div>
  );
};

export default ControlPanel;