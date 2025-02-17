---
layout: doc
title: Set Up Direct Debit
---

<script setup>
import { defineAsyncComponent } from 'vue'
const DirectDebitForm = defineAsyncComponent(() => import('../components/DirectDebitForm.vue'))
const DonationGuard = defineAsyncComponent(() => import('../components/DonationGuard.vue'))
</script>

<ClientOnly>
<DonationGuard>
<div class="direct-debit-page">
  <div class="direct-debit-header">
    <h1>Set Up Direct Debit</h1>
    <p class="subtitle">
      Set up a secure Direct Debit donation to support our mission. Direct Debit allows you to make automatic donations directly from your UK bank account.
    </p>
  </div>

  <div class="direct-debit-content">
    <DirectDebitForm />
  </div>
</div>
</DonationGuard>
</ClientOnly>

<style>
.direct-debit-page {
  max-width: 800px;
  margin: 0 auto;
  padding: 2rem 1rem;
}

.direct-debit-header {
  text-align: center;
  margin-bottom: 2rem;
}

.subtitle {
  color: var(--vp-c-text-2);
  font-size: 1.1rem;
  line-height: 1.6;
  margin-top: 1rem;
}

.direct-debit-content {
  background: var(--vp-c-bg-soft);
  border-radius: 12px;
  padding: 2rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

@media (max-width: 640px) {
  .direct-debit-page {
    padding: 1rem;
  }

  .direct-debit-content {
    padding: 1rem;
  }
}
</style>
