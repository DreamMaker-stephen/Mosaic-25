import React, { useState, useRef } from 'react';
import { UploadCloud, Scissors, Download, RefreshCw, LayoutGrid } from 'lucide-react';
import { GridItem, GridSplitSize } from '../types';
import { splitImage, downloadZip } from '../utils/imageHelper';
import GridSlot from './GridSlot';
import { downloadImage } from '../utils/canvasGenerator';

const SplitMode: React.FC = () => {
  const [gridSize, setGridSize] = useState<GridSplitSize>(5);
  const [items, setItems] = useState<GridItem[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const uploadInputRef = useRef<HTMLInputElement>(null);

  const handleMainUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || !e.target.files[0]) return;
    
    const file = e.target.files[0];
    setIsProcessing(true);
    
    try {
      const splitUrls = await splitImage(file, gridSize, gridSize);
      
      const newItems: GridItem[] = splitUrls.map((url, i) => ({
        id: `split-${i}`,
        file: null, // We don't have the File object for generated splits, just URL
        previewUrl: url
      }));
      
      setItems(newItems);
    } catch (err) {
      console.error(err);
      alert("图片拆分失败 / Failed to split image.");
    } finally {
      setIsProcessing(false);
      // Reset input
      if (uploadInputRef.current) uploadInputRef.current.value = '';
    }
  };

  const handleSlotUpload = (index: number, file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      setItems(prev => {
        const next = [...prev];
        next[index] = {
          ...next[index],
          file: file,
          previewUrl: e.target?.result as string
        };
        return next;
      });
    };
    reader.readAsDataURL(file);
  };

  const handleSlotRemove = (index: number) => {
     // For split mode, remove just clears it, making it empty
    setItems(prev => {
      const next = [...prev];
      next[index] = { ...next[index], file: null, previewUrl: null };
      return next;
    });
  };

  const handleDownloadAll = async () => {
    if (items.length === 0) return;
    setIsProcessing(true);
    try {
        const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
        await downloadZip(items.map(i => i.previewUrl), `mosaic-${gridSize}x${gridSize}-split-${timestamp}.zip`);
    } catch (e) {
        console.error(e);
        alert("打包失败 / Failed to zip images");
    } finally {
        setIsProcessing(false);
    }
  };

  const handleReset = () => {
    if (window.confirm("确定要重新开始吗？当前内容将丢失。\nStart over? This will clear current split.")) {
        setItems([]);
    }
  };

  // Dynamically calculate grid columns style
  const gridStyle = {
    display: 'grid',
    gridTemplateColumns: `repeat(${gridSize}, minmax(0, 1fr))`,
    gap: '4px',
  };

  return (
    <div className="animate-in fade-in duration-500">
      {items.length === 0 ? (
        // Empty State / Upload View
        <div className="max-w-xl mx-auto mt-12 p-8 border-2 border-dashed border-slate-700 rounded-2xl bg-slate-800/30 text-center">
            <div className="mb-6 flex justify-center">
                <div className="p-4 bg-blue-600/20 rounded-full text-blue-400">
                    <Scissors size={48} />
                </div>
            </div>
            <h2 className="text-2xl font-bold text-white mb-2">图片拆分 / Split Image</h2>
            <p className="text-slate-400 mb-8">上传一张大图自动拆分为宫格图<br/>Upload one large image to automatically split it into tiles.</p>

            <div className="flex justify-center gap-4 mb-8">
                <button 
                    onClick={() => setGridSize(3)}
                    className={`flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all ${gridSize === 3 ? 'border-blue-500 bg-blue-500/10' : 'border-slate-700 hover:border-slate-600'}`}
                >
                    <LayoutGrid size={24} className={gridSize === 3 ? 'text-blue-400' : 'text-slate-500'} />
                    <span className="text-sm font-medium">3x3 (9宫格/9-Grid)</span>
                </button>
                <button 
                    onClick={() => setGridSize(5)}
                    className={`flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all ${gridSize === 5 ? 'border-blue-500 bg-blue-500/10' : 'border-slate-700 hover:border-slate-600'}`}
                >
                     <div className="grid grid-cols-2 gap-0.5">
                        <LayoutGrid size={10} className={gridSize === 5 ? 'text-blue-400' : 'text-slate-500'} />
                        <LayoutGrid size={10} className={gridSize === 5 ? 'text-blue-400' : 'text-slate-500'} />
                        <LayoutGrid size={10} className={gridSize === 5 ? 'text-blue-400' : 'text-slate-500'} />
                        <LayoutGrid size={10} className={gridSize === 5 ? 'text-blue-400' : 'text-slate-500'} />
                     </div>
                    <span className="text-sm font-medium">5x5 (25宫格/25-Grid)</span>
                </button>
            </div>

            <button
                onClick={() => uploadInputRef.current?.click()}
                disabled={isProcessing}
                className="px-8 py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-lg font-semibold flex items-center gap-2 mx-auto transition-colors shadow-lg shadow-blue-500/20"
            >
                {isProcessing ? <div className="animate-spin w-5 h-5 border-2 border-white border-t-transparent rounded-full" /> : <UploadCloud size={20} />}
                <span>选择图片 (Select Image)</span>
            </button>
            <input 
                type="file" 
                ref={uploadInputRef} 
                className="hidden" 
                accept="image/*" 
                onChange={handleMainUpload} 
            />
        </div>
      ) : (
        // Result View
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <div className="lg:col-span-8 flex flex-col items-center">
                 <div className="w-full max-w-[600px] aspect-square bg-slate-800 rounded-xl overflow-hidden shadow-2xl border border-slate-700 p-4">
                    <div style={gridStyle} className="w-full h-full bg-slate-900">
                        {items.map((item, index) => (
                            <GridSlot
                                key={item.id}
                                index={index}
                                item={item}
                                onUpload={handleSlotUpload}
                                onRemove={handleSlotRemove}
                            />
                        ))}
                    </div>
                 </div>
                 <div className="mt-4 text-sm text-slate-500 flex gap-4">
                     <p>点击任意方格可替换图片 / Click any tile to replace it.</p>
                 </div>
            </div>
            
            <div className="lg:col-span-4">
                <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-xl p-6 h-fit sticky top-6 shadow-xl">
                    <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                        <Scissors size={20} className="text-blue-400" />
                        拆分操作 / Actions
                    </h2>
                    
                    <div className="space-y-3">
                         <div className="p-4 bg-slate-900/50 rounded-lg border border-slate-700 mb-4">
                            <span className="text-slate-400 text-sm block mb-1">Grid Type</span>
                            <span className="text-white font-medium flex items-center gap-2">
                                <LayoutGrid size={16} />
                                {gridSize}x{gridSize} ({gridSize * gridSize} 格/Tiles)
                            </span>
                         </div>

                        <button
                            onClick={handleDownloadAll}
                            disabled={isProcessing}
                            className="w-full py-3 px-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white rounded-lg flex items-center justify-center gap-2 font-semibold transition-all shadow-lg"
                        >
                            {isProcessing ? (
                                <div className="animate-spin w-5 h-5 border-2 border-white border-t-transparent rounded-full" />
                            ) : (
                                <Download size={20} />
                            )}
                            <span>打包下载 / Download ZIP</span>
                        </button>

                        <button
                            onClick={handleReset}
                            className="w-full py-3 px-4 bg-slate-700 hover:bg-slate-600 text-white rounded-lg flex items-center justify-center gap-2 transition-colors"
                        >
                            <RefreshCw size={18} />
                            <span>重新拆分 / Reset</span>
                        </button>
                    </div>

                    <div className="mt-6 pt-6 border-t border-slate-700 text-xs text-slate-500">
                        <p>提示：下载前，您可以点击生成的方格替换其中的图片。<br/>Tips: You can click tiles to replace them before downloading.</p>
                    </div>
                </div>
            </div>
        </div>
      )}
    </div>
  );
};

export default SplitMode;