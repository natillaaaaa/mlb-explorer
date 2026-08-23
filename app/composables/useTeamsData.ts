export interface TeamSeason {
  id: string
  year: number
  lgID: string
  lgName: string
  teamID: string
  franchID: string
  franchName: string
  name: string
  div: string
  rank: string
  G: string
  W: string
  L: string
  DivWin: string
  WCWin: string
  LgWin: string
  WSWin: string
  R: string
  AB: string
  H: string
  HR: string
  BB: string
  SO: string
  SB: string
  RA: string
  ERA: string
  E: string
  FP: string
  park: string
  attendance: string
}

const DIV_NAMES: Record<string, string> = {
  E: 'División Este',
  W: 'División Oeste',
  C: 'División Central',
  '': 'Sin división'
}

export function divName(div: string) {
  return DIV_NAMES[div] ?? div
}

export function useTeamsData() {
  const data = useState<TeamSeason[]>('teams-data', () => [])
  const loading = useState<boolean>('teams-loading', () => false)
  const loaded = useState<boolean>('teams-loaded', () => false)

  async function ensureLoaded() {
    if (loaded.value) return
    loading.value = true
    try {
      const res = await $fetch<TeamSeason[]>('/data/teams.json')
      data.value = res
      loaded.value = true
    } finally {
      loading.value = false
    }
  }

  return { data, loading, loaded, ensureLoaded }
}

export function winPct(w: string, l: string) {
  const wn = Number(w), ln = Number(l)
  if (!wn && !ln) return '—'
  const pct = wn / (wn + ln)
  return isNaN(pct) ? '—' : pct.toFixed(3).replace(/^0/, '')
}
