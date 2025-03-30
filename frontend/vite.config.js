import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
  },
  optimizeDeps: {
    include: ['@emotion/styled'], //MUI material is not compatible with styled() components. So this is to ensure 'emotion/style' is configured to run.
  },
});
