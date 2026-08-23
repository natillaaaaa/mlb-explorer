<template>
  <div class="container page">
    <Breadcrumbs :items="[
      { label: 'Inicio', to: '/' },
      { label: 'Ligas', to: '/ligas' },
      { label: lgName, to: `/liga/${lgId}` },
      { label: franchName, to: `/liga/${lgId}/${franchId}` },
      { label: yearLabel }
    ]" />

    <div v-if="loading" class="skeleton" style="height:400px" />

    <div v-else-if="!team" class="empty">
      <h1>Temporada no encontrada</h1>
      <NuxtLink :to="`/liga/${lgId}/${franchId}`" class="btn btn-primary">Volver a {{ franchName }}</NuxtLink>
    </div>

    <template v-else>
      <div class="detail-head">
        <div>
          <p class="eyebrow">{{ team.year }} · {{ lgName }}</p>
          <h1 class="page-title">{{ team.name }}</h1>
          <p class="page-sub">{{ team.park || 'Estadio no registrado' }}</p>
        </div>
        <div class="badges">
          <span v-if="team.WSWin === 'Y'" class="pill pill-red">🏆 Campeón Serie Mundial</span>
          <span v-if="team.LgWin === 'Y'" class="pill pill-blue">Campeón de Liga</span>
          <span v-if="team.DivWin === 'Y'" class="pill">Campeón de División</span>
        </div>
      </div>

      <div class="grid grid-4 record-grid">
        <div class="stat-card"><span>Récord</span><strong>{{ team.W }}-{{ team.L }}</strong></div>
        <div class="stat-card"><span>Porcentaje</span><strong>{{ pct }}</strong></div>
        <div class="stat-card"><span>Posición</span><strong>{{ team.rank || '—' }}º · {{ divLabel }}</strong></div>
        <div class="stat-card"><span>Asistencia</span><strong>{{ attendance }}</strong></div>
      </div>

      <div class="grid grid-2 stats-cols">
        <div class="card stats-block">
          <h2>Ofensiva</h2>
          <dl>
            <div><dt>Carreras anotadas (R)</dt><dd>{{ team.R }}</dd></div>
            <div><dt>Turnos al bate (AB)</dt><dd>{{ team.AB }}</dd></div>
            <div><dt>Hits (H)</dt><dd>{{ team.H }}</dd></div>
            <div><dt>Jonrones (HR)</dt><dd>{{ team.HR }}</dd></div>
            <div><dt>Bases por bolas (BB)</dt><dd>{{ team.BB }}</dd></div>
            <div><dt>Ponches (SO)</dt><dd>{{ team.SO }}</dd></div>
            <div><dt>Bases robadas (SB)</dt><dd>{{ team.SB }}</dd></div>
          </dl>
        </div>
        <div class="card stats-block">
          <h2>Pitcheo y defensa</h2>
          <dl>
            <div><dt>Carreras permitidas (RA)</dt><dd>{{ team.RA }}</dd></div>
            <div><dt>Efectividad (ERA)</dt><dd>{{ team.ERA }}</dd></div>
            <div><dt>Errores (E)</dt><dd>{{ team.E }}</dd></div>
            <div><dt>Porcentaje de fildeo (FP)</dt><dd>{{ team.FP }}</dd></div>
            <div><dt>Juegos jugados (G)</dt><dd>{{ team.G }}</dd></div>
          </dl>
        </div>
      </div>

      <nav class="season-nav">
        <NuxtLink v-if="prevTeam" class="btn btn-ghost" :to="`/liga/${lgId}/${franchId}/${prevTeam.year}-${prevTeam.teamID}`">← {{ prevTeam.year }}</NuxtLink>
        <NuxtLink :to="`/liga/${lgId}/${franchId}`" class="btn btn-primary">Todas las temporadas</NuxtLink>
        <NuxtLink v-if="nextTeam" class="btn btn-ghost" :to="`/liga/${lgId}/${franchId}/${nextTeam.year}-${nextTeam.teamID}`">{{ nextTeam.year }} →</NuxtLink>
      </nav>
    </template>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { useTeamsData, winPct, divName } from '~/composables/useTeamsData'

const route = useRoute()
const lgId = computed(() => String(route.params.lg))
const franchId = computed(() => String(route.params.franch))
const yearParam = computed(() => String(route.params.year))
const yearNum = computed(() => Number(String(yearParam.value).split('-')[0]))

const { data, loading, ensureLoaded } = useTeamsData()
onMounted(ensureLoaded)

const franchRows = computed(() =>
  data.value
    .filter(t => t.lgID === lgId.value && t.franchID === franchId.value)
    .sort((a, b) => a.year - b.year)
)

const team = computed(() => franchRows.value.find(t => t.id === yearParam.value))
const yearLabel = computed(() => team.value?.year ?? yearNum.value)
const lgName = computed(() => team.value?.lgName ?? lgId.value)
const franchName = computed(() => team.value?.franchName ?? franchId.value)
const divLabel = computed(() => team.value ? divName(team.value.div) : '')
const pct = computed(() => team.value ? winPct(team.value.W, team.value.L) : '—')
const attendance = computed(() => {
  const a = Number(team.value?.attendance)
  return a ? a.toLocaleString('es') : 'N/D'
})

const idx = computed(() => franchRows.value.findIndex(t => t.id === yearParam.value))
const prevTeam = computed(() => idx.value > 0 ? franchRows.value[idx.value - 1] : null)
const nextTeam = computed(() => idx.value >= 0 && idx.value < franchRows.value.length - 1 ? franchRows.value[idx.value + 1] : null)
</script>

<style scoped>
.page { padding: 40px 0 64px; }
.detail-head { display: flex; justify-content: space-between; align-items: flex-start; flex-wrap: wrap; gap: 16px; margin-bottom: 28px; }
.page-title { font-size: 32px; margin: 4px 0 6px; }
.page-sub { color: var(--mlb-gray-600); margin: 0; }
.badges { display: flex; gap: 8px; flex-wrap: wrap; }

.record-grid { margin-bottom: 28px; }
.stat-card {
  padding: 18px;
  border: 1px solid var(--mlb-gray-200);
  border-radius: var(--radius);
  display: flex;
  flex-direction: column;
  gap: 4px;
}
.stat-card span { font-size: 11px; text-transform: uppercase; letter-spacing: 0.06em; color: var(--mlb-gray-600); }
.stat-card strong { font-family: var(--font-display); font-size: 22px; color: var(--mlb-blue); }

.stats-cols { margin-bottom: 32px; }
.stats-block { padding: 22px; }
.stats-block h2 { font-size: 17px; margin-bottom: 14px; color: var(--mlb-red); }
.stats-block dl { margin: 0; }
.stats-block dl div { display: flex; justify-content: space-between; padding: 8px 0; border-top: 1px solid var(--mlb-gray-100); font-size: 14px; }
.stats-block dl div:first-child { border-top: none; }
.stats-block dt { color: var(--mlb-gray-600); }
.stats-block dd { margin: 0; font-weight: 700; }

.season-nav { display: flex; justify-content: space-between; align-items: center; gap: 12px; flex-wrap: wrap; }
.empty { padding: 60px 0; text-align: center; }
</style>
