<template>
  <span class="inline-flex items-center">
    <img
      v-if="iconUrl"
      :src="iconUrl"
      :alt="type"
      class="h-10 w-20 object-contain"
      @error="onError"
      @load="onLoad"
    />
    <span v-else-if="loading" class="h-20 w-20 bg-slate-200 rounded animate-pulse"></span>
  </span>
</template>

<script>
import { ref, onMounted } from 'vue'

const POKEAPI = 'https://pokeapi.co/api/v2'
const TYPE_ICON_CACHE = 'pokeapi_type_icons'

export default {
  name: 'TypeIcon',
  props: {
    type: { type: String, required: true },
  },
  setup(props) {
    const iconUrl = ref(null)
    const loading = ref(true)
    const hasError = ref(false)

    async function fetchTypeIcon() {
      try {
        // Check cache first
        const cached = localStorage.getItem(TYPE_ICON_CACHE)
        let typeIcons = cached ? JSON.parse(cached) : {}

        if (typeIcons[props.type]) {
          iconUrl.value = typeIcons[props.type]
          loading.value = false
          return
        }

        // Fetch from PokéAPI
        const res = await fetch(`${POKEAPI}/type/${props.type}`)
        if (!res.ok) throw new Error('Type not found')
        const data = await res.json()

        // Extract the official Gen IX icon URL
        const url = data.sprites?.['generation-ix']?.['scarlet-violet']?.name_icon ||
                    data.sprites?.['generation-viii']?.['sword-shield']?.name_icon ||
                    data.sprites?.['generation-vii']?.['ultra-sun-ultra-moon']?.name_icon

        if (url) {
          iconUrl.value = url
          typeIcons[props.type] = url
          localStorage.setItem(TYPE_ICON_CACHE, JSON.stringify(typeIcons))
        }
      } catch (err) {
        console.error(`Failed to load type icon for ${props.type}:`, err)
        hasError.value = true
      } finally {
        loading.value = false
      }
    }

    function onLoad() {
      // Icon loaded successfully
    }

    function onError() {
      hasError.value = true
    }

    onMounted(() => {
      fetchTypeIcon()
    })

    return { iconUrl, loading, hasError, onLoad, onError }
  }
}
</script>

<style scoped>
</style>