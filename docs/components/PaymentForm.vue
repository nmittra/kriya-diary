<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vitepress'

const router = useRouter()
const processing = ref(false)
const donationDetails = ref(null)

onMounted(() => {
  // Retrieve donation details from localStorage
  const details = localStorage.getItem('donationDetails')
  if (details) {
    donationDetails.value = JSON.parse(details)
    // If payment method is direct debit, redirect to direct debit setup
    if (donationDetails.value.method === 'direct-debit') {
      router.push('/donate/direct-debit')
    }
  } else {
    // If no donation details, redirect back to donation form
    router.push('/donate')
  }
})

const handlePayment = async () => {
  processing.value = true
  try {
    // Only handle PayPal payments here
    if (donationDetails.value.method === 'paypal') {
      const paypalUrl = donationDetails.value.type === 'monthly'
        ? 'https://www.paypal.com/subscribe/?hosted_button_id=SUBSCRIPTION_BUTTON_ID'
        : 'https://www.paypal.com/cgi-bin/webscr?cmd=_s-xclick&hosted_button_id=ONETIME_BUTTON_ID'
      
      // For external PayPal URLs, we use window.location.href
      window.location.href = paypalUrl
    }
  } catch (error) {
    console.error('Payment processing error:', error)
  } finally {
    processing.value = false
  }
}

const handleBack = () => {
  router.push('/donate/gift-aid')
}
</script>

<template>
  <div class="payment-form">
    <div class="progress-bar">
      <div class="progress-step completed">Amount</div>
      <div class="progress-step completed">Details</div>
      <div class="progress-step completed">Gift Aid</div>
      <div class="progress-step active">Payment</div>
    </div>

    <div class="payment-container">
      <h2>Complete Your Payment</h2>
      <p>You will be redirected to PayPal to complete your {{ donationDetails?.type }} donation.</p>
      
      <div class="amount-summary">
        <h3>Donation Summary</h3>
        <p>Amount: £{{ donationDetails?.amount }}</p>
        <p>Type: {{ donationDetails?.type === 'monthly' ? 'Monthly Donation' : 'One-time Donation' }}</p>
      </div>

      <div class="form-actions">
        <button 
          type="button" 
          class="back-btn" 
          @click="handleBack"
          :disabled="processing"
        >
          Back
        </button>
        <button 
          type="button" 
          class="continue-btn" 
          @click="handlePayment"
          :disabled="processing"
        >
          {{ processing ? 'Processing...' : 'Proceed to PayPal' }}
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.payment-form {
  max-width: 600px;
  margin: 0 auto;
  padding: 20px;
}

.payment-container {
  background: var(--vp-c-bg-soft);
  padding: 2rem;
  border-radius: 12px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.amount-summary {
  background: var(--vp-c-bg);
  padding: 1.5rem;
  border-radius: 8px;
  margin: 2rem 0;
}

.amount-summary h3 {
  margin-bottom: 1rem;
  color: var(--vp-c-text-1);
}

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

.back-btn:hover:not(:disabled) {
  background: var(--vp-c-brand-soft);
}

.continue-btn:hover:not(:disabled) {
  background: var(--vp-c-brand-dark);
}

button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.progress-bar {
  display: flex;
  justify-content: space-between;
  margin-bottom: 2rem;
  padding: 0 1rem;
}

.progress-step {
  position: relative;
  padding-bottom: 0.5rem;
  color: var(--vp-c-text-2);
  font-size: 0.9rem;
}

.progress-step::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 3px;
  background: var(--vp-c-divider);
}

.progress-step.completed::after {
  background: var(--vp-c-brand);
}

.progress-step.active {
  color: var(--vp-c-brand);
  font-weight: 500;
}

.progress-step.active::after {
  background: var(--vp-c-brand);
}
</style>
