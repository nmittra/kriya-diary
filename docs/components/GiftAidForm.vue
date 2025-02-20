<script setup>
import { ref, onMounted } from 'vue'
import { useRouter, useData } from 'vitepress'

const router = useRouter()
const { site } = useData()
const giftAid = ref(false)
const donationDetails = ref(null)

const getPath = (path) => {
  return `${site.value.base || '/'}${path}`.replace(/\/+/g, '/')
}

onMounted(() => {
  const details = localStorage.getItem('donationDetails')
  console.log('Retrieved donation details:', details)
  if (details) {
    donationDetails.value = JSON.parse(details)
    console.log('Parsed donation details:', donationDetails.value)
  } else {
    router.push('/donate')
  }
})

const handleSubmit = () => {
  // Save gift aid choice
  localStorage.setItem('giftAid', JSON.stringify({ enabled: giftAid.value }))
  
  console.log('Current donation details:', donationDetails.value)
  console.log('Payment method:', donationDetails.value?.method)
  
  // Route based on payment method
  if (donationDetails.value?.method === 'direct-debit') {
    console.log('Routing to direct-debit page')
    router.push('/donate/direct-debit')
  } else if (donationDetails.value?.method === 'paypal') {
    console.log('Routing to payment page')
    router.push('/donate/payment')
  } else {
    console.log('No payment method found, going to fallback')
    router.push('/donate')
  }
}

const handleBack = () => {
  router.push('/donate/details')
}
</script>

<template>
  <div class="gift-aid-form">
    <form @submit.prevent="handleSubmit" class="gift-aid-form">
      <div class="info-box">
        <h3>Important Information</h3>
        <p>Gift Aid allows UK charities to claim an extra 25p for every £1 you give. It won't cost you any extra.</p>
      </div>

      <div class="checkbox-group">
        <input 
          type="checkbox" 
          id="giftAid"
          v-model="giftAid"
        >
        <label for="giftAid">
          <span class="checkbox-title">Yes, I am a UK taxpayer</span>
          <p class="checkbox-description">
            I want to Gift Aid my donation and any donations I make in the future or have made in the past 4 years to Kriya Yoga UK. 
            I understand that if I pay less Income Tax and/or Capital Gains Tax than the amount of Gift Aid claimed on all my donations 
            in that tax year, it is my responsibility to pay any difference.
          </p>
        </label>
      </div>

      <div class="notice-box">
        <p>Please notify us if you:</p>
        <ul>
          <li>Want to cancel this declaration</li>
          <li>Change your name or home address</li>
          <li>No longer pay sufficient tax on your income and/or capital gains</li>
        </ul>
      </div>

      <div class="form-actions">
        <button type="button" class="back-btn" @click="handleBack">
          Back
        </button>
        <button type="submit" class="continue-btn">
          Continue to Payment
        </button>
      </div>
    </form>
  </div>
</template>

<style scoped>
.gift-aid-form {
  max-width: 600px;
  margin: 0 auto;
  padding: 20px;
}

.info-box {
  background-color: var(--vp-c-bg-soft);
  border-left: 4px solid var(--vp-c-brand);
  padding: 1rem;
  margin-bottom: 1.5rem;
}

.info-box h3 {
  color: var(--vp-c-text-1);
  margin-bottom: 0.5rem;
  font-weight: bold;
}

.checkbox-group {
  display: flex;
  gap: 1rem;
  margin-bottom: 1.5rem;
}

.checkbox-title {
  display: block;
  font-weight: bold;
  margin-bottom: 0.5rem;
}

.notice-box {
  background-color: var(--vp-c-bg-soft);
  padding: 1rem;
  border-radius: 4px;
  margin-bottom: 1.5rem;
}

.notice-box ul {
  list-style-type: disc;
  margin-left: 1.5rem;
}

button {
  background-color: var(--vp-c-brand);
  color: white;
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  width: 100%;
}

/* Add new styles for form actions */
.form-actions {
  display: flex;
  gap: 1rem;
  margin-top: 2rem;
}

.back-btn,
.continue-btn {
  flex: 1;
  padding: 0.75rem 1.5rem;
  border-radius: 6px;
  font-weight: 500;
  transition: all 0.2s;
}

.back-btn {
  background: transparent;
  border: 2px solid var(--vp-c-brand);
  color: var(--vp-c-brand);
}

.continue-btn {
  background: var(--vp-c-brand);
  border: none;
  color: white;
}

.back-btn:hover {
  background: var(--vp-c-brand-soft);
}

.continue-btn:hover {
  background: var(--vp-c-brand-dark);
}
</style>
