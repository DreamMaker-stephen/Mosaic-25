import React, { useEffect, useState } from 'react';
import { Download } from 'lucide-react';

interface UsageCounterProps {
  count: number;
}

const UsageCounter: React.FC<UsageCounterProps> = ({ count }) => {
  const [displayCount, setDisplayCount] = useState(count);

  // Smooth counter animation
  useEffect(() => {
    let start = displayCount;
    const end = count;
    if (start === end) return;

    const duration = 1000;
    const startTime = performance.now();

    const animate = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      // Ease out quart
      const ease = 1 - Math.pow(1 - progress, 4);
      
      const current = Math.floor(start + (end - start) * ease);
      setDisplayCount(current);

      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };

    requestAnimationFrame(animate);
  }, [count]);

  return (
    <div className="fixed bottom-6 right-6 z-50 animate-in slide-in-from-bottom-4 duration-700 pointer-events-none">
      <div className="flex items-center gap-3 px-5 py-3 rounded-2xl bg-slate-800/40 backdrop-blur-xl border border-white/10 shadow-2xl shadow-black/20 group hover:bg-slate-800/60 transition-all pointer-events-auto">
        <div className="relative">
          <div className="absolute inset-0 bg-blue-500 blur-sm opacity-20 group-hover:opacity-40 transition-opacity rounded-full"></div>
          <div className="bg-gradient-to-br from-blue-500 to-indigo-600 p-2 rounded-full relative z-10">
             <Download size={16} className="text-white" />
          </div>
        </div>
        <div className="flex flex-col">
          <span className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">Total Downloads / 累计下载</span>
          <span className="text-lg font-bold text-white font-mono leading-none tracking-tight">
            {displayCount.toLocaleString()}
          </span>
        </div>
      </div>
    </div>
  );
};

export default UsageCounter;