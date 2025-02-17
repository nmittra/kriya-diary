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
      router.go('/donate/direct-debit-setup')
    }
  } else {
    // If no donation details, redirect back to donation form
    router.go('/donate')
  }
})

const handlePayment = async () => {
  processing.value = true
  try {
    // Only handle PayPal payments here
    if (donationDetails.value.method === 'paypal') {
      if (donationDetails.value.type === 'monthly') {
        window.location.href = 'https://www.paypal.com/subscribe/?hosted_button_id=SUBSCRIPTION_BUTTON_ID'
      } else {
        window.location.href = 'https://www.paypal.com/donate/?hosted_button_id=ONE_TIME_BUTTON_ID'
      }
    }
  } catch (error) {
    console.error('Payment processing failed:', error)
  } finally {
    processing.value = false
  }
}
</script>

<template>
  <div class="payment-form">
    <!-- Donation Summary -->
    <div class="donation-summary">
      <h2 class="text-xl font-bold mb-4">Donation Summary</h2>
      <div class="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
        <p class="text-lg">
          <span class="font-semibold">Amount:</span> 
          £{{ donationDetails?.amount || '0' }}
          <span v-if="donationDetails?.type === 'monthly'">/month</span>
        </p>
        <p class="text-sm text-gray-600 dark:text-gray-400">
          {{ donationDetails?.type === 'monthly' ? 'Monthly donation' : 'One-time donation' }}
        </p>
      </div>
    </div>

    <!-- PayPal Payment -->
    <div class="space-y-6 mt-8">
      <div class="paypal-info">
        <div class="flex items-center">
          <img 
            src="https://www.paypalobjects.com/webstatic/mktg/Logo/pp-logo-100px.png" 
            alt="PayPal" 
            class="h-6 mr-3"
          >
          <p class="text-sm">
            Secure payment processing by PayPal. You can pay using PayPal or any major credit/debit card.
            {{ donationDetails?.type === 'monthly' ? 'Your donation will be automatically processed monthly.' : '' }}
          </p>
        </div>
      </div>

      <button
        type="button"
        @click="handlePayment"
        :disabled="processing || !donationDetails"
        class="paypal-button"
      >
        <span v-if="processing">Processing...</span>
        <span v-else>
          {{ donationDetails?.type === 'monthly' ? 'Set Up Monthly Donation' : 'Complete Donation' }}
        </span>
      </button>
    </div>

    <!-- Payment Methods Icons -->
    <div class="payment-methods">
      <img src="/icons/payment/visa.svg" alt="Visa" class="h-8">
      <img src="/icons/payment/mastercard.svg" alt="Mastercard" class="h-8">
      <img src="/icons/payment/amex.svg" alt="American Express" class="h-8">
      <img 
        src="https://www.paypalobjects.com/webstatic/mktg/Logo/pp-logo-100px.png" 
        alt="PayPal" 
        class="h-8"
      >
    </div>

    <!-- Monthly Donation Info -->
    <div v-if="donationDetails?.type === 'monthly'" class="monthly-info">
      <h3 class="font-semibold mb-2">About Monthly Donations</h3>
      <ul class="text-sm text-gray-600 dark:text-gray-400 list-disc pl-5">
        <li>Your first donation will be processed today</li>
        <li>Subsequent donations will be automatically processed monthly</li>
        <li>You can cancel or modify your monthly donation at any time</li>
        <li>You'll receive email receipts for each donation</li>
      </ul>
    </div>

    <!-- Security Notice -->
    <div class="security-notice">
      <p>All payments are securely processed.</p>
      <p>Your payment details are protected.</p>
    </div>

    <!-- Back Link -->
    <div class="back-link">
      <a 
        href="/donate"
        class="text-red-600 hover:text-red-700"
      >
        ← Return to Donation Form
      </a>
    </div>
  </div>
</template>

<style scoped>
.payment-form {
  max-width: 600px;
  margin: 0 auto;
  padding: 20px;
}

.donation-summary {
  margin-bottom: 2rem;
}

.paypal-info {
  background-color: var(--vp-c-bg-soft);
  padding: 1rem;
  border-radius: 8px;
  margin-bottom: 1.5rem;
  color: var(--vp-c-text-1);
}

.paypal-button {
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
}

.paypal-button:hover {
  background-color: var(--vp-c-brand-dark);
}

.paypal-button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.payment-methods {
  display: flex;
  justify-content: center;
  gap: 2rem;
  margin: 2rem 0;
}

.monthly-info {
  background-color: var(--vp-c-bg-soft);
  padding: 1rem;
  border-radius: 8px;
  margin: 1.5rem 0;
  color: var(--vp-c-text-1);
}

.monthly-info h3 {
  color: var(--vp-c-text-1);
  font-weight: 600;
  margin-bottom: 0.5rem;
}

.monthly-info ul {
  list-style-type: disc;
  padding-left: 1.5rem;
  color: var(--vp-c-text-1);
}

.monthly-info li {
  margin-bottom: 0.5rem;
}

.security-notice {
  text-align: center;
  color: #666;
  margin: 1.5rem 0;
}

.back-link {
  text-align: center;
  margin-top: 2rem;
}
</style>
