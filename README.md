# Madrid President Simulator 4.1 · Live Squad & AutoScout Pro

Proyecto fan no oficial inspirado en el Real Madrid. Planificador de plantilla 26/27 para el Madrid de José Mourinho.

## Novedades 4.1

- Sincronización de plantilla 26/27 con lista provisional interna basada en la página oficial del Real Madrid.
- AutoScout Pro amplía rumores desde RSS/noticias públicas.
- Si aparece un jugador nuevo en rumores y no está en la base, lo crea automáticamente como candidato fichable.
- Resolución automática de fotos reales vía Wikimedia desde GitHub Actions.
- Fallback integrado: si no hay foto real, siempre aparece una tarjeta local, nunca queda vacío.
- Se preservan fotos y jugadores al actualizar `data.json`.

## Archivos a subir en GitHub web

Sube/reemplaza:

- `index.html`
- `styles.css`
- `app.js`
- `data.json`
- `README.md`
- `scripts/update-data.mjs`

No subas `.github/` si ya tienes creado el workflow.

## AutoScout

Después de subir, ejecuta:

`Actions → AutoMarket update → Run workflow`

El workflow actualizará `data.json` con nuevos rumores, candidatos fichables y fotos remotas cuando estén disponibles.
