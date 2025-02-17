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
  }
})

const handleDirectDebit = async () => {
  processing.value = true
  try {
    // Store payment method choice
    localStorage.setItem('paymentMethod', 'direct-debit')
    
    // Navigate to Direct Debit setup page
    router.go('/donate/direct-debit-setup.html')
  } catch (error) {
    console.error('Direct Debit setup failed:', error)
  } finally {
    processing.value = false
  }
}
</script>

<template>
  <div class="direct-debit-form">
    <!-- Donation Summary -->
    <div class="donation-summary">
      <h2>Donation Summary</h2>
      <div class="summary-box">
        <p class="amount">
          <span class="label">Amount:</span> 
          £{{ donationDetails?.amount || '0' }}
          <span v-if="donationDetails?.type === 'monthly'">/month</span>
        </p>
        <p class="type">
          {{ donationDetails?.type === 'monthly' ? 'Monthly donation' : 'One-time donation' }}
        </p>
      </div>
    </div>

    <!-- Direct Debit Info -->
    <div class="dd-info">
      <img 
        src="/images/direct-debit.svg" 
        alt="Direct Debit" 
        class="dd-logo"
      >
      <div class="dd-text">
        <h3>Direct Debit Guarantee</h3>
        <ul>
          <li>This Guarantee is offered by all banks and building societies that accept instructions to pay Direct Debits</li>
          <li>If there are any changes to the amount, date or frequency of your Direct Debit, we will notify you in advance</li>
          <li>If an error is made in the payment of your Direct Debit, you are entitled to a full and immediate refund</li>
        </ul>
      </div>
    </div>

    <button
      @click="handleDirectDebit"
      :disabled="processing || !donationDetails"
      class="setup-btn"
    >
      {{ processing ? 'Processing...' : 'Set Up Direct Debit' }}
    </button>

    <!-- Back Link -->
    <div class="back-link">
      <a href="/donate">← Return to Donation Form</a>
    </div>
  </div>
</template>

<style scoped>
.direct-debit-form {
  max-width: 600px;
  margin: 0 auto;
}

.donation-summary {
  margin-bottom: 2rem;
}

.summary-box {
  background-color: var(--vp-c-bg-soft);
  padding: 1rem;
  border-radius: 8px;
  margin-top: 1rem;
}

.amount {
  font-size: 1.2rem;
  font-weight: 600;
  margin-bottom: 0.5rem;
}

.type {
  color: var(--vp-c-text-2);
}

.dd-info {
  background-color: var(--vp-c-brand-soft);
  padding: 1.5rem;
  border-radius: 8px;
  margin: 1.5rem 0;
}

.dd-logo {
  width: 60px;
  height: auto;
  max-height: 40px;
  margin-bottom: 1rem;
}

.dd-text h3 {
  margin-bottom: 1rem;
  color: var(--vp-c-text-1);
}

.dd-text ul {
  list-style-type: disc;
  padding-left: 1.5rem;
  color: var(--vp-c-text-1);
}

.dd-text li {
  margin-bottom: 0.5rem;
}

.setup-btn {
  width: 100%;
  background-color: var(--vp-c-brand);
  color: white;
  padding: 1rem;
  border-radius: 8px;
  font-size: 1.2rem;
  font-weight: bold;
  border: none;
  cursor: pointer;
  transition: background-color 0.2s;
  margin: 1.5rem 0;
}

.setup-btn:hover {
  background-color: var(--vp-c-brand-dark);
}

.setup-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.back-link {
  text-align: center;
  margin-top: 1.5rem;
}

.back-link a {
  color: var(--vp-c-brand);
  text-decoration: none;
}

.back-link a:hover {
  text-decoration: underline;
}
</style>

// Add explicit default export
export default {
  name: 'DirectDebitForm'
}
