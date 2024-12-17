import { defineConfig } from "vite";
import react from '@vitejs/plugin-react'
// import commonjs from '@rollup/plugin-commonjs'
import { nodePolyfills } from 'vite-plugin-node-polyfills'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), nodePolyfills()],
});
