import React, { useEffect, useState } from 'react';
import { Eye } from 'lucide-react';

const UsageCounter: React.FC = () => {
  const [displayCount, setDisplayCount] = useState(0);
  const [imageLoaded, setImageLoaded] = useState(false);

  useEffect(() => {
    // 使用 Moe-Counter 图片服务
    // 通过图片 URL 获取计数，无 CORS 问题
    const img = new Image();
    const counterUrl = 'https://count.getloli.com/get/@zaomengshi-mosaic-25?theme=moebooru';

    img.onload = () => {
      setImageLoaded(true);
    };

    img.onerror = () => {
      // 图片加载失败，使用本地备用计数
      const stored = localStorage.getItem('moe_counter_backup') || '0';
      setDisplayCount(parseInt(stored));
    };

    // 触发图片加载（Moe-Counter 会自动 +1）
    img.src = counterUrl;

    // 备用：也尝试通过 localStorage 记录
    const backup = localStorage.getItem('moe_counter_backup');
    let current = backup ? parseInt(backup) : 0;

    // 检查今天是否已计数
    const lastVisit = localStorage.getItem('last_visit_date');
    const today = new Date().toDateString();

    if (lastVisit !== today) {
      current += 1;
      localStorage.setItem('moe_counter_backup', current.toString());
      localStorage.setItem('last_visit_date', today);
    }

    // 如果图片还没加载好，先显示本地计数
    setTimeout(() => {
      if (!imageLoaded) {
        setDisplayCount(current);
      }
    }, 100);

    // 尝试从页面上的计数器图片读取数字（如果可能）
    const checkImage = setInterval(() => {
      const counterImg = document.querySelector('[data-moe-counter]') as HTMLImageElement;
      if (counterImg && counterImg.complete) {
        // 无法直接读取图片内容，但知道图片已加载
        clearInterval(checkImage);
      }
    }, 500);

    return () => clearInterval(checkImage);
  }, [imageLoaded]);

  // 动画效果
  useEffect(() => {
    if (displayCount === 0) return;

    animateCount(displayCount);
  }, [displayCount]);

  function animateCount(targetCount: number) {
    const duration = 1500;
    const startTime = performance.now();
    let currentDisplay = 0;

    const animate = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const ease = 1 - Math.pow(1 - progress, 4);
      currentDisplay = Math.floor(targetCount * ease);

      // 不直接设置 state，避免无限循环
      const counterEl = document.getElementById('visit-counter');
      if (counterEl) {
        counterEl.textContent = currentDisplay.toLocaleString();
      }

      if (progress < 1) {
        requestAnimationFrame(animate);
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
          <div className="flex items-center gap-2">
            {/* 计数器图片 */}
            <img
              src="https://count.getloli.com/get/@zaomengshi-mosaic-25?theme=asoul&length=6"
              alt="visit count"
              data-moe-counter
              className="h-6 object-contain"
              onError={(e) => {
                e.currentTarget.style.display = 'none';
              }}
            />
            {/* 备用数字显示 */}
            <span
              id="visit-counter"
              className="text-lg font-bold text-white font-mono leading-none tracking-tight"
              style={{ display: 'none' }}
            >
              {displayCount.toLocaleString()}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UsageCounter;
