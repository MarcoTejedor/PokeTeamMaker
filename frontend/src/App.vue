<template>
  <div class="flex flex-col min-h-screen bg-gray-50">
    <header v-if="isAuthenticated" class="sticky top-0 z-50 bg-white shadow-md">
      <div class="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
        <router-link to="/equipos" class="flex items-center gap-2">
          <img 
            src="@/assets/logo.png" 
            alt="PokéTeam Logo" 
            class="h-10 w-10 object-contain"
            @error="logoError = true"
          />
          <span v-if="logoError" class="text-xl font-bold text-blue-600">
            PokéTeam
          </span>
        </router-link>

        <div class="flex items-center gap-4">
          <span class="text-gray-700 font-semibold">
            {{ userName }}
          </span>
          <button
            @click="handleLogout"
            class="btn-secondary text-sm"
          >
            Logout
          </button>
        </div>
      </div>
    </header>

    <main class="flex-grow">
      <router-view />
    </main>

    <footer v-if="isAuthenticated" class="bg-gray-800 text-gray-300 text-sm py-6 mt-12">
      <div class="max-w-7xl mx-auto px-4">
        <p class="text-center mb-3">
          Pokémon is © Nintendo/Game Freak. PokéTeam Master AI is a fan project 
          for educational purposes. We are not affiliated with The Pokémon Company.
        </p>
        <div class="text-center">
          <router-link 
            to="/info" 
            class="text-blue-400 hover:text-blue-300 transition-colors"
          >
            More Information
          </router-link>
        </div>
      </div>
    </footer>
  </div>
</template>

<script>
import { ref, onMounted, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { authAPI } from './services/api'

export default {
  name: 'App',
  setup() {
    const router = useRouter()
    const route = useRoute()
    const isAuthenticated = ref(false)
    const userName = ref('')
    const logoError = ref(false)

    // Reactively sync auth state on route changes
    const checkAuthStatus = () => {
      const userId = localStorage.getItem('userId')
      if (userId) {
        isAuthenticated.value = true
        const userName_stored = localStorage.getItem('userName')
        userName.value = userName_stored || 'User'
      } else {
        isAuthenticated.value = false
        userName.value = ''
      }
    }

    // Check if user is authenticated on mount
    onMounted(() => {
      checkAuthStatus()
    })

    watch(() => route.path, checkAuthStatus)

    // Handle logout
    const handleLogout = async () => {
      try {
        await authAPI.logout()
      } catch (error) {
        console.error('Logout API error (continuing anyway):', error)
      }

      // Clear local storage
      localStorage.removeItem('userId')
      localStorage.removeItem('userName')

      // Reset state
      checkAuthStatus()

      // Redirect to logout confirmation
      router.push('/logout-confirmation')
    }

    return {
      isAuthenticated,
      userName,
      logoError,
      handleLogout,
    }
  },
}
</script>

<style scoped>
/* Additional scoped styles can go here if needed */
</style>