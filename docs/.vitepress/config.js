import { defineConfig } from 'vitepress'

export default defineConfig({
  title: 'Kriya Yoga UK',
  description: 'Kriya Yoga UK - The Kriyavan\'s Handbook for Self Analysis',
  
  themeConfig: {
    logo: '/logo.svg',
    
    nav: [
      { text: 'Home', link: '/' },
      { text: 'Assess Progress', link: '/assess-progress' },
      { text: 'Kriya Yoga', link: '/kriya-yoga' },
      { text: 'Donate', link: '/donate.html' }
    ],

    sidebar: {
      '/donate/': [
        {
          text: 'Donation',
          items: [
            { text: 'Make a Donation', link: '/donate.html' },
            { text: 'Direct Debit', link: '/donate/direct-debit' },
            { text: 'Gift Aid', link: '/donate/gift-aid' },
            { text: 'Payment', link: '/donate/payment' }
          ]
        }
      ],
      '/': [
        {
          text: 'Guide',
          items: [
            { text: 'Introduction', link: '/introduction' },
            { text: 'Daily Practice Review', link: '/daily-practice-review' },
            { text: 'Assess Progress', link: '/assess-progress' },
            { text: 'Kriya Yoga', link: '/kriya-yoga' }
          ]
        },
        {
          text: 'Support',
          items: [
            { text: 'Donate', link: '/donate.html' }
          ]
        }
      ]
    },

    // socialLinks section removed
  },

  // Enable Vue template features
  vue: {
    template: {
      compilerOptions: {
        isCustomElement: (tag) => tag.includes('-')
      }
    }
  }
})
