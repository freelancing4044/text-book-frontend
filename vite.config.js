import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  // Load env file based on `mode` in the current working directory.
  const env = loadEnv(mode, process.cwd(), '');
  
  return {
    plugins: [react()],
    // This ensures that the app works when served from a subpath
    base: env.NODE_ENV === 'production' ? '/' : '/',
    server: {
      // This ensures that the app works with client-side routing in development
      historyApiFallback: true,
    },
    // This ensures that the app works when built for production
    build: {
      outDir: 'dist',
      assetsDir: 'assets',
      sourcemap: true,
    },
  };
});
