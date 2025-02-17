---
layout: page
---

<script setup>
import ThankYou from '../components/ThankYou.vue'
import DonationGuard from '../components/DonationGuard.vue'
</script>

<DonationGuard>
  <ThankYou />
</DonationGuard>
