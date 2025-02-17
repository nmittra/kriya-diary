<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vitepress'

const router = useRouter()

const getPaymentMethod = () => {
  try {
    const details = JSON.parse(localStorage.getItem('donationDetails') || '{}')
    return details.method || 'paypal'
  } catch {
    return 'paypal'
  }
}

const steps = computed(() => {
  const paymentMethod = getPaymentMethod()
  
  if (paymentMethod === 'direct-debit') {
    return [
      { number: 1, title: "Amount", path: "/donate" },
      { number: 2, title: "Details", path: "/donate/details" },
      { number: 3, title: "Gift Aid", path: "/donate/gift-aid" },
      { number: 4, title: "Direct Debit", path: "/donate/direct-debit" }
    ]
  } else {
    return [
      { number: 1, title: "Amount", path: "/donate" },
      { number: 2, title: "Details", path: "/donate/details" },
      { number: 3, title: "Gift Aid", path: "/donate/gift-aid" },
      { number: 4, title: "Payment", path: "/donate/payment" }
    ]
  }
})

const currentStep = computed(() => {
  const currentPath = router.route.path.replace(/\/$/, '')
  const step = steps.value.find(s => s.path.replace(/\/$/, '') === currentPath)
  return step ? step.number : 1
})

const progress = computed(() => {
  return ((currentStep.value - 1) / (steps.value.length - 1)) * 100
})

const handleStepClick = (step) => {
  if (step.number <= currentStep.value) {
    router.go(step.path)
  }
}
</script>

<template>
  <div class="donation-steps">
    <div class="steps-container">
      <div 
        v-for="step in steps" 
        :key="step.number"
        :class="[
          'step',
          { 
            'completed': step.number < currentStep,
            'active': step.number === currentStep
          }
        ]"
        @click="handleStepClick(step)"
      >
        <div class="step-number">{{ step.number }}</div>
        <div class="step-title">{{ step.title }}</div>
      </div>
    </div>
    <div class="progress-bar">
      <div class="progress" :style="{ width: `${progress}%` }"></div>
    </div>
  </div>
</template>

<style scoped>
.donation-steps {
  margin: 2rem 0;
}

.steps-container {
  display: flex;
  justify-content: space-between;
  margin-bottom: 1rem;
}

.step {
  display: flex;
  flex-direction: column;
  align-items: center;
  cursor: pointer;
}

.step.hidden {
  display: none;
}

.step-number {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: var(--vp-c-bg-soft);
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 0.5rem;
}

.step.completed .step-number {
  background: var(--vp-c-brand);
  color: white;
}

.step.active .step-number {
  background: var(--vp-c-brand);
  color: white;
  font-weight: bold;
}

.step-title {
  font-size: 0.875rem;
  color: var(--vp-c-text-2);
}

.step.active .step-title {
  color: var(--vp-c-text-1);
  font-weight: 500;
}

.progress-bar {
  height: 4px;
  background: var(--vp-c-bg-soft);
  border-radius: 2px;
  overflow: hidden;
}

.progress {
  height: 100%;
  background: var(--vp-c-brand);
  transition: width 0.3s ease;
}

@media (max-width: 640px) {
  .step-title {
    font-size: 0.75rem;
  }
  
  .step-number {
    width: 24px;
    height: 24px;
    font-size: 0.875rem;
  }
}
</style>
