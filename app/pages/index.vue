<template>
  <div>
    <section class="hero">
      <div class="container hero-inner">
        <p class="eyebrow">Archivo histórico · 1871–2015</p>
        <h1 class="hero-title">Explora la historia completa de las Grandes Ligas</h1>
        <p class="hero-sub">
          {{ total.toLocaleString('es') }} registros de temporadas de equipos, organizados por liga, franquicia y año.
          Busca cualquier equipo, campeón o récord de la historia del béisbol.
        </p>
        <form class="hero-search" @submit.prevent="goSearch">
          <input v-model="q" class="input" type="text" placeholder="Buscar equipo, ciudad o año… (ej. Yankees, 1998, Red Sox)">
          <button class="btn btn-accent" type="submit">Buscar</button>
        </form>
        <div class="hero-stats">
          <div class="stat"><strong>{{ leagueCount }}</strong><span>Ligas</span></div>
          <div class="stat"><strong>{{ franchCount }}</strong><span>Franquicias</span></div>
          <div class="stat"><strong>{{ yearSpan }}</strong><span>Años cubiertos</span></div>
        </div>
      </div>
    </section>

    <section class="container section">
      <div class="section-head">
        <h2>Navega por liga</h2>
        <NuxtLink to="/ligas" class="see-all">Ver todas →</NuxtLink>
      </div>
      <div class="grid grid-3">
        <NuxtLink v-for="lg in leagues" :key="lg.id" :to="`/liga/${lg.id}`" class="card-link">
          <div class="card league-card">
            <span class="pill pill-blue">{{ lg.id }}</span>
            <h3>{{ lg.name }}</h3>
            <p>{{ lg.franchises }} franquicias · {{ lg.seasons.toLocaleString('es') }} temporadas</p>
          </div>
        </NuxtLink>
      </div>
    </section>

    <section class="container section">
      <div class="section-head">
        <h2>Campeones recientes de la Serie Mundial</h2>
      </div>
      <div v-if="loading" class="grid grid-4">
        <div v-for="i in 4" :key="i" class="skeleton" style="height:96px" />
      </div>
      <div v-else class="grid grid-4">
        <NuxtLink v-for="t in recentChampions" :key="t.id" :to="`/liga/${t.lgID}/${t.franchID}/${t.year}-${t.teamID}`" class="card-link">
          <div class="card champ-card">
            <span class="champ-year">{{ t.year }}</span>
            <strong>{{ t.name }}</strong>
            <span class="pill pill-red">Campeón Serie Mundial</span>
          </div>
        </NuxtLink>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { useTeamsData } from '~/composables/useTeamsData'

const { data, loading, ensureLoaded } = useTeamsData()
const q = ref('')
const router = useRouter()

onMounted(ensureLoaded)

const total = computed(() => data.value.length)

const leagues = computed(() => {
  const map = new Map<string, { id: string; name: string; franchises: Set<string>; seasons: number }>()
  for (const t of data.value) {
    if (!map.has(t.lgID)) map.set(t.lgID, { id: t.lgID, name: t.lgName, franchises: new Set(), seasons: 0 })
    const entry = map.get(t.lgID)!
    entry.franchises.add(t.franchID)
    entry.seasons++
  }
  return [...map.values()]
    .map(e => ({ id: e.id, name: e.name, franchises: e.franchises.size, seasons: e.seasons }))
    .sort((a, b) => b.seasons - a.seasons)
    .slice(0, 6)
})

const leagueCount = computed(() => new Set(data.value.map(t => t.lgID)).size)
const franchCount = computed(() => new Set(data.value.map(t => t.franchID)).size)
const yearSpan = computed(() => {
  if (!data.value.length) return '—'
  const years = data.value.map(t => t.year)
  return `${Math.min(...years)}–${Math.max(...years)}`
})

const recentChampions = computed(() =>
  data.value
    .filter(t => t.WSWin === 'Y')
    .sort((a, b) => b.year - a.year)
    .slice(0, 4)
)

function goSearch() {
  router.push({ path: '/buscar', query: q.value ? { q: q.value } : {} })
}
</script>

<style scoped>
.hero {
  background: linear-gradient(180deg, var(--mlb-blue) 0%, var(--mlb-blue-dark) 100%);
  color: #fff;
  padding: 64px 0 48px;
}
.hero-title {
  font-size: clamp(28px, 4vw, 44px);
  font-weight: 800;
  margin: 10px 0 14px;
  max-width: 760px;
}
.hero-sub { max-width: 620px; color: rgba(255,255,255,0.82); font-size: 16px; line-height: 1.6; margin-bottom: 28px; }
.hero-search { display: flex; gap: 10px; max-width: 560px; }
.hero-search .input { background: rgba(255,255,255,0.95); }
.hero-stats { display: flex; gap: 36px; margin-top: 36px; flex-wrap: wrap; }
.stat { display: flex; flex-direction: column; }
.stat strong { font-size: 26px; font-family: var(--font-display); }
.stat span { font-size: 12px; color: rgba(255,255,255,0.7); text-transform: uppercase; letter-spacing: 0.08em; }

.section { padding: 48px 0; }
.section-head { display: flex; align-items: baseline; justify-content: space-between; margin-bottom: 20px; }
.section-head h2 { font-size: 22px; }
.see-all { color: var(--mlb-blue); font-weight: 600; font-size: 14px; }

.league-card { padding: 20px; height: 100%; }
.league-card h3 { margin: 10px 0 6px; font-size: 19px; }
.league-card p { margin: 0; font-size: 13px; color: var(--mlb-gray-600); }

.champ-card { padding: 18px; display: flex; flex-direction: column; gap: 8px; height: 100%; }
.champ-year { font-family: var(--font-display); font-size: 22px; color: var(--mlb-red); font-weight: 800; }
.champ-card strong { font-size: 15px; }
</style>
