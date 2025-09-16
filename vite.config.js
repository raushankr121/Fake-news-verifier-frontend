import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    // This allows any host from Render's domain
    allowedHosts: ['.onrender.com'],
  },
});