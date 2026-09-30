import { existsSync } from 'node:fs'
import { resolve } from 'node:path'
import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import { localApiPlugin, staticHeadPlugin } from './config/vite-plugins.js'
import { resume } from './src/data/portfolio.js'

// Absolute origin used for canonical URLs, Open Graph images, and the sitemap.
// Priority: SITE_URL (set this once you own a domain) → Vercel's production domain → local preview.
function resolveSiteUrl(env) {
  const url = env.SITE_URL
    || (process.env.VERCEL_PROJECT_PRODUCTION_URL && `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`)
    || 'http://localhost:4173'
  return url.replace(/\/+$/, '')
}

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  // Make .env values (e.g. GITHUB_TOKEN) visible to the local API handlers.
  for (const key of ['GITHUB_TOKEN']) {
    if (env[key] && !process.env[key]) process.env[key] = env[key]
  }

  const siteUrl = resolveSiteUrl(env)
  const resumeAvailable = existsSync(resolve(process.cwd(), 'public', resume.path.replace(/^\//, '')))

  return {
    plugins: [react(), staticHeadPlugin({ siteUrl }), localApiPlugin()],
    define: {
      __SITE_URL__: JSON.stringify(siteUrl),
      __RESUME_AVAILABLE__: JSON.stringify(resumeAvailable),
    },
    test: {
      environment: 'node',
      include: ['tests/**/*.test.js'],
    },
  }
})
