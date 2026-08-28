import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { sites } from '@openai/sites-vite-plugin'
import { mkdirSync, writeFileSync } from 'node:fs'

function staticSiteWorker() {
  return {
    name: 'static-site-worker',
    closeBundle() {
      mkdirSync('dist/server', { recursive: true })
      writeFileSync(
        'dist/server/index.js',
        `export default {\n  fetch(request, env) {\n    return env.ASSETS.fetch(request)\n  },\n}\n`,
      )
    },
  }
}

export default defineConfig({
  plugins: [react(), sites(), staticSiteWorker()],
})
