import { defineConfig } from 'vitepress'

// Use base path /ombor/ only for GitHub Actions deployment
// For local development and preview: use /
const isGitHubActions = process.env.GITHUB_ACTIONS === 'true'
const base = isGitHubActions ? '/ombor/' : '/'

console.log(`VitePress base path: ${base} (GitHub Actions: ${isGitHubActions})`)

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: "Ombor.js",
  description: "Ombor- sizga Firebase uslubidagi sodda, kuchli, foydalanuvchi brauzerida saqlanadigan, IndexedDB ma'lumotlar bazasida ishlashni osonlashtiradigan offlayn ma'lumotlar bazasini taqdim etadi.",
  base, // Auto-detected base path
  ignoreDeadLinks: [
    // Ignore localhost links that are only available during development
    /^http:\/\/localhost:/
  ],
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    nav: [
      { text: 'Bosh sahifa', link: '/' },
      { text: 'Qo\'llanma', link: '/guide/getting-started' },
      { text: 'API', link: '/api/introduction' },
      { text: 'Misollar', link: '/guide/examples' },
      { text: '🎮 Tajriba maydoni (sinovda)', link: '/playground' },
    ],

    sidebar: {
      '/guide/': [
        {
          text: 'Qo\'llanma',
          items: [
            { text: 'Ishni Boshlash', link: '/guide/getting-started' },
            { text: 'Misollar', link: '/guide/examples' },
            { text: 'Best Practices', link: '/guide/best-practices' }
          ]
        }
      ],
      '/api/': [
        {
          text: 'API Hujjatlari',
          items: [
            { text: 'Kirish', link: '/api/introduction' },
            { text: 'Collection', link: '/api/collection' },
            { text: 'Document', link: '/api/document' },
            { text: 'Filterlar', link: '/api/filters' },
            { text: 'Kalitlar', link: '/api/keys' },
            { text: 'Konfiguratsiya', link: '/api/configuration' }
          ]
        }
      ]
    },

    socialLinks: [
      { icon: 'github', link: 'https://github.com/otabekoff/ombor' }
    ]
  }
})
