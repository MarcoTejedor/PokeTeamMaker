<template>
  <div class="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-600 via-red-500 to-slate-900 p-4">
    <div class="bg-white rounded-2xl shadow-2xl p-8 md:p-10 max-w-md w-full">
      <h2 class="text-2xl font-bold text-gray-900 mb-2">Log In</h2>
      <p class="text-sm text-gray-600 mb-6">Sign in to manage your teams and analyze strategies.</p>

      <form @submit.prevent="handleSubmit" class="space-y-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1" for="username">Username</label>
          <input
            id="username"
            v-model="form.username"
            type="text"
            required
            class="input-field"
            autocomplete="username"
          />
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1" for="password">Password</label>
          <input
            id="password"
            v-model="form.password"
            type="password"
            required
            class="input-field"
            autocomplete="current-password"
          />
        </div>

        <div v-if="error" class="text-red-600 text-sm">
          {{ error }}
        </div>

        <div class="flex items-center justify-between mt-4">
          <button
            type="submit"
            class="btn-primary px-6 py-2 text-base"
            :disabled="loading"
          >
            <span v-if="!loading">Log In</span>
            <span v-else>Signing in...</span>
          </button>

          <router-link to="/register" class="text-sm text-blue-600 hover:underline">
            Create account
          </router-link>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { authAPI } from '@/services/api'

export default {
  name: 'LoginView',
  setup() {
    const router = useRouter()
    const form = ref({
      username: '',
      password: '',
    })
    const loading = ref(false)
    const error = ref(null)

    onMounted(() => {
      // Redirect if already authenticated
      const userId = localStorage.getItem('userId')
      if (userId) router.replace('/equipos')
    })

    const handleSubmit = async () => {
      error.value = null
      loading.value = true

      try {
        const payload = {
          username: form.value.username,
          password: form.value.password,
        }
        const res = await authAPI.login(payload)

        // Expecting response with user_id and username per backend
        const userId = res.data.user_id || res.data.userId || null
        const userName = res.data.username || res.data.user || ''

        if (userId) {
          localStorage.setItem('userId', String(userId))
          localStorage.setItem('userName', userName)
          // Navigate to teams
          router.push('/equipos')
        } else {
          error.value = 'Login succeeded but no user data returned.'
        }
      } catch (err) {
        if (err.response && err.response.data) {
          // Try to extract useful message
          const data = err.response.data
          error.value = data.error || data.non_field_errors || JSON.stringify(data)
        } else {
          error.value = 'Network or server error. Please try again.'
        }
      } finally {
        loading.value = false
      }
    }

    return {
      form,
      loading,
      error,
      handleSubmit,
    }
  },
}
</script>

<style scoped>
/* minor scoped overrides can go here if needed */
</style>