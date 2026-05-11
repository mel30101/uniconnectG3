import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    // Prioriza variantes .web.ts/.web.tsx antes que las genéricas
    extensions: ['.web.tsx', '.web.ts', '.tsx', '.ts', '.jsx', '.js'],
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@shared': path.resolve(__dirname, '../packages/shared/src'),
      // Force single React instance to prevent "Cannot read properties of null" error
      'react': path.resolve(__dirname, './node_modules/react'),
      'react-dom': path.resolve(__dirname, './node_modules/react-dom'),
    },
  },
  optimizeDeps: {
    // Exclude workspace packages from pre-bundling to avoid React instance conflicts
    exclude: ['@uniconnect/shared'],
  },
  server: {
    port: 5173,
    fs: {
      // Allow serving files from one level up (for workspace packages)
      allow: ['..'],
    },
  },
})
