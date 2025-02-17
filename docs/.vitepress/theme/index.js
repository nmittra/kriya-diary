import DefaultTheme from 'vitepress/theme'
import './custom.css'

// Import your components
import DirectDebitForm from '../../components/DirectDebitForm.vue'
import DonationForm from '../../components/DonationForm.vue'
import DonationGuard from '../../components/DonationGuard.vue'
import PaymentForm from '../../components/PaymentForm.vue'
import GiftAidForm from '../../components/GiftAidForm.vue'

export default {
  extends: DefaultTheme,
  enhanceApp({ app }) {
    // Register components globally
    app.component('DirectDebitForm', DirectDebitForm)
    app.component('DonationForm', DonationForm)
    app.component('DonationGuard', DonationGuard)
    app.component('PaymentForm', PaymentForm)
    app.component('GiftAidForm', GiftAidForm)
  }
}
