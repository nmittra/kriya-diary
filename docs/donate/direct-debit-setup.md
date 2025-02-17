---
layout: doc
title: Direct Debit Setup
---

<script setup>
import { defineAsyncComponent } from 'vue'
const DirectDebitSetupForm = defineAsyncComponent(() => import('../components/DirectDebitSetupForm.vue'))
const DonationGuard = defineAsyncComponent(() => import('../components/DonationGuard.vue'))
</script>

<ClientOnly>
<DonationGuard>
<div class="direct-debit-setup-page">
  <div class="progress-bar">
    <div class="progress-step completed">Amount</div>
    <div class="progress-step completed">Details</div>
    <div class="progress-step completed">Gift Aid</div>
    <div class="progress-step active">Setup Direct Debit</div>
  </div>

  <DirectDebitSetupForm />
</div>
</DonationGuard>
</ClientOnly>

<style>
.direct-debit-setup-page {
  max-width: 800px;
  margin: 0 auto;
  padding: 2rem 1rem;
}

.progress-bar {
  display: flex;
  justify-content: space-between;
  margin-bottom: 2rem;
  padding: 0 1rem;
}

.progress-step {
  position: relative;
  font-size: 0.9rem;
  color: var(--vp-c-text-2);
}

.progress-step.completed {
  color: var(--vp-c-brand);
}

.progress-step.active {
  color: var(--vp-c-brand);
  font-weight: bold;
}

@media (max-width: 640px) {
  .direct-debit-setup-page {
    padding: 1rem;
  }
  
  .progress-step {
    font-size: 0.8rem;
  }
}
</style>