import { defineConfig } from 'vitepress'

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: "Ombor.js",
  description: "Ombor- sizga Firebase uslubidagi sodda, kuchli, foydalanuvchi brauzerida saqlanadigan, IndexedDB ma'lumotlar bazasida ishlashni osonlashtiradigan offlayn ma'lumotlar bazasini taqdim etadi.",
  base: '/ombor/', // GitHub Pages base path
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    nav: [
      { text: 'Bosh sahifa', link: '/' },
      { text: 'Qo\'llanma', link: '/guide/getting-started' },
      { text: 'API', link: '/api/introduction' },
      { text: 'Misollar', link: '/guide/examples' }
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
