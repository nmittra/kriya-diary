<script setup>
import { ref } from 'vue'
import { useRouter } from 'vitepress'

const router = useRouter()
const formData = ref({
  title: 'Mr',
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  address1: '',
  address2: '',
  city: '',
  postcode: '',
  country: 'United Kingdom'
})

const handleSubmit = async () => {
  // Store donor details
  localStorage.setItem('donorDetails', JSON.stringify(formData.value))
  // Navigate to gift aid page
  router.go('/donate/gift-aid')
}
</script>

<template>
  <div class="donor-details-container">
    <div class="progress-bar">
      <div class="progress-step completed">Amount</div>
      <div class="progress-step active">Details</div>
      <div class="progress-step">Gift Aid</div>
      <div class="progress-step">Payment</div>
    </div>

    <form @submit.prevent="handleSubmit" class="donor-form">
      <div class="form-header">
        <h2>Your Details</h2>
        <p>Please provide your contact information for donation receipts and updates.</p>
      </div>

      <div class="form-grid">
        <div class="form-group">
          <label for="title">Title</label>
          <select 
            id="title"
            v-model="formData.title"
            required
          >
            <option value="Mr">Mr</option>
            <option value="Mrs">Mrs</option>
            <option value="Miss">Miss</option>
            <option value="Ms">Ms</option>
            <option value="Dr">Dr</option>
          </select>
        </div>

        <div class="form-group">
          <label for="firstName">First Name</label>
          <input 
            id="firstName"
            type="text"
            v-model="formData.firstName"
            required
          >
        </div>

        <div class="form-group">
          <label for="lastName">Last Name</label>
          <input 
            id="lastName"
            type="text"
            v-model="formData.lastName"
            required
          >
        </div>

        <div class="form-group full-width">
          <label for="email">Email Address</label>
          <input 
            id="email"
            type="email"
            v-model="formData.email"
            required
          >
        </div>

        <div class="form-group">
          <label for="phone">Phone Number</label>
          <input 
            id="phone"
            type="tel"
            v-model="formData.phone"
          >
        </div>
      </div>

      <div class="address-section">
        <h3>Address Details</h3>
        
        <div class="form-group">
          <label for="address1">Address Line 1</label>
          <input 
            id="address1"
            type="text"
            v-model="formData.address1"
            required
          >
        </div>

        <div class="form-group">
          <label for="address2">Address Line 2 (Optional)</label>
          <input 
            id="address2"
            type="text"
            v-model="formData.address2"
          >
        </div>

        <div class="form-grid">
          <div class="form-group">
            <label for="city">City</label>
            <input 
              id="city"
              type="text"
              v-model="formData.city"
              required
            >
          </div>

          <div class="form-group">
            <label for="postcode">Postcode</label>
            <input 
              id="postcode"
              type="text"
              v-model="formData.postcode"
              required
            >
          </div>

          <div class="form-group full-width">
            <label for="country">Country</label>
            <input 
              id="country"
              type="text"
              v-model="formData.country"
              required
            >
          </div>
        </div>
      </div>

      <div class="form-actions">
        <button type="button" class="back-btn" @click="router.go('/donate')">
          Back
        </button>
        <button type="submit" class="continue-btn">
          Continue to Gift Aid
        </button>
      </div>
    </form>
  </div>
</template>

<style scoped>
.donor-details-container {
  max-width: 800px;
  margin: 2rem auto;
  padding: 0 1rem;
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

.donor-form {
  background: var(--vp-c-bg-soft);
  padding: 2rem;
  border-radius: 12px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.form-header {
  margin-bottom: 2rem;
  text-align: center;
}

.form-header h2 {
  font-size: 1.5rem;
  font-weight: 600;
  margin-bottom: 0.5rem;
}

.form-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1.5rem;
  margin-bottom: 2rem;
}

.form-group {
  display: flex;
  flex-direction: column;
}

.form-group.full-width {
  grid-column: 1 / -1;
}

.form-group label {
  margin-bottom: 0.5rem;
  font-weight: 500;
  color: var(--vp-c-text-1);
}

.form-group input,
.form-group select {
  padding: 0.75rem;
  border: 2px solid var(--vp-c-divider);
  border-radius: 6px;
  background: var(--vp-c-bg);
  color: var(--vp-c-text-1);
}

.form-group input:focus,
.form-group select:focus {
  outline: none;
  border-color: var(--vp-c-brand);
  box-shadow: 0 0 0 2px var(--vp-c-brand-soft);
}

.address-section {
  margin-top: 2rem;
  padding-top: 2rem;
  border-top: 1px solid var(--vp-c-divider);
}

.address-section h3 {
  font-size: 1.2rem;
  font-weight: 600;
  margin-bottom: 1.5rem;
}

.form-actions {
  display: flex;
  gap: 1rem;
  margin-top: 2rem;
}

.back-btn,
.continue-btn {
  flex: 1; /* Make both buttons take equal space */
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

@media (max-width: 640px) {
  .form-grid {
    grid-template-columns: 1fr;
  }
  
  .donor-form {
    padding: 1.5rem;
  }
  
  .form-actions {
    flex-direction: column;
  }
  
  .back-btn,
  .continue-btn {
    width: 100%;
  }
}
</style>
