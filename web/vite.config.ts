import path from 'path';
import react from '@vitejs/plugin-react-swc';
import { defineConfig } from 'vite';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, '../src/renderer'),
      '@lib': path.resolve(__dirname, 'src/lib'),
      '@/app': path.resolve(__dirname, 'src/App.tsx'),
      '@/containers/HomePage': path.resolve(__dirname, 'src/HomePage.tsx'),
      '@/utils/enhancement': path.resolve(__dirname, 'src/enhancement.ts'),
      'electron-log/renderer': path.resolve(__dirname, 'src/stubs/electron-log.ts'),
      '@nivalis/string-similarity': path.resolve(__dirname, 'src/stubs/@nivalis/string-similarity.ts'),
    },
  },
  server: {
    port: 3456, strictPort: true,
    fs: { allow: ['..'] },
    proxy: { '/api': { target: 'http://localhost:3001', changeOrigin: true } },
  },
  build: {
    outDir: 'dist', cssCodeSplit: false, assetsInlineLimit: 1024 * 20,
    rollupOptions: { output: { manualChunks(id) { return id.includes('node_modules') ? 'vendor' : null; } } },
  },
  define: { __BUILD_DATE__: Date.now() },
});
