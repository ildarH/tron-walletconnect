import { defineConfig } from "vite";
import react from '@vitejs/plugin-react'
import commonjs from '@rollup/plugin-commonjs'
import { nodePolyfills } from 'vite-plugin-node-polyfills'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(), 
    nodePolyfills({
      include: ['buffer', 'crypto', 'util', 'stream'],
    }),
    commonjs({
      transformMixedEsModules: true,
      ignore: ['axios']
    }),
  ],
  build: {
    outDir: 'dist',
    sourcemap: true,
    commonjsOptions: {
      transformMixedEsModules: true,
    },
  },
  resolve: {
    alias: {
      process: 'process/browser',
      stream: 'stream-browserify',
      util: 'util',
      zlib: 'browserify-zlib',
    },
  },
  define: {
    'process.env': {},
  },
  optimizeDeps: {
    esbuildOptions: {
      define: {
        global: 'globalThis',
      },
    },
    include: [],
  },
  server: {
    host: true,
    port: 3000
  }
});
