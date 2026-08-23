// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: false },
  ssr: true,
  css: ['~/assets/css/main.css'],
  app: {
    head: {
      title: 'MLB Explorer · Archivo Histórico de Equipos',
      meta: [
        { name: 'description', content: 'Explora más de 2,900 temporadas históricas de equipos de las Grandes Ligas de Béisbol (1871-2015): ligas, franquicias y estadísticas de cada campaña.' }
      ],
      link: [
        { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
        { rel: 'stylesheet', href: 'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=Roboto+Condensed:wght@400;700&display=swap' }
      ]
    }
  },
  nitro: {
    prerender: {
      routes: ['/'],
      crawlLinks: true,
      failOnError: false
    }
  }
})
