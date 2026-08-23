<template>
  <div class="container page">
    <Breadcrumbs :items="[{ label: 'Inicio', to: '/' }, { label: 'Buscar' }]" />
    <h1 class="page-title">Buscar en el archivo</h1>
    <p class="page-sub">Busca por equipo, ciudad, año o estadio entre {{ data.length.toLocaleString('es') }} temporadas.</p>

    <div class="search-panel card">
      <input v-model="query" class="input" type="text" placeholder="Ej. Yankees, Dodgers, 1927, Fenway…" autofocus>
      <div class="filters">
        <select v-model="lgFilter" class="input select">
          <option value="">Todas las ligas</option>
          <option v-for="lg in leagueOptions" :key="lg" :value="lg">{{ lg }}</option>
        </select>
        <select v-model="titleFilter" class="input select">
          <option value="">Cualquier resultado</option>
          <option value="ws">Solo campeones de Serie Mundial</option>
          <option value="lg">Solo campeones de liga</option>
          <option value="div">Solo campeones de división</option>
        </select>
      </div>
    </div>

    <p class="results-count">
      {{ loading ? 'Cargando…' : `${filtered.length.toLocaleString('es')} resultado(s)` }}
    </p>

    <div v-if="loading" class="grid grid-3">
      <div v-for="i in 6" :key="i" class="skeleton" style="height:110px" />
    </div>

    <p v-else-if="!filtered.length" class="no-results">No se encontraron resultados. Intenta con otro término o quita los filtros.</p>

    <div v-else class="grid grid-3">
      <NuxtLink v-for="t in pageItems" :key="t.id" :to="`/liga/${t.lgID}/${t.franchID}/${t.year}-${t.teamID}`" class="card-link">
        <div class="card result-card">
          <div class="result-top">
            <span class="pill pill-blue">{{ t.lgID }}</span>
            <span class="result-year">{{ t.year }}</span>
          </div>
          <h3>{{ t.name }}</h3>
          <p>{{ t.W }}-{{ t.L }} · {{ t.park || 'Estadio no registrado' }}</p>
          <span v-if="t.WSWin === 'Y'" class="pill pill-red">Serie Mundial</span>
        </div>
      </NuxtLink>
    </div>

    <Pagination v-if="!loading" :page="page" :total-pages="totalPages" @update:page="p => page = p" />
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watch, onMounted } from 'vue'
import { useTeamsData } from '~/composables/useTeamsData'

const route = useRoute()
const router = useRouter()
const { data, loading, ensureLoaded } = useTeamsData()
onMounted(ensureLoaded)

const query = ref(String(route.query.q ?? ''))
const lgFilter = ref('')
const titleFilter = ref('')
const page = ref(1)
const pageSize = 12

const leagueOptions = computed(() => [...new Set(data.value.map(t => t.lgID))].sort())

const filtered = computed(() => {
  let rows = data.value
  const q = query.value.trim().toLowerCase()
  if (q) {
    rows = rows.filter(t =>
      t.name.toLowerCase().includes(q) ||
      t.franchName.toLowerCase().includes(q) ||
      (t.park || '').toLowerCase().includes(q) ||
      String(t.year).includes(q)
    )
  }
  if (lgFilter.value) rows = rows.filter(t => t.lgID === lgFilter.value)
  if (titleFilter.value === 'ws') rows = rows.filter(t => t.WSWin === 'Y')
  if (titleFilter.value === 'lg') rows = rows.filter(t => t.LgWin === 'Y')
  if (titleFilter.value === 'div') rows = rows.filter(t => t.DivWin === 'Y')
  return [...rows].sort((a, b) => b.year - a.year)
})

const totalPages = computed(() => Math.max(1, Math.ceil(filtered.value.length / pageSize)))
const pageItems = computed(() => filtered.value.slice((page.value - 1) * pageSize, page.value * pageSize))

watch([query, lgFilter, titleFilter], () => { page.value = 1 })
watch(query, (v) => {
  router.replace({ query: v ? { q: v } : {} })
})
</script>

<style scoped>
.page { padding: 40px 0 64px; }
.page-title { font-size: 30px; margin-bottom: 6px; }
.page-sub { color: var(--mlb-gray-600); margin: 0 0 24px; }

.search-panel { padding: 20px; display: flex; flex-direction: column; gap: 14px; margin-bottom: 12px; }
.filters { display: flex; gap: 12px; flex-wrap: wrap; }
.select { max-width: 240px; cursor: pointer; }

.results-count { font-size: 13px; color: var(--mlb-gray-600); margin: 20px 0 16px; }

.result-card { padding: 18px; height: 100%; display: flex; flex-direction: column; gap: 8px; }
.result-top { display: flex; justify-content: space-between; align-items: center; }
.result-year { font-family: var(--font-display); font-weight: 700; color: var(--mlb-gray-600); }
.result-card h3 { font-size: 16px; margin: 0; }
.result-card p { margin: 0; font-size: 13px; color: var(--mlb-gray-600); }
.no-results { color: var(--mlb-gray-600); padding: 40px 0; text-align: center; }
</style>
