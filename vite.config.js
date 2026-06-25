import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { fileURLToPath } from 'node:url'

export default defineConfig(({ mode }) => {
  const root = fileURLToPath(new URL('.', import.meta.url))
  const env = loadEnv(mode, root, '')

  return {
    plugins: [
      react({ jsxRuntime: 'automatic' }),
      tailwindcss(),
    ],
    esbuild: {
      jsx: 'automatic',
    },
    base: env.VITE_BASE_PATH || '/incubateur/',
  }
})
