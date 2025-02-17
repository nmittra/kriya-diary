<script setup>
import { ref, computed } from 'vue'
import { format, subDays, parseISO } from 'date-fns'

const viewMode = ref('form')
const showSuccess = ref(false)
const formData = ref({
  date: new Date().toISOString().split('T')[0],
  positiveIndex: {
    discipline: 5,
    love: 5,
    attention: 5,
    gratitude: 5
  },
  practices: {
    disciplinedLife: false,
    lovingAttention: false,
    loveToOthers: false,
    depthOfLove: false,
    godConcentration: false,
    seeingGod: false,
    desireForRealization: false,
    humilityHonesty: false,
    patience: false,
    perseverance: false,
    compassionateDetachment: false,
    blissCheerfulness: false,
    peacefulPresence: false,
    faithInGod: false,
    surrender: false,
    prayerfulAttitude: false,
    introvertingSenses: false,
    solitudeSilence: false,
    selflessService: false,
    charity: false,
    scriptureStudy: false,
    developingVirtues: false
  },
  concentration: {
    willDesire: 0,
    godConsciousness: 0,
    breathAwareness: 0,
    fontanelFocus: 0,
    divineQualities: 0
  },
  counts: {
    meditationTimes: 0,
    kriyaBows: 0,
    mahamudraCycles: 0,
    kriyaBreathingCycles: 0,
    secondKriyaCycles: 0,
    jyotiMudraCycles: 0
  },
  reflection: {
    spiritualProgress: '',
    obstacles: '',
    improvements: ''
  }
})

const formatLabel = (key) => {
  return key
    .replace(/([A-Z])/g, ' $1')
    .replace(/^./, str => str.toUpperCase())
}

const weeklyAverages = computed(() => {
  const sevenDaysAgo = subDays(new Date(), 7)
  const assessments = JSON.parse(localStorage.getItem('kriyaAssessments') || '[]')
  const weeklyData = assessments.filter(a => parseISO(a.date) >= sevenDaysAgo)
  
  const averages = {
    positiveIndex: {},
    practices: {},
    concentration: {}
  }

  // Calculate averages for positive index
  Object.keys(formData.value.positiveIndex).forEach(key => {
    const sum = weeklyData.reduce((acc, curr) => acc + curr.positiveIndex[key], 0)
    averages.positiveIndex[key] = weeklyData.length ? sum / weeklyData.length : 0
  })

  // Calculate practice completion rates
  Object.keys(formData.value.practices).forEach(key => {
    const completions = weeklyData.filter(d => d.practices[key]).length
    averages.practices[key] = weeklyData.length ? completions / weeklyData.length : 0
  })

  // Calculate concentration averages
  Object.keys(formData.value.concentration).forEach(key => {
    const sum = weeklyData.reduce((acc, curr) => acc + curr.concentration[key], 0)
    averages.concentration[key] = weeklyData.length ? sum / weeklyData.length : 0
  })

  return averages
})

const saveAssessment = () => {
  const assessments = JSON.parse(localStorage.getItem('kriyaAssessments') || '[]')
  assessments.push({
    ...formData.value,
    id: Date.now()
  })
  localStorage.setItem('kriyaAssessments', JSON.stringify(assessments))
  
  // Show success message
  showSuccess.value = true
  setTimeout(() => {
    showSuccess.value = false
  }, 3000)
  
  // Reset form
  formData.value = {
    date: new Date().toISOString().split('T')[0],
    positiveIndex: {
      discipline: 5,
      love: 5,
      attention: 5,
      gratitude: 5
    },
    practices: Object.fromEntries(
      Object.keys(formData.value.practices).map(key => [key, false])
    ),
    concentration: Object.fromEntries(
      Object.keys(formData.value.concentration).map(key => [key, 0])
    ),
    counts: Object.fromEntries(
      Object.keys(formData.value.counts).map(key => [key, 0])
    ),
    reflection: {
      spiritualProgress: '',
      obstacles: '',
      improvements: ''
    }
  }
}
</script>

<template>
  <div class="max-w-4xl mx-auto p-6">
    <!-- Success Message -->
    <div 
      v-if="showSuccess" 
      class="fixed top-4 right-4 bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative shadow-lg"
      style="z-index: 9999;"
      role="alert"
    >
      <strong class="font-bold">Success!</strong>
      <span class="block sm:inline ml-1">Your daily progress has been saved.</span>
      <button 
        @click="showSuccess = false"
        class="absolute top-0 right-0 px-4 py-3"
      >
        <span class="sr-only">Close</span>
        <svg class="h-4 w-4 fill-current" role="button" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
          <path d="M14.348 14.849a1.2 1.2 0 0 1-1.697 0L10 11.819l-2.651 3.029a1.2 1.2 0 1 1-1.697-1.697l2.758-3.15-2.759-3.152a1.2 1.2 0 1 1 1.697-1.697L10 8.183l2.651-3.031a1.2 1.2 0 1 1 1.697 1.697l-2.758 3.152 2.758 3.15a1.2 1.2 0 0 1 0 1.698z"/>
        </svg>
      </button>
    </div>

    <div class="flex justify-end space-x-4 mb-6">
      <button 
        :class="['btn', viewMode === 'form' ? 'btn-primary' : 'btn-outline']"
        @click="viewMode = 'form'"
      >
        Daily Entry
      </button>
      <button 
        :class="['btn', viewMode === 'weekly' ? 'btn-primary' : 'btn-outline']"
        @click="viewMode = 'weekly'"
      >
        Weekly Review
      </button>
    </div>

    <div v-if="viewMode === 'form'" class="space-y-8">
      <div class="card bg-white p-6">
        <h2 class="text-2xl font-bold mb-6">Daily Practice Assessment</h2>
        
        <!-- Date -->
        <div class="mb-6">
          <label class="block text-sm font-medium mb-2">Date</label>
          <input 
            type="date" 
            v-model="formData.date"
            class="w-full p-2 border rounded"
          />
        </div>

        <!-- Positive Index Section -->
        <div class="mb-8">
          <h3 class="text-xl font-semibold mb-4">Positive Index (1-10)</h3>
          <div class="space-y-4">
            <div v-for="(value, key) in formData.positiveIndex" :key="key">
              <label class="block text-sm font-medium mb-2">{{ formatLabel(key) }}</label>
              <input 
                type="range" 
                v-model.number="formData.positiveIndex[key]" 
                min="1" 
                max="10"
                class="w-full"
              />
              <div class="text-right">{{ value }}/10</div>
            </div>
          </div>
        </div>

        <!-- Spiritual Practices Section -->
        <div class="mb-8">
          <h3 class="text-xl font-semibold mb-4">Spiritual Practices</h3>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div v-for="(value, key) in formData.practices" :key="key">
              <label class="flex items-center space-x-2">
                <input 
                  type="checkbox" 
                  v-model="formData.practices[key]"
                  class="form-checkbox"
                />
                <span>{{ formatLabel(key) }}</span>
              </label>
            </div>
          </div>
        </div>

        <!-- Concentration Metrics -->
        <div class="mb-8">
          <h3 class="text-xl font-semibold mb-4">Depth of Concentration</h3>
          <div class="space-y-4">
            <div v-for="(value, key) in formData.concentration" :key="key">
              <label class="block text-sm font-medium mb-2">{{ formatLabel(key) }}</label>
              <input 
                type="number" 
                v-model.number="formData.concentration[key]"
                class="w-full p-2 border rounded"
                min="0"
                max="100"
                step="1"
              />
            </div>
          </div>
        </div>

        <!-- Practice Counts -->
        <div class="mb-8">
          <h3 class="text-xl font-semibold mb-4">Practice Counts</h3>
          <div class="space-y-4">
            <div v-for="(value, key) in formData.counts" :key="key">
              <label class="block text-sm font-medium mb-2">{{ formatLabel(key) }}</label>
              <input 
                type="number" 
                v-model.number="formData.counts[key]"
                class="w-full p-2 border rounded"
                min="0"
                step="1"
              />
            </div>
          </div>
        </div>

        <!-- Reflection -->
        <div class="mb-8">
          <h3 class="text-xl font-semibold mb-4">Daily Reflection</h3>
          <div class="space-y-4">
            <div v-for="(value, key) in formData.reflection" :key="key">
              <label class="block text-sm font-medium mb-2">{{ formatLabel(key) }}</label>
              <textarea 
                v-model="formData.reflection[key]"
                class="w-full p-2 border rounded"
                rows="3"
              ></textarea>
            </div>
          </div>
        </div>

        <button @click="saveAssessment" class="btn btn-primary w-full">
          Save Daily Progress
        </button>
      </div>
    </div>

    <div v-else class="card bg-white p-6">
      <h2 class="text-2xl font-bold mb-6">Weekly Progress Report</h2>
      
      <div class="space-y-8">
        <!-- Positive Index Averages -->
        <div>
          <h3 class="text-xl font-semibold mb-4">Average Positive Index</h3>
          <div class="space-y-4">
            <div v-for="(avg, key) in weeklyAverages.positiveIndex" :key="key">
              <div class="flex justify-between mb-1">
                <span>{{ formatLabel(key) }}</span>
                <span>{{ avg.toFixed(1) }}/10</span>
              </div>
              <div class="w-full bg-gray-200 rounded">
                <div 
                  class="bg-blue-600 rounded h-2" 
                  :style="{ width: `${(avg/10)*100}%` }"
                ></div>
              </div>
            </div>
          </div>
        </div>

        <!-- Practice Completion Rates -->
        <div>
          <h3 class="text-xl font-semibold mb-4">Practice Completion Rate</h3>
          <div class="space-y-4">
            <div v-for="(rate, key) in weeklyAverages.practices" :key="key">
              <div class="flex justify-between mb-1">
                <span>{{ formatLabel(key) }}</span>
                <span>{{ (rate * 100).toFixed(0) }}%</span>
              </div>
              <div class="w-full bg-gray-200 rounded">
                <div 
                  class="bg-green-600 rounded h-2" 
                  :style="{ width: `${rate*100}%` }"
                ></div>
              </div>
            </div>
          </div>
        </div>

        <!-- Average Concentration -->
        <div>
          <h3 class="text-xl font-semibold mb-4">Average Concentration Levels</h3>
          <div class="space-y-4">
            <div v-for="(avg, key) in weeklyAverages.concentration" :key="key">
              <div class="flex justify-between mb-1">
                <span>{{ formatLabel(key) }}</span>
                <span>{{ avg.toFixed(1) }}%</span>
              </div>
              <div class="w-full bg-gray-200 rounded">
                <div 
                  class="bg-purple-600 rounded h-2" 
                  :style="{ width: `${avg}%` }"
                ></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.btn {
  @apply px-4 py-2 rounded-lg font-medium transition-colors;
}
.btn-primary {
  @apply bg-blue-600 text-white hover:bg-blue-700;
}
.btn-outline {
  @apply border border-gray-300 hover:bg-gray-50;
}
.card {
  @apply rounded-lg shadow-sm;
}
.form-checkbox {
  @apply rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50;
}
</style>