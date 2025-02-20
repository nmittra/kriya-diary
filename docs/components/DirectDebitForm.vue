<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vitepress'

const router = useRouter()
const processing = ref(false)
const donationDetails = ref(null)
const bankDetails = ref({
  accountName: '',
  sortCode: '',
  accountNumber: ''
})

onMounted(() => {
  const details = localStorage.getItem('donationDetails')
  if (details) {
    donationDetails.value = JSON.parse(details)
    if (donationDetails.value.method !== 'direct-debit') {
      router.push('/donate/payment')
    }
  } else {
    router.push('/donate')
  }
})

const formatSortCode = (value) => {
  return value.replace(/\D/g, '').replace(/(\d{2})(?=\d)/g, '$1-')
}

const handleSubmit = async () => {
  processing.value = true
  try {
    // Here you would typically send the bank details to your backend
    // For now, we'll just simulate a success
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    // Store direct debit setup confirmation
    localStorage.setItem('directDebitSetup', JSON.stringify({
      completed: true,
      timestamp: new Date().toISOString()
    }))
    
    // Redirect to success page
    router.push('/donate/success')
  } catch (error) {
    console.error('Direct Debit setup error:', error)
  } finally {
    processing.value = false
  }
}

const handleBack = () => {
  router.push('/donate/gift-aid')
}
</script>

<template>
  <div class="direct-debit-form">
    <div class="progress-bar">
      <div class="progress-step completed">Amount</div>
      <div class="progress-step completed">Details</div>
      <div class="progress-step completed">Gift Aid</div>
      <div class="progress-step active">Direct Debit</div>
    </div>

    <form @submit.prevent="handleSubmit" class="form-container">
      <h2>Set Up Direct Debit</h2>
      <p>Please provide your bank details to set up your {{ donationDetails?.type }} donation of £{{ donationDetails?.amount }}.</p>

      <div class="form-group">
        <label for="accountName">Account Name</label>
        <input 
          id="accountName"
          v-model="bankDetails.accountName"
          type="text"
          required
        >
      </div>

      <div class="form-group">
        <label for="sortCode">Sort Code</label>
        <input 
          id="sortCode"
          v-model="bankDetails.sortCode"
          type="text"
          pattern="\d{2}-\d{2}-\d{2}"
          maxlength="8"
          placeholder="00-00-00"
          @input="e => bankDetails.sortCode = formatSortCode(e.target.value)"
          required
        >
      </div>

      <div class="form-group">
        <label for="accountNumber">Account Number</label>
        <input 
          id="accountNumber"
          v-model="bankDetails.accountNumber"
          type="text"
          pattern="\d{8}"
          maxlength="8"
          required
        >
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
          type="submit" 
          class="continue-btn"
          :disabled="processing"
        >
          {{ processing ? 'Processing...' : 'Set Up Direct Debit' }}
        </button>
      </div>
    </form>
  </div>
</template>

<style scoped>
.direct-debit-form {
  max-width: 600px;
  margin: 0 auto;
  padding: 20px;
}

.form-container {
  background: var(--vp-c-bg-soft);
  padding: 2rem;
  border-radius: 12px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.form-group {
  margin-bottom: 1.5rem;
}

.form-group label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 500;
}

.form-group input {
  width: 100%;
  padding: 0.75rem;
  border: 2px solid var(--vp-c-divider);
  border-radius: 6px;
  background: var(--vp-c-bg);
  color: var(--vp-c-text-1);
}

.form-group input:focus {
  outline: none;
  border-color: var(--vp-c-brand);
  box-shadow: 0 0 0 2px var(--vp-c-brand-soft);
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

/* Progress bar styles same as PaymentForm */
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
