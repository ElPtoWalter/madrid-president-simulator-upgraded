# Madrid President Simulator 2.1 AutoMarket

Proyecto fan no oficial inspirado en el Real Madrid. Permite montar un once, vender/fichar jugadores, negociar, analizar la plantilla y gestionar el balance económico.

## Novedades 2.1

- AutoMarket preparado para actualizar rumores automáticamente.
- GitHub Actions se ejecuta 4 veces al día y actualiza `data.json`.
- Búsqueda de rumores mediante RSS/noticias públicas.
- Query específica para noticias que mencionen a Fabrizio Romano + Real Madrid.
- Soporte opcional para API oficial de X si añades `X_BEARER_TOKEN` como GitHub Secret.
- Detección conservadora de jugadores ya existentes en el mercado.
- Si aparece un nombre nuevo en titulares, se añade como objetivo revisable de mercado.
- Rumores con etiqueta `AutoMarket`, enlace de fuente, confianza y fecha de actualización.

## Cómo subirlo a GitHub Pages

1. Sustituye todos los archivos del repositorio por los de este ZIP:
   - `index.html`
   - `styles.css`
   - `app.js`
   - `data.json`
   - `README.md`
   - `scripts/`
   - `.github/`
2. Haz commit en `main`.
3. Comprueba `Settings → Pages`:
   - Source: `Deploy from a branch`
   - Branch: `main`
   - Folder: `/root`
4. Abre la web con `?v=2-1-automarket` para evitar caché.

## Activar AutoMarket

En repositorios públicos, GitHub Actions debería poder ejecutarse sin coste para este uso ligero.

Pasos recomendados:

1. En GitHub, entra en el repositorio.
2. Ve a `Settings → Actions → General`.
3. En `Workflow permissions`, marca `Read and write permissions`.
4. Guarda.
5. Ve a la pestaña `Actions`.
6. Entra en `AutoMarket update`.
7. Pulsa `Run workflow` para probarlo manualmente.
8. Si funciona, cada ejecución actualizará `data.json` con un commit automático cuando detecte cambios.

## Opcional: conectar X/Fabrizio

Por defecto la web no necesita X. Usa noticias/RSS.

Para activar lectura oficial de X:

1. Crea una app en X Developer.
2. Consigue un Bearer Token.
3. En GitHub: `Settings → Secrets and variables → Actions → New repository secret`.
4. Nombre del secret: `X_BEARER_TOKEN`.
5. Valor: tu token.
6. Ejecuta `AutoMarket update` manualmente.

El script solo guarda resumen, estado, fuente y enlace. No copia posts completos.

## Avisos

- Proyecto fan no oficial. No afiliado al Real Madrid, Transfermarkt, X ni Fabrizio Romano.
- No hace scraping masivo de Transfermarkt.
- Los valores son orientativos y editables.
- Las fotos pueden depender de fuentes externas y podrían fallar.
