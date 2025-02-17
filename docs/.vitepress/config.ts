import { defineConfig } from 'vitepress'

export default defineConfig({
  // Add base URL for production
  base: process.env.NODE_ENV === 'production' ? '/kriya-diary/' : '/',
  
  lang: 'en-US',
  title: 'Kriya Yoga UK',
  description: 'Kriya Yoga UK is a registered UK charity in England & Wales (Number 1119701), and a Company registered in England in May 2007 (Number 6243130).',
  
  head: [
    ['meta', { name: 'description', content: 'Kriya Yoga UK is a registered UK charity in England & Wales (Number 1119701), and a Company registered in England in May 2007 (Number 6243130).' }],
    ['meta', { property: 'og:title', content: 'Kriya Yoga UK' }],
    ['meta', { property: 'og:description', content: 'Kriya Yoga UK is a registered UK charity in England & Wales (Number 1119701), and a Company registered in England in May 2007 (Number 6243130).' }],
    ['link', { rel: 'icon', type: 'image/svg+xml', href: '/logo.svg' }]
  ],

  appearance: true,

  themeConfig: {
    siteTitle: 'Kriya Yoga UK',
    logo: '/logo.svg',
    colors: {
      primary: '#FFD699',
      text: '#333',
      accent: '#2DBDB6'
    },

    nav: [
      { text: 'Assess Daily Progress', link: '/assess-progress' },
      { text: 'What is Kriya Yoga', link: '/kriya-yoga' },
      { text: 'About the Author', link: '/author' },
      { text: 'Donate', link: '/donate.html' }
    ],

    sidebar: {
      '/donate/': [
        {
          text: 'Donation Options',
          items: [
            { text: 'Make a Donation', link: '/donate.html' },
            { text: 'Direct Debit', link: '/donate/direct-debit' },
            { text: 'Direct Debit Setup', link: '/donate/direct-debit-setup' },
            { text: 'Gift Aid', link: '/donate/gift-aid' },
            { text: 'Payment', link: '/donate/payment' }
          ]
        }
      ],
      '/': [
        {
          text: 'Main Navigation',
          items: [
            { text: 'Assess Daily Progress', link: '/assess-progress' },
            { text: 'What is Kriya Yoga', link: '/kriya-yoga' },
            { text: 'About the Author', link: '/author' },
            { text: 'Donate', link: '/donate.html' }
          ]
        }
      ]
    }
  },

  layout: 'default',

  vue: {
    template: {
      compilerOptions: {
        isCustomElement: (tag) => tag.includes('-')
      }
    }
  }
})
