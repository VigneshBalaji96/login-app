import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import federation from '@originjs/vite-plugin-federation'
import tailwindcss from "@tailwindcss/vite";

export default defineConfig(() => ({
  plugins: [
    react(),
    tailwindcss(),
    federation({
      name: 'login',
      filename: 'remoteEntry.js',
      exposes: {
        './LoginApp': './src/App.tsx',
      },
      shared: ['react', 'react-dom', 'react-router-dom', 'react-redux', '@repo/shared-store'],
    }),
  ],
  server: {
    port: 5001,
  },
  build: {
    modulePreload: false,
    target: 'esnext',
    minify: false,
    cssCodeSplit: false,
    sourcemap: true,
  },
  preview: {
    port: 5001,
  },
}))
