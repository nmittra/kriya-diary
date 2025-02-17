import DefaultTheme from 'vitepress/theme'
import './style.css'
import type { Theme } from 'vitepress'
import KriyaTracker from '../../components/KriyaTracker.vue'
import DonationForm from '../../components/DonationForm.vue'

export default {
  ...DefaultTheme,
  enhanceApp({ app }) {
    app.component('KriyaTracker', KriyaTracker)
    app.component('DonationForm', DonationForm)
  }
} satisfies Theme