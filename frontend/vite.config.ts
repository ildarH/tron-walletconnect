import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import { nodePolyfills } from 'vite-plugin-node-polyfills'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), nodePolyfills()],
  build: {
    outDir: 'dist',
    sourcemap: true
  },
  server: {
    host: true,
    port: 3000
  }
});
