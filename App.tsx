import React, { useState, useEffect } from 'react';
import { Grid, Scissors, Github } from 'lucide-react';
import { TOTAL_SLOTS } from './types';
import PackMode from './components/PackMode';
import SplitMode from './components/SplitMode';
import UsageCounter from './components/UsageCounter';

type Mode = 'pack' | 'split';

function App() {
  const [mode, setMode] = useState<Mode>('split');
  // Initial believable number for stats
  const [usageCount, setUsageCount] = useState(18934);

  useEffect(() => {
    // Simulate live global updates occasionally
    const interval = setInterval(() => {
      // 30% chance to increment every 5 seconds to simulate other users
      if (Math.random() > 0.7) {
        setUsageCount(c => c + Math.floor(Math.random() * 3) + 1);
      }
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const handleIncrementUsage = () => {
    setUsageCount(prev => prev + 1);
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col relative">
      <UsageCounter count={usageCount} />

      {/* Header */}
      <header className="border-b border-slate-800 bg-slate-900/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-gradient-to-br from-blue-500 to-indigo-600 p-2 rounded-lg shadow-lg shadow-blue-500/20">
              <Grid size={24} className="text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400">
                Mosaic 25
              </h1>
              <p className="text-xs text-slate-500 tracking-wide">造梦师出品</p>
            </div>
          </div>

          {/* Mode Switcher (Tabs) */}
          <div className="hidden md:flex items-center gap-1 bg-slate-800 p-1 rounded-lg border border-slate-700">
             <button
                onClick={() => setMode('split')}
                className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all flex items-center gap-2
                  ${mode === 'split' ? 'bg-slate-600 text-white shadow-sm' : 'text-slate-400 hover:text-slate-200'}
                `}
             >
               <Scissors size={14} />
               拆分 (Split)
             </button>
             <button
                onClick={() => setMode('pack')}
                className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all flex items-center gap-2
                  ${mode === 'pack' ? 'bg-slate-600 text-white shadow-sm' : 'text-slate-400 hover:text-slate-200'}
                `}
             >
               <Grid size={14} />
               打包 (Pack)
             </button>
          </div>

          <div className="flex items-center gap-4 text-sm text-slate-400">
            <a href="#" className="hover:text-white transition-colors">
              <Github size={20} />
            </a>
          </div>
        </div>
        
        {/* Mobile Tab Fallback */}
        <div className="md:hidden flex border-t border-slate-800">
             <button
                onClick={() => setMode('split')}
                className={`flex-1 py-3 text-sm font-medium flex justify-center items-center gap-2
                  ${mode === 'split' ? 'bg-slate-800 text-white' : 'text-slate-500'}
                `}
             >
               <Scissors size={16} /> 拆分 / Split
             </button>
            <button
                onClick={() => setMode('pack')}
                className={`flex-1 py-3 text-sm font-medium flex justify-center items-center gap-2
                  ${mode === 'pack' ? 'bg-slate-800 text-white' : 'text-slate-500'}
                `}
             >
               <Grid size={16} /> 打包 / Pack
             </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 py-8">
         {mode === 'pack' ? (
           <PackMode onUsed={handleIncrementUsage} />
         ) : (
           <SplitMode onUsed={handleIncrementUsage} />
         )}
      </main>

      <footer className="py-6 text-center text-slate-600 text-sm">
        <p>&copy; {new Date().getFullYear()} Mosaic 25. Built with React & Tailwind.</p>
      </footer>
    </div>
  );
}

export default App;