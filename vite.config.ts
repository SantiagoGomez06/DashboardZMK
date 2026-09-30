import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import { viteSingleFile } from 'vite-plugin-singlefile'

export default defineConfig(({ mode }) => ({
  base: '/DashboardZMK/',
  plugins: [
    react(),
    tailwindcss(),
    ...(mode === 'singlefile' ? [viteSingleFile()] : []),
  ],
  build: {
    assetsInlineLimit: mode === 'singlefile' ? 100000000 : 4096,
  },
}))