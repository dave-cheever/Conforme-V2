import { defineConfig, loadEnv } from 'vite';
import svgrPlugin from 'vite-plugin-svgr';
import envCompatible from 'vite-plugin-env-compatible';
import react from '@vitejs/plugin-react';
import eslintPlugin from "vite-plugin-eslint";

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');

  // https://vitejs.dev/config/
  return {
    // This changes the out put dir from dist to build
    // comment this out if that isn't relevant for your project
    build: {
      outDir: 'build',
    },
    plugins: [
      react(),
      // eslintPlugin(),
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
      port: env.PORT ? Number(env.PORT) : 3000,
    },
  };
});
