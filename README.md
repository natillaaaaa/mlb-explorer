# MLB Explorer — Archivo Histórico de Equipos (1871–2015)

Sitio web construido con **Nuxt 3/4** para navegar un conjunto de datos grande (2,985 registros)
de temporadas de equipos de las Grandes Ligas de Béisbol, con jerarquía de navegación,
búsqueda global y paginación.

**URL del proyecto publicado en Netlify:** _(pega aquí la URL que te da Netlify después del deploy, ver abajo)_

## Conjunto de datos

- **Fuente:** [Baseball Databank](https://github.com/chadwickbureau/baseballdatabank) (Chadwick Baseball Bureau),
  disponible también en [Kaggle](https://www.kaggle.com/datasets/open-source-sports/baseball-databank).
- **Registros:** 2,985 temporadas de equipos (`Teams.csv`), desde 1871 hasta 2015.
- **Archivo usado por el sitio:** `public/data/teams.json` (generado a partir de `Teams.csv` +
  `TeamsFranchises.csv` para incluir el nombre completo de cada franquicia).

## Jerarquía de navegación

El esquema de organización sigue la estructura natural del dominio (béisbol):

```
Inicio
 └─ Ligas (AL, NL, AA, UA, PL, FL, NA...)
     └─ Franquicia (ej. New York Yankees, Boston Red Sox...)
         └─ Temporada (año + equipo) → Detalle con estadísticas completas
```

Además existe una página de **Búsqueda global** (`/buscar`) que permite filtrar los 2,985
registros por texto libre (equipo, ciudad, año, estadio), por liga y por tipo de título ganado,
con paginación de resultados.

## Estructura del proyecto

```
app/
  app.vue                        Layout general (header, footer, nav)
  assets/css/main.css            Estilos globales (paleta azul/rojo/blanco)
  components/
    Breadcrumbs.vue              Migas de pan
    Pagination.vue                Componente de paginación reutilizable
  composables/
    useTeamsData.ts              Carga y utilidades sobre el dataset
  pages/
    index.vue                    Portada
    ligas.vue                    Listado de ligas
    buscar.vue                   Búsqueda global + paginación
    liga/[lg]/index.vue          Franquicias de una liga (con búsqueda + paginación)
    liga/[lg]/[franch]/index.vue Temporadas de una franquicia (con búsqueda + paginación)
    liga/[lg]/[franch]/[year].vue Detalle de una temporada (estadísticas completas)
public/
  data/teams.json                Conjunto de datos (2,985 registros)
  _redirects                     Redirección SPA para Netlify
nuxt.config.ts
netlify.toml
```

## Ejecutar en local

```bash
npm install
npm run dev
```

Abre `http://localhost:3000`.

## Generar versión estática

```bash
npm run generate
```

Esto crea la carpeta `.output/public`, lista para publicarse en cualquier hosting estático.

## Publicar en Netlify

**Opción rápida (arrastrar y soltar):**

1. Ejecuta `npm install` y `npm run generate` en tu máquina.
2. Entra a [app.netlify.com/drop](https://app.netlify.com/drop).
3. Arrastra la carpeta `.output/public` generada.
4. Netlify te dará una URL pública al instante (algo como `https://tu-sitio.netlify.app`).
5. Copia esa URL en la parte superior de este README.

**Opción recomendada (repositorio conectado, con despliegues automáticos):**

1. Sube este proyecto a un repositorio de GitHub.
2. En Netlify, elige "Add new site" → "Import an existing project" → selecciona el repositorio.
3. Netlify detectará automáticamente la configuración de `netlify.toml`:
   - Comando de build: `npm run generate`
   - Carpeta de publicación: `.output/public`
4. Haz clic en "Deploy site" y copia la URL final.

## Notas técnicas

- El dataset se sirve como archivo estático (`public/data/teams.json`) y se carga una sola vez
  en el cliente mediante el composable `useTeamsData`, cacheado en el estado de la app.
- Las rutas dinámicas (`/liga/:lg`, `/liga/:lg/:franch`, `/liga/:lg/:franch/:year`) se resuelven
  en el cliente contra ese dataset, por lo que funcionan como una SPA sobre hosting estático
  (de ahí la redirección `/* → /200.html` en `netlify.toml` y `public/_redirects`).
- Paleta de colores inspirada en la identidad visual de MLB: azul (#002d72), rojo (#d50032)
  y blanco, con un diseño minimalista y responsivo (grid adaptable, tipografía Inter/Roboto Condensed).
