<script setup>
import { onMounted, ref } from 'vue'
import { useRouter } from 'vitepress'

const router = useRouter()
const isAuthorized = ref(false)

onMounted(() => {
  const donationDetails = localStorage.getItem('donationDetails')
  const donorDetails = localStorage.getItem('donorDetails')
  const paymentMethod = localStorage.getItem('paymentMethod')
  
  // Check if user has completed previous steps
  if (!donationDetails || !donorDetails || paymentMethod !== 'direct-debit') {
    router.go('/donate')
    return
  }
  
  isAuthorized.value = true
})
</script>

<template>
  <div v-if="isAuthorized">
    <slot></slot>
  </div>
</template>
