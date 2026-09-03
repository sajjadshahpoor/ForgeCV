import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// Repo is deployed as a GitHub Pages *project* site: https://<user>.github.io/ForgeCV/
// so all asset URLs must be prefixed with the repo name.
export default defineConfig({
  base: '/ForgeCV/',
  plugins: [react(), tailwindcss()],
})
