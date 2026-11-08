import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path' // <-- Añadir esta línea

export default defineConfig({
  plugins: [react()],
  resolve: { // <-- Añadir este bloque
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
})