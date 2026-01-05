import { defineConfig, loadEnv, Plugin } from 'vite';
import svgrPlugin from 'vite-plugin-svgr';
import envCompatible from 'vite-plugin-env-compatible';
import react from '@vitejs/plugin-react';
import eslintPlugin from 'vite-plugin-eslint';
/// <reference types="vitest" />

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');

  // https://vitejs.dev/config/
  return {
    define: {
      'window.global': 'globalThis',
    },
    // This changes the out put dir from dist to build
    // comment this out if that isn't relevant for your project
    build: {
      outDir: 'build',
      rollupOptions: {
        output: {
          manualChunks: {
            react: ['react', 'react-dom', 'react-router-dom'],
            chakra: ['@chakra-ui/react', '@emotion/react', '@emotion/styled', 'framer-motion'],
            apollo: ['@apollo/client', 'graphql'],
          },
        },
      },
      chunkSizeWarningLimit: 2000,
    },
    plugins: [
      react(),
      // eslintPlugin({
      //   // Ensure ESLint resolves config and tsconfig from the React folder
      //   cwd: __dirname,
      //   cache: false,
      //   failOnError: false,
      //   failOnWarning: false,
      // }),
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
    test: {
      globals: true,
      environment: 'jsdom',
      setupFiles: './src/setupTests.ts',
      server: {
        deps: {
          inline: [
            "suneditor",
            "suneditor-react"
          ]
        }
      },
      coverage: {
        provider: 'v8',
        reporter: ['text', 'json', 'html', 'lcov'],
        reportsDirectory: './coverage',
        include: ['src/**/*.{ts,tsx}'],
        exclude: ['src/**/*.test.{ts,tsx}', 'src/**/*.spec.{ts,tsx}', 'src/setupTests.ts', 'src/**/__tests__/**', 'src/**/_tests__/**'],
      },
    },
  };
});
