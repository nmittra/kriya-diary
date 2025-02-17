---
layout: doc
---

<script setup>
import PaymentForm from '../components/PaymentForm.vue'
import DonationGuard from '../components/DonationGuard.vue'
</script>

<div class="payment-page">
  <div class="payment-header">
    <h1>Complete Your Donation</h1>
    <p class="subtitle">
      Thank you for your generosity. Your donation will help support our mission to spread the teachings of Kriya Yoga and provide humanitarian aid.
    </p>
  </div>

  <div class="payment-content">
    <PaymentForm />
  </div>
</div>

<style>
.payment-page {
  max-width: 800px;
  margin: 0 auto;
  padding: 2rem 1rem;
}

.payment-header {
  text-align: center;
  margin-bottom: 2rem;
}

.subtitle {
  color: var(--vp-c-text-2);
  font-size: 1.1rem;
  line-height: 1.6;
  margin-top: 1rem;
}

.payment-content {
  background: var(--vp-c-bg-soft);
  border-radius: 12px;
  padding: 2rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

/* Control SVG sizes */
.payment-content svg {
  width: 60px;
  height: auto;
  max-height: 40px;
}

/* Ensure payment icons maintain aspect ratio */
.payment-content img[src*="visa"],
.payment-content img[src*="mastercard"],
.payment-content img[src*="amex"],
.payment-content img[src*="paypal"] {
  width: 60px;
  height: auto;
  max-height: 40px;
  object-fit: contain;
}

/* Fix PayPal info box */
:deep(.paypal-info) {
  background-color: var(--vp-c-brand-soft);
  padding: 1rem;
  border-radius: 8px;
  margin-bottom: 1.5rem;
  color: var(--vp-c-text-1);
}

/* Fix payment methods section */
:deep(.payment-methods) {
  background-color: var(--vp-c-brand-soft);
  padding: 1.5rem;
  border-radius: 8px;
  margin: 1.5rem 0;
  display: flex;
  justify-content: center;
  gap: 2rem;
  align-items: center;
}

/* Fix monthly donation info box */
:deep(.monthly-info) {
  background-color: var(--vp-c-brand-soft);
  padding: 1rem;
  border-radius: 8px;
  margin: 1.5rem 0;
  color: var(--vp-c-text-1);
}

:deep(.monthly-info h3) {
  color: var(--vp-c-text-1);
  margin-bottom: 0.5rem;
}

:deep(.monthly-info ul) {
  color: var(--vp-c-text-1);
  list-style-type: disc;
  padding-left: 1.5rem;
}

:deep(.monthly-info li) {
  color: var(--vp-c-text-1);
  margin-bottom: 0.25rem;
}

:deep(.security-notice) {
  color: var(--vp-c-text-2);
  font-size: 0.9rem;
  text-align: center;
  margin-top: 1rem;
}

@media (max-width: 640px) {
  .payment-page {
    padding: 1rem;
  }

  .payment-content {
    padding: 1rem;
  }
  
  /* Slightly smaller SVGs on mobile */
  .payment-content svg,
  .payment-content img[src*="visa"],
  .payment-content img[src*="mastercard"],
  .payment-content img[src*="amex"],
  .payment-content img[src*="paypal"] {
    width: 50px;
    max-height: 35px;
  }

  :deep(.payment-methods) {
    padding: 1rem;
    gap: 1rem;
  }
}
</style>
