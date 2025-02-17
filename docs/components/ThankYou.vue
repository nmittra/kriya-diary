<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vitepress'

const router = useRouter()
const donationDetails = ref({
  amount: '',
  type: '',
  giftAid: false
})

// Add timeout reference
let cleanupTimeout

onMounted(() => {
  // Retrieve donation details from localStorage
  const paymentDetails = JSON.parse(localStorage.getItem('paymentDetails') || '{}')
  const giftAidDetails = JSON.parse(localStorage.getItem('giftAid') || '{}')
  
  donationDetails.value = {
    amount: paymentDetails.amount || '',
    type: paymentDetails.type || 'one-time',
    giftAid: giftAidDetails.enabled || false
  }

  // Set cleanup timeout (5 minutes)
  cleanupTimeout = setTimeout(() => {
    localStorage.removeItem('paymentDetails')
    localStorage.removeItem('giftAid')
    localStorage.removeItem('donationAmount')
    router.go('/')
  }, 5 * 60 * 1000)
})

onUnmounted(() => {
  // Clear timeout if component is unmounted
  if (cleanupTimeout) {
    clearTimeout(cleanupTimeout)
  }
})

const handleReturnHome = () => {
  router.go('/')
}
</script>

<template>
  <div class="max-w-2xl mx-auto text-center space-y-8">
    <div class="bg-green-50 dark:bg-green-900/30 rounded-full h-24 w-24 mx-auto flex items-center justify-center">
      <svg 
        class="h-12 w-12 text-green-500" 
        xmlns="http://www.w3.org/2000/svg" 
        fill="none" 
        viewBox="0 0 24 24" 
        stroke="currentColor"
      >
        <path 
          stroke-linecap="round" 
          stroke-linejoin="round" 
          stroke-width="2" 
          d="M5 13l4 4L19 7"
        />
      </svg>
    </div>

    <div class="space-y-4">
      <h1 class="text-3xl font-bold text-gray-900 dark:text-white">
        Thank You for Your Donation!
      </h1>
      
      <p class="text-lg text-gray-600 dark:text-gray-300">
        Your generous contribution of 
        <span class="font-semibold">£{{ donationDetails.amount }}</span>
        {{ donationDetails.type === 'monthly' ? 'per month ' : '' }}
        will help support our mission.
      </p>

      <div v-if="donationDetails.giftAid" class="text-sm text-gray-500 dark:text-gray-400">
        <p>
          Your donation is eligible for Gift Aid, which means we can claim an extra 25p for every £1 you've given.
        </p>
      </div>
    </div>

    <div class="bg-gray-50 dark:bg-gray-800 p-6 rounded-lg mt-8">
      <h2 class="text-xl font-semibold text-gray-900 dark:text-white mb-4">
        What Happens Next?
      </h2>
      
      <div class="space-y-3 text-left">
        <div class="flex items-start">
          <div class="flex-shrink-0">
            <svg 
              class="h-6 w-6 text-red-500" 
              xmlns="http://www.w3.org/2000/svg" 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
            >
              <path 
                stroke-linecap="round" 
                stroke-linejoin="round" 
                stroke-width="2" 
                d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
              />
            </svg>
          </div>
          <div class="ml-3">
            <h3 class="text-sm font-medium text-gray-900 dark:text-white">
              Email Confirmation
            </h3>
            <p class="text-sm text-gray-500 dark:text-gray-400">
              You'll receive a confirmation email with your donation details shortly.
            </p>
          </div>
        </div>

        <div class="flex items-start">
          <div class="flex-shrink-0">
            <svg 
              class="h-6 w-6 text-red-500" 
              xmlns="http://www.w3.org/2000/svg" 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
            >
              <path 
                stroke-linecap="round" 
                stroke-linejoin="round" 
                stroke-width="2" 
                d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
              />
            </svg>
          </div>
          <div class="ml-3">
            <h3 class="text-sm font-medium text-gray-900 dark:text-white">
              Receipt
            </h3>
            <p class="text-sm text-gray-500 dark:text-gray-400">
              A receipt for your donation will be sent to your email address for your records.
            </p>
          </div>
        </div>

        <div v-if="donationDetails.type === 'monthly'" class="flex items-start">
          <div class="flex-shrink-0">
            <svg 
              class="h-6 w-6 text-red-500" 
              xmlns="http://www.w3.org/2000/svg" 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
            >
              <path 
                stroke-linecap="round" 
                stroke-linejoin="round" 
                stroke-width="2" 
                d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
          </div>
          <div class="ml-3">
            <h3 class="text-sm font-medium text-gray-900 dark:text-white">
              Monthly Donations
            </h3>
            <p class="text-sm text-gray-500 dark:text-gray-400">
              Your donation will be processed automatically each month. You can cancel or modify this at any time.
            </p>
          </div>
        </div>
      </div>
    </div>

    <div class="pt-8">
      <button 
        @click="handleReturnHome"
        class="inline-flex items-center text-red-600 hover:text-red-700 transition-colors"
      >
        <svg 
          class="h-5 w-5 mr-2" 
          xmlns="http://www.w3.org/2000/svg" 
          fill="none" 
          viewBox="0 0 24 24" 
          stroke="currentColor"
        >
          <path 
            stroke-linecap="round" 
            stroke-linejoin="round" 
            stroke-width="2" 
            d="M10 19l-7-7m0 0l7-7m-7 7h18"
          />
        </svg>
        Return to Homepage
      </button>
    </div>
  </div>
</template>
