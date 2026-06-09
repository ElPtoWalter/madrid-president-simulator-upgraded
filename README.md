# Madrid President Simulator — Live Market Upgrade

Web estática para simular la presidencia/deportiva del Real Madrid.

## Novedades de esta versión

- Jugadores con imagen/avatar en cartas y campo.
- Los jugadores colocados en el once desaparecen de la lista de Disponibles.
- Panel de datos con enlaces directos a Transfermarkt: plantilla y rumores.
- Panel de rumores/posibles fichajes, marcados como rumor, objetivo o rumor débil.
- Importación JSON para actualizar plantilla, valores, fotos o rumores sin tocar el código.
- ZIP preparado con `index.html` en la raíz para GitHub Pages.

## Importar datos

Botón `Importar JSON`. Ejemplo:

```json
{
  "players": [
    {"name": "Kylian Mbappé", "value": 200, "photo": "https://..."}
  ],
  "rumours": [
    {"name":"Jugador X", "club":"Club", "pos":["DFC"], "age":24, "value":40, "wage":7, "rating":82, "potential":87, "reliability":"Rumor", "source":"Prensa", "note":"Descripción"}
  ]
}
```

## Limitación importante

Transfermarkt no ofrece una API pública simple para usar sus datos automáticamente. En una web estática, hacer scraping directo suele fallar por CORS y puede incumplir condiciones de uso. La solución profesional sería añadir un backend o un job programado que genere un `data.json` propio.
