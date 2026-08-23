# MLB Explorer — Archivo Histórico de Equipos (1871–2015)
 Estudiante: Nathali Abigail Chacon Murillo

 
**URL del proyecto:** _[(https://wondrous-belekoy-8ff025.netlify.app/)]_

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

