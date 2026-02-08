/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './index.tsx',
    './App.tsx',
    './components/**/*.tsx',
  ],
  safelist: [
    { pattern: /^(bg|text|border)-(slate|white|blue|indigo|gray|red|green|yellow)-(50|100|200|300|400|500|600|700|800|850|900)$/ },
    { pattern: /^(shadow|shadow-lg)-(slate|blue|red)-(50|100|200|300|400|500)/ },
    { pattern: /^(px|py|p)-(1|2|3|4|6|8)$/ },
    { pattern: /^(gap|m)-(1|2|3|4|6|8)$/ },
    'gap-1', 'gap-2', 'gap-3', 'gap-4', 'gap-6', 'gap-8',
    'px-1', 'px-2', 'px-3', 'px-4', 'px-6', 'px-8',
    'py-1', 'py-2', 'py-3', 'py-4', 'py-6', 'py-8',
    'bg-slate-800', 'bg-slate-850', 'bg-slate-900', 'bg-slate-600',
    'text-slate-100', 'text-slate-400', 'text-slate-500', 'text-slate-600',
    'border-slate-700', 'border-slate-800',
    'bg-blue-500', 'bg-indigo-600', 'text-white',
  ],
  theme: {
    extend: {
      colors: {
        slate: {
          850: '#151f32',
          900: '#0f172a',
        }
      }
    }
  },
  plugins: [],
}
