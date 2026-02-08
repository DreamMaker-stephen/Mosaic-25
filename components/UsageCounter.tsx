import React, { useEffect, useState } from 'react';

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
      <div className="inline-flex items-center gap-3 px-4 py-2 bg-black/80 rounded-lg border border-green-500/30 shadow-[0_0_15px_rgba(34,197,94,0.15)] backdrop-blur-sm pointer-events-auto hover:border-green-500/50 transition-all">
        {/* 脉冲绿点 */}
        <span className="relative flex h-2.5 w-2.5">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-green-500"></span>
        </span>

        {/* 计数器图片 */}
        <img
          src="https://count.getloli.com/get/@zaomengshi-mosaic-25?theme=moebooru&length=6"
          alt="visit count"
          data-moe-counter
          className="h-5 object-contain"
          style={{
            filter: 'drop-shadow(0 0 3px rgba(34, 197, 94, 0.5))',
            imageRendering: 'pixelated'
          }}
          onError={(e) => {
            e.currentTarget.style.display = 'none';
            const backup = document.getElementById('visit-counter');
            if (backup) backup.style.display = 'block';
          }}
        />

        {/* 备用数字显示 */}
        <span
          id="visit-counter"
          className="text-sm font-bold text-green-400 font-mono leading-none tracking-tight hidden"
          style={{ textShadow: '0 0 10px rgba(34, 197, 94, 0.5)' }}
        >
          {displayCount.toLocaleString()}
        </span>
      </div>
    </div>
  );
};

export default UsageCounter;
