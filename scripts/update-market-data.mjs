import fs from "node:fs";

// Plantilla de automatización.
// Para usar X/Fabrizio hace falta un token oficial de X en GitHub Secrets: X_BEARER_TOKEN.
// Este script NO hace scraping de Transfermarkt ni copia tweets. Solo deja preparada la estructura.

const dataPath = new URL("../data.json", import.meta.url);
const current = JSON.parse(fs.readFileSync(dataPath, "utf8"));
current.updatedAt = new Date().toISOString().slice(0, 10);
current.notes = "Actualización automática preparada. Añade fuentes/API permitidas para rellenar rumours/players/targets.";
fs.writeFileSync(dataPath, JSON.stringify(current, null, 2) + "\n");
console.log("data.json actualizado", current.updatedAt);
