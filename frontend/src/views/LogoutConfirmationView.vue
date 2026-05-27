<template>
  <div class="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-600 via-red-500 to-slate-900 p-4">
    <div class="bg-white rounded-2xl shadow-2xl p-8 md:p-12 max-w-md w-full text-center">
      <!-- Success Icon -->
      <div class="mb-6">
        <div class="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg class="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
          </svg>
        </div>
        <h2 class="text-2xl font-bold text-gray-900 mb-2">Logged Out Successfully</h2>
        <p class="text-gray-600">You have been logged out of your account.</p>
      </div>

      <!-- Navigation Buttons -->
      <div class="flex flex-col gap-4">
        <router-link
          to="/login"
          class="btn-primary py-3 text-lg font-semibold transition-transform hover:scale-105"
        >
          Log In Again
        </router-link>

        <router-link
          to="/register"
          class="px-4 py-3 bg-slate-900 text-white rounded-lg hover:bg-slate-800 transition-colors font-semibold text-lg"
        >
          Create New Account
        </router-link>
      </div>

      <!-- Footer note -->
      <p class="text-xs text-gray-500 mt-8">
        Thank you for using PokéTeam Master AI!
      </p>
    </div>
  </div>
</template>

<script>
export default {
  name: 'LogoutConfirmationView',
  setup() {
    // No additional logic needed - just a confirmation page
    return {}
  },
}
</script>

<style scoped>
/* Additional scoped styles can go here if needed */
</style>