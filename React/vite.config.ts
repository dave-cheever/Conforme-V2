import { defineConfig } from 'vite';
import svgrPlugin from 'vite-plugin-svgr';
import envCompatible from 'vite-plugin-env-compatible';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
const viteConfig = {
  // This changes the out put dir from dist to build
  // comment this out if that isn't relevant for your project
  build: {
    outDir: 'build',
  },
  plugins: [
    react(),
    svgrPlugin({
      svgrOptions: {
        icon: true,
        // ...svgr options (https://react-svgr.com/docs/options/)
      },
    }),
    envCompatible({
      prefix: 'REACT_APP',
    }),
  ],
  server: {
    port: process.env.PORT ? Number(process.env.PORT) : 3000,
  },
};

export default defineConfig(viteConfig);
