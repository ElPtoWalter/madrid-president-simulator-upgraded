const STORE_KEY = 'madrid-president-state-v22-season-2627';
const SIMS_KEY = 'madrid-president-sims-v22-season-2627';
const FACE_CACHE_KEY = 'madrid-president-face-cache-v2';

const els = {};
let data = null;
let state = null;
let faceObserver = null;

const POS_GROUPS = {
  POR: ['POR'], DEF: ['DFC','LI','LD','CAI','CAD'], MID: ['MCD','MC','MCO','MI','MD'], FWD: ['EI','ED','DC','MCO']
};
const POS_LABELS = ['POR','DFC','LI','LD','CAI','CAD','MCD','MC','MCO','MI','MD','EI','ED','DC'];
const DIFFS = ['baja','media','alta','muy alta','intocable'];

window.addEventListener('DOMContentLoaded', init);

async function init(){
  cacheEls();
  bindStaticEvents();
  try{
    const res = await fetch(`data.json?v=${Date.now()}`, {cache:'no-store'});
    if(!res.ok) throw new Error('No se pudo cargar data.json');
    data = await res.json();
  }catch(err){
    console.error(err);
    toast('No he podido cargar data.json. En GitHub Pages funcionará; en local usa un servidor o sube todos los archivos.');
    data = fallbackData();
  }
  state = loadState() || createInitialState();
  ensureStateIntegrity();
  initFaceObserver();
  fillStaticControls();
  renderAll();
}

function cacheEls(){
  document.querySelectorAll('[id]').forEach(el => els[el.id] = el);
}

function createInitialState(){
  return {
    simName: 'Proyecto Real Madrid 26/27',
    project: 'champions',
    formation: '4-3-3',
    initialBudget: 0,
    season: {year:'2026/27', window:'Planificación', tick:0},
    lineup: {},
    sold: [],
    signed: [],
    targets: [],
    customPlayers: {},
    history: [],
    events: [],
    baseline: null
  };
}

function ensureStateIntegrity(){
  state.formation = data.formations[state.formation] ? state.formation : Object.keys(data.formations)[0];
  state.baseline = state.baseline || computeBaseline();
  Object.keys(state.lineup).forEach(slot => {
    if(!getPlayer(state.lineup[slot]) || isSold(state.lineup[slot])) delete state.lineup[slot];
  });
}

function computeBaseline(){
  const squad = playersByStatus('squad');
  return {
    squadValue: sum(squad.map(p=>p.value)),
    salary: sum(squad.map(p=>p.salary)),
    avgAge: avg(squad.map(p=>p.age)),
    avgRating: avg(squad.map(p=>p.rating))
  };
}

function loadState(){
  try { return JSON.parse(localStorage.getItem(STORE_KEY)); } catch { return null; }
}
function saveState(){ localStorage.setItem(STORE_KEY, JSON.stringify(state)); }

function bindStaticEvents(){
  document.querySelectorAll('.nav-btn').forEach(btn => btn.addEventListener('click', () => switchTab(btn.dataset.tab)));
  els.btnReset?.addEventListener('click', () => { if(confirm('¿Reiniciar esta simulación?')){ state=createInitialState(); saveState(); fillStaticControls(); renderAll(); }});
  els.btnShare?.addEventListener('click', shareSite);
  els.btnExportPng?.addEventListener('click', exportLineupPng);
  els.btnSupport?.addEventListener('click', () => toast('Aquí puedes poner tu enlace de Ko-fi, PayPal o Buy Me a Coffee cuando lo tengas.'));
  els.btnSuggestedXI?.addEventListener('click', applySuggestedXI);
  els.btnClearXI?.addEventListener('click', () => { state.lineup={}; pushHistory('once','Campo vaciado',0); saveAndRender(); });
  els.btnSaveSim?.addEventListener('click', saveNamedSimulation);
  els.btnLoadSim?.addEventListener('click', loadNamedSimulation);
  els.btnDuplicateSim?.addEventListener('click', duplicateSimulation);
  els.btnNewSim?.addEventListener('click', () => { state=createInitialState(); fillStaticControls(); saveAndRender(); });
  els.btnNeedTargets?.addEventListener('click', suggestByNeeds);
  els.btnUndo?.addEventListener('click', undoLast);
  els.btnAdvanceWindow?.addEventListener('click', cycleSeasonPhase);
  els.btnSimEvent?.addEventListener('click', generateSeasonEvent);
  els.btnExportJson?.addEventListener('click', exportSimulationJson);
  els.fileImport?.addEventListener('change', importJson);
  els.modalClose?.addEventListener('click', () => els.playerModal.close());
  els.playerModal?.addEventListener('click', (e)=>{ if(e.target === els.playerModal) els.playerModal.close(); });
  ['availableSearch','squadSearch','squadFilter','marketSearch','marketPosition','marketDifficulty','marketAge','marketValue'].forEach(id => els[id]?.addEventListener('input', renderAll));
  els.projectSelect?.addEventListener('change', e => { state.project=e.target.value; saveAndRender(); });
  els.formationSelect?.addEventListener('change', e => { state.formation=e.target.value; state.lineup={}; pushHistory('once',`Cambio a ${state.formation}`,0); saveAndRender(); });
  els.initialBudget?.addEventListener('input', e => { state.initialBudget = Number(e.target.value || 0); saveAndRender(); });
  els.simName?.addEventListener('input', e => { state.simName = e.target.value; saveState(); });
}

function switchTab(tab){
  document.querySelectorAll('.nav-btn').forEach(b => b.classList.toggle('active', b.dataset.tab===tab));
  document.querySelectorAll('.tab').forEach(t => t.classList.toggle('active', t.id===`tab-${tab}`));
  setTimeout(()=> observeFaces(), 10);
}

function fillStaticControls(){
  if(!data) return;
  els.projectSelect.innerHTML = Object.entries(data.projects).map(([id,p]) => `<option value="${id}">${escapeHtml(p.name)}</option>`).join('');
  els.formationSelect.innerHTML = Object.keys(data.formations).map(f => `<option value="${f}">${f}</option>`).join('');
  [els.squadFilter, els.marketPosition].forEach(sel => {
    if(!sel) return;
    const first = sel.id==='squadFilter' ? '<option value="all">Todas</option>' : '<option value="all">Posición</option>';
    sel.innerHTML = first + POS_LABELS.map(p => `<option value="${p}">${p}</option>`).join('');
  });
  els.marketDifficulty.innerHTML = '<option value="all">Dificultad</option>' + DIFFS.map(d => `<option value="${d}">${capitalize(d)}</option>`).join('');
  els.projectSelect.value = state.project;
  els.formationSelect.value = state.formation;
  els.initialBudget.value = state.initialBudget;
  els.simName.value = state.simName || '';
  renderSavedSelect();
}

function renderAll(){
  if(!data || !state) return;
  syncControls();
  renderKpis();
  renderPitch();
  renderAvailable();
  renderBench();
  renderSquad();
  renderMarket();
  renderRumors();
  renderFinance();
  renderAnalysis();
  renderHistory();
  renderSeason();
  renderDataPreview();
  observeFaces();
}
function saveAndRender(){ saveState(); renderAll(); }
function syncControls(){
  els.projectSelect && (els.projectSelect.value = state.project);
  els.formationSelect && (els.formationSelect.value = state.formation);
  els.initialBudget && (els.initialBudget.value = state.initialBudget);
  els.simName && (els.simName.value = state.simName || '');
  els.lastUpdate.textContent = `Datos: ${data.meta?.lastManualReview || '—'} · AutoMarket: ${formatAutoDate(data.meta?.lastAutoUpdate || data.meta?.autoMarket?.lastRun)}`;
  els.formationBadge.textContent = state.formation;
  els.seasonBadge.textContent = `${state.season.year} · ${state.season.window}`;
}

function getAllPlayers(){
  return data.players.map(p => ({...p, ...(state.customPlayers?.[p.id] || {})}));
}
function getPlayer(id){ return getAllPlayers().find(p => p.id === id); }
function playersByStatus(status){ return getAllPlayers().filter(p => p.status === status); }
function isSold(id){ return state.sold.includes(id); }
function isSigned(id){ return state.signed.includes(id); }
function isInLineup(id){ return Object.values(state.lineup).includes(id); }
function activePlayers(){
  const base = getAllPlayers().filter(p => (p.status==='squad' || isSigned(p.id)) && !isSold(p.id));
  return uniqueBy(base, p=>p.id);
}
function availablePlayers(){ return activePlayers().filter(p => !isInLineup(p.id)); }
function lineupPlayers(){ return Object.values(state.lineup).map(getPlayer).filter(Boolean); }
function benchPlayers(){ return activePlayers().filter(p => !isInLineup(p.id)); }

function renderKpis(){
  const active = activePlayers();
  const market = playersByStatus('market').length;
  const finance = computeFinance();
  const analysis = computeAnalysis();
  els.kpiSquad.textContent = active.length;
  els.kpiMarket.textContent = market;
  els.kpiBalance.textContent = fmtMoney(finance.balance);
  els.kpiRating.textContent = analysis.overall ? analysis.overall.toFixed(1) : '—';
}

function renderPitch(){
  const slots = data.formations[state.formation] || [];
  els.pitch.innerHTML = slots.map(slot => {
    const player = getPlayer(state.lineup[slot.id]);
    return `<div class="slot" data-slot="${slot.id}" data-group="${slot.group}" style="left:${slot.x}%;top:${slot.y}%">
      ${player ? miniPlayerHtml(player, slot) : `<div class="slot-label">${slot.label}</div>`}
    </div>`;
  }).join('');
  els.pitch.querySelectorAll('.slot').forEach(slotEl => {
    slotEl.addEventListener('dragover', e => { e.preventDefault(); slotEl.classList.add('over'); });
    slotEl.addEventListener('dragleave', () => slotEl.classList.remove('over'));
    slotEl.addEventListener('drop', e => {
      e.preventDefault(); slotEl.classList.remove('over');
      const playerId = e.dataTransfer.getData('text/player-id');
      if(playerId) assignPlayerToSlot(playerId, slotEl.dataset.slot);
    });
  });
}
function miniPlayerHtml(p, slot){
  const warn = slot && !fitsSlot(p, slot) ? '⚠️' : '';
  return `<div class="mini-player" draggable="true" data-player-id="${p.id}">
    ${faceHtml(p)}
    <div><strong>${escapeHtml(shortName(p.name))} ${warn}</strong><small>${p.position} · ${fmtMoney(p.value)}</small>
      <div class="slot-actions"><button data-action="open" data-id="${p.id}" class="btn btn-soft">Info</button><button data-action="remove-slot" data-slot="${slot.id}" class="btn btn-soft">Quitar</button></div>
    </div>
  </div>`;
}
function assignPlayerToSlot(playerId, slotId){
  const p = getPlayer(playerId);
  if(!p || isSold(playerId)) return toast('Ese jugador no está disponible.');
  const existingSlot = Object.entries(state.lineup).find(([,id]) => id === playerId)?.[0];
  if(existingSlot) delete state.lineup[existingSlot];
  const replaced = state.lineup[slotId];
  state.lineup[slotId] = playerId;
  const slot = (data.formations[state.formation]||[]).find(s=>s.id===slotId);
  const msg = replaced ? `${p.name} sustituye a ${getPlayer(replaced)?.name || 'jugador'} en ${slot.label}` : `${p.name} al campo en ${slot.label}`;
  pushHistory('once', msg, 0);
  if(!fitsSlot(p, slot)) toast(`${p.name} puede jugar ahí, pero no es su posición natural.`);
  saveAndRender();
}

function renderAvailable(){
  const q = norm(els.availableSearch?.value || '');
  const list = availablePlayers().filter(p => !q || norm(`${p.name} ${p.position} ${p.secondary.join(' ')} ${p.tags.join(' ')}`).includes(q));
  els.availableList.innerHTML = list.length ? list.map(p => playerCardHtml(p, {compact:true, actions:['open','sell']})).join('') : empty('No quedan jugadores disponibles para esta búsqueda.');
  bindCardEvents(els.availableList);
}
function renderBench(){
  const list = benchPlayers().slice().sort((a,b)=>b.rating-a.rating);
  els.benchList.innerHTML = list.length ? list.map(p => playerCardHtml(p, {compact:true, actions:['open','sell']})).join('') : empty('El banquillo está vacío.');
  bindCardEvents(els.benchList);
}
function renderSquad(){
  const q = norm(els.squadSearch?.value || '');
  const pos = els.squadFilter?.value || 'all';
  const squad = activePlayers().filter(p => (pos==='all'||p.position===pos||p.secondary.includes(pos)) && (!q || norm(`${p.name} ${p.club} ${p.nationality} ${p.tags.join(' ')}`).includes(q)));
  els.squadGrid.innerHTML = squad.map(p => playerCardHtml(p, {actions:['open','sell','target']})).join('') || empty('No hay jugadores con ese filtro.');
  bindCardEvents(els.squadGrid);
  const former = playersByStatus('former');
  els.formerGrid.innerHTML = former.map(p => playerCardHtml(p, {compact:true, actions:['open']})).join('') || empty('Sin salidas registradas.');
  bindCardEvents(els.formerGrid);
}
function renderMarket(){
  const q = norm(els.marketSearch?.value || '');
  const pos = els.marketPosition?.value || 'all';
  const diff = els.marketDifficulty?.value || 'all';
  const maxAge = Number(els.marketAge?.value || 99);
  const maxVal = Number(els.marketValue?.value || 999);
  let market = playersByStatus('market').filter(p => !isSigned(p.id) && !isSold(p.id));
  market = market.filter(p => (pos==='all'||p.position===pos||p.secondary.includes(pos)) && (diff==='all'||p.difficulty===diff) && p.age<=maxAge && p.value<=maxVal);
  if(q) market = market.filter(p => norm(`${p.name} ${p.club} ${p.nationality} ${p.position} ${p.secondary.join(' ')} ${p.tags.join(' ')}`).includes(q));
  market.sort((a,b)=> b.rating - a.rating || b.potential - a.potential || a.value-b.value);
  els.marketGrid.innerHTML = market.map(p => playerCardHtml(p, {actions:['open','negotiate','target']})).join('') || empty('No hay objetivos con esos filtros.');
  bindCardEvents(els.marketGrid);
}
function renderRumors(){
  const sorted = (data.rumors||[]).slice().sort((a,b)=>(b.auto?1:0)-(a.auto?1:0) || (b.confidence||0)-(a.confidence||0));
  els.rumorList.innerHTML = sorted.map(r => {
    const p = getPlayer(r.playerId);
    if(!p) return '';
    const source = r.sourceUrl ? `<a target="_blank" rel="noopener" href="${escapeAttr(r.sourceUrl)}">${escapeHtml(r.source || 'Fuente')}</a>` : escapeHtml(r.source || 'Radar');
    const autoBadge = r.auto ? '<span class="tag tag-auto">AutoMarket</span>' : '<span class="tag">Manual</span>';
    const updated = r.updatedAt ? `<small> · ${formatAutoDate(r.updatedAt)}</small>` : '';
    return `<article class="rumor-item ${r.auto ? 'auto-rumor' : ''}">
      <header><div><b>${escapeHtml(p.name)}</b><small>${escapeHtml(r.status)} · ${escapeHtml(p.club)} · ${fmtMoney(p.value)} ${updated}</small></div><span class="pill">${r.confidence}%</span></header>
      <p>${escapeHtml(r.note || '')}</p><small>Fuente: ${source} · ${autoBadge}</small>
      <div class="confidence"><i style="width:${Math.max(5, Math.min(100, r.confidence || 0))}%"></i></div>
      <div class="card-actions"><button class="btn btn-primary" data-action="negotiate" data-id="${p.id}">Negociar</button><button class="btn btn-soft" data-action="target" data-id="${p.id}">Radar</button><button class="btn btn-soft" data-action="open" data-id="${p.id}">Ficha</button></div>
    </article>`;
  }).join('') || empty('Todavía no hay rumores. Cuando GitHub Actions ejecute AutoMarket, aparecerán aquí.');
  bindCardEvents(els.rumorList);
  const auto = data.meta?.autoMarket;
  const autoCard = auto ? `<a class="source-auto" href="#"><b>AutoMarket activo</b><small><br>${auto.articlesFetched||0} noticias leídas · ${auto.detections||0} detecciones · ${formatAutoDate(auto.lastRun || data.meta?.lastAutoUpdate)}</small></a>` : '';
  els.sourceLinks.innerHTML = autoCard + (data.sources||[]).map(s => `<a target="_blank" rel="noopener" href="${s.url}"><b>${escapeHtml(s.name)}</b><small><br>${escapeHtml(s.purpose)}</small></a>`).join('');
}

function playerCardHtml(p, opts={}){
  const cls = p.tags?.includes('estrella')||p.tags?.includes('galáctico') ? 'role-star' : p.tags?.includes('joven')||p.tags?.includes('promesa') ? 'role-young' : p.tags?.includes('transferible') ? 'role-transfer' : p.status==='market' ? 'role-market' : '';
  const actions = opts.actions || ['open'];
  const tags = (p.tags||[]).slice(0,3).map(t=>`<span class="tag">${escapeHtml(t)}</span>`).join('');
  return `<article class="player-card ${cls}" draggable="true" data-player-id="${p.id}">
    <div class="player-top">${faceHtml(p)}<div><div class="player-name">${escapeHtml(p.name)}</div><div class="player-meta">${p.position}${p.secondary?.length ? ' / '+p.secondary.join(' / ') : ''} · ${p.age} años<br>${escapeHtml(p.club || '')}</div></div></div>
    <div class="stat-row"><div class="stat"><b>${fmtMoney(p.value)}</b><small>Valor</small></div><div class="stat"><b>${p.rating}</b><small>Media</small></div></div>
    <div class="tag-row">${tags}</div>
    <div class="card-actions">${actions.map(a => actionButton(a,p)).join('')}</div>
  </article>`;
}
function actionButton(action,p){
  const labels = {open:'Ficha', sell:'Vender', negotiate:'Negociar', target:'Radar'};
  const cls = action==='negotiate' ? 'btn-primary' : action==='sell' ? 'btn-danger-soft' : 'btn-soft';
  return `<button class="btn ${cls}" data-action="${action}" data-id="${p.id}">${labels[action]}</button>`;
}
function bindCardEvents(root){
  if(!root) return;
  root.querySelectorAll('.player-card,.mini-player').forEach(card => {
    card.addEventListener('dragstart', e => { e.dataTransfer.setData('text/player-id', card.dataset.playerId); card.classList.add('dragging'); });
    card.addEventListener('dragend', () => card.classList.remove('dragging'));
  });
  root.querySelectorAll('[data-action]').forEach(btn => btn.addEventListener('click', e => {
    e.stopPropagation();
    const {action, id, slot} = btn.dataset;
    if(action === 'open') return openPlayerModal(id);
    if(action === 'sell') return sellPlayer(id);
    if(action === 'negotiate') return openNegotiation(id);
    if(action === 'target') return addTarget(id);
    if(action === 'remove-slot') return removeSlot(slot);
  }));
  root.querySelectorAll('.player-card').forEach(card => card.addEventListener('click', e => {
    if(e.target.closest('button')) return;
    openPlayerModal(card.dataset.playerId);
  }));
  observeFaces();
}

function faceHtml(p){
  const initials = getInitials(p.name);
  const manual = p.photo;
  const srcAttr = manual ? `data-src="${escapeAttr(manual)}"` : '';
  return `<div class="face" data-face="${p.id}" data-wiki="${escapeAttr(p.wiki || p.name)}" ${srcAttr}>${initials}</div>`;
}
function initFaceObserver(){
  faceObserver = new IntersectionObserver(entries => entries.forEach(entry => {
    if(entry.isIntersecting){ loadFace(entry.target); faceObserver.unobserve(entry.target); }
  }), {rootMargin:'220px'});
}
function observeFaces(){
  if(!faceObserver) return;
  document.querySelectorAll('.face[data-face]:not([data-observed])').forEach(el => { el.dataset.observed='1'; faceObserver.observe(el); });
}
async function loadFace(el){
  if(el.dataset.loaded) return;
  el.dataset.loaded = '1';
  const manual = el.dataset.src;
  let url = manual || getFaceCache(el.dataset.wiki);
  if(!url && el.dataset.wiki){
    try{
      const res = await fetch(`https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(el.dataset.wiki)}`);
      const js = await res.json();
      url = js?.thumbnail?.source || js?.originalimage?.source || '';
      if(url) setFaceCache(el.dataset.wiki, url);
    }catch{ /* fallback */ }
  }
  if(url){
    const img = new Image(); img.referrerPolicy='no-referrer'; img.loading='lazy'; img.src=url;
    img.onload = () => { el.textContent=''; el.appendChild(img); img.className='face-img'; Object.assign(img.style,{width:'100%',height:'100%',objectFit:'cover',borderRadius:'inherit'}); };
  }
}
function getFaceCache(k){ try { return JSON.parse(localStorage.getItem(FACE_CACHE_KEY)||'{}')[k]; } catch { return ''; } }
function setFaceCache(k,v){ try { const c=JSON.parse(localStorage.getItem(FACE_CACHE_KEY)||'{}'); c[k]=v; localStorage.setItem(FACE_CACHE_KEY, JSON.stringify(c)); } catch{} }

function openPlayerModal(id){
  const p = getPlayer(id); if(!p) return;
  const slot = Object.entries(state.lineup).find(([,pid])=>pid===id)?.[0];
  const buyCost = estimateBuyCost(p);
  const sellOffer = estimateSellOffer(p);
  els.modalContent.innerHTML = `<div class="modal-player">
    <div class="modal-photo face" data-face="modal-${p.id}" data-wiki="${escapeAttr(p.wiki || p.name)}" ${p.photo ? `data-src="${escapeAttr(p.photo)}"` : ''}>${getInitials(p.name)}</div>
    <div>
      <span class="pill">${escapeHtml(p.status)} · ${escapeHtml(p.difficulty || 'media')}</span>
      <h2>${escapeHtml(p.name)}</h2>
      <p>${escapeHtml(p.club)} · ${escapeHtml(p.nationality)} · ${p.age} años · ${p.position}${p.secondary?.length ? ' / '+p.secondary.join(' / ') : ''}</p>
      <div class="modal-stats">
        <div class="stat"><b>${fmtMoney(p.value)}</b><small>Valor</small></div>
        <div class="stat"><b>${fmtMoney(p.salary)}</b><small>Salario/año</small></div>
        <div class="stat"><b>${p.rating}</b><small>Media</small></div>
        <div class="stat"><b>${p.potential}</b><small>Potencial</small></div>
      </div>
      <div class="tag-row">${(p.tags||[]).map(t=>`<span class="tag">${escapeHtml(t)}</span>`).join('')}</div>
      <div class="analysis-text mt">
        <div class="note"><b>Rol:</b> ${escapeHtml(p.role || '—')}</div>
        <div class="note"><b>Compra estimada:</b> ${fmtMoney(buyCost)} · <b>Oferta de venta estimada:</b> ${fmtMoney(sellOffer)}</div>
        ${slot ? `<div class="note warn">Está colocado en el campo. Si lo vendes, saldrá del XI.</div>` : ''}
      </div>
      <div class="button-row">
        ${p.status==='market' && !isSigned(p.id) ? `<button class="btn btn-primary" data-modal-action="buy" data-id="${p.id}">Fichar con precio manual</button>` : ''}
        ${(p.status==='squad'||isSigned(p.id)) && !isSold(p.id) ? `<button class="btn btn-danger-soft" data-modal-action="sell" data-id="${p.id}">Vender con precio manual</button>` : ''}
        <button class="btn btn-soft" data-modal-action="photo" data-id="${p.id}">Cambiar foto</button>
        <button class="btn btn-soft" data-modal-action="target" data-id="${p.id}">Añadir al radar</button>
      </div>
    </div>
  </div>`;
  els.modalContent.querySelectorAll('[data-modal-action]').forEach(btn => btn.addEventListener('click', () => {
    const action = btn.dataset.modalAction;
    const pid = btn.dataset.id;
    if(action==='buy') { buyPlayer(pid); els.playerModal.close(); }
    if(action==='sell') { sellPlayer(pid); els.playerModal.close(); }
    if(action==='photo') { setPhoto(pid); }
    if(action==='target') { addTarget(pid); }
  }));
  els.playerModal.showModal();
  observeFaces();
}
function openNegotiation(id){
  const p=getPlayer(id); if(!p) return;
  const cost=estimateBuyCost(p);
  const fee = askTransactionFee('buy', p, cost);
  if(fee !== null) buyPlayer(id, fee);
}
function buyPlayer(id, cost=null){
  const p=getPlayer(id); if(!p) return;
  if(isSigned(id)) return toast(`${p.name} ya está fichado.`);
  const suggested = estimateBuyCost(p);
  const fee = cost ?? askTransactionFee('buy', p, suggested);
  if(fee === null) return;
  state.signed.push(id);
  state.sold = state.sold.filter(x=>x!==id);
  const diff = Number(fee) - Number(p.value || 0);
  pushHistory('buy', `Fichaje: ${p.name} por ${fmtMoney(fee)} · valor base ${fmtMoney(p.value)} · ${diff>=0?'+':''}${fmtMoney(diff)} vs base`, -fee, {playerId:id, fee, baseValue:p.value, suggested});
  saveAndRender();
  toast(`${p.name} fichado por ${fmtMoney(fee)}.`);
}
function sellPlayer(id){
  const p=getPlayer(id); if(!p || isSold(id)) return;
  const suggested = estimateSellOffer(p);
  const offer = askTransactionFee('sale', p, suggested);
  if(offer === null) return;
  state.sold.push(id);
  Object.keys(state.lineup).forEach(slot => { if(state.lineup[slot]===id) delete state.lineup[slot]; });
  const diff = Number(offer) - Number(p.value || 0);
  pushHistory('sale', `Venta: ${p.name} por ${fmtMoney(offer)} · valor base ${fmtMoney(p.value)} · ${diff>=0?'+':''}${fmtMoney(diff)} vs base`, offer, {playerId:id, fee:offer, baseValue:p.value, suggested});
  saveAndRender();
  toast(`${p.name} vendido por ${fmtMoney(offer)}.`);
}
function askTransactionFee(type, p, suggested){
  const label = type === 'sale' ? 'venta' : 'compra';
  const helper = type === 'sale'
    ? `Puedes vender por encima o por debajo de su valor base. Valor base: ${fmtMoney(p.value)}. Oferta sugerida: ${fmtMoney(suggested)}.`
    : `Puedes pagar más o menos que el valor base. Valor base: ${fmtMoney(p.value)}. Precio sugerido realista: ${fmtMoney(suggested)}.`;
  const raw = prompt(`Precio manual de ${label} para ${p.name} en M€\n\n${helper}\n\nEscribe solo el número, por ejemplo 85.`, String(suggested));
  if(raw === null) return null;
  const normalized = String(raw).replace(',', '.').replace(/[^0-9.\-]/g, '');
  const value = Number(normalized);
  if(!Number.isFinite(value) || value < 0){ toast('Precio no válido. Operación cancelada.'); return null; }
  return Math.round(value*10)/10;
}
function addTarget(id){
  const p=getPlayer(id); if(!p) return;
  if(!state.targets.includes(id)) state.targets.push(id);
  saveState(); toast(`${p.name} añadido al radar.`);
}
function setPhoto(id){
  const p=getPlayer(id); if(!p) return;
  const url = prompt(`Pega una URL de foto para ${p.name}`, p.photo || '');
  if(url !== null){
    state.customPlayers[id] = {...(state.customPlayers[id]||{}), photo:url.trim()};
    saveAndRender(); openPlayerModal(id);
  }
}
function removeSlot(slot){ if(state.lineup[slot]){ delete state.lineup[slot]; pushHistory('once','Jugador retirado del campo',0); saveAndRender(); } }

function estimateBuyCost(p){
  const diffFactor = {baja:1.0, media:1.15, alta:1.35, 'muy alta':1.65, intocable:2.1}[p.difficulty] || 1.2;
  const potentialBonus = p.potential>=90 ? .15 : p.potential>=87 ? .08 : 0;
  const ageFactor = p.age<=23 ? .10 : p.age>=31 ? -.12 : 0;
  return round5(Math.max(1, p.value * (diffFactor + potentialBonus + ageFactor)));
}
function estimateSellOffer(p){
  const base = p.value;
  let factor = p.tags?.includes('transferible') ? .95 : 1.08;
  if(p.age>=32) factor -= .18;
  if(p.potential>=90 && p.age<=24) factor += .18;
  if(p.role?.toLowerCase().includes('intocable') || p.tags?.includes('estrella')) factor += .12;
  return round5(Math.max(1, base * factor));
}
function round5(n){ return Math.round(n/5)*5; }

function computeFinance(){
  let sales=0, buys=0, baseSales=0, baseBuys=0;
  for(const h of state.history){
    if(h.type==='sale'){ sales += h.amount; baseSales += Number(h.meta?.baseValue ?? h.amount); }
    if(h.type==='buy'){ buys += Math.abs(h.amount); baseBuys += Number(h.meta?.baseValue ?? Math.abs(h.amount)); }
  }
  const negotiationDelta = (sales - baseSales) + (baseBuys - buys);
  const active = activePlayers();
  const salaryNow = sum(active.map(p=>p.salary));
  const salaryBase = state.baseline?.salary || salaryNow;
  const salaryDelta = salaryNow - salaryBase;
  const balance = Number(state.initialBudget||0) + sales - buys;
  const risk = balance < -250 || salaryDelta > 40 ? 'Alto' : balance < -100 || salaryDelta > 20 ? 'Medio' : 'Controlado';
  return {sales, buys, baseSales, baseBuys, negotiationDelta, balance, salaryNow, salaryBase, salaryDelta, risk};
}
function renderFinance(){
  const f=computeFinance();
  els.riskBadge.textContent = `Riesgo ${f.risk}`;
  els.riskBadge.style.borderColor = f.risk==='Alto' ? 'rgba(255,107,107,.5)' : f.risk==='Medio' ? 'rgba(255,179,92,.5)' : 'rgba(95,224,160,.5)';
  const items = [
    ['Presupuesto inicial', fmtMoney(Number(state.initialBudget||0))], ['Ventas', fmtMoney(f.sales)], ['Fichajes', fmtMoney(f.buys)], ['Balance', fmtMoney(f.balance)], ['Diferencial vs valor base', fmtMoney(f.negotiationDelta)], ['Masa salarial', fmtMoney(f.salaryNow)], ['Delta salarial', fmtMoney(f.salaryDelta)]
  ];
  els.financeCards.innerHTML = items.map(([k,v]) => `<div class="finance-item"><span>${k}</span><b>${v}</b></div>`).join('');
  const max = Math.max(20, f.sales, f.buys, Math.abs(f.salaryDelta));
  els.barSales.style.height = `${Math.max(8, f.sales/max*80)}px`;
  els.barBuys.style.height = `${Math.max(8, f.buys/max*80)}px`;
  els.barSalary.style.height = `${Math.max(8, Math.abs(f.salaryDelta)/max*80)}px`;
}

function computeAnalysis(){
  const line = lineupPlayers();
  const slots = data.formations[state.formation] || [];
  const byGroup = {POR:[], DEF:[], MID:[], FWD:[]};
  for(const slot of slots){ const p = getPlayer(state.lineup[slot.id]); if(p) byGroup[slot.group]?.push(p); }
  const scores = {
    porteria: avg(byGroup.POR.map(p=>p.rating)) || 0,
    defensa: avg(byGroup.DEF.map(p=>p.rating)) || 0,
    medio: avg(byGroup.MID.map(p=>p.rating)) || 0,
    ataque: avg(byGroup.FWD.map(p=>p.rating)) || 0,
    banquillo: avg(benchPlayers().slice().sort((a,b)=>b.rating-a.rating).slice(0,7).map(p=>p.rating)) || 0
  };
  let balance = 82;
  const naturalPenalty = slots.reduce((acc,slot)=>{ const p=getPlayer(state.lineup[slot.id]); return acc + (p && !fitsSlot(p, slot) ? 3 : 0); },0);
  if(!line.some(p=>p.position==='MCD'||p.secondary.includes('MCD'))) balance -= 7;
  if(byGroup.DEF.length < 4 && state.formation.startsWith('4')) balance -= 5;
  if(line.filter(p=>['EI','ED','DC'].includes(p.position)).length >= 4) balance -= 3;
  balance -= naturalPenalty;
  scores.equilibrio = clamp(balance, 40, 95);
  const availableScores = Object.values(scores).filter(Boolean);
  const overall = line.length ? (scores.porteria*.14 + scores.defensa*.22 + scores.medio*.24 + scores.ataque*.25 + scores.equilibrio*.15)/10 : 0;
  return {scores, overall: overall, complete: line.length===11, line};
}
function renderAnalysis(){
  const a = computeAnalysis();
  els.analysisScore.textContent = a.overall ? `${a.overall.toFixed(1)}/10` : '—';
  els.kpiRating.textContent = a.overall ? a.overall.toFixed(1) : '—';
  const labels = [['porteria','Portería'],['defensa','Defensa'],['medio','Medio'],['ataque','Ataque'],['equilibrio','Equilibrio'],['banquillo','Banquillo']];
  els.lineScores.innerHTML = labels.map(([k,l])=>`<div class="score-card"><b>${a.scores[k] ? a.scores[k].toFixed(0) : '—'}</b><span>${l}</span></div>`).join('');
  const notes = buildAnalysisNotes(a);
  els.analysisText.innerHTML = notes.map(n=>`<div class="note ${n.type}">${n.text}</div>`).join('');
  renderNeeds(a);
}
function buildAnalysisNotes(a){
  const notes=[];
  const line=a.line;
  if(!a.complete) notes.push({type:'warn', text:`Te faltan ${11-line.length} jugadores para completar el once.`});
  if(line.some(p=>p.tags?.includes('galáctico')||p.tags?.includes('estrella'))) notes.push({type:'good', text:'El once tiene estrellas capaces de decidir partidos grandes.'});
  if(!line.some(p=>p.position==='MCD'||p.secondary.includes('MCD'))) notes.push({type:'bad', text:'Falta un pivote defensivo claro. El equipo puede partirse en transiciones.'});
  const slots=data.formations[state.formation]||[];
  const off = slots.map(s=>({slot:s,p:getPlayer(state.lineup[s.id])})).filter(x=>x.p && !fitsSlot(x.p,x.slot));
  if(off.length) notes.push({type:'warn', text:`Jugadores fuera de posición: ${off.map(x=>`${x.p.name} en ${x.slot.label}`).join(', ')}.`});
  const age=avg(line.map(p=>p.age)); if(age && age<25) notes.push({type:'good', text:'Once joven con margen de crecimiento y revalorización.'}); if(age>29) notes.push({type:'warn', text:'Once veterano: rendimiento inmediato alto, pero menor recorrido a medio plazo.'});
  const fin=computeFinance(); if(fin.balance < -200) notes.push({type:'bad', text:'La inversión es muy agresiva. Deportivamente puede ser brutal, pero el riesgo económico sube.'}); else if(fin.balance>=0) notes.push({type:'good', text:'Balance positivo o controlado. Tienes margen para otra operación.'});
  if(a.scores.ataque >= 88 && a.scores.defensa < 84) notes.push({type:'warn', text:'Ataque de élite, pero la defensa queda un escalón por debajo. Ojo en Champions.'});
  if(!notes.length) notes.push({type:'good', text:'Equipo equilibrado y sin alertas graves.'});
  return notes;
}
function renderNeeds(a){
  const active=activePlayers();
  const counts={POR:0,DFC:0,LD:0,LI:0,MCD:0,MC:0,MCO:0,EI:0,ED:0,DC:0};
  for(const p of active){ if(counts[p.position]!=null) counts[p.position]++; }
  const needs=[];
  if(counts.POR<2) needs.push(['bad','Falta un segundo portero fiable.']);
  if(counts.DFC<4) needs.push(['warn','Plantilla corta de centrales.']);
  if(counts.LI<2) needs.push(['warn','Falta profundidad en lateral izquierdo.']);
  if(counts.LD<2) needs.push(['warn','Falta profundidad en lateral derecho.']);
  if(counts.MCD<1) needs.push(['bad','No hay pivote defensivo puro suficiente.']);
  if(counts.DC<2) needs.push(['warn','Solo hay un 9 claro; dependerás de Mbappé/Endrick.']);
  if(active.filter(p=>p.age<=23).length>=7) needs.push(['good','Buena base joven para el futuro.']);
  if(active.filter(p=>p.nationality==='España').length>=8) needs.push(['good','Presencia española fuerte, útil para narrativa de proyecto.']);
  const projectScore=computeProjectScore(active,a);
  els.projectScore.textContent = `${projectScore}%`;
  els.squadNeeds.innerHTML = needs.map(([type,text])=>`<div class="note ${type}">${text}</div>`).join('') + `<div class="note"><b>Objetivo:</b> ${escapeHtml(data.projects[state.project]?.description || '')}</div>`;
}
function computeProjectScore(active,a){
  const f=computeFinance(); let score=70;
  if(state.project==='galactico') score += active.filter(p=>p.value>=100||p.tags?.includes('galáctico')).length*6 + (f.balance<0?8:0);
  if(state.project==='sostenible') score += f.balance>=0?25:f.balance>-80?10:-15; score -= Math.max(0,f.salaryDelta-20)*.6;
  if(state.project==='cantera') score += active.filter(p=>p.tags?.includes('cantera')||p.age<=22).length*4;
  if(state.project==='espanol') score += active.filter(p=>p.nationality==='España').length*5;
  if(state.project==='rebuild') score += (avg(active.map(p=>p.age))<26?20:0) + active.filter(p=>p.age<=23).length*2;
  if(state.project==='champions') score += (a.overall||0)*2.2 - (a.complete?0:20);
  return Math.round(clamp(score,0,100));
}
function fitsSlot(p, slot){
  if(!slot) return true;
  if(p.position===slot.label || p.secondary?.includes(slot.label)) return true;
  const accepted = POS_GROUPS[slot.group] || [];
  return accepted.includes(p.position) || p.secondary?.some(s => accepted.includes(s));
}
function renderNeedsHighlights(){ }
function suggestByNeeds(){
  switchTab('market');
  const needs = detectNeedPositions();
  if(needs[0]) els.marketPosition.value = needs[0];
  els.marketDifficulty.value = 'all'; els.marketAge.value = needs.includes('MCD') ? 29 : 27; els.marketValue.value = '';
  renderMarket();
  toast(`Sugerencias filtradas por necesidad: ${needs.join(', ') || 'talento general'}`);
}
function detectNeedPositions(){
  const active=activePlayers(); const count = pos => active.filter(p=>p.position===pos||p.secondary.includes(pos)).length;
  const needs=[]; if(count('MCD')<2) needs.push('MCD'); if(count('DFC')<5) needs.push('DFC'); if(count('LI')<2) needs.push('LI'); if(count('LD')<2) needs.push('LD'); if(count('DC')<2) needs.push('DC'); return needs;
}

function renderHistory(){
  els.historyList.innerHTML = state.history.length ? state.history.slice().reverse().map(h=>`<div class="history-item"><b class="type-${h.type}">${typeLabel(h.type)}</b><span>${escapeHtml(h.text)}</span><b>${fmtMoney(h.amount)}</b></div>`).join('') : empty('Aún no hay operaciones.');
}
function pushHistory(type,text,amount,meta={}){ state.history.push({id:crypto.randomUUID?.() || String(Date.now()+Math.random()), type, text, amount, meta, at:new Date().toISOString()}); if(state.history.length>120) state.history.shift(); }
function undoLast(){
  const h=state.history.pop(); if(!h) return;
  if(h.type==='buy'){ state.signed = state.signed.filter(id=>id!==h.meta?.playerId); Object.keys(state.lineup).forEach(slot=>{if(state.lineup[slot]===h.meta?.playerId) delete state.lineup[slot];}); }
  if(h.type==='sale'){ state.sold = state.sold.filter(id=>id!==h.meta?.playerId); }
  saveAndRender(); toast('Última operación deshecha.');
}
function typeLabel(t){ return ({buy:'Compra',sale:'Venta',once:'Once',event:'Evento'}[t] || t); }

function applySuggestedXI(){
  const slots = data.formations[state.formation] || [];
  const candidates = activePlayers().slice().sort((a,b)=> b.rating - a.rating || b.potential-a.potential);
  const used = new Set(); const next = {};
  for(const slot of slots){
    let best = candidates.find(p => !used.has(p.id) && fitsSlot(p, slot));
    if(!best) best = candidates.find(p => !used.has(p.id));
    if(best){ next[slot.id]=best.id; used.add(best.id); }
  }
  state.lineup = next; pushHistory('once',`XI sugerido para ${state.formation}`,0); saveAndRender();
}

function renderSeason(){
  state.season.year = '2026/27';
  els.seasonBadge.textContent = `${state.season.year} · ${state.season.window}`;
  els.seasonLog.innerHTML = state.events.length ? state.events.slice().reverse().map(e=>`<div class="note ${e.type||''}"><b>${escapeHtml(e.title)}</b><br>${escapeHtml(e.text)}</div>`).join('') : empty('Sin eventos todavía. Esta sección simula únicamente escenarios de mercado dentro de 2026/27.');
  const active=activePlayers(); const f=computeFinance();
  const stats=[['Valor base plantilla',fmtMoney(sum(active.map(p=>p.value)))],['Edad media',avg(active.map(p=>p.age)).toFixed(1)],['Media plantilla',avg(active.map(p=>p.rating)).toFixed(1)],['Masa salarial',fmtMoney(f.salaryNow)],['Diferencial negociado',fmtMoney(f.negotiationDelta)],['Españoles',active.filter(p=>p.nationality==='España').length]];
  els.compareStats.innerHTML = stats.map(([k,v])=>`<div class="finance-item"><span>${k}</span><b>${v}</b></div>`).join('');
}
function cycleSeasonPhase(){
  const order=['Planificación','Mercado de verano','Pretemporada','Plantilla cerrada','Mercado de invierno','Tramo final 26/27'];
  let idx=order.indexOf(state.season.window); idx=(idx+1)%order.length; state.season.window=order[idx]; state.season.year='2026/27'; state.season.tick++;
  generateSeasonEvent(); saveAndRender();
}
function agePlayersOneYear(){
  for(const p of activePlayers()){
    const custom = state.customPlayers[p.id] || {};
    let rating = custom.rating ?? p.rating; let value = custom.value ?? p.value;
    if(p.age<=23){ rating += 1; value = round5(value*1.08); }
    if(p.age>=31){ rating = Math.max(60, rating-1); value = round5(value*.85); }
    state.customPlayers[p.id] = {...custom, age:(custom.age??p.age)+1, rating, value};
  }
}
function generateSeasonEvent(){
  const active=activePlayers(); if(!active.length) return;
  const p = active[Math.floor(Math.random()*active.length)];
  const templates = [
    {type:'warn',title:'Oferta recibida',text:`Un club de la Premier pregunta por ${p.name}. Oferta orientativa: ${fmtMoney(estimateSellOffer(p))}.`},
    {type:'good',title:'Subida de valor',text:`${p.name} se revaloriza por buen rendimiento. +${fmtMoney(5)} de valor estimado.`},
    {type:'warn',title:'Rumor de mercado',text:`La prensa vincula al Madrid con ${randomMarketTarget().name} para la plantilla 26/27. Revísalo en Mercado Pro.`},
    {type:'bad',title:'Alerta física',text:`${p.name} arrastra molestias. Revisa profundidad de banquillo en su posición.`}
  ];
  const e = templates[Math.floor(Math.random()*templates.length)];
  state.events.push({...e, at:new Date().toISOString()});
  pushHistory('event', e.title, 0);
  saveAndRender();
}
function randomMarketTarget(){ const m=playersByStatus('market'); return m[Math.floor(Math.random()*m.length)] || getAllPlayers()[0]; }

function renderDataPreview(){
  const preview = {simulation: state, meta: data.meta, autoMarket: data.autoMarket, sources: data.sources, counts:{players:data.players.length, rumors:data.rumors.length, autoRumors:(data.rumors||[]).filter(r=>r.auto).length}};
  els.dataPreview.value = JSON.stringify(preview, null, 2);
}
function exportSimulationJson(){
  downloadJson(`${slug(state.simName || 'simulacion')}.json`, {simulation:state, exportedAt:new Date().toISOString()});
}
function importJson(e){
  const file=e.target.files?.[0]; if(!file) return;
  const reader=new FileReader();
  reader.onload=()=>{
    try{
      const js=JSON.parse(reader.result);
      if(js.players && js.formations){ data=js; state=createInitialState(); toast('data.json importado como nueva base temporal.'); }
      else if(js.simulation){ state=js.simulation; toast('Simulación importada.'); }
      else if(js.lineup || js.history){ state={...createInitialState(), ...js}; toast('Simulación importada.'); }
      ensureStateIntegrity(); fillStaticControls(); saveAndRender();
    }catch(err){ toast('JSON no válido.'); }
  };
  reader.readAsText(file);
}
function downloadJson(filename, obj){
  const blob = new Blob([JSON.stringify(obj,null,2)], {type:'application/json'}); const url=URL.createObjectURL(blob); const a=document.createElement('a'); a.href=url; a.download=filename; a.click(); URL.revokeObjectURL(url);
}

function saveNamedSimulation(){
  const sims = getSims();
  const id = state.id || crypto.randomUUID?.() || String(Date.now()); state.id=id;
  sims[id] = {name: state.simName || 'Simulación', updatedAt:new Date().toISOString(), state};
  localStorage.setItem(SIMS_KEY, JSON.stringify(sims)); saveState(); renderSavedSelect(); toast('Simulación guardada.');
}
function getSims(){ try { return JSON.parse(localStorage.getItem(SIMS_KEY)||'{}'); } catch { return {}; } }
function renderSavedSelect(){
  const sims=getSims(); const entries=Object.entries(sims).sort((a,b)=>new Date(b[1].updatedAt)-new Date(a[1].updatedAt));
  els.savedSelect.innerHTML = entries.length ? entries.map(([id,s])=>`<option value="${id}">${escapeHtml(s.name)} · ${new Date(s.updatedAt).toLocaleDateString()}</option>`).join('') : '<option value="">Sin guardados</option>';
}
function loadNamedSimulation(){ const id=els.savedSelect.value; const sim=getSims()[id]; if(sim){ state=sim.state; ensureStateIntegrity(); fillStaticControls(); saveAndRender(); toast('Simulación cargada.'); } }
function duplicateSimulation(){ state={...JSON.parse(JSON.stringify(state)), id:null, simName:(state.simName||'Simulación')+' copia'}; saveNamedSimulation(); fillStaticControls(); saveAndRender(); }

async function shareSite(){
  const url = location.href.split('?')[0];
  const text = `Mi plantilla Real Madrid 26/27: balance ${fmtMoney(computeFinance().balance)} y nota XI ${computeAnalysis().overall?.toFixed(1) || '—'}/10`;
  if(navigator.share){ try{ await navigator.share({title:'Madrid President Simulator 2.2', text, url}); return; }catch{} }
  await navigator.clipboard?.writeText(`${text}\n${url}`); toast('Enlace copiado al portapapeles.');
}
function exportLineupPng(){
  const canvas=document.createElement('canvas'); canvas.width=1400; canvas.height=1800; const ctx=canvas.getContext('2d');
  const grad=ctx.createLinearGradient(0,0,1400,1800); grad.addColorStop(0,'#080b14'); grad.addColorStop(.55,'#123d25'); grad.addColorStop(1,'#05070d'); ctx.fillStyle=grad; ctx.fillRect(0,0,1400,1800);
  ctx.strokeStyle='rgba(255,255,255,.35)'; ctx.lineWidth=4; roundRect(ctx,80,230,1240,1280,34,true); ctx.beginPath(); ctx.moveTo(80,870); ctx.lineTo(1320,870); ctx.stroke(); ctx.beginPath(); ctx.arc(700,870,140,0,Math.PI*2); ctx.stroke();
  ctx.fillStyle='#f3d98b'; ctx.font='900 64px system-ui'; ctx.fillText('Madrid President Simulator 2.2',80,110); ctx.fillStyle='#fff'; ctx.font='700 34px system-ui'; ctx.fillText(`${state.simName || 'Proyecto'} · ${state.formation} · Balance ${fmtMoney(computeFinance().balance)}`,80,165);
  const slots=data.formations[state.formation]||[];
  for(const slot of slots){ const p=getPlayer(state.lineup[slot.id]); const x=80 + slot.x/100*1240; const y=230 + slot.y/100*1280; ctx.fillStyle='rgba(5,7,13,.82)'; roundRect(ctx,x-95,y-42,190,84,18,true); ctx.strokeStyle='rgba(243,217,139,.45)'; roundRect(ctx,x-95,y-42,190,84,18,false); ctx.fillStyle='#f3d98b'; ctx.font='900 22px system-ui'; ctx.textAlign='center'; ctx.fillText(slot.label,x,y-8); ctx.fillStyle='#fff'; ctx.font='800 24px system-ui'; ctx.fillText(p?shortName(p.name):'—',x,y+22); }
  ctx.textAlign='left'; ctx.fillStyle='rgba(255,255,255,.72)'; ctx.font='500 24px system-ui'; ctx.fillText('Proyecto fan no oficial · No afiliado a Real Madrid ni Transfermarkt',80,1690);
  const a=document.createElement('a'); a.href=canvas.toDataURL('image/png'); a.download=`${slug(state.simName || 'once')}.png`; a.click();
}
function roundRect(ctx,x,y,w,h,r,fill){ ctx.beginPath(); ctx.moveTo(x+r,y); ctx.arcTo(x+w,y,x+w,y+h,r); ctx.arcTo(x+w,y+h,x,y+h,r); ctx.arcTo(x,y+h,x,y,r); ctx.arcTo(x,y,x+w,y,r); ctx.closePath(); fill?ctx.fill():ctx.stroke(); }


function formatAutoDate(value){
  if(!value) return 'pendiente';
  if(String(value).includes('pendiente')) return 'pendiente';
  const d = new Date(value);
  if(Number.isNaN(d.getTime())) return String(value);
  return d.toLocaleString('es-ES', {day:'2-digit', month:'2-digit', hour:'2-digit', minute:'2-digit'});
}

function fallbackData(){
  return {meta:{appName:'Madrid President Simulator 2.2',lastManualReview:'sin data.json'},players:[],rumors:[],formations:{'4-3-3':[]},projects:{champions:{name:'Proyecto Champions',description:''}},sources:[]};
}
function fmtMoney(n){ n=Number(n||0); const sign=n<0?'-':''; return `${sign}${Math.abs(n).toLocaleString('es-ES',{maximumFractionDigits:0})} M€`; }
function sum(arr){ return arr.reduce((a,b)=>a+Number(b||0),0); } function avg(arr){ const f=arr.filter(n=>Number.isFinite(Number(n))); return f.length?sum(f)/f.length:0; }
function clamp(n,min,max){ return Math.max(min, Math.min(max,n)); }
function uniqueBy(arr,fn){ const seen=new Set(); return arr.filter(x=>{const k=fn(x); if(seen.has(k)) return false; seen.add(k); return true;}); }
function norm(s){ return String(s||'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase(); }
function escapeHtml(s){ return String(s??'').replace(/[&<>"]/g, c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c])); }
function escapeAttr(s){ return escapeHtml(s).replace(/'/g,'&#39;'); }
function shortName(name){ const parts=String(name).split(' '); if(parts.length<=2) return name; return `${parts[0]} ${parts[parts.length-1]}`; }
function getInitials(name){ return String(name).split(/\s+/).filter(Boolean).slice(0,2).map(x=>x[0]).join('').toUpperCase(); }
function empty(text){ return `<div class="note">${escapeHtml(text)}</div>`; }
function capitalize(s){ return String(s).charAt(0).toUpperCase()+String(s).slice(1); }
function slug(s){ return norm(s).replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'') || 'madrid-president'; }
function toast(msg){ els.toast.textContent=msg; els.toast.classList.add('show'); clearTimeout(toast._t); toast._t=setTimeout(()=>els.toast.classList.remove('show'),3200); }
