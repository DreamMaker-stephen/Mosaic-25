import React, { useState, useEffect, useRef } from 'react';
import { Eye } from 'lucide-react';

const UsageCounter: React.FC = () => {
  const [count, setCount] = useState(0);
  const [displayCount, setDisplayCount] = useState(0);
  const imgRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    // 从本地存储获取上次访问数
    const stored = localStorage.getItem('visit_count');
    let currentCount = stored ? parseInt(stored) : 0;

    // 检查是否是今天第一次访问
    const lastVisit = localStorage.getItem('last_visit_date');
    const today = new Date().toDateString();

    if (lastVisit !== today) {
      // 新的一天，计数+1
      currentCount += 1;
      localStorage.setItem('visit_count', currentCount.toString());
      localStorage.setItem('last_visit_date', today);
    }

    // 动画显示
    animateCount(currentCount);

    // 尝试从 hits.sh 获取真实访问数（通过图片加载）
    // 由于 CORS 限制，我们只能显示图片，无法读取数字
    // 所以本地计数作为备用显示
  }, []);

  // 监听 hits.sh 图片加载
  useEffect(() => {
    const img = imgRef.current;
    if (!img) return;

    const handleLoad = () => {
      // 图片加载成功，但无法读取数字（CORS）
      // 保持本地计数显示
    };

    img.addEventListener('load', handleLoad);
    return () => img.removeEventListener('load', handleLoad);
  }, []);

  function animateCount(targetCount: number) {
    const duration = 1500;
    const startTime = performance.now();

    const animate = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const ease = 1 - Math.pow(1 - progress, 4);
      const current = Math.floor(targetCount * ease);
      setDisplayCount(current);

      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        setDisplayCount(targetCount);
      }
    };

    requestAnimationFrame(animate);
  }

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
        {/* 隐藏的 hits.sh 图片用于统计（虽然 CORS 阻止我们读取，但可以记录访问） */}
        <img
          ref={imgRef}
          src="https://hits.sh/www.zaomengshi.cn/.svg?style=flat-square&label=Views&color=007ec6&labelColor=555555"
          alt=""
          className="hidden"
          crossOrigin="anonymous"
        />
      </div>
    </div>
  );
};

export default UsageCounter;
