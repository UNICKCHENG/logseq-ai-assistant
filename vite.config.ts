import reactPlugin from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import logseqDevPlugin from "vite-plugin-logseq";
import path from 'path';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [logseqDevPlugin(), reactPlugin()],
  // Makes HMR available for development
  build: {
    target: "esnext",
    minify: "esbuild",
  },
  resolve: {
    alias: {
      '@libs': path.resolve(__dirname, 'libs'),
      '@': path.resolve(__dirname, 'src'),
    }
  },
});
