import React, { useState, useCallback } from 'react';
import { Image as ImageIcon } from 'lucide-react';
import { GridItem, GridConfig, TOTAL_SLOTS } from '../types';
import GridSlot from './GridSlot';
import ControlPanel from './ControlPanel';
import { generateGridImage, downloadImage } from '../utils/canvasGenerator';

const initialItems: GridItem[] = Array.from({ length: TOTAL_SLOTS }, (_, i) => ({
  id: `slot-${i}`,
  file: null,
  previewUrl: null
}));

const initialConfig: GridConfig = {
  gap: 4,
  backgroundColor: '#ffffff',
  exportSize: 2000,
};

interface PackModeProps {
  onUsed?: () => void;
}

const PackMode: React.FC<PackModeProps> = ({ onUsed }) => {
  const [items, setItems] = useState<GridItem[]>(initialItems);
  const [config, setConfig] = useState<GridConfig>(initialConfig);
  const [isExporting, setIsExporting] = useState(false);

  const handleUpload = useCallback((index: number, file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      setItems((prev) => {
        const newItems = [...prev];
        newItems[index] = {
          ...newItems[index],
          file: file,
          previewUrl: e.target?.result as string,
        };
        return newItems;
      });
    };
    reader.readAsDataURL(file);
  }, []);

  const handleRemove = useCallback((index: number) => {
    setItems((prev) => {
      const newItems = [...prev];
      newItems[index] = { ...newItems[index], file: null, previewUrl: null };
      return newItems;
    });
  }, []);

  const handleBatchUpload = useCallback((files: FileList) => {
    const fileArray = Array.from(files);
    
    // Preliminary check or state logic
    let currentFileIndex = 0;
    const processNextFile = (currentItems: GridItem[]) => {
      if (currentFileIndex >= fileArray.length) {
        setItems(currentItems);
        return;
      }

      const file = fileArray[currentFileIndex];
      const emptyIndex = currentItems.findIndex(item => item.previewUrl === null);
      
      if (emptyIndex === -1) {
        setItems(currentItems);
        return;
      }

      const reader = new FileReader();
      reader.onload = (e) => {
        const updatedItems = [...currentItems];
        updatedItems[emptyIndex] = {
          ...updatedItems[emptyIndex],
          file: file,
          previewUrl: e.target?.result as string
        };
        currentFileIndex++;
        processNextFile(updatedItems);
      };
      reader.readAsDataURL(file);
    };

    processNextFile([...items]);
  }, [items]);

  const handleClearAll = useCallback(() => {
    if (window.confirm('确定要清空所有图片吗？\nAre you sure you want to clear all images?')) {
      setItems(initialItems);
    }
  }, []);

  const handleExport = useCallback(async () => {
    setIsExporting(true);
    setTimeout(async () => {
      try {
        const dataUrl = await generateGridImage(items, config, 5);
        const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
        downloadImage(dataUrl, `mosaic-25-pack-${timestamp}.png`);
        onUsed?.();
      } catch (error) {
        console.error("Export failed", error);
        alert("导出失败，请重试。\nFailed to generate image. Please try again.");
      } finally {
        setIsExporting(false);
      }
    }, 100);
  }, [items, config, onUsed]);

  const filledCount = items.filter(i => i.previewUrl !== null).length;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 animate-in fade-in duration-500">
      {/* Left Column: The Grid */}
      <div className="lg:col-span-8 flex flex-col items-center">
        <div 
          className="w-full max-w-[600px] aspect-square bg-slate-800 rounded-xl overflow-hidden shadow-2xl border border-slate-700 relative"
          style={{ padding: `${config.gap > 0 ? '16px' : '0'}`}} 
        >
          <div 
              className="grid grid-cols-5 w-full h-full"
              style={{ 
                  gap: `${config.gap}px`, 
                  backgroundColor: config.backgroundColor 
              }}
          >
            {items.map((item, index) => (
              <GridSlot
                key={item.id}
                index={index}
                item={item}
                onUpload={handleUpload}
                onRemove={handleRemove}
              />
            ))}
          </div>
        </div>
        
        <div className="mt-6 flex flex-col items-center gap-2 text-slate-500 text-sm">
          <div className="flex items-center gap-2">
              <ImageIcon size={16} />
              <span>直接拖放图片到方格中 / Drag and drop images directly onto slots</span>
          </div>
        </div>
      </div>

      {/* Right Column: Controls */}
      <div className="lg:col-span-4">
        <ControlPanel
          config={config}
          setConfig={setConfig}
          onBatchUpload={handleBatchUpload}
          onClearAll={handleClearAll}
          onExport={handleExport}
          isExporting={isExporting}
          filledCount={filledCount}
        />
      </div>
    </div>
  );
};

export default PackMode;