<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vitepress'

const router = useRouter()
const processing = ref(false)
const donationDetails = ref(null)
const donorDetails = ref(null)

const formData = ref({
  accountName: '',
  sortCode: '',
  accountNumber: '',
  bankName: '',
  preferredPaymentDate: '1',
})

const errors = ref({})

onMounted(() => {
  // Retrieve stored details
  const details = localStorage.getItem('donationDetails')
  const donor = localStorage.getItem('donorDetails')
  if (details) donationDetails.value = JSON.parse(details)
  if (donor) donorDetails.value = JSON.parse(donor)
})

const formatSortCode = (value) => {
  const cleaned = value.replace(/\D/g, '')
  const matches = cleaned.match(/(\d{0,2})(\d{0,2})(\d{0,2})/)
  if (matches) {
    const formatted = matches.slice(1).filter(Boolean).join('-')
    formData.value.sortCode = formatted
  }
}

const validateForm = () => {
  errors.value = {}
  
  if (!formData.value.accountName) {
    errors.value.accountName = 'Account name is required'
  }
  
  if (!formData.value.sortCode || formData.value.sortCode.length !== 8) {
    errors.value.sortCode = 'Valid sort code is required (XX-XX-XX)'
  }
  
  if (!formData.value.accountNumber || formData.value.accountNumber.length !== 8) {
    errors.value.accountNumber = 'Valid 8-digit account number is required'
  }
  
  if (!formData.value.bankName) {
    errors.value.bankName = 'Bank name is required'
  }

  return Object.keys(errors.value).length === 0
}

const handleSubmit = async () => {
  if (!validateForm()) return
  
  processing.value = true
  try {
    // Here you would typically send the data to your backend
    // For now, we'll just simulate a success
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    // Store direct debit details
    localStorage.setItem('directDebitDetails', JSON.stringify(formData.value))
    
    // Navigate to confirmation page
    router.go('/donate/confirmation')
  } catch (error) {
    console.error('Failed to setup Direct Debit:', error)
  } finally {
    processing.value = false
  }
}
</script>

<template>
  <div class="direct-debit-setup-form">
    <!-- Donation Summary -->
    <div class="summary-section">
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

    <!-- Bank Details Form -->
    <form @submit.prevent="handleSubmit" class="bank-details-form">
      <h2>Bank Account Details</h2>
      
      <div class="form-group">
        <label for="accountName">Name on Account</label>
        <input 
          type="text"
          id="accountName"
          v-model="formData.accountName"
          :class="{ 'error': errors.accountName }"
        >
        <span class="error-message" v-if="errors.accountName">{{ errors.accountName }}</span>
      </div>

      <div class="form-group">
        <label for="sortCode">Sort Code</label>
        <input 
          type="text"
          id="sortCode"
          v-model="formData.sortCode"
          @input="formatSortCode($event.target.value)"
          placeholder="XX-XX-XX"
          maxlength="8"
          :class="{ 'error': errors.sortCode }"
        >
        <span class="error-message" v-if="errors.sortCode">{{ errors.sortCode }}</span>
      </div>

      <div class="form-group">
        <label for="accountNumber">Account Number</label>
        <input 
          type="text"
          id="accountNumber"
          v-model="formData.accountNumber"
          maxlength="8"
          :class="{ 'error': errors.accountNumber }"
        >
        <span class="error-message" v-if="errors.accountNumber">{{ errors.accountNumber }}</span>
      </div>

      <div class="form-group">
        <label for="bankName">Bank Name</label>
        <input 
          type="text"
          id="bankName"
          v-model="formData.bankName"
          :class="{ 'error': errors.bankName }"
        >
        <span class="error-message" v-if="errors.bankName">{{ errors.bankName }}</span>
      </div>

      <div class="form-group" v-if="donationDetails?.type === 'monthly'">
        <label for="preferredPaymentDate">Preferred Payment Date</label>
        <select 
          id="preferredPaymentDate"
          v-model="formData.preferredPaymentDate"
        >
          <option value="1">1st of each month</option>
          <option value="15">15th of each month</option>
          <option value="28">28th of each month</option>
        </select>
      </div>

      <!-- Direct Debit Guarantee -->
      <div class="dd-guarantee">
        <h3>Direct Debit Guarantee</h3>
        <ul>
          <li>This Guarantee is offered by all banks and building societies that accept instructions to pay Direct Debits</li>
          <li>If there are any changes to the amount, date or frequency of your Direct Debit, we will notify you 10 working days in advance</li>
          <li>If an error is made in the payment of your Direct Debit, you are entitled to a full and immediate refund from your bank or building society</li>
          <li>You can cancel a Direct Debit at any time by contacting your bank or building society</li>
        </ul>
      </div>

      <button 
        type="submit"
        :disabled="processing"
        class="submit-button"
      >
        {{ processing ? 'Setting up...' : 'Set Up Direct Debit' }}
      </button>
    </form>

    <!-- Back Link -->
    <div class="back-link">
      <a href="/donate">← Return to Donation Form</a>
    </div>
  </div>
</template>

<style scoped>
.direct-debit-setup-form {
  max-width: 600px;
  margin: 0 auto;
}

.summary-section {
  margin-bottom: 2rem;
}

.summary-box {
  background-color: var(--vp-c-bg-soft);
  padding: 1rem;
  border-radius: 8px;
  margin-top: 1rem;
}

.bank-details-form {
  background: var(--vp-c-bg-soft);
  padding: 2rem;
  border-radius: 12px;
  margin-bottom: 2rem;
}

.form-group {
  margin-bottom: 1.5rem;
}

label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 500;
}

input, select {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid var(--vp-c-divider);
  border-radius: 6px;
  background: var(--vp-c-bg);
  color: var(--vp-c-text-1);
}

input.error {
  border-color: #dc2626;
}

.error-message {
  color: #dc2626;
  font-size: 0.875rem;
  margin-top: 0.25rem;
}

.dd-guarantee {
  background-color: var(--vp-c-brand-soft);
  padding: 1.5rem;
  border-radius: 8px;
  margin: 2rem 0;
}

.dd-guarantee h3 {
  margin-bottom: 1rem;
}

.dd-guarantee ul {
  list-style-type: disc;
  padding-left: 1.5rem;
}

.dd-guarantee li {
  margin-bottom: 0.5rem;
}

.submit-button {
  width: 100%;
  background-color: var(--vp-c-brand);
  color: white;
  padding: 1rem;
  border: none;
  border-radius: 8px;
  font-size: 1.1rem;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.2s;
}

.submit-button:hover {
  background-color: var(--vp-c-brand-dark);
}

.submit-button:disabled {
  opacity: 0.7;
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

@media (max-width: 640px) {
  .bank-details-form {
    padding: 1rem;
  }
}
</style>