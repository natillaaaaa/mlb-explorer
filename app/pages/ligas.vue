<template>
  <div class="container page">
    <Breadcrumbs :items="[{ label: 'Inicio', to: '/' }, { label: 'Ligas' }]" />
    <h1 class="page-title">Ligas históricas</h1>
    <p class="page-sub">Selecciona una liga para explorar sus franquicias y temporadas.</p>

    <div v-if="loading" class="grid grid-2">
      <div v-for="i in 4" :key="i" class="skeleton" style="height:120px" />
    </div>
    <div v-else class="grid grid-2">
      <NuxtLink v-for="lg in leagues" :key="lg.id" :to="`/liga/${lg.id}`" class="card-link">
        <div class="card lg-card">
          <div class="lg-card-top">
            <span class="pill pill-blue">{{ lg.id }}</span>
            <span class="lg-years">{{ lg.minYear }}–{{ lg.maxYear }}</span>
          </div>
          <h2>{{ lg.name }}</h2>
          <p>{{ lg.franchises }} franquicias · {{ lg.seasons.toLocaleString('es') }} temporadas registradas</p>
        </div>
      </NuxtLink>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { useTeamsData } from '~/composables/useTeamsData'

const { data, loading, ensureLoaded } = useTeamsData()
onMounted(ensureLoaded)

const leagues = computed(() => {
  const map = new Map<string, { id: string; name: string; franchises: Set<string>; seasons: number; minYear: number; maxYear: number }>()
  for (const t of data.value) {
    if (!map.has(t.lgID)) map.set(t.lgID, { id: t.lgID, name: t.lgName, franchises: new Set(), seasons: 0, minYear: t.year, maxYear: t.year })
    const e = map.get(t.lgID)!
    e.franchises.add(t.franchID)
    e.seasons++
    e.minYear = Math.min(e.minYear, t.year)
    e.maxYear = Math.max(e.maxYear, t.year)
  }
  return [...map.values()]
    .map(e => ({ id: e.id, name: e.name, franchises: e.franchises.size, seasons: e.seasons, minYear: e.minYear, maxYear: e.maxYear }))
    .sort((a, b) => b.seasons - a.seasons)
})
</script>

<style scoped>
.page { padding: 40px 0 64px; }
.page-title { font-size: 30px; margin-bottom: 6px; }
.page-sub { color: var(--mlb-gray-600); margin: 0 0 28px; }
.lg-card { padding: 22px; height: 100%; }
.lg-card-top { display: flex; align-items: center; justify-content: space-between; margin-bottom: 12px; }
.lg-years { font-size: 12px; color: var(--mlb-gray-400); font-weight: 600; }
.lg-card h2 { font-size: 22px; margin-bottom: 6px; }
.lg-card p { margin: 0; color: var(--mlb-gray-600); font-size: 14px; }
</style>
