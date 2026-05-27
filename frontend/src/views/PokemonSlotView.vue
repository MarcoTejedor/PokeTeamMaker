<template>
  <div class="min-h-screen bg-slate-50 py-10 px-4">
    <div class="max-w-4xl mx-auto bg-white rounded-3xl shadow-xl p-8 md:p-10">
      <div class="flex items-center justify-between mb-6">
        <div>
          <h1 class="text-2xl font-bold">Add Pokémon to {{ teamName || 'Team' }}</h1>
          <p class="text-gray-600">Search and choose the Pokémon you want to add.</p>
        </div>
        <router-link :to="`/equipos/${teamId}`" class="text-blue-600 hover:underline">Back</router-link>
      </div>

      <div class="grid gap-4 sm:grid-cols-3 mb-4 items-center">
        <div class="sm:col-span-2">
          <label class="block text-sm font-medium text-slate-700 mb-1">Search (partial allowed)</label>
          <input v-model="searchTerm" @input="onSearchInput" placeholder="Type name or partial (e.g., 'char')" class="input-field w-full" />
          <ul v-if="filteredResults.length && showResults" class="border rounded mt-2 max-h-48 overflow-auto bg-white">
            <li v-for="item in filteredResults.slice(0,50)" :key="item.name" class="px-3 py-2 cursor-pointer hover:bg-slate-100 flex justify-between" @click="selectSpecies(item)">
              <span class="capitalize">{{ item.name }}</span>
              <small class="text-gray-400">{{ item.url ? '' : '' }}</small>
            </li>
          </ul>
        </div>

        <div>
          <label class="block text-sm font-medium text-slate-700 mb-1">Generation</label>
          <select v-model="selectedGeneration" class="input-field w-full" @change="onGenerationChange">
            <option value="">All</option>
            <option v-for="g in generations" :key="g.name" :value="g.url">{{ g.name }}</option>
          </select>
        </div>
      </div>

      <div v-if="loading" class="text-center py-10 text-gray-600">
        Loading...
      </div>

      <div v-if="error" class="rounded-2xl border border-red-200 bg-red-50 p-4 text-red-700 mb-6">{{ error }}</div>

      <div v-if="selectedSpecies">
        <div class="mb-4">
          <h2 class="text-xl font-semibold capitalize">{{ selectedSpecies.name }}</h2>
          <p class="text-sm text-gray-500">Choose a form if available</p>
        </div>

        <div v-if="forms.length > 1" class="mb-4">
          <label class="text-sm font-medium text-slate-700 mb-1 block">Form / Variant</label>
          <select v-model="selectedForm" class="input-field w-full">
            <option v-for="f in forms" :key="f.name" :value="f.name">{{ f.name }}</option>
          </select>
        </div>

        <div v-if="pokemonDetail" class="grid gap-4 lg:grid-cols-2">
          <div class="rounded-3xl border p-6 bg-slate-50">
            <img :src="pokemonDetail.sprites.front_default" alt="" class="h-36 w-36 object-contain mx-auto mb-4" />
            <div class="text-center">
              <div class="text-lg font-bold">{{ pokemonDetail.name }}</div>
              <div class="text-sm text-gray-600">#{{ pokemonDetail.id }}</div>
              <div class="mt-3 flex gap-2 items-center justify-center flex-wrap">
                <TypeIcon v-for="t in pokemonDetail.types" :key="t" :type="t" />
              </div>
            </div>
          </div>

          <div class="rounded-3xl border p-6 bg-white">
            <h3 class="text-lg font-semibold mb-3">Summary</h3>
            <p class="text-sm text-gray-600 mb-4">Preview the Pokémon details and assign to the team. You can also pick the desired form above if available.</p>

            <div class="flex gap-3">
              <button @click="assignSelected" class="btn-primary px-4 py-2" :disabled="assigning">{{ assigning ? 'Assigning...' : 'Assign to Team' }}</button>
              <button @click="clearSelection" class="btn-secondary px-4 py-2">Cancel</button>
            </div>

            <div v-if="assignSuccess" class="mt-4 text-green-700 bg-green-50 p-3 rounded">{{ assignSuccess }}</div>
            <div v-if="assignError" class="mt-4 text-red-700 bg-red-50 p-3 rounded">{{ assignError }}</div>
          </div>
        </div>
      </div>

      <div v-else class="text-gray-500 mt-6">No Pokémon selected.</div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import TypeIcon from '@/components/TypeIcon.vue'
import { teamsAPI } from '@/services/api'

const POKEAPI = import.meta.env.VITE_POKEAPI_URL || 'https://pokeapi.co/api/v2'

export default {
  name: 'PokemonSlotView',
  components: { TypeIcon },
  setup(){
    const route = useRoute()
    const router = useRouter()
    const teamId = route.params.id
    const teamName = ref('')
    const searchTerm = ref('')
    const showResults = ref(false)
    const loading = ref(false)
    const error = ref(null)
    const speciesList = ref([])
    const filteredResults = ref([])
    const selectedSpecies = ref(null)
    const forms = ref([])
    const selectedForm = ref('')
    const pokemonDetail = ref(null)
    const assigning = ref(false)
    const assignSuccess = ref('')
    const assignError = ref('')
    const selectedGeneration = ref('')
    const generations = ref([])

    // Load species list (cached locally)
    async function loadSpeciesList(){
      const cached = localStorage.getItem('pokedex_species')
      if (cached){
        speciesList.value = JSON.parse(cached)
        return
      }
      try {
        loading.value = true
        const res = await fetch(`${POKEAPI}/pokemon?limit=2000`)
        const data = await res.json()
        speciesList.value = data.results || []
        localStorage.setItem('pokedex_species', JSON.stringify(speciesList.value))
      } catch (err) {
        console.error(err)
      } finally { loading.value = false }
    }

    async function loadGenerations(){
      try {
        const res = await fetch(`${POKEAPI}/generation`)
        const data = await res.json()
        generations.value = data.results || []
      } catch(e){ /* ignore */ }
    }

    async function onSearchInput(){
      showResults.value = true
      const q = searchTerm.value.trim().toLowerCase()
      if (!q) { filteredResults.value = [] ; return }
      
      let list = speciesList.value
      
      if (selectedGeneration.value){
        // Additive: Get all species from Gen 1 to selected generation
        try {
          // Fetch the selected generation to get its generation number
          const selectedGenRes = await fetch(selectedGeneration.value)
          const selectedGenData = await selectedGenRes.json()
          const targetGen = selectedGenData.id // Generation number (1, 2, 3, ...)
          
          const allowedSpecies = new Set()
          
          // Fetch all generations from 1 to targetGen and accumulate species
          for (let g = 1; g <= targetGen; g++) {
            const genRes = await fetch(`${POKEAPI}/generation/${g}`)
            const genData = await genRes.json()
            ;(genData.pokemon_species || []).forEach(s => allowedSpecies.add(s.name))
          }
          
          filteredResults.value = list.filter(s => s.name.includes(q) && allowedSpecies.has(s.name))
        } catch (err) {
          console.error('Failed to filter by generation:', err)
          filteredResults.value = list.filter(s => s.name.includes(q))
        }
        return
      }
      
      filteredResults.value = list.filter(s => s.name.includes(q))
    }

    function selectSpecies(item){
      selectedSpecies.value = item
      showResults.value = false
      searchTerm.value = item.name
      loadFormsForSpecies(item.name)
    }

    async function loadFormsForSpecies(speciesName){
      loading.value = true
      selectedForm.value = ''
      forms.value = []
      pokemonDetail.value = null
      try {
        // get species to learn varieties
        const sp = await fetch(`${POKEAPI}/pokemon-species/${speciesName}`).then(r=>r.json())
        const varieties = sp.varieties || []
        if (varieties.length <= 1) {
          // directly fetch pokemon/{speciesName}
          const p = await fetch(`${POKEAPI}/pokemon/${speciesName}`).then(r=>r.json())
          pokemonDetail.value = transformPokemonDetail(p)
          forms.value = [{ name: p.name, url: `${POKEAPI}/pokemon/${p.name}` }]
          selectedForm.value = p.name
        } else {
          forms.value = varieties.map(v => ({ name: v.pokemon.name, url: v.pokemon.url }))
          selectedForm.value = forms.value[0].name
          // fetch default
          const p = await fetch(forms.value[0].url).then(r=>r.json())
          pokemonDetail.value = transformPokemonDetail(p)
        }
      } catch (err) {
        error.value = 'Failed to load species/forms.'
      } finally {
        loading.value = false
      }
    }

    async function onGenerationChange(){
      // Re-filter current search term after selecting generation
      onSearchInput()
    }

    watch(selectedForm, async (val) => {
      if (!val) return
      try {
        const p = await fetch(`${POKEAPI}/pokemon/${val}`).then(r=>r.json())
        pokemonDetail.value = transformPokemonDetail(p)
      } catch(e){ /* ignore */ }
    })

    function transformPokemonDetail(p){
      return {
        id: p.id,
        name: p.name,
        pokedex_id: p.id,
        types: p.types.map(t => t.type.name),
        sprites: {
          front_default: p.sprites.front_default,
          front_female: p.sprites.front_female,
          back_default: p.sprites.back_default
        },
        stats: p.stats.reduce((acc,s)=>{ acc[s.stat.name]=s.base_stat; return acc}, {})
      }
    }

    function clearSelection(){
      selectedSpecies.value = null
      pokemonDetail.value = null
      forms.value = []
      searchTerm.value = ''
    }

    async function assignSelected(){
      if (!pokemonDetail.value) return
      assigning.value = true
      assignSuccess.value = ''
      assignError.value = ''
      try {
        // call teamsAPI.assignSlot but first we must know the position - it's in the route param (position)
        const position = Number(route.params.m)
        await teamsAPI.assignSlot(teamId, position, {
          pokedex_id: pokemonDetail.value.pokedex_id,
          name: pokemonDetail.value.name,
          types: pokemonDetail.value.types,
          sprites: pokemonDetail.value.sprites,
          stats: pokemonDetail.value.stats
        })
        assignSuccess.value = `${pokemonDetail.value.name} assigned. Redirecting...`
        setTimeout(()=>router.push(`/equipos/${teamId}`),700)
      } catch (err) {
        assignError.value = err.response?.data?.error || 'Failed to assign Pokémon.'
      } finally {
        assigning.value = false
      }
    }

    async function loadTeamName(){
      try {
        const res = await teamsAPI.getDetail(teamId)
        teamName.value = res.data.name
      } catch(e){}
    }

    onMounted(()=>{
      loadSpeciesList()
      loadGenerations()
      loadTeamName()
    })

    return {
      teamId, teamName, searchTerm, selectedSpecies, pokemonDetail, loading, error,
      filteredResults, showResults, onSearchInput, selectSpecies, forms, selectedForm,
      assignSelected, assigning, assignSuccess, assignError, clearSelection, generations,
      selectedGeneration, onGenerationChange
    }
  }
}
</script>

<style scoped>
/* lightweight styles */
</style>