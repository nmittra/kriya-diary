# Donor Details

Please provide your contact information below. We'll use this to send you updates about how your donation is making a difference.

<DonorDetailsForm />

<script setup>
import DonorDetailsForm from '../components/DonorDetailsForm.vue'
</script>

<style>
.donor-form {
  max-width: 600px;
  margin: 0 auto;
  padding: 20px;
  background: var(--vp-c-bg-soft);
  border-radius: 8px;
}

.form-group {
  margin-bottom: 1.5rem;
}

.form-group label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 500;
  color: var(--vp-c-text-1);
}

.form-group input,
.form-group select {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid var(--vp-c-divider);
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

.form-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
}

button {
  background-color: var(--vp-c-brand);
  color: white;
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  width: 100%;
  margin-top: 1.5rem;
  font-weight: 500;
  font-size: 1.1rem;
}

button:hover {
  background-color: var(--vp-c-brand-dark);
}

@media (max-width: 640px) {
  .form-grid {
    grid-template-columns: 1fr;
  }
}
</style>
