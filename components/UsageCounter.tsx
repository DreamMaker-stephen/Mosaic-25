import React, { useEffect, useState } from 'react';
import { Eye } from 'lucide-react';

const UsageCounter: React.FC = () => {
  const [displayCount, setDisplayCount] = useState(0);

  useEffect(() => {
    // 使用 hits.sh - 国内访问更稳定
    fetch('https://hits.sh/www.zaomengshi.cn/.svg')
      .then(res => res.text())
      .then(text => {
        // 从 SVG 中提取数字
        const match = text.match(/>(\d+)</);
        const count = match ? parseInt(match[1]) : 0;
        if (count > 0) {
          animateCount(count);
        } else {
          // 备用：visitor-badge
          return fetch('https://api.visitorbadge.io/api/visitors?path=www.zaomengshi.cn&label=&labelColor=%230d1117&countColor=%230d1117&style=flat')
            .then(res => res.text())
            .then(text2 => {
              const match2 = text2.match(/>([\d,]+)</);
              const count2 = match2 ? parseInt(match2[1].replace(/,/g, '')) : 0;
              animateCount(count2);
            });
        }
      })
      .catch(() => setDisplayCount(0));

    function animateCount(count: number) {
      const duration = 1500;
      const startTime = performance.now();
      const animate = (currentTime: number) => {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const ease = 1 - Math.pow(1 - progress, 4);
        const current = Math.floor(count * ease);
        setDisplayCount(current);
        if (progress < 1) requestAnimationFrame(animate);
        else setDisplayCount(count);
      };
      requestAnimationFrame(animate);
    }
  }, []);

  return (
    <div className="fixed bottom-6 right-6 z-50 animate-in slide-in-from-bottom-4 duration-700 pointer-events-none">
      <div className="flex items-center gap-3 px-5 py-3 rounded-2xl bg-slate-800/40 backdrop-blur-xl border border-white/10 shadow-2xl shadow-black/20 group hover:bg-slate-800/60 transition-all pointer-events-auto">
        <div className="relative">
          <div className="absolute inset-0 bg-blue-500 blur-sm opacity-20 group-hover:opacity-40 transition-opacity rounded-full"></div>
          <div className="bg-gradient-to-br from-blue-500 to-indigo-600 p-2 rounded-full relative z-10">
             <Eye size={16} className="text-white" />
          </div>
        </div>
        <div className="flex flex-col">
          <span className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">Total Visits / 累计访问</span>
          <span className="text-lg font-bold text-white font-mono leading-none tracking-tight">
            {displayCount.toLocaleString()}
          </span>
        </div>
      </div>
    </div>
  );
};

export default UsageCounter;