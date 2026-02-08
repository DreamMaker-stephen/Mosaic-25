import path from 'path';
import fs from 'fs';
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
    const env = loadEnv(mode, '.', '');
    
    // 检查是否有CNAME文件（自定义域名）
    const hasCNAME = fs.existsSync(path.join(__dirname, 'public/CNAME')) || 
                     fs.existsSync(path.join(__dirname, 'CNAME'));
    const base = hasCNAME ? '/' : '/Mosaic-25/';
    
    return {
      base,
      server: {
        port: 3000,
        host: '0.0.0.0',
      },
      plugins: [react()],
      define: {
        'process.env.API_KEY': JSON.stringify(env.GEMINI_API_KEY),
        'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY)
      },
      resolve: {
        alias: {
          '@': path.resolve(__dirname, '.'),
        }
      },
      build: {
        rollupOptions: {
          output: {
            entryFileNames: 'assets/[name].[hash].js',
            chunkFileNames: 'assets/[name].[hash].js',
            assetFileNames: 'assets/[name].[hash][extname]'
          }
        },
        assetsDir: 'assets',
        assetsInlineLimit: 4096,
      }
    };
});
