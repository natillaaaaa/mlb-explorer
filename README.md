# MLB Explorer — Archivo Histórico de Equipos (1871–2015)
 Estudiante: Nathali Abigail Chacon Murillo

 
**URL del proyecto publicado en Netlify:** _(pega aquí la URL que te da Netlify después del deploy, ver abajo)_

## Conjunto de datos

- **Fuente:** [Baseball Databank](https://github.com/chadwickbureau/baseballdatabank) (Chadwick Baseball Bureau),
  disponible también en [Kaggle](https://www.kaggle.com/datasets/open-source-sports/baseball-databank).


## Jerarquía de navegación

El esquema de organización sigue la estructura natural del dominio (béisbol):

```
Inicio
 └─ Ligas (AL, NL, AA, UA, PL, FL, NA...)
     └─ Franquicia (ej. New York Yankees, Boston Red Sox...)
         └─ Temporada (año + equipo) → Detalle con estadísticas completas
```

Además existe una página de **Búsqueda global** 

## Ejecutar en local


npm install
npm run dev

Abre `http://localhost:3000`.

