<template>
  <div class="max-w-6xl mx-auto px-4 py-8">
    <div class="flex items-start justify-between mb-6">
      <div>
        <h1 class="text-3xl font-bold text-slate-900">{{ team.name || 'Team' }}</h1>
        <p class="text-gray-600 mt-1">{{ team.pokemon_in_team.length }} Pokémon</p>
      </div>

      <div class="flex items-center gap-3">
        <button
          v-if="team.pokemon_in_team.length < 6"
          @click="handleAddPokemon"
          class="btn-primary px-4 py-2"
        >
          Add Pokémon
        </button>

        <button @click="showEditModal = true" class="btn-secondary px-4 py-2">
          Edit Team
        </button>

        <button @click="confirmDeleteTeam" class="btn-danger px-4 py-2">
          Delete Team
        </button>
      </div>
    </div>

    <!-- Roster Grid (2x3) -->
    <section class="rounded-2xl bg-white p-6 shadow-sm mb-6">
      <h2 class="text-xl font-semibold mb-4">Roster</h2>

      <div v-if="team.pokemon_in_team.length === 0" class="text-center py-8 text-gray-600">
        No Pokémon in this team yet.
      </div>

      <div v-else class="grid grid-cols-3 gap-4">
        <div v-for="pokemon in sortedRoster" :key="pokemon.position" class="pokemon-card p-4 flex flex-col items-center gap-2">
          <img :src="pokemon.sprites.front_default" :alt="pokemon.name" class="h-16 w-16 object-contain" />
          <div class="text-center flex-1">
            <div class="text-sm font-bold text-slate-900">{{ pokemon.name }}</div>
            <div class="text-xs text-gray-500">#{{ pokemon.pokedex_id }}</div>
            <div class="mt-2 flex items-center gap-1 justify-center flex-wrap">
              <TypeIcon v-for="t in pokemon.types" :key="t" :type="t" />
            </div>
            <span v-if="pokemon.equipped_item" class="mt-1 inline-block px-2 py-0.5 text-xs font-medium bg-yellow-100 text-yellow-800 rounded">
              {{ pokemon.equipped_item }}
            </span>
          </div>

          <div class="flex gap-2 w-full">
            <button @click="goToEdit(pokemon)" class="flex-1 text-xs text-blue-600 hover:underline">Edit</button>
            <button @click="confirmDeletePokemon(pokemon)" class="flex-1 text-xs text-red-600 hover:underline">Delete</button>
          </div>
        </div>
      </div>
    </section>

    <!-- Type Analysis (3 Columns) -->
    <section class="rounded-2xl bg-white p-6 shadow-sm">
      <h3 class="text-xl font-semibold mb-4">Type Analysis</h3>

      <div v-if="analysisData.totalPokemon === 0" class="text-center py-8 text-gray-600">
        Add Pokémon to see analysis.
      </div>

      <div v-else class="grid grid-cols-3 gap-6">
        <!-- Weaknesses -->
        <div class="analysis-column">
          <h4 class="text-sm font-semibold text-slate-700 mb-3">Weaknesses</h4>
          <div v-if="Object.keys(analysisData.weaknesses).length === 0" class="text-xs text-gray-500">None</div>
          <div v-else class="flex flex-wrap gap-2">
            <div v-for="(count, type) in analysisData.weaknesses" :key="`weak-${type}`" class="relative">
              <TypeIcon :type="type" />
              <span class="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">{{ count }}</span>
            </div>
          </div>
        </div>

        <!-- Resistances -->
        <div class="analysis-column">
          <h4 class="text-sm font-semibold text-slate-700 mb-3">Resistances</h4>
          <div v-if="Object.keys(analysisData.resistances).length === 0" class="text-xs text-gray-500">None</div>
          <div v-else class="flex flex-wrap gap-2">
            <div v-for="(count, type) in analysisData.resistances" :key="`resist-${type}`" class="relative">
              <TypeIcon :type="type" />
              <span class="absolute -top-2 -right-2 bg-green-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">{{ count }}</span>
            </div>
          </div>
        </div>

        <!-- Immunities -->
        <div class="analysis-column">
          <h4 class="text-sm font-semibold text-slate-700 mb-3">Immunities</h4>
          <div v-if="Object.keys(analysisData.immunities).length === 0" class="text-xs text-gray-500">None</div>
          <div v-else class="flex flex-wrap gap-2">
            <div v-for="(count, type) in analysisData.immunities" :key="`immune-${type}`" class="relative">
              <TypeIcon :type="type" />
              <span class="absolute -top-2 -right-2 bg-blue-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">{{ count }}</span>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Edit Team Modal -->
    <div v-if="showEditModal" class="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div class="w-full max-w-lg rounded-3xl bg-white p-6 shadow-2xl">
        <h3 class="text-2xl font-bold mb-4">Edit Team</h3>
        <form @submit.prevent="saveTeam" class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-slate-700 mb-1">Team Name</label>
            <input v-model="editForm.name" type="text" class="input-field w-full" required />
          </div>
          <div>
            <label class="block text-sm font-medium text-slate-700 mb-1">Description</label>
            <textarea v-model="editForm.description" class="input-field w-full" rows="4"></textarea>
          </div>

          <div class="flex justify-end gap-3 pt-4">
            <button type="button" @click="showEditModal = false" class="btn-secondary">Cancel</button>
            <button type="submit" class="btn-primary">Save Changes</button>
          </div>
        </form>
      </div>
    </div>

  </div>
</template>

<script>
import { ref, computed, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { teamsAPI } from '@/services/api'
import TypeIcon from '@/components/TypeIcon.vue'

const TYPE_EFFECTIVENESS = {
  normal: { weak_to: ['fighting'], resists: [], immune_to: ['ghost'] },
  fire: { weak_to: ['water', 'ground', 'rock'], resists: ['fire','grass','ice','bug','steel','fairy'], immune_to: [] },
  water: { weak_to: ['electric','grass'], resists: ['fire','water','ice','steel'], immune_to: [] },
  electric: { weak_to: ['ground'], resists: ['flying','steel','electric'], immune_to: [] },
  grass: { weak_to: ['fire','ice','poison','flying','bug'], resists: ['ground','water','grass','electric'], immune_to: [] },
  ice: { weak_to: ['fire','fighting','rock','steel'], resists: ['ice'], immune_to: [] },
  fighting: { weak_to: ['flying','psychic','fairy'], resists: ['rock','bug','dark'], immune_to: [] },
  poison: { weak_to: ['ground','psychic'], resists: ['fighting','poison','bug','grass'], immune_to: [] },
  ground: { weak_to: ['water','grass','ice'], resists: ['poison','rock'], immune_to: ['electric'] },
  flying: { weak_to: ['electric','ice','rock'], resists: ['fighting','bug','grass'], immune_to: [] },
  psychic: { weak_to: ['bug','ghost','dark'], resists: ['fighting','psychic'], immune_to: [] },
  bug: { weak_to: ['fire','flying','rock'], resists: ['fighting','ground','grass'], immune_to: [] },
  rock: { weak_to: ['water','grass','fighting','ground','steel'], resists: ['normal','flying','poison','fire'], immune_to: [] },
  ghost: { weak_to: ['ghost','dark'], resists: ['poison','bug'], immune_to: ['normal','fighting'] },
  dragon: { weak_to: ['ice','dragon','fairy'], resists: ['fire','water','grass','electric'], immune_to: [] },
  dark: { weak_to: ['fighting','bug','fairy'], resists: ['ghost','dark'], immune_to: ['psychic'] },
  steel: { weak_to: ['fire','water','ground'], resists: ['normal','flying','rock','bug','steel','grass','psychic','ice','dragon','fairy'], immune_to: ['poison'] },
  fairy: { weak_to: ['poison','steel'], resists: ['fighting','bug','dark'], immune_to: [] },
}

export default {
  name: 'TeamDetailView',
  components: { TypeIcon },
  setup() {
    const route = useRoute()
    const router = useRouter()
    const team = ref({ pokemon_in_team: [] })
    const loading = ref(false)
    const error = ref(null)
    const showEditModal = ref(false)
    const editForm = ref({ name: '', description: '' })

    const analysisData = ref({ weaknesses: {}, totalPokemon: 0 })

    const loadTeam = async () => {
      loading.value = true
      error.value = null
      try {
        const resp = await teamsAPI.getDetail(route.params.id)
        team.value = resp.data
        editForm.value = { name: team.value.name || '', description: team.value.description || '' }
        computeAnalysis()
      } catch (err) {
        error.value = err.response?.data?.error || 'Failed to load team.'
      } finally {
        loading.value = false
      }
    }

    // Only render filled roster cards, ordered by position
    const sortedRoster = computed(() => {
      return [...(team.value.pokemon_in_team || [])].sort((a,b)=>a.position - b.position)
    })

    function computeAnalysis() {
      const weaknesses = {}
      const resistances = {}
      const immunities = {}
      const roster = team.value.pokemon_in_team || []
      roster.forEach(poke => {
        const types = poke.types || []
        // For each Pokémon, compute weaknesses, resistances, and immunities
        types.forEach(t => {
          const typeInfo = TYPE_EFFECTIVENESS[t]
          if (!typeInfo) return
          typeInfo.weak_to.forEach(w => { weaknesses[w] = (weaknesses[w] || 0) + 1 })
          typeInfo.resists.forEach(r => { resistances[r] = (resistances[r] || 0) + 1 })
          typeInfo.immune_to.forEach(i => { immunities[i] = (immunities[i] || 0) + 1 })
        })
      })
      analysisData.value = { weaknesses, resistances, immunities, totalPokemon: roster.length }
    }

    async function saveTeam() {
      try {
        await teamsAPI.update(route.params.id, { name: editForm.value.name, description: editForm.value.description })
        showEditModal.value = false
        await loadTeam()
      } catch (err) {
        alert('Failed to save team.')
      }
    }

    function confirmDeleteTeam() {
      if (!confirm('Delete this team permanently?')) return
      teamsAPI.delete(route.params.id).then(()=>router.push('/equipos')).catch(()=>alert('Failed to delete team.'))
    }

    function confirmDeletePokemon(pokemon) {
      if (!confirm(`Remove ${pokemon.name} from this team?`)) return
      teamsAPI.clearSlot(route.params.id, pokemon.position).then(()=>loadTeam()).catch(()=>alert('Failed to delete Pokémon from team.'))
    }

    function goToEdit(pokemon) {
      // Navigate to selection page for that internal position (under the hood)
      router.push(`/equipos/${route.params.id}/slot/${pokemon.position}`)
    }

    function handleAddPokemon() {
      // Find first empty position 1..6
      const occupied = new Set((team.value.pokemon_in_team || []).map(p=>p.position))
      for (let pos=1; pos<=6; pos++){
        if (!occupied.has(pos)) {
          router.push(`/equipos/${route.params.id}/slot/${pos}`)
          return
        }
      }
      // already full
    }

    onMounted(loadTeam)

    return {
      team, loading, error, showEditModal, editForm, saveTeam,
      sortedRoster, handleAddPokemon, goToEdit, confirmDeletePokemon, confirmDeleteTeam,
      analysisData
    }
  }
}
</script>

<style scoped>
.pokemon-card { @apply bg-slate-50 rounded-lg shadow p-3 flex flex-col items-center; }
.analysis-column { @apply flex flex-col; }
</style>