<template>
  <div class="container page">
    <Breadcrumbs :items="[{ label: 'Inicio', to: '/' }, { label: 'Ligas', to: '/ligas' }, { label: lgName }]" />

    <div v-if="!loading && !allFranchises.length && loaded" class="empty">
      <h1>Liga no encontrada</h1>
      <NuxtLink to="/ligas" class="btn btn-primary">Volver a ligas</NuxtLink>
    </div>

    <template v-else>
      <p class="eyebrow">{{ lgId }}</p>
      <h1 class="page-title">{{ lgName }}</h1>
      <p class="page-sub">{{ allFranchises.length }} franquicias · {{ totalSeasons.toLocaleString('es') }} temporadas registradas</p>

      <div class="toolbar">
        <input v-model="query" class="input" type="text" placeholder="Buscar franquicia por nombre…">
      </div>

      <div v-if="loading" class="grid grid-3">
        <div v-for="i in 6" :key="i" class="skeleton" style="height:104px" />
      </div>

      <p v-else-if="!filtered.length" class="no-results">No se encontraron franquicias que coincidan con "{{ query }}".</p>

      <div v-else class="grid grid-3">
        <NuxtLink v-for="f in pageItems" :key="f.franchID" :to="`/liga/${lgId}/${f.franchID}`" class="card-link">
          <div class="card franch-card">
            <h3>{{ f.franchName }}</h3>
            <p>{{ f.count }} temporadas · {{ f.minYear }}–{{ f.maxYear }}</p>
            <div class="franch-badges">
              <span v-if="f.titles" class="pill pill-red">{{ f.titles }}× Serie Mundial</span>
              <span v-if="f.divTitles" class="pill pill-blue">{{ f.divTitles }}× División</span>
            </div>
          </div>
        </NuxtLink>
      </div>

      <Pagination v-if="!loading" :page="page" :total-pages="totalPages" @update:page="p => page = p" />
    </template>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watch, onMounted } from 'vue'
import { useTeamsData } from '~/composables/useTeamsData'

const route = useRoute()
const lgId = computed(() => String(route.params.lg))
const { data, loading, loaded, ensureLoaded } = useTeamsData()
onMounted(ensureLoaded)

const leagueRows = computed(() => data.value.filter(t => t.lgID === lgId.value))
const lgName = computed(() => leagueRows.value[0]?.lgName ?? lgId.value)
const totalSeasons = computed(() => leagueRows.value.length)

const allFranchises = computed(() => {
  const map = new Map<string, { franchID: string; franchName: string; count: number; minYear: number; maxYear: number; titles: number; divTitles: number }>()
  for (const t of leagueRows.value) {
    if (!map.has(t.franchID)) {
      map.set(t.franchID, { franchID: t.franchID, franchName: t.franchName, count: 0, minYear: t.year, maxYear: t.year, titles: 0, divTitles: 0 })
    }
    const e = map.get(t.franchID)!
    e.count++
    e.minYear = Math.min(e.minYear, t.year)
    e.maxYear = Math.max(e.maxYear, t.year)
    if (t.WSWin === 'Y') e.titles++
    if (t.DivWin === 'Y') e.divTitles++
  }
  return [...map.values()].sort((a, b) => b.count - a.count)
})

const query = ref('')
const page = ref(1)
const pageSize = 12

const filtered = computed(() => {
  if (!query.value.trim()) return allFranchises.value
  const q = query.value.toLowerCase()
  return allFranchises.value.filter(f => f.franchName.toLowerCase().includes(q))
})

const totalPages = computed(() => Math.max(1, Math.ceil(filtered.value.length / pageSize)))
const pageItems = computed(() => filtered.value.slice((page.value - 1) * pageSize, page.value * pageSize))

watch(query, () => { page.value = 1 })
watch(lgId, () => { page.value = 1; query.value = '' })
</script>

<style scoped>
.page { padding: 40px 0 64px; }
.page-title { font-size: 30px; margin: 4px 0 6px; }
.page-sub { color: var(--mlb-gray-600); margin: 0 0 24px; }
.toolbar { max-width: 420px; margin-bottom: 28px; }
.franch-card { padding: 20px; height: 100%; }
.franch-card h3 { font-size: 17px; margin-bottom: 6px; }
.franch-card p { margin: 0 0 10px; font-size: 13px; color: var(--mlb-gray-600); }
.franch-badges { display: flex; gap: 6px; flex-wrap: wrap; }
.no-results { color: var(--mlb-gray-600); padding: 40px 0; text-align: center; }
.empty { padding: 60px 0; text-align: center; }
</style>
