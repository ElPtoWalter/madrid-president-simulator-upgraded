const formations = {
  "4-3-3": [["POR",50,91],["LI",18,74],["DFC",38,74],["DFC",62,74],["LD",82,74],["MC",32,54],["MCD",50,58],["MC",68,54],["EI",23,31],["DC",50,22],["ED",77,31]],
  "4-2-3-1": [["POR",50,91],["LI",18,74],["DFC",38,74],["DFC",62,74],["LD",82,74],["MCD",42,58],["MCD",58,58],["EI",24,38],["MCO",50,36],["ED",76,38],["DC",50,21]],
  "4-4-2": [["POR",50,91],["LI",18,74],["DFC",38,74],["DFC",62,74],["LD",82,74],["MI",22,51],["MC",42,53],["MC",58,53],["MD",78,51],["DC",42,25],["DC",58,25]],
  "3-5-2": [["POR",50,91],["DFC",30,74],["DFC",50,77],["DFC",70,74],["CAI",18,50],["MC",38,54],["MCD",50,58],["MC",62,54],["CAD",82,50],["DC",42,24],["DC",58,24]],
  "3-4-3": [["POR",50,91],["DFC",30,74],["DFC",50,77],["DFC",70,74],["CAI",20,54],["MC",42,56],["MC",58,56],["CAD",80,54],["EI",24,32],["DC",50,22],["ED",76,32]]
};

const basePlayers = [
  {id:1,name:"Thibaut Courtois",pos:["POR"],role:"Titular",value:15,wage:15,age:34,rating:87,potential:87,status:"available"},
  {id:2,name:"Andriy Lunin",pos:["POR"],role:"Rotación",value:12,wage:4,age:27,rating:80,potential:83,status:"available"},
  {id:3,name:"Fran González",pos:["POR"],role:"Canterano",value:3,wage:1,age:20,rating:66,potential:78,status:"available"},

  {id:4,name:"Trent Alexander-Arnold",pos:["LD","CAD","MC"],role:"Titular",value:60,wage:15,age:27,rating:86,potential:87,status:"available"},
  {id:5,name:"Dani Carvajal",pos:["LD","CAD"],role:"Veterano",value:4,wage:9,age:34,rating:82,potential:82,status:"available"},
  {id:6,name:"Marc Cucurella",pos:["LI","CAI","MI"],role:"Fichaje / titular",value:50,wage:10,age:27,rating:84,potential:85,status:"available"},
  {id:7,name:"Álvaro Carreras",pos:["LI","CAI"],role:"Fichaje / competencia",value:50,wage:5,age:23,rating:80,potential:87,status:"available"},
  {id:8,name:"Fran García",pos:["LI","CAI"],role:"Rotación",value:10,wage:3,age:26,rating:77,potential:80,status:"available"},
  {id:9,name:"Ferland Mendy",pos:["LI","CAI"],role:"Rotación / posible salida",value:4,wage:8,age:31,rating:78,potential:78,status:"available"},

  {id:10,name:"Dean Huijsen",pos:["DFC"],role:"Titular futuro",value:60,wage:6,age:21,rating:81,potential:90,status:"available"},
  {id:11,name:"Ibrahima Konaté",pos:["DFC"],role:"Fichaje / titular",value:45,wage:11,age:27,rating:85,potential:87,status:"available"},
  {id:12,name:"Éder Militão",pos:["DFC","LD"],role:"Titular/rotación",value:20,wage:10,age:28,rating:82,potential:84,status:"available"},
  {id:13,name:"Raúl Asencio",pos:["DFC"],role:"Promesa",value:20,wage:2,age:23,rating:78,potential:86,status:"available"},
  {id:14,name:"Antonio Rüdiger",pos:["DFC"],role:"Veterano",value:6,wage:11,age:33,rating:84,potential:84,status:"available"},
  {id:15,name:"David Alaba",pos:["DFC","LI","MCD"],role:"Veterano / rotación",value:3,wage:12,age:33,rating:79,potential:79,status:"available"},

  {id:16,name:"Aurélien Tchouaméni",pos:["MCD","MC","DFC"],role:"Titular",value:70,wage:9,age:26,rating:86,potential:89,status:"available"},
  {id:17,name:"Federico Valverde",pos:["MC","MD","LD"],role:"Titular",value:90,wage:10,age:27,rating:88,potential:89,status:"available"},
  {id:18,name:"Eduardo Camavinga",pos:["MC","MCD","LI"],role:"Titular/rotación",value:50,wage:8,age:23,rating:84,potential:90,status:"available"},
  {id:19,name:"Bernardo Silva",pos:["MCO","MC","ED"],role:"Fichaje / veterano creativo",value:22,wage:16,age:31,rating:86,potential:86,status:"available"},
  {id:20,name:"Jude Bellingham",pos:["MCO","MC"],role:"Estrella",value:130,wage:15,age:22,rating:90,potential:94,status:"available"},
  {id:21,name:"Arda Güler",pos:["MCO","MC","ED"],role:"Talento",value:90,wage:4,age:21,rating:83,potential:92,status:"available"},
  {id:22,name:"Dani Ceballos",pos:["MC"],role:"Rotación",value:7,wage:5,age:29,rating:77,potential:77,status:"available"},
  {id:23,name:"Thiago Pitarch",pos:["MC","MCO"],role:"Canterano",value:20,wage:1,age:18,rating:70,potential:85,status:"available"},
  {id:24,name:"Jorge Cestero",pos:["MC","MCD"],role:"Canterano",value:7.5,wage:1,age:20,rating:68,potential:80,status:"available"},
  {id:25,name:"Manuel Ángel",pos:["MC","MCO"],role:"Canterano",value:5,wage:1,age:22,rating:68,potential:79,status:"available"},
  {id:26,name:"César Palacios",pos:["MCO","MC"],role:"Canterano",value:7.5,wage:1,age:21,rating:69,potential:82,status:"available"},
  {id:27,name:"Brahim Díaz",pos:["MCO","ED","EI"],role:"Rotación ofensiva",value:35,wage:6,age:26,rating:82,potential:84,status:"available"},

  {id:28,name:"Vinícius Jr.",pos:["EI","DC"],role:"Estrella",value:140,wage:20,age:25,rating:91,potential:93,status:"available"},
  {id:29,name:"Kylian Mbappé",pos:["DC","EI"],role:"Estrella",value:180,wage:30,age:27,rating:92,potential:93,status:"available"},
  {id:30,name:"Rodrygo",pos:["ED","EI","DC"],role:"Titular/rotación",value:45,wage:12,age:25,rating:84,potential:87,status:"available"},
  {id:31,name:"Franco Mastantuono",pos:["ED","MCO"],role:"Promesa",value:45,wage:3,age:18,rating:77,potential:91,status:"available"},
  {id:32,name:"Gonzalo García",pos:["DC"],role:"Canterano / rotación",value:30,wage:1,age:22,rating:76,potential:84,status:"available"},
  {id:33,name:"Endrick",pos:["DC"],role:"Promesa",value:35,wage:4,age:19,rating:77,potential:91,status:"available"}
];

const playerPhotoMap = {
  "Thibaut Courtois": "https://img.a.transfermarkt.technology/portrait/medium/108390-1717280733.jpg?lm=1",
  "Andriy Lunin": "https://img.a.transfermarkt.technology/portrait/medium/404839-1701294131.jpg?lm=1",
  "Fran González": "https://img.a.transfermarkt.technology/portrait/medium/1055220-1704358404.jpg?lm=1",
  "Trent Alexander-Arnold": "https://img.a.transfermarkt.technology/portrait/medium/314353-1701680958.jpg?lm=1",
  "Dani Carvajal": "https://img.a.transfermarkt.technology/portrait/medium/138927-1721026790.jpg?lm=1",
  "Marc Cucurella": "https://img.a.transfermarkt.technology/portrait/big/284857-1765185117.jpg?lm=1",
  "Éder Militão": "https://img.a.transfermarkt.technology/portrait/medium/401530-1719653438.jpg?lm=1",
  "Antonio Rüdiger": "https://img.a.transfermarkt.technology/portrait/medium/86202-1684484602.jpg?lm=1",
  "David Alaba": "https://img.a.transfermarkt.technology/portrait/medium/59016-1684921582.jpeg?lm=1",
  "Raúl Asencio": "https://img.a.transfermarkt.technology/portrait/medium/935245-1731168094.jpg?lm=1",
  "Dean Huijsen": "https://img.a.transfermarkt.technology/portrait/medium/890290-1750251451.jpg?lm=1",
  "Ibrahima Konaté": "https://img.a.transfermarkt.technology/portrait/big/357119-1669190550.jpg?lm=1",
  "Ferland Mendy": "https://img.a.transfermarkt.technology/portrait/medium/291417-1701294025.jpg?lm=1",
  "Fran García": "https://img.a.transfermarkt.technology/portrait/medium/341264-1688119965.jpg?lm=1",
  "Eduardo Camavinga": "https://img.a.transfermarkt.technology/portrait/medium/640428-1668500874.jpg?lm=1",
  "Aurélien Tchouaméni": "https://img.a.transfermarkt.technology/portrait/medium/413112-1668500754.jpg?lm=1",
  "Federico Valverde": "https://img.a.transfermarkt.technology/portrait/medium/369081-1731018042.jpg?lm=1",
  "Bernardo Silva": "https://img.a.transfermarkt.technology/portrait/big/241641-1684311533.jpg?lm=1",
  "Jude Bellingham": "https://img.a.transfermarkt.technology/portrait/medium/581678-1748102891.jpg?lm=1",
  "Dani Ceballos": "https://img.a.transfermarkt.technology/portrait/medium/319745-1723666162.jpg?lm=1",
  "Arda Güler": "https://img.a.transfermarkt.technology/portrait/medium/861410-1699472585.jpg?lm=1",
  "Brahim Díaz": "https://img.a.transfermarkt.technology/portrait/medium/314678-1744193327.jpg?lm=1",
  "Vinícius Jr.": "https://img.a.transfermarkt.technology/portrait/medium/371998-1761575144.jpg?lm=1",
  "Kylian Mbappé": "https://img.a.transfermarkt.technology/portrait/medium/342229-1682683695.jpg?lm=1",
  "Rodrygo": "https://img.a.transfermarkt.technology/portrait/medium/412363-1763041611.jpg?lm=1",
  "Gonzalo García": "https://img.a.transfermarkt.technology/portrait/medium/935230-1780664637.jpg?lm=1",
  "Franco Mastantuono": "https://img.a.transfermarkt.technology/portrait/medium/1057316-1755702696.jpg?lm=1"
};
basePlayers.forEach(p => { if (playerPhotoMap[p.name]) p.photo = playerPhotoMap[p.name]; });

const suggestedTargets = [
  {name:"Erling Haaland",club:"Manchester City",pos:["DC"],age:25,value:180,wage:28,rating:92,potential:93,tier:"galactico",note:"Delantero total. Eleva el techo goleador, pero obliga a encajar a Mbappé/Vinícius."},
  {name:"Florian Wirtz",club:"Bayern / Leverkusen",pos:["MCO","MC"],age:23,value:140,wage:18,rating:89,potential:93,tier:"galactico",note:"Creador diferencial entre líneas. Encaja si quieres más fútbol interior."},
  {name:"Jamal Musiala",club:"Bayern",pos:["MCO","EI"],age:23,value:140,wage:18,rating:89,potential:93,tier:"galactico",note:"Talento generacional, ideal para un proyecto de posesión y desequilibrio."},
  {name:"Rodri",club:"Manchester City",pos:["MCD","MC"],age:30,value:100,wage:22,rating:91,potential:91,tier:"top",note:"Pivote élite para controlar partidos grandes. Fichaje muy difícil."},
  {name:"William Saliba",club:"Arsenal",pos:["DFC"],age:25,value:90,wage:14,rating:88,potential:91,tier:"top",note:"Central dominante para liderar la defensa muchos años."},
  {name:"Achraf Hakimi",club:"PSG",pos:["LD","CAD"],age:27,value:65,wage:14,rating:86,potential:87,tier:"top",note:"Lateral muy ofensivo. Potencia el carril derecho."},
  {name:"Alphonso Davies",club:"Bayern",pos:["LI","CAI"],age:25,value:70,wage:14,rating:85,potential:88,tier:"top",note:"Profundidad y velocidad para el lateral izquierdo."},
  {name:"Nico Williams",club:"Athletic Club",pos:["EI","ED"],age:23,value:70,wage:10,rating:84,potential:89,tier:"top",note:"Extremo vertical. Buen recambio si vendes a Rodrygo o necesitas banda."},
  {name:"Martín Zubimendi",club:"Arsenal / Real Sociedad",pos:["MCD","MC"],age:27,value:60,wage:10,rating:84,potential:86,tier:"top",note:"Pivote equilibrado, más realista que una megaestrella."},
  {name:"Vitinha",club:"PSG",pos:["MC","MCD"],age:26,value:80,wage:12,rating:86,potential:88,tier:"top",note:"Control, presión y pase. Muy buen complemento para Bellingham/Valverde."},
  {name:"Leny Yoro",club:"Manchester United",pos:["DFC"],age:20,value:55,wage:8,rating:80,potential:90,tier:"joven",note:"Central joven de alto potencial para proyecto a largo plazo."},
  {name:"João Neves",club:"PSG",pos:["MC","MCD"],age:21,value:80,wage:9,rating:84,potential:91,tier:"joven",note:"Motor joven para muchos años. Encaja en proyecto de presión."},
  {name:"Lamine Yamal",club:"Barcelona",pos:["ED"],age:18,value:180,wage:20,rating:88,potential:95,tier:"galactico",note:"Fichaje casi imposible, pero modo presidente permite soñar."},
  {name:"Alejandro Balde",club:"Barcelona",pos:["LI","CAI"],age:22,value:50,wage:8,rating:82,potential:88,tier:"joven",note:"Lateral joven y profundo. Operación políticamente muy complicada."},
  {name:"Micky van de Ven",club:"Tottenham",pos:["DFC","LI"],age:25,value:55,wage:8,rating:83,potential:87,tier:"top",note:"Central rapidísimo, útil si juegas con defensa adelantada."},
  {name:"Álex Baena",club:"Atlético / Villarreal",pos:["MC","MCO","EI"],age:25,value:50,wage:7,rating:83,potential:86,tier:"barato",note:"Creatividad y balón parado a coste razonable."},
  {name:"Miguel Gutiérrez",club:"Girona",pos:["LI","CAI"],age:24,value:35,wage:5,rating:81,potential:86,tier:"barato",note:"Opción conocida, buena salida de balón y precio asumible."},
  {name:"Gregor Kobel",club:"Dortmund",pos:["POR"],age:28,value:40,wage:9,rating:85,potential:87,tier:"top",note:"Portero fiable si planificas relevo a medio plazo."}
];

const $ = id => document.getElementById(id);
const money = n => `${Number(n || 0).toLocaleString("es-ES")} M€`;
const clone = x => JSON.parse(JSON.stringify(x));
function photoFor(p){
  return p.photo || fallbackPhotoFor(p);
}

function fallbackPhotoFor(p){
  const initials = String(p?.name || "RM").split(" ").filter(Boolean).slice(0,2).map(x=>x[0]).join("").toUpperCase();
  return `data:image/svg+xml;utf8,${encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 160 160"><defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#ffffff"/><stop offset=".55" stop-color="#eee9dc"/><stop offset="1" stop-color="#b99a52"/></linearGradient></defs><rect width="160" height="160" rx="34" fill="url(#g)"/><circle cx="80" cy="58" r="34" fill="#101c38" opacity=".92"/><path d="M28 145c9-39 29-58 52-58s43 19 52 58" fill="#101c38" opacity=".92"/><text x="80" y="148" text-anchor="middle" font-family="Arial" font-size="28" font-weight="800" fill="#b99a52">${initials}</text></svg>`)}`;
}
const storageKey = "madrid-president-simulator-v5-current-squad";
const dataVersion = "21/06/2026 · plantilla revisada con Real Madrid oficial + Transfermarkt";
const sources = {
  transfermarktSquad: "https://www.transfermarkt.com/real-madrid/kader/verein/418",
  transfermarktRumours: "https://www.transfermarkt.com/real-madrid/geruechte/verein/418",
  officialSquad: "https://www.realmadrid.com/en-US/football/first-team/players"
};

const rumourTargets = [
  {name:"Denzel Dumfries",club:"Inter de Milán",pos:["LD","CAD"],age:30,value:25,wage:8,rating:83,potential:83,tier:"rumor",reliability:"Rumor/posible objetivo",source:"Prensa / mercado",note:"Lateral derecho físico. Encaja si se busca competencia para Trent y Carvajal."},
  {name:"Rodri",club:"Manchester City",pos:["MCD","MC"],age:30,value:100,wage:22,rating:91,potential:91,tier:"rumor",reliability:"Muy difícil",source:"Prensa",note:"Pivote élite. Sería una inversión enorme y muy complicada."},
  {name:"Erling Haaland",club:"Manchester City",pos:["DC"],age:25,value:180,wage:28,rating:92,potential:93,tier:"rumor",reliability:"Rumor débil/galáctico",source:"Rumores recurrentes",note:"Nombre galáctico. Solo recomendable en modo inversión brutal."},
  {name:"João Neves",club:"PSG",pos:["MC","MCD"],age:21,value:80,wage:9,rating:84,potential:91,tier:"rumor",reliability:"Rumor/objetivo",source:"Transfermarkt rumores",note:"Mediocentro joven de mucho potencial. Muy caro y complicado."},
  {name:"William Saliba",club:"Arsenal",pos:["DFC"],age:25,value:90,wage:14,rating:88,potential:91,tier:"rumor",reliability:"Muy difícil",source:"Rumores de mercado",note:"Central top, pero tras Konaté y Huijsen solo tendría sentido si vendes defensas."},
  {name:"Nico Williams",club:"Athletic Club",pos:["EI","ED"],age:23,value:70,wage:10,rating:84,potential:89,tier:"rumor",reliability:"Opción de mercado",source:"Rumores recurrentes",note:"Extremo vertical. Interesante si vendes a Rodrygo o necesitas profundidad de banda."},
  {name:"Miguel Gutiérrez",club:"Girona",pos:["LI","CAI"],age:24,value:35,wage:5,rating:81,potential:85,tier:"rumor",reliability:"Poco necesario ahora",source:"Rumores anteriores",note:"Con Cucurella, Carreras, Fran y Mendy, el lateral izquierdo ya está muy poblado."}
];

let state = {
  saves: {},
  activeSaveId: "default",
  players: clone(basePlayers),
  lineup: Array(11).fill(null),
  initialBudget: 0,
  activeFilter: "available",
  objective: "champions",
  season: 2026,
  saveName: "Proyecto inicial"
};

function init() {
  load();
  if (!Object.keys(state.saves).length) commitActiveSave(false);
  renderSaveSelect();
  Object.keys(formations).forEach(f => {
    const opt = document.createElement("option");
    opt.value = f; opt.textContent = f;
    $("formationSelect").appendChild(opt);
  });
  bindEvents();
  renderAll();
}

function bindEvents() {
  $("formationSelect").addEventListener("change", () => { state.lineup = Array(11).fill(null); renderAll(); });
  $("searchInput").addEventListener("input", renderSquad);
  $("budgetInput").addEventListener("input", e => { state.initialBudget = Number(e.target.value || 0); renderAll(); });
  $("saveNameInput").addEventListener("input", e => { state.saveName = e.target.value || "Sin nombre"; commitActiveSave(); renderSaveSelect(); });
  $("objectiveSelect").addEventListener("change", e => { state.objective = e.target.value; renderAll(); });
  $("clearLineupBtn").addEventListener("click", () => { state.lineup = Array(11).fill(null); renderAll(); toast("Campo vaciado."); });
  $("autoLineupBtn").addEventListener("click", autoLineup);
  $("resetBtn").addEventListener("click", resetApp);
  $("exportBtn").addEventListener("click", exportProject);
  $("exportImageBtn").addEventListener("click", exportLineupImage);
  $("shareBtn")?.addEventListener("click", shareWeb);
  $("supportBtn")?.addEventListener("click", supportProject);
  $("copySupportTextBtn")?.addEventListener("click", copySupportText);
  $("copyDisclaimerBtn")?.addEventListener("click", copyDisclaimer);
  $("nextSeasonBtn").addEventListener("click", nextSeason);
  $("openSquadSourceBtn")?.addEventListener("click", () => window.open(sources.transfermarktSquad, "_blank"));
  $("openRumoursSourceBtn")?.addEventListener("click", () => window.open(sources.transfermarktRumours, "_blank"));
  $("importDataBtn")?.addEventListener("click", importDataPrompt);
  $("refreshRumoursBtn")?.addEventListener("click", () => { renderRumours(); toast("Rumores recargados desde la lista curada de esta versión."); });
  $("saveSnapshotBtn").addEventListener("click", saveSnapshot);
  $("newSaveBtn").addEventListener("click", newSimulation);
  $("saveSelect").addEventListener("change", e => loadSave(e.target.value));
  $("signingForm").addEventListener("submit", signPlayer);
  $("suggestPosition").addEventListener("change", renderSuggestions);
  $("suggestTier").addEventListener("change", renderSuggestions);
  document.querySelectorAll(".filter").forEach(btn => btn.addEventListener("click", () => {
    document.querySelectorAll(".filter").forEach(b => b.classList.remove("active"));
    btn.classList.add("active"); state.activeFilter = btn.dataset.filter; renderSquad();
  }));
}

function renderAll() {
  ensureLineupSize();
  $("budgetInput").value = state.initialBudget;
  $("objectiveSelect").value = state.objective;
  $("saveNameInput").value = state.saveName;
  $("seasonLabel").textContent = `${state.season}/${String(state.season + 1).slice(-2)}`;
  $("dataVersion") && ($("dataVersion").textContent = dataVersion);
  renderPitch(); renderSquad(); renderBudget(); renderAnalysis(); renderDepth(); renderSuggestions(); renderRumours();
  commitActiveSave(); save();
}

function ensureLineupSize() {
  if (!Array.isArray(state.lineup) || state.lineup.length !== 11) state.lineup = Array(11).fill(null);
}

function renderPitch() {
  const pitch = $("pitch"); pitch.innerHTML = "";
  const formation = formations[$("formationSelect").value];
  const available = state.players.filter(p => p.status !== "sold" && p.status !== "wishlist");
  formation.forEach(([label, x, y], index) => {
    const selected = state.players.find(p => p.id === state.lineup[index]);
    const natural = !selected || selected.pos.includes(label) || flexiblePosition(selected.pos, label);
    const slot = document.createElement("div");
    slot.className = `slot ${natural ? "" : "warning"}`;
    slot.style.left = `${x}%`; slot.style.top = `${y}%`;
    slot.dataset.index = index;
    slot.innerHTML = `<div class="slot-label">${label}</div>`;
    const card = document.createElement("div");
    card.className = `slot-card ${selected ? "" : "empty"}`;
    card.draggable = !!selected;
    card.dataset.playerId = selected?.id || "";
    card.innerHTML = selected ? `<img class="slot-photo" src="${photoFor(selected)}" onerror="this.onerror=null;this.src=fallbackPhotoFor(selected)" alt=""><div class="slot-name">${selected.name}</div><div class="slot-meta">${selected.pos.join("/")} · ${selected.rating} · ${money(selected.value)}</div>` : `<div class="slot-name">Soltar jugador</div><div class="slot-meta">${label}</div>`;
    if (selected) card.addEventListener("dragstart", onDragStart);
    slot.appendChild(card);
    const select = document.createElement("select");
    select.innerHTML = `<option value="">Elegir</option>` + available.map(p => `<option value="${p.id}" ${state.lineup[index]===p.id?'selected':''}>${p.name}</option>`).join("");
    select.addEventListener("change", e => setLineupPlayer(index, e.target.value ? Number(e.target.value) : null));
    slot.appendChild(select);
    slot.addEventListener("dragover", e => { e.preventDefault(); slot.classList.add("drag-over"); });
    slot.addEventListener("dragleave", () => slot.classList.remove("drag-over"));
    slot.addEventListener("drop", e => onDrop(e, index));
    slot.addEventListener("dblclick", () => setLineupPlayer(index, null));
    pitch.appendChild(slot);
  });
}

function onDragStart(e) {
  const id = e.currentTarget.dataset.playerId || e.currentTarget.closest(".player-card")?.dataset.playerId;
  e.dataTransfer.setData("text/plain", id);
  e.dataTransfer.effectAllowed = "move";
  e.currentTarget.classList.add("dragging");
}

function onDrop(e, index) {
  e.preventDefault();
  document.querySelectorAll(".drag-over").forEach(el => el.classList.remove("drag-over"));
  const id = Number(e.dataTransfer.getData("text/plain"));
  if (!id) return;
  const p = state.players.find(x => x.id === id);
  if (!p || p.status === "sold" || p.status === "wishlist") return;
  setLineupPlayer(index, id);
}

function setLineupPlayer(index, id) {
  if (id && state.lineup.includes(id)) state.lineup[state.lineup.indexOf(id)] = null;
  state.lineup[index] = id;
  renderAll();
}

function flexiblePosition(pos, label) {
  const groups = [["LD","CAD","MD"],["LI","CAI","MI"],["MC","MCD","MCO"],["EI","ED","DC"],["DFC","MCD"]];
  return groups.some(g => g.includes(label) && pos.some(p => g.includes(p)));
}

function renderSquad() {
  const q = $("searchInput").value.toLowerCase().trim();
  const list = $("squadList"); list.innerHTML = "";
  state.players
    .filter(p => filterStatus(p))
    .filter(p => !(state.activeFilter === "available" && state.lineup.includes(p.id)))
    .filter(p => !q || p.name.toLowerCase().includes(q) || p.pos.join(" ").toLowerCase().includes(q) || String(p.role).toLowerCase().includes(q))
    .sort((a,b) => statusRank(a.status) - statusRank(b.status) || b.rating - a.rating || b.value - a.value)
    .forEach(p => list.appendChild(playerCard(p)));
}

function filterStatus(p) {
  const f = state.activeFilter;
  if (f === "all") return true;
  if (f === "available") return p.status === "available" || p.status === "signed";
  return p.status === f;
}
function statusRank(s) { return {available:0,signed:1,wishlist:2,sold:3}[s] ?? 4; }
function statusLabel(s) { return s === "sold" ? "Vendido" : s === "signed" ? "Fichaje" : s === "wishlist" ? "Objetivo" : "Plantilla"; }

function playerCard(p) {
  const card = document.createElement("div");
  card.className = "player-card";
  card.draggable = p.status !== "sold" && p.status !== "wishlist";
  card.dataset.playerId = p.id;
  card.addEventListener("dragstart", onDragStart);
  card.addEventListener("dragend", () => card.classList.remove("dragging"));
  card.innerHTML = `
    <div class="player-head">
      <img class="player-photo" src="${photoFor(p)}" onerror="this.onerror=null;this.src=fallbackPhotoFor(p)" alt="Foto de ${p.name}">
      <div class="player-info">
        <strong>${p.name}</strong>
        <div class="player-meta">
          <span class="badge ${p.status}">${p.pos.join("/")}</span><span>${p.age ?? "—"} años</span><span>${p.role}</span><span>${statusLabel(p.status)}</span>
        </div>
      </div>
      <div class="player-rating">${p.rating ?? 75}</div>
    </div>
    <div class="player-stats">
      <div><span>VALOR</span><b>${money(p.value)}</b></div>
      <div><span>SAL.</span><b>${money(p.wage)}</b></div>
      <div><span>POT.</span><b>${p.potential ?? p.rating}</b></div>
      <div><span>ROL</span><b>${shortRole(p.role)}</b></div>
    </div>
    <div class="player-actions">
      <input class="value-edit" type="number" value="${p.value}" title="Valor M€" />
      <input class="wage-edit" type="number" value="${p.wage ?? 0}" title="Salario M€" />
      ${actionButtons(p)}
    </div>`;
  card.querySelector(".value-edit").addEventListener("change", e => { p.value = Number(e.target.value || 0); renderAll(); });
  card.querySelector(".wage-edit").addEventListener("change", e => { p.wage = Number(e.target.value || 0); renderAll(); });
  card.querySelectorAll("button[data-action]").forEach(btn => btn.addEventListener("click", () => handlePlayerAction(p.id, btn.dataset.action)));
  return card;
}

function shortRole(role) {
  if (!role) return "—";
  if (role.includes("Estrella")) return "Star";
  if (role.includes("Titular")) return "XI";
  if (role.includes("Promesa") || role.includes("Canterano")) return "Jov.";
  if (role.includes("Rotación")) return "Rot.";
  return role.slice(0,4);
}

function actionButtons(p) {
  if (p.status === "sold") return `<button class="small" data-action="restore">Recuperar</button>`;
  if (p.status === "wishlist") return `<button class="small" data-action="signWish">Fichar</button><button class="small ghost" data-action="removeWish">Quitar</button>`;
  return `<button class="small" data-action="sell">Vender</button><button class="small ghost" data-action="bench">Banquillo</button><button class="small ghost" data-action="setPhoto">Foto</button>`;
}

function handlePlayerAction(id, action) {
  const p = state.players.find(x => x.id === id);
  if (!p) return;
  if (action === "sell") { p.status = "sold"; state.lineup = state.lineup.map(x => x === id ? null : x); toast(`${p.name} vendido por ${money(p.value)}.`); }
  if (action === "restore") { p.status = p.signed ? "signed" : "available"; toast(`${p.name} vuelve a estar disponible.`); }
  if (action === "bench") { state.lineup = state.lineup.map(x => x === id ? null : x); toast(`${p.name} enviado al banquillo.`); }
  if (action === "signWish") { p.status = "signed"; p.signed = true; toast(`${p.name} fichado por ${money(p.value)}.`); }
  if (action === "removeWish") { state.players = state.players.filter(x => x.id !== id); }
  if (action === "setPhoto") {
    const url = prompt("Pega la URL de la foto de " + p.name + ". Déjalo vacío para quitar la foto personalizada.", p.photo || "");
    if (url !== null) { p.photo = url.trim(); toast(url.trim() ? "Foto actualizada." : "Foto eliminada; se usará avatar."); }
  }
  renderAll();
}

function renderBudget() {
  const sales = state.players.filter(p => p.status === "sold" && !p.signed).reduce((a,p)=>a+Number(p.value||0),0);
  const spend = state.players.filter(p => p.signed && p.status !== "sold" && p.status !== "wishlist").reduce((a,p)=>a+Number(p.value||0),0);
  const wages = state.players.filter(p => p.status !== "sold" && p.status !== "wishlist").reduce((a,p)=>a+Number(p.wage||0),0);
  const balance = state.initialBudget + sales - spend;
  $("initialBudget").textContent = money(state.initialBudget);
  $("salesTotal").textContent = money(sales);
  $("spendTotal").textContent = money(spend);
  $("wageTotal").textContent = money(wages);
  $("balanceTotal").textContent = money(balance);
  const status = $("budgetStatus");
  status.textContent = balance > 50 ? "Positivo: mucho margen para fichar" : balance > 0 ? "Positivo: margen moderado" : balance < -150 ? "Muy negativo: inversión agresiva" : balance < 0 ? "Negativo: inversión necesaria" : "Equilibrado";
  status.style.color = balance < 0 ? "var(--red)" : balance > 0 ? "var(--green)" : "var(--navy)";
}

function renderAnalysis() {
  const selected = selectedPlayers();
  const formation = formations[$("formationSelect").value];
  const out = selected.filter(p => {
    const idx = state.lineup.indexOf(p.id); const label = formation[idx]?.[0];
    return label && !p.pos.includes(label) && !flexiblePosition(p.pos, label);
  });
  const groups = groupCounts(selected);
  const value = selected.reduce((a,p)=>a+Number(p.value||0),0);
  const avg = selected.length ? selected.reduce((a,p)=>a+Number(p.rating||75),0)/selected.length : 0;
  const score = selected.length === 11 ? Math.min(10, Math.max(4, (avg - 70) / 3 + 4.2 - out.length * .35 + objectiveBonus(selected))).toFixed(1) : null;
  const depth = depthScore();
  const notes = tacticalNotes(selected, out, groups);
  const objective = objectiveText(score, selected, depth);
  $("analysis").innerHTML = `
    <div class="analysis-card"><strong>Nota global:</strong> ${score ? `${score}/10` : "Completa los 11 jugadores"}<div class="meter"><span style="width:${score ? score*10 : selected.length/11*100}%"></span></div></div>
    <div class="analysis-card"><strong>Valor del once:</strong> ${money(value)} · <strong>Media:</strong> ${selected.length ? avg.toFixed(1) : "—"}</div>
    <div class="analysis-card"><strong>Equilibrio:</strong> ${groups.def} defensas · ${groups.mid} medios · ${groups.att} atacantes · ${groups.gk} porteros</div>
    <div class="analysis-card"><strong>Fuera de posición:</strong> ${out.length ? out.map(p=>p.name).join(", ") : "Ninguno importante"}</div>
    <div class="analysis-card"><strong>Diagnóstico táctico:</strong><br>${notes.map(n=>`• ${n}`).join("<br>")}</div>
    <div class="analysis-card"><strong>Objetivo presidencial:</strong><br>${objective}</div>`;
}

function selectedPlayers() { return state.lineup.map(id => state.players.find(p => p.id === id)).filter(Boolean); }
function groupCounts(arr) {
  return {
    gk: arr.filter(p => p.pos.includes("POR")).length,
    def: arr.filter(p => p.pos.some(x => ["DFC","LI","LD","CAI","CAD"].includes(x))).length,
    mid: arr.filter(p => p.pos.some(x => ["MCD","MC","MCO","MI","MD"].includes(x))).length,
    att: arr.filter(p => p.pos.some(x => ["EI","ED","DC"].includes(x))).length
  };
}
function objectiveBonus(selected) {
  const avgAge = selected.reduce((a,p)=>a+Number(p.age||27),0)/(selected.length || 1);
  const avgRating = selected.reduce((a,p)=>a+Number(p.rating||75),0)/(selected.length || 1);
  if (state.objective === "champions" && avgRating >= 86) return .35;
  if (state.objective === "cantera" && avgAge <= 25) return .35;
  if (state.objective === "galacticos" && selected.filter(p => p.rating >= 88).length >= 4) return .35;
  if (state.objective === "equilibrio" && groupCounts(selected).def >= 4 && groupCounts(selected).mid >= 3) return .35;
  if (state.objective === "sostenible" && currentBalance() >= 0) return .35;
  return 0;
}
function tacticalNotes(selected, out, groups) {
  if (selected.length < 11) return ["Aún faltan jugadores para valorar con precisión."];
  const notes = [];
  if (out.length >= 2) notes.push("Hay demasiados jugadores adaptados fuera de su zona natural.");
  if (groups.gk !== 1) notes.push("El once necesita exactamente un portero.");
  if (groups.def < 4 && $("formationSelect").value.startsWith("4")) notes.push("Para una línea de cuatro te falta estructura defensiva real.");
  if (groups.mid < 3) notes.push("Falta control en el centro. El equipo puede partirse en partidos grandes.");
  if (!selected.some(p => p.pos.includes("MCD"))) notes.push("No hay pivote defensivo claro. Riesgo en transiciones.");
  if (selected.filter(p => p.rating >= 88).length >= 4) notes.push("Tienes núcleo de estrellas suficiente para competir por Champions.");
  if (groups.att >= 4) notes.push("Mucho talento ofensivo, pero revisa la presión tras pérdida.");
  if (!notes.length) notes.push("Once muy equilibrado: calidad, control y estructura defensiva razonable.");
  return notes;
}
function objectiveText(score, selected, depth) {
  const balance = currentBalance();
  const avgAge = selected.length ? selected.reduce((a,p)=>a+Number(p.age||27),0)/selected.length : 0;
  const stars = selected.filter(p => p.rating >= 88).length;
  const map = {
    champions: `Objetivo ganar ya. ${score && Number(score) >= 8.6 ? "Vas en línea de equipo campeón." : "Necesitas más fiabilidad o profundidad para competir al máximo."}`,
    galacticos: `Proyecto Galáctico. Tienes ${stars} estrellas claras en el once. ${stars >= 4 ? "La idea está muy marcada." : "Faltan nombres diferenciales."}`,
    cantera: `Proyecto joven. Edad media del once: ${avgAge ? avgAge.toFixed(1) : "—"}. ${avgAge && avgAge <= 25 ? "Muy buena base de futuro." : "Aún dependes de veteranos."}`,
    sostenible: `Proyecto sostenible. Balance: ${money(balance)}. ${balance >= 0 ? "Financieramente está controlado." : "El proyecto exige inversión."}`,
    equilibrio: `Proyecto equilibrado. Profundidad estimada: ${depth}/10. ${depth >= 7 ? "La plantilla aguanta rotaciones." : "El banquillo necesita refuerzos."}`
  };
  return map[state.objective];
}
function currentBalance() {
  const sales = state.players.filter(p => p.status === "sold" && !p.signed).reduce((a,p)=>a+Number(p.value||0),0);
  const spend = state.players.filter(p => p.signed && p.status !== "sold" && p.status !== "wishlist").reduce((a,p)=>a+Number(p.value||0),0);
  return state.initialBudget + sales - spend;
}

function renderDepth() {
  const selectedIds = new Set(state.lineup.filter(Boolean));
  const active = state.players.filter(p => p.status !== "sold" && p.status !== "wishlist");
  const bench = active.filter(p => !selectedIds.has(p.id)).sort((a,b)=>b.rating-a.rating);
  const sold = state.players.filter(p => p.status === "sold");
  const signed = state.players.filter(p => p.status === "signed");
  const needs = squadNeeds(active);
  $("depth").innerHTML = `
    <div class="depth-card"><strong>Titulares:</strong><div class="depth-list">${badges(selectedPlayers())}</div></div>
    <div class="depth-card"><strong>Banquillo:</strong><div class="depth-list">${badges(bench.slice(0,14))}</div></div>
    <div class="depth-card"><strong>Fichados:</strong><div class="depth-list">${badges(signed)}</div></div>
    <div class="depth-card"><strong>Vendidos:</strong><div class="depth-list">${badges(sold)}</div></div>
    <div class="depth-card"><strong>Necesidades:</strong> ${needs.length ? needs.join(" · ") : "Plantilla bastante compensada"}</div>`;
}
function badges(arr) { return arr.length ? arr.map(p=>`<span class="badge ${p.status}">${p.name}</span>`).join("") : `<span class="badge">—</span>`; }
function squadNeeds(active) {
  const counts = {POR:0, LD:0, LI:0, DFC:0, MCD:0, MC:0, MCO:0, ED:0, EI:0, DC:0};
  active.forEach(p => p.pos.forEach(pos => { if (counts[pos] !== undefined) counts[pos]++; }));
  const needs = [];
  if (counts.POR < 2) needs.push("portero suplente");
  if (counts.DFC < 4) needs.push("central");
  if (counts.LD < 2) needs.push("lateral derecho");
  if (counts.LI < 2) needs.push("lateral izquierdo");
  if (counts.MCD < 2) needs.push("pivote");
  if (counts.ED < 2) needs.push("extremo derecho");
  if (counts.DC < 2) needs.push("delantero");
  return needs;
}
function depthScore() {
  const active = state.players.filter(p => p.status !== "sold" && p.status !== "wishlist");
  const high = active.filter(p => p.rating >= 80).length;
  const needs = squadNeeds(active).length;
  return Math.max(1, Math.min(10, Math.round(high / 2.2 - needs * .6)));
}

function autoLineup() {
  const used = new Set();
  state.lineup = formations[$("formationSelect").value].map(([label]) => {
    const pool = state.players.filter(p => p.status !== "sold" && p.status !== "wishlist" && !used.has(p.id));
    const exact = pool.filter(p => p.pos.includes(label)).sort((a,b)=>b.rating-a.rating || b.value-a.value)[0];
    const flex = pool.filter(p => flexiblePosition(p.pos,label)).sort((a,b)=>b.rating-a.rating || b.value-a.value)[0];
    const pick = exact || flex || null;
    if (pick) { used.add(pick.id); return pick.id; }
    return null;
  });
  renderAll(); toast("Once sugerido generado.");
}

function signPlayer(e) {
  e.preventDefault();
  addSigned({
    name: $("signName").value.trim(), club: $("signClub").value.trim(), age: Number($("signAge").value || 25),
    pos: [$("signPosition").value], value: Number($("signValue").value || 0), wage: Number($("signWage").value || 0),
    rating: estimateRating(Number($("signValue").value || 0)), potential: estimateRating(Number($("signValue").value || 0)) + 2,
    role: $("signClub").value ? `Fichado desde ${$("signClub").value}` : "Fichaje"
  });
  e.target.reset(); renderAll();
}
function estimateRating(value) { return Math.max(68, Math.min(92, Math.round(70 + Math.sqrt(value) * 1.7))); }
function addSigned(data) {
  state.players.push({id: Date.now() + Math.floor(Math.random()*999), status:"signed", signed:true, ...data});
  toast(`${data.name} fichado por ${money(data.value)}.`);
}

function renderSuggestions() {
  const posFilter = $("suggestPosition")?.value || "need";
  const tier = $("suggestTier")?.value || "all";
  const needs = squadNeeds(state.players.filter(p => p.status !== "sold" && p.status !== "wishlist"));
  const positionFromNeed = needs.join(" ").includes("central") ? "DFC" : needs.join(" ").includes("pivote") ? "MCD" : needs.join(" ").includes("derecho") ? "LD" : needs.join(" ").includes("izquierdo") ? "LI" : needs.join(" ").includes("delantero") ? "DC" : needs.join(" ").includes("portero") ? "POR" : null;
  const pos = posFilter === "need" ? positionFromNeed : posFilter;
  const list = suggestedTargets
    .filter(t => tier === "all" || t.tier === tier)
    .filter(t => !pos || t.pos.includes(pos) || flexiblePosition(t.pos, pos))
    .filter(t => !state.players.some(p => p.name === t.name && p.status !== "wishlist"))
    .slice(0, 8);
  const root = $("suggestions"); if (!root) return;
  root.innerHTML = list.length ? list.map((t,i) => `
    <div class="suggestion">
      <div class="suggestion-top"><strong>${t.name}</strong><span class="badge ${t.tier === "galactico" ? "signed" : ""}">${t.pos.join("/")} · ${money(t.value)}</span></div>
      <p>${t.club} · ${t.age} años · salario ${money(t.wage)} · ${t.note}</p>
      <div><button class="small" data-suggest="${i}">Fichar</button> <button class="small ghost" data-wish="${i}">Añadir a objetivos</button></div>
    </div>`).join("") : `<div class="analysis-card">No hay sugerencias para ese filtro.</div>`;
  root.querySelectorAll("button[data-suggest]").forEach((btn, idx) => btn.addEventListener("click", () => addSigned({...list[idx], role:`Fichado desde ${list[idx].club}`} ) || renderAll()));
  root.querySelectorAll("button[data-wish]").forEach((btn, idx) => btn.addEventListener("click", () => addWishlist(list[idx])));
}
function addWishlist(t) {
  if (state.players.some(p => p.name === t.name)) return toast("Ese jugador ya está en la simulación.");
  state.players.push({id: Date.now()+Math.floor(Math.random()*999), ...clone(t), role:"Objetivo de mercado", status:"wishlist", signed:true});
  renderAll(); toast(`${t.name} añadido a objetivos.`);
}

function renderRumours() {
  const root = $("rumoursList"); if (!root) return;
  const existing = new Set(state.players.map(p => p.name));
  root.innerHTML = rumourTargets.map((t, i) => `
    <div class="rumour-card">
      <img class="rumour-photo" src="${photoFor(t)}" onerror="this.onerror=null;this.src=fallbackPhotoFor(t)" alt="">
      <div>
        <div class="rumour-title"><strong>${t.name}</strong><span class="badge wishlist">${t.reliability}</span></div>
        <p>${t.club} · ${t.pos.join("/")} · ${money(t.value)} · Fuente: ${t.source}</p>
        <small>${t.note}</small>
        <div class="rumour-actions">
          <button class="small" data-rumour-sign="${i}" ${existing.has(t.name)?"disabled":""}>Fichar</button>
          <button class="small ghost" data-rumour-wish="${i}" ${existing.has(t.name)?"disabled":""}>Añadir a objetivos</button>
        </div>
      </div>
    </div>`).join("");
  root.querySelectorAll("button[data-rumour-sign]").forEach(btn => btn.addEventListener("click", () => {
    const t = rumourTargets[Number(btn.dataset.rumourSign)];
    addSigned({...clone(t), role:`Rumor fichado desde ${t.club}`}); renderAll();
  }));
  root.querySelectorAll("button[data-rumour-wish]").forEach(btn => btn.addEventListener("click", () => {
    addWishlist(rumourTargets[Number(btn.dataset.rumourWish)]);
  }));
}

function importDataPrompt() {
  const raw = prompt("Pega un JSON con arrays opcionales: { players: [...], rumours: [...] }. Sirve para actualizar valores/fotos desde un fichero propio.");
  if (!raw) return;
  try {
    const data = JSON.parse(raw);
    if (Array.isArray(data.players)) {
      data.players.forEach(np => {
        const p = state.players.find(x => x.name.toLowerCase() === String(np.name||"").toLowerCase());
        if (p) Object.assign(p, np);
        else state.players.push({id: Date.now()+Math.floor(Math.random()*9999), status:"available", role:"Importado", ...np});
      });
    }
    if (Array.isArray(data.rumours)) {
      data.rumours.forEach(r => rumourTargets.push(r));
    }
    renderAll(); toast("Datos importados correctamente.");
  } catch(e) {
    alert("JSON no válido. Revisa el formato.");
  }
}

function nextSeason() {
  state.season += 1;
  state.players.forEach(p => {
    if (typeof p.age === "number") p.age += 1;
    if (p.status === "sold" || p.status === "wishlist") return;
    if (p.age <= 23 && p.potential > p.rating) { p.rating = Math.min(p.potential, p.rating + 1); p.value = Math.round(p.value * 1.08); }
    else if (p.age >= 32) { p.rating = Math.max(65, p.rating - 1); p.value = Math.max(1, Math.round(p.value * .82)); }
    else { p.value = Math.max(1, Math.round(p.value * .98)); }
  });
  renderAll(); toast("Temporada avanzada: edades, medias y valores actualizados de forma orientativa.");
}

function renderSaveSelect() {
  const sel = $("saveSelect"); if (!sel) return;
  sel.innerHTML = Object.entries(state.saves).map(([id, s]) => `<option value="${id}" ${id===state.activeSaveId?'selected':''}>${s.saveName || "Simulación"}</option>`).join("");
}
function shareWeb() {
  const url = location.href.split("?")[0];
  const text = "He creado un simulador fan para montar tu proyecto como presidente del Madrid: once, fichajes, ventas, balance y rumores.";
  if (navigator.share) {
    navigator.share({ title: "Madrid President Simulator", text, url }).catch(() => {});
  } else {
    navigator.clipboard?.writeText(url);
    toast("Enlace copiado para compartir.");
  }
}
function supportProject() {
  const msg = "Aquí puedes poner tu enlace real de Ko-fi, Buy Me a Coffee o PayPal cuando lo tengas. Por ahora el botón está preparado para monetización.";
  toast(msg);
}
function copySupportText() {
  const txt = "¿Te gusta Madrid President Simulator? Apoya el proyecto para que pueda añadir datos actualizados, más rumores, modo temporadas y análisis avanzado.";
  navigator.clipboard?.writeText(txt);
  toast("Texto de apoyo copiado.");
}
function copyDisclaimer() {
  const txt = "Proyecto fan no oficial. No afiliado al Real Madrid, Transfermarkt ni ninguna entidad oficial. Valores, rumores e imágenes son orientativos/editables.";
  navigator.clipboard?.writeText(txt);
  toast("Disclaimer copiado.");
}

function commitActiveSave(updateSelect = false) {
  state.saves[state.activeSaveId] = {
    saveName: state.saveName, players: clone(state.players), lineup: clone(state.lineup), initialBudget: state.initialBudget,
    objective: state.objective, season: state.season, formation: $("formationSelect")?.value || "4-3-3"
  };
  if (updateSelect) renderSaveSelect();
}
function loadSave(id) {
  const s = state.saves[id]; if (!s) return;
  state.activeSaveId = id;
  state.players = clone(s.players); state.lineup = clone(s.lineup); state.initialBudget = s.initialBudget || 0;
  state.objective = s.objective || "champions"; state.season = s.season || 2026; state.saveName = s.saveName || "Simulación";
  if ($("formationSelect") && s.formation) $("formationSelect").value = s.formation;
  renderAll(); toast(`Simulación cargada: ${state.saveName}`);
}
function saveSnapshot() {
  const id = `save-${Date.now()}`;
  state.activeSaveId = id;
  state.saveName = `${state.saveName} copia`;
  commitActiveSave(true); renderAll(); toast("Copia guardada.");
}
function newSimulation() {
  const id = `save-${Date.now()}`;
  state.activeSaveId = id; state.players = clone(basePlayers); state.lineup = Array(11).fill(null); state.initialBudget = 0; state.objective = "champions"; state.season = 2026; state.saveName = "Nueva simulación";
  commitActiveSave(true); renderAll(); toast("Nueva simulación creada.");
}
function save() { localStorage.setItem(storageKey, JSON.stringify(state)); }
function load() {
  try {
    const saved = JSON.parse(localStorage.getItem(storageKey) || "null");
    if (saved) state = {...state, ...saved};
  } catch { }
}
function resetApp() {
  if (!confirm("¿Reiniciar la simulación activa?")) return;
  state.players = clone(basePlayers); state.lineup = Array(11).fill(null); state.initialBudget = 0; state.objective = "champions"; state.season = 2026; state.saveName = "Proyecto inicial";
  renderAll(); toast("Simulación reiniciada.");
}

function exportProject() {
  const payload = JSON.stringify(state.saves[state.activeSaveId], null, 2);
  downloadBlob(payload, `madrid-president-${slug(state.saveName)}.json`, "application/json");
}
function exportLineupImage() {
  const canvas = document.createElement("canvas"); canvas.width = 1200; canvas.height = 1600;
  const ctx = canvas.getContext("2d");
  ctx.fillStyle = "#f7f4ee"; ctx.fillRect(0,0,canvas.width,canvas.height);
  ctx.fillStyle = "#101c38"; ctx.font = "bold 58px system-ui"; ctx.fillText("Madrid President Simulator", 70, 95);
  ctx.fillStyle = "#b99a52"; ctx.font = "bold 26px system-ui"; ctx.fillText(`${state.saveName} · ${$("formationSelect").value} · ${state.season}/${String(state.season+1).slice(-2)}`, 70, 140);
  const px = 120, py = 190, pw = 960, ph = 980;
  const grad = ctx.createLinearGradient(px,py,px+pw,py+ph); grad.addColorStop(0,"#1d7c51"); grad.addColorStop(1,"#146a43"); ctx.fillStyle = grad; roundRect(ctx,px,py,pw,ph,34,true,false);
  ctx.strokeStyle = "rgba(255,255,255,.75)"; ctx.lineWidth = 5; roundRect(ctx,px+35,py+35,pw-70,ph-70,20,false,true);
  ctx.beginPath(); ctx.arc(px+pw/2, py+ph/2, 95, 0, Math.PI*2); ctx.stroke();
  formations[$("formationSelect").value].forEach(([label,x,y],i) => {
    const p = state.players.find(pl => pl.id === state.lineup[i]);
    const cx = px + pw*x/100, cy = py + ph*y/100;
    ctx.fillStyle = "rgba(255,255,255,.94)"; roundRect(ctx,cx-80,cy-35,160,70,18,true,false);
    ctx.fillStyle = "#101c38"; ctx.font = "bold 18px system-ui"; ctx.textAlign = "center"; ctx.fillText(p ? trimName(p.name) : label, cx, cy-3);
    ctx.fillStyle = "#767676"; ctx.font = "14px system-ui"; ctx.fillText(p ? `${p.pos.join('/')} · ${p.rating}` : "Vacío", cx, cy+21);
  });
  ctx.textAlign = "left";
  ctx.fillStyle = "#101c38"; ctx.font = "bold 34px system-ui"; ctx.fillText(`Balance: ${money(currentBalance())}`, 70, 1245);
  ctx.font = "24px system-ui"; ctx.fillText(`Objetivo: ${$("objectiveSelect").selectedOptions[0].textContent}`, 70, 1290);
  ctx.fillText(`Titulares: ${selectedPlayers().length}/11`, 70, 1330);
  canvas.toBlob(blob => downloadBlob(blob, `once-${slug(state.saveName)}.png`, "image/png"));
}
function roundRect(ctx,x,y,w,h,r,fill,stroke){ ctx.beginPath(); ctx.moveTo(x+r,y); ctx.arcTo(x+w,y,x+w,y+h,r); ctx.arcTo(x+w,y+h,x,y+h,r); ctx.arcTo(x,y+h,x,y,r); ctx.arcTo(x,y,x+w,y,r); if(fill)ctx.fill(); if(stroke)ctx.stroke(); }
function trimName(name){ return name.length > 17 ? name.split(" ").slice(-1)[0] : name; }
function downloadBlob(content, filename, type) {
  const blob = content instanceof Blob ? content : new Blob([content], {type});
  const url = URL.createObjectURL(blob); const a = document.createElement("a"); a.href = url; a.download = filename; a.click(); URL.revokeObjectURL(url);
}
function slug(s){ return String(s).toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g,"").replace(/[^a-z0-9]+/g,"-").replace(/^-|-$/g,"") || "proyecto"; }
function toast(msg) {
  document.querySelectorAll(".toast").forEach(t => t.remove());
  const t = document.createElement("div"); t.className = "toast"; t.textContent = msg; document.body.appendChild(t);
  setTimeout(()=>t.remove(), 2600);
}

init();
