<script setup>
import { ref } from 'vue'
import { useRouter } from 'vitepress'

const router = useRouter()
const donationType = ref('monthly')
const selectedAmount = ref(10)
const customAmount = ref('')
const isOver18 = ref(false)
const processing = ref(false)
const validationError = ref('')
const formRef = ref(null)

// Add keyboard navigation for amount buttons
const handleKeyNavigation = (event, amount) => {
  if (event.key === 'Enter' || event.key === ' ') {
    event.preventDefault()
    handleAmountSelect(amount)
  }
}

// Enhance validation
const handleDonateNow = () => {
  if (!isOver18.value) {
    validationError.value = 'Please confirm you are 18 or over'
    return
  }
  if (!selectedAmount.value && !customAmount.value) {
    validationError.value = 'Please select or enter a donation amount'
    return
  }
  validationError.value = ''
  processing.value = true
  try {
    const amount = customAmount.value || selectedAmount.value
    const donationData = {
      type: donationType.value,
      amount: parseFloat(amount),
      method: 'paypal'
    }
    
    console.log('Storing donation data:', donationData) // Debug log
    localStorage.setItem('donationDetails', JSON.stringify(donationData))
    router.push('/donate/details')
  } catch (error) {
    console.error('Error processing donation:', error)
  } finally {
    processing.value = false
  }
}

const handleDirectDebit = () => {
  console.log('handleDirectDebit clicked') // Debug log
  if (!isOver18.value || (!selectedAmount.value && !customAmount.value)) {
    console.log('Validation failed') // Debug log
    return
  }

  processing.value = true
  try {
    const amount = customAmount.value || selectedAmount.value
    const donationData = {
      type: donationType.value,
      amount: parseFloat(amount),
      method: 'direct-debit'
    }
    
    console.log('Storing donation data:', donationData) // Debug log
    localStorage.setItem('donationDetails', JSON.stringify(donationData))
    router.push('/donate/details')
  } catch (error) {
    console.error('Error processing donation:', error)
  } finally {
    processing.value = false
  }
}
</script>

<template>
  <!-- Add skip link -->
  <a href="#donation-form" class="skip-link">Skip to donation form</a>

  <div class="donation-container">
    <div class="donation-wrapper">
      <div class="donation-header">
        <h1>Support Our Mission</h1>
        <div class="quote-block">
          <p>"We should learn to live for others. When we live for others, our hearts and minds are purified, and love and compassion flow more deeply."</p>
          <cite>— Paramahamsa Prajnanananda</cite>
        </div>
      </div>

      <div id="donation-form" 
           class="donation-box" 
           ref="formRef"
           role="form"
           aria-label="Donation form">
        
        <!-- Add error message display -->
        <div v-if="validationError" 
             class="error-message" 
             role="alert"
             aria-live="polite">
          {{ validationError }}
        </div>

        <div class="donation-type-selector" role="radiogroup" aria-label="Donation frequency">
          <button 
            @click="donationType = 'single'"
            :class="['type-btn', donationType === 'single' ? 'active' : '']"
            role="radio"
            :aria-checked="donationType === 'single'"
          >
            One-time Gift
          </button>
          <button 
            @click="donationType = 'monthly'"
            :class="['type-btn', donationType === 'monthly' ? 'active' : '']"
            role="radio"
            :aria-checked="donationType === 'monthly'"
          >
            Monthly Gift
          </button>
        </div>

        <div class="amount-grid" role="group" aria-label="Select donation amount">
          <button 
            v-for="amount in [5, 10, 15, 25, 50, 100]"
            :key="amount"
            @click="handleAmountSelect(amount)"
            @keydown="(e) => handleKeyNavigation(e, amount)"
            :class="['amount-btn', selectedAmount === amount && !customAmount ? 'active' : '']"
            tabindex="0"
            :aria-pressed="selectedAmount === amount && !customAmount"
          >
            £{{ amount }}
          </button>
        </div>

        <div class="custom-amount">
          <input 
            type="text" 
            v-model="customAmount"
            @input="e => validateCustomAmount(e.target.value)"
            placeholder="Enter custom amount" 
            class="custom-input"
            aria-label="Custom donation amount"
          >
        </div>

        <div class="donation-summary">
          <p>
            Your {{ donationType === 'monthly' ? 'monthly' : 'one-time' }} gift of 
            <strong>£{{ customAmount || selectedAmount || '0' }}</strong> 
            will help {{ donationType === 'monthly' ? 'sustain our ongoing programs' : 'make an immediate impact' }}.
          </p>
        </div>

        <div class="consent-checkbox">
          <label>
            <input 
              type="checkbox" 
              v-model="isOver18"
            >
            <span>I confirm that I am 18 or over</span>
          </label>
        </div>

        <div class="donation-actions">
          <button 
            type="button"
            @click="handleDonateNow"
            :disabled="processing || !isOver18 || (!selectedAmount && !customAmount)"
            class="donate-btn paypal-btn"
            :aria-busy="processing"
          >
            <span v-if="processing" class="loading-indicator" aria-hidden="true">⌛</span>
            {{ processing ? 'Processing...' : 'Donate with PayPal' }}
          </button>
          
          <button 
            type="button"
            @click="handleDirectDebit"
            :disabled="processing || !isOver18 || (!selectedAmount && !customAmount)"
            class="donate-btn direct-debit-btn"
          >
            {{ processing ? 'Processing...' : 'Donate with Direct Debit' }}
          </button>
        </div>

        <div class="payment-methods" aria-label="Accepted payment methods">
          <img 
            src="/images/paypal.svg" 
            alt="Donate securely with PayPal - Credit and Debit cards accepted" 
            class="payment-icon"
          >
          <img 
            src="/images/direct-debit.svg" 
            alt="Set up Direct Debit payment through your UK bank account" 
            class="payment-icon"
          >
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* Add new styles */
.skip-link {
  position: absolute;
  left: -9999px;
  z-index: 999;
  padding: 1em;
  background: var(--vp-c-brand);
  color: white;
}

.skip-link:focus {
  left: 50%;
  transform: translateX(-50%);
}

.error-message {
  background: #fde8e8;
  color: #9b1c1c;
  padding: 0.75rem;
  border-radius: 6px;
  margin-bottom: 1rem;
}

/* Enhance focus styles */
.type-btn:focus-visible,
.amount-btn:focus-visible,
.custom-input:focus-visible,
.donate-btn:focus-visible {
  outline: 3px solid var(--vp-c-brand);
  outline-offset: 2px;
}

/* Loading indicator */
.loading-indicator {
  margin-right: 0.5rem;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

.donation-container {
  max-width: 800px;
  margin: 2rem auto;
  padding: 0 1rem;
}

.donation-wrapper {
  background: var(--vp-c-bg-soft);
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.donation-header {
  background: var(--vp-c-brand);
  color: white;
  padding: 2rem;
  text-align: center;
}

.donation-header h1 {
  font-size: 2rem;
  margin-bottom: 1rem;
  font-weight: 600;
}

.quote-block {
  max-width: 600px;
  margin: 0 auto;
  font-style: italic;
}

.quote-block cite {
  display: block;
  margin-top: 0.5rem;
  font-size: 0.9rem;
  opacity: 0.9;
}

.donation-box {
  padding: 2rem;
}

.donation-type-selector {
  display: flex;
  gap: 1rem;
  margin-bottom: 2rem;
}

.type-btn {
  flex: 1;
  padding: 1rem;
  border: 2px solid var(--vp-c-brand);
  border-radius: 8px;
  background: transparent;
  color: var(--vp-c-text-1);
  font-weight: 500;
  transition: all 0.2s;
}

.type-btn.active {
  background: var(--vp-c-brand);
  color: white;
}

.amount-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1rem;
  margin-bottom: 1.5rem;
}

.amount-btn {
  padding: 1rem;
  border: 2px solid var(--vp-c-divider);
  border-radius: 8px;
  background: transparent;
  color: var(--vp-c-text-1);
  font-size: 1.2rem;
  font-weight: 500;
  transition: all 0.2s;
}

.amount-btn.active {
  border-color: var(--vp-c-brand);
  background: var(--vp-c-brand-soft);
  color: var(--vp-c-brand);
}

.custom-amount {
  margin-bottom: 1.5rem;
}

.custom-input {
  width: 100%;
  padding: 1rem;
  border: 2px solid var(--vp-c-divider);
  border-radius: 8px;
  font-size: 1.2rem;
  background: var(--vp-c-bg);
  color: var(--vp-c-text-1);
}

.donation-summary {
  background: var(--vp-c-bg-soft);
  padding: 1rem;
  border-radius: 8px;
  margin-bottom: 1.5rem;
}

.consent-checkbox {
  margin-bottom: 1.5rem;
}

.consent-checkbox label {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.donate-btn {
  width: 100%;
  padding: 1.2rem;
  border: none;
  border-radius: 8px;
  font-size: 1.2rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
}

.paypal-btn {
  background: var(--vp-c-brand);
  color: white;
}

.direct-debit-btn {
  background: var(--vp-c-brand-soft);
  color: var(--vp-c-brand);
  border: 2px solid var(--vp-c-brand);
}

.donation-actions {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-top: 2rem;
}

.payment-methods {
  display: flex;
  justify-content: center;
  gap: 2rem;
  margin-top: 1.5rem;
  padding-top: 1.5rem;
  border-top: 1px solid var(--vp-c-divider);
}

.payment-methods .payment-icon {
  height: 32px !important;
  width: auto !important;
  object-fit: contain !important;
}

@media (max-width: 640px) {
  .amount-grid {
    grid-template-columns: repeat(2, 1fr);
  }
  
  .donation-header {
    padding: 1.5rem;
  }
  
  .donation-box {
    padding: 1.5rem;
  }

  .payment-icon {
    height: 28px !important; /* Slightly smaller on mobile but still visible */
    width: auto !important;
  }

  .payment-methods .payment-icon {
    height: 28px !important;
    width: auto !important;
  }
}
</style>


