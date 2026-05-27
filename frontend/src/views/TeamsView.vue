<template>
  <div class="max-w-7xl mx-auto px-4 py-8">
    <!-- Header Section -->
    <div class="flex items-center justify-between mb-8">
      <div>
        <h1 class="text-3xl font-bold text-gray-900">My Teams</h1>
        <p class="text-gray-600 mt-1">Manage your Pokémon teams and strategies</p>
      </div>
      <button
        @click="showCreateModal = true"
        class="btn-primary px-6 py-3 text-lg"
      >
        Create New Team
      </button>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="text-center py-12">
      <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
      <p class="text-gray-600 mt-4">Loading your teams...</p>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="text-center py-12">
      <div class="text-red-600 mb-4">
        <svg class="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"></path>
        </svg>
      </div>
      <p class="text-red-600 font-semibold mb-2">Error loading teams</p>
      <p class="text-gray-600 mb-4">{{ error }}</p>
      <button @click="loadTeams" class="btn-secondary">Try Again</button>
    </div>

    <!-- Teams Grid -->
    <div v-else-if="teams.length > 0" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <div
        v-for="team in teams"
        :key="team.id"
        class="pokemon-card cursor-pointer hover:shadow-lg transition-shadow"
        @click="goToTeam(team.id)"
      >
        <div class="flex items-center justify-between mb-4">
          <h3 class="text-xl font-bold text-gray-900">{{ team.name }}</h3>
          <span class="text-sm text-gray-500">{{ team.pokemon_count }}/6 Pokémon</span>
        </div>

        <p v-if="team.description" class="text-gray-600 mb-4 line-clamp-2">
          {{ team.description }}
        </p>
        <p v-else class="text-gray-400 mb-4 italic">No description</p>

        <div class="flex items-center justify-between text-sm text-gray-500">
          <span>Created {{ formatDate(team.created_at) }}</span>
          <div class="flex gap-2">
            <button
              @click.stop="editTeam(team)"
              class="text-blue-600 hover:text-blue-800"
            >
              Edit
            </button>
            <button
              @click.stop="deleteTeam(team)"
              class="text-red-600 hover:text-red-800"
            >
              Delete
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Empty State -->
    <div v-else class="text-center py-12">
      <div class="text-gray-400 mb-4">
        <svg class="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path>
        </svg>
      </div>
      <h3 class="text-xl font-semibold text-gray-900 mb-2">No teams yet</h3>
      <p class="text-gray-600 mb-6">Create your first Pokémon team to get started!</p>
      <button
        @click="showCreateModal = true"
        class="btn-primary px-8 py-3 text-lg"
      >
        Create Your First Team
      </button>
    </div>

    <!-- Create Team Modal -->
    <div v-if="showCreateModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div class="bg-white rounded-lg p-6 w-full max-w-md">
        <h3 class="text-xl font-bold mb-4">Create New Team</h3>
        <form @submit.prevent="createTeam">
          <div class="mb-4">
            <label class="block text-sm font-medium text-gray-700 mb-1">Team Name</label>
            <input
              v-model="newTeam.name"
              type="text"
              required
              class="input-field"
              placeholder="Enter team name"
            />
          </div>
          <div class="mb-6">
            <label class="block text-sm font-medium text-gray-700 mb-1">Description (Optional)</label>
            <textarea
              v-model="newTeam.description"
              class="input-field"
              rows="3"
              placeholder="Describe your team strategy..."
            ></textarea>
          </div>
          <div class="flex gap-3">
            <button type="submit" class="btn-primary flex-1" :disabled="creating">
              <span v-if="!creating">Create Team</span>
              <span v-else>Creating...</span>
            </button>
            <button @click="showCreateModal = false" class="btn-secondary flex-1">
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { teamsAPI } from '@/services/api'

export default {
  name: 'TeamsView',
  setup() {
    const router = useRouter()
    const teams = ref([])
    const loading = ref(true)
    const error = ref(null)
    const showCreateModal = ref(false)
    const creating = ref(false)
    const newTeam = ref({
      name: '',
      description: '',
    })

    // Load teams on mount
    onMounted(() => {
      loadTeams()
    })

    const loadTeams = async () => {
      loading.value = true
      error.value = null
      try {
        const response = await teamsAPI.getAll()
        teams.value = response.data.results ?? response.data
      } catch (err) {
        error.value = err.response?.data?.error || 'Failed to load teams'
      } finally {
        loading.value = false
      }
    }

    const goToTeam = (teamId) => {
      router.push(`/equipos/${teamId}`)
    }

    const createTeam = async () => {
      creating.value = true
      try {
        await teamsAPI.create(newTeam.value)
        showCreateModal.value = false
        newTeam.value = { name: '', description: '' }
        await loadTeams() // Refresh the list
      } catch (err) {
        alert('Failed to create team: ' + (err.response?.data?.error || 'Unknown error'))
      } finally {
        creating.value = false
      }
    }

    const editTeam = (team) => {
      // For now, just navigate to team detail (we can add inline editing later)
      goToTeam(team.id)
    }

    const deleteTeam = async (team) => {
      if (!confirm(`Are you sure you want to delete "${team.name}"?`)) return

      try {
        await teamsAPI.delete(team.id)
        await loadTeams() // Refresh the list
      } catch (err) {
        alert('Failed to delete team: ' + (err.response?.data?.error || 'Unknown error'))
      }
    }

    const formatDate = (dateString) => {
      return new Date(dateString).toLocaleDateString()
    }

    return {
      teams,
      loading,
      error,
      showCreateModal,
      creating,
      newTeam,
      loadTeams,
      goToTeam,
      createTeam,
      editTeam,
      deleteTeam,
      formatDate,
    }
  },
}
</script>

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>