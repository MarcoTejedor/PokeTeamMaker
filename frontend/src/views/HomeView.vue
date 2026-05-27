<template>
  <div class="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-600 via-red-500 to-slate-900 p-4">
    <!-- Centered Hero Card -->
    <div class="bg-white rounded-2xl shadow-2xl p-8 md:p-12 max-w-md w-full text-center">
      <!-- App Title -->
      <h1 class="text-4xl md:text-5xl font-bold text-gray-900 mb-2">
        PokéTeam Master AI
      </h1>

      <!-- Decorative divider -->
      <div class="h-1 w-16 bg-red-600 mx-auto mb-6 rounded"></div>

      <!-- Tagline -->
      <p class="text-lg text-gray-600 mb-8">
        Build, manage, and analyze your ultimate competitive Pokémon team.
      </p>

      <!-- Button Container -->
      <div class="flex flex-col gap-4">
        <!-- Log In Button -->
        <router-link
          to="/login"
          class="btn-primary py-3 text-lg font-semibold transition-transform hover:scale-105"
        >
          Log In
        </router-link>

        <!-- Sign Up Button -->
        <router-link
          to="/register"
          class="px-4 py-3 bg-slate-900 text-white rounded-lg hover:bg-slate-800 transition-colors font-semibold text-lg"
        >
          Sign Up
        </router-link>
      </div>

      <!-- Footer note -->
      <p class="text-xs text-gray-500 mt-8">
        Built with Vue.js, Django, and the PokéAPI
      </p>
    </div>
  </div>
</template>

<script>
export default {
  name: 'HomeView',
  setup() {
    // No additional logic needed - router guards handle redirect if authenticated
    return {}
  },
}
</script>

<style scoped>
/* Additional scoped styles if needed */
</style>