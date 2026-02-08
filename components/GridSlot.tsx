import React, { useRef } from 'react';
import { Upload, X, RefreshCw } from 'lucide-react';
import { GridItem } from '../types';

interface GridSlotProps {
  item: GridItem;
  index: number;
  onUpload: (index: number, file: File) => void;
  onRemove: (index: number) => void;
}

const GridSlot: React.FC<GridSlotProps> = ({ item, index, onUpload, onRemove }) => {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      onUpload(index, e.target.files[0]);
    }
    // Reset input so same file can be selected again if needed
    if (inputRef.current) {
      inputRef.current.value = '';
    }
  };

  const handleClick = () => {
    if (!item.previewUrl) {
      inputRef.current?.click();
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      onUpload(index, e.dataTransfer.files[0]);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  return (
    <div
      className={`relative group aspect-square rounded-lg overflow-hidden border-2 transition-all duration-200 
        ${item.previewUrl ? 'border-transparent' : 'border-dashed border-slate-600 hover:border-blue-500 hover:bg-slate-800 cursor-pointer'}
      `}
      onClick={handleClick}
      onDrop={handleDrop}
      onDragOver={handleDragOver}
    >
      <input
        type="file"
        ref={inputRef}
        className="hidden"
        accept="image/*"
        onChange={handleFileChange}
      />

      {item.previewUrl ? (
        <>
          <img
            src={item.previewUrl}
            alt={`Slot ${index + 1}`}
            className="w-full h-full object-cover"
          />
          {/* Overlay Actions */}
          <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-2">
            <button
              onClick={(e) => {
                e.stopPropagation();
                inputRef.current?.click();
              }}
              className="p-2 bg-blue-600 rounded-full hover:bg-blue-500 text-white shadow-lg transform hover:scale-105 transition-transform"
              title="Replace Image / 更换图片"
            >
              <RefreshCw size={18} />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onRemove(index);
              }}
              className="p-2 bg-red-600 rounded-full hover:bg-red-500 text-white shadow-lg transform hover:scale-105 transition-transform"
              title="Remove Image / 移除图片"
            >
              <X size={18} />
            </button>
          </div>
          <div className="absolute top-1 left-1 bg-black/40 text-white text-[10px] px-1.5 py-0.5 rounded backdrop-blur-sm">
            {index + 1}
          </div>
        </>
      ) : (
        <div className="flex flex-col items-center justify-center h-full text-slate-500 group-hover:text-blue-400">
          <Upload size={24} className="mb-2" />
          <span className="text-xs font-medium">添加/Add</span>
          <span className="text-[10px] opacity-50 absolute bottom-1 right-2">{index + 1}</span>
        </div>
      )}
    </div>
  );
};

export default GridSlot;