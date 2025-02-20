<script setup>
import { onMounted, ref } from 'vue'
import { useRouter } from 'vitepress'

const router = useRouter()
const isAuthorized = ref(false)

onMounted(() => {
  const donationDetails = localStorage.getItem('donationDetails')
  const donorDetails = localStorage.getItem('donorDetails')
  const giftAid = localStorage.getItem('giftAid')
  
  // Check if user has completed previous steps
  if (!donationDetails || !donorDetails || !giftAid) {
    router.push('/donate')
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
