import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    host: true, // Allow external access (e.g., from Docker)
    port: 5173, // Match the exposed Docker port
    watch: {
      usePolling: true, // Enable polling for file changes in Docker
    },
  },
});
