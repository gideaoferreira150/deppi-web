   import { defineConfig } from 'vite'
   import react from '@vitejs/plugin-react'
   export default defineConfig({
     plugins: [react()],
     server: {
       proxy: {
         '/api-proxy': {
           target: 'https://deppi-api-3i98.onrender.com',
           changeOrigin: true,
           secure: true,
           rewrite: (p) => p.replace(/^\/api-proxy/, '')
         }
       }
     }
   })