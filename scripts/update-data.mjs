import fs from 'node:fs/promises';

const DATA_PATH = new URL('../data.json', import.meta.url);

const DEFAULT_FEEDS = [
  ['Google News · Real Madrid fichajes', 'https://news.google.com/rss/search?q=Real%20Madrid%20fichajes%20rumores%20mercado%202026%202027&hl=es&gl=ES&ceid=ES:es', 12],
  ['Google News · Real Madrid transfer rumours', 'https://news.google.com/rss/search?q=Real%20Madrid%20transfer%20rumours%20target%20signing%202026%202027&hl=en-US&gl=US&ceid=US:en', 12],
  ['Google News · Fabrizio + Real Madrid', 'https://news.google.com/rss/search?q=Fabrizio%20Romano%20Real%20Madrid%20transfer%20signing%20target&hl=en-US&gl=US&ceid=US:en', 22],
  ['Google News · Marca fichajes Madrid', 'https://news.google.com/rss/search?q=site%3Amarca.com%20Real%20Madrid%20fichajes%20mercado&hl=es&gl=ES&ceid=ES:es', 10],
  ['Google News · AS fichajes Madrid', 'https://news.google.com/rss/search?q=site%3Aas.com%20Real%20Madrid%20fichajes%20mercado&hl=es&gl=ES&ceid=ES:es', 10],
  ['Google News · Relevo Real Madrid', 'https://news.google.com/rss/search?q=site%3Arelevo.com%20Real%20Madrid%20fichajes%20rumor&hl=es&gl=ES&ceid=ES:es', 10],
  ['Google News · The Athletic Real Madrid transfers', 'https://news.google.com/rss/search?q=site%3Atheathletic.com%20Real%20Madrid%20transfer%20target&hl=en-US&gl=US&ceid=US:en', 10],
  ['Bing News · Real Madrid transfer', 'https://www.bing.com/news/search?q=Real+Madrid+transfer+rumours+Fabrizio+Romano&format=rss', 8]
].map(([name,url,weight])=>({name,url,weight,type:'rss'}));

const MAX_AUTO_RUMORS = 80;
const AUTO_RUMOR_MAX_AGE_DAYS = 24;
const POSITIONS = ['POR','DFC','LI','LD','CAI','CAD','MCD','MC','MCO','MI','MD','EI','ED','DC'];

async function main(){
  const data = JSON.parse(await fs.readFile(DATA_PATH, 'utf8'));
  const now = new Date();
  const nowIso = now.toISOString();
  const feeds = data.autoMarket?.feeds?.length ? data.autoMarket.feeds : DEFAULT_FEEDS;
  const articles = await collectArticles(feeds);
  const xPosts = await collectXPostsIfConfigured();
  const allItems = [...articles, ...xPosts];
  const detections = detectRumors(allItems, data, nowIso);
  mergeDetections(data, detections, now);
  data.meta = data.meta || {};
  data.meta.version = '4.0.0-autoscout-pro';
  data.meta.lastAutoUpdate = nowIso;
  data.meta.lastAutomationCheck = nowIso;
  data.meta.automationNote = 'AutoScout Pro usa RSS/noticias públicas para actualizar rumores y crear candidatos fichables. No hace scraping de Transfermarkt.';
  data.meta.autoMarket = {
    enabled:true, name:'AutoScout Pro', lastRun:nowIso, feedCount:feeds.length,
    articlesFetched:allItems.length, detections:detections.length,
    autoRumors:(data.rumors||[]).filter(r=>r.auto).length,
    autoPlayers:(data.players||[]).filter(p=>String(p.source||'').includes('AutoScout')).length,
    strategy:'RSS/noticias deportivas + catálogo interno ampliado + creación automática conservadora de candidatos.'
  };
  data.meta.autoScoutPro = {...(data.meta.autoScoutPro||{}), enabled:true, totalPlayers:data.players.length, marketPlayers:data.players.filter(p=>p.status==='market').length, lastRun:nowIso};
  data.sources = mergeSources(data.sources||[], feeds.map(f=>({name:f.name,url:f.url,purpose:'AutoScout Pro: detección automática de rumores desde titulares/noticias públicas'})));
  await fs.writeFile(DATA_PATH, JSON.stringify(data,null,2)+'\n','utf8');
  console.log(`AutoScout Pro OK: ${allItems.length} items, ${detections.length} detections, ${data.players.length} players.`);
}

async function collectArticles(feeds){
  const out=[];
  for(const feed of feeds){
    try{
      const controller=new AbortController(); const timer=setTimeout(()=>controller.abort(),14000);
      const res=await fetch(feed.url,{signal:controller.signal,headers:{'User-Agent':'MadridPresidentSimulatorAutoScout/4.0'}});
      clearTimeout(timer); if(!res.ok) throw new Error(`${res.status} ${res.statusText}`);
      const xml=await res.text();
      const items=parseRss(xml).map(x=>({...x,feedName:feed.name,feedWeight:feed.weight||0}));
      out.push(...items); console.log(`${feed.name}: ${items.length}`);
    }catch(err){ console.warn(`Feed skipped ${feed.name}: ${err.message}`); }
  }
  return dedupeArticles(out).slice(0,180);
}

async function collectXPostsIfConfigured(){
  const token=process.env.X_BEARER_TOKEN; const username=process.env.X_USERNAME||'FabrizioRomano';
  if(!token) return [];
  try{
    const u=await fetch(`https://api.x.com/2/users/by/username/${encodeURIComponent(username)}`,{headers:{Authorization:`Bearer ${token}`}});
    if(!u.ok) throw new Error(`X user ${u.status}`); const user=await u.json(); const id=user?.data?.id; if(!id) return [];
    const t=await fetch(`https://api.x.com/2/users/${id}/tweets?max_results=25&tweet.fields=created_at&exclude=retweets,replies`,{headers:{Authorization:`Bearer ${token}`}});
    if(!t.ok) throw new Error(`X tweets ${t.status}`); const tweets=await t.json();
    return (tweets.data||[]).filter(x=>/real madrid|madrid|los blancos/i.test(x.text||'')).map(x=>({title:cleanText(x.text).slice(0,260),link:`https://x.com/${username}/status/${x.id}`,pubDate:x.created_at,feedName:`X · ${username}`,feedWeight:28,fromX:true}));
  }catch(err){ console.warn(`X skipped: ${err.message}`); return []; }
}

function parseRss(xml){
  const blocks=[...xml.matchAll(/<item\b[\s\S]*?<\/item>/gi)].map(m=>m[0]);
  const entries=blocks.length?blocks:[...xml.matchAll(/<entry\b[\s\S]*?<\/entry>/gi)].map(m=>m[0]);
  return entries.map(block=>{
    const title=htmlDecode(stripCdata(tag(block,'title')));
    let link=htmlDecode(stripCdata(tag(block,'link')));
    const href=block.match(/<link[^>]+href=["']([^"']+)["']/i)?.[1]; if(href) link=htmlDecode(href);
    const pubDate=htmlDecode(stripCdata(tag(block,'pubDate')||tag(block,'published')||tag(block,'updated')));
    const source=htmlDecode(stripCdata(tag(block,'source')));
    const desc=htmlDecode(stripCdata(tag(block,'description')||tag(block,'summary')));
    return {title:cleanText(title),link,pubDate,source,description:cleanText(desc)};
  }).filter(x=>x.title);
}
function tag(block,name){return block.match(new RegExp(`<${name}[^>]*>([\\s\\S]*?)<\\/${name}>`,'i'))?.[1]||'';}
function stripCdata(s){return String(s||'').replace(/^<!\[CDATA\[/,'').replace(/\]\]>$/,'');}
function htmlDecode(s){return String(s||'').replace(/&amp;/g,'&').replace(/&quot;/g,'"').replace(/&#39;/g,"'").replace(/&apos;/g,"'").replace(/&lt;/g,'<').replace(/&gt;/g,'>').replace(/&#(\d+);/g,(_,n)=>String.fromCharCode(Number(n)));}
function cleanText(s){return String(s||'').replace(/<[^>]+>/g,' ').replace(/\s+/g,' ').trim();}
function norm(s){return String(s||'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase();}
function slugify(s){return norm(s).replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'').slice(0,62);}
function dedupeArticles(items){const seen=new Set(), out=[]; for(const it of items){const k=norm(it.title).replace(/\W+/g,' ').slice(0,150); if(seen.has(k)) continue; seen.add(k); out.push(it);} return out;}

function detectRumors(items,data,nowIso){
  const known=(data.players||[]).filter(p=>p.status!=='former').map(p=>({...p, aliases:buildAliases(p)}));
  const detections=[];
  for(const item of items){
    const full=`${item.title} ${item.description||''} ${item.source||''}`; const n=norm(full);
    if(!isMadridMarketText(n)) continue;
    const matched=[];
    for(const p of known){ if(p.aliases.some(a=>a.length>=4 && n.includes(a))) matched.push(p); }
    if(matched.length){ for(const p of matched.slice(0,5)) detections.push(buildDetection(p,item,nowIso)); continue; }
    const guessed=guessUnknownPlayerName(item.title);
    if(guessed){ const p=ensureAutoPlayer(data,guessed,item); known.push({...p,aliases:buildAliases(p)}); detections.push(buildDetection(p,item,nowIso,true)); }
  }
  return uniqueDetections(detections);
}
function isMadridMarketText(t){return /real madrid|los blancos|madrid/.test(t) && /transfer|fichaje|fichajes|mercado|rumor|rumour|target|interes|interested|linked|signing|deal|negoci|traspas|salida|exit|move|offer|bid|here we go|acuerdo|agreement|precio|clausula|mou|mourinho/.test(t);}
function buildAliases(p){
  const names=[p.name, ...(p.aliases||[])]; const chunks=String(p.name||'').split(/\s+/);
  if(chunks.length>=2){ names.push(`${chunks[0]} ${chunks[chunks.length-1]}`); names.push(chunks[chunks.length-1]); }
  if(p.id) names.push(p.id.replace(/-/g,' '));
  return [...new Set(names.map(norm).filter(x=>x.length>=4))];
}
function buildDetection(p,item,nowIso,created=false){
  const status=inferStatus(item.title+' '+(item.description||''));
  const confidence=scoreConfidence(item,status,created);
  return { id:`auto-${p.id}-${hash(item.title).slice(0,8)}`, playerId:p.id, status, confidence, source:item.feedName||item.source||'AutoScout', sourceUrl:item.link||'', sourceUrls:item.link?[item.link]:[], sourceCount:1, auto:true, createdByAutoScout:created, updatedAt:nowIso, lastTitle:item.title, note:buildNote(p,item,status,created)};
}
function inferStatus(text){const t=norm(text); if(/here we go|acuerdo|agreement|done deal|cerrado|oficial/.test(t)) return 'Muy avanzado'; if(/negoci|talks|offer|bid|contact|proposal/.test(t)) return 'Negociación'; if(/salida|exit|leave|sale|sell/.test(t)) return 'Posible salida'; if(/interes|interested|target|linked|radar|monitor/.test(t)) return 'Interés'; if(/descart|reject|no ira|unlikely/.test(t)) return 'Descartado'; return 'Rumor';}
function scoreConfidence(item,status,created){let s=25+(item.feedWeight||0); if(item.fromX) s+=18; if(status==='Muy avanzado') s+=30; if(status==='Negociación') s+=16; if(status==='Interés') s+=8; if(status==='Descartado') s-=8; if(created) s-=5; return Math.max(12,Math.min(92,s));}
function buildNote(p,item,status,created){const base=created?'AutoScout lo ha creado como candidato porque aparece vinculado al Madrid y no estaba en la base.':'Detectado en radar de medios deportivos.'; return `${base} Estado: ${status}. Último titular: ${item.title}`.slice(0,360);}
function guessUnknownPlayerName(title){
  const cleaned=String(title||'').replace(/Real Madrid|Madrid|Fabrizio Romano|transfer|rumour|rumor|fichaje|mercado|Mourinho/gi,' ');
  const m=cleaned.match(/\b([A-ZÁÉÍÓÚÑ][A-Za-zÁÉÍÓÚÜÑáéíóúüñ'’-]{2,}(?:\s+[A-ZÁÉÍÓÚÑ][A-Za-zÁÉÍÓÚÜÑáéíóúüñ'’-]{2,}){0,2})\b/);
  if(!m) return '';
  const name=m[1].trim();
  if(/Marca|AS|Relevo|The|Athletic|News|Google|Madrid|Real|Liga|Premier|Champions/.test(name)) return '';
  return name;
}
function ensureAutoPlayer(data,name,item){
  const n=norm(name); const found=(data.players||[]).find(p=>norm(p.name)===n); if(found) return found;
  const id=`autoscout-${slugify(name)}`; const player={id,name,age:24,position:'MC',secondary:[],value:40,salary:3.5,club:'Por confirmar',nationality:'Por confirmar',role:'Candidato AutoScout',status:'market',potential:85,rating:80,foot:'Derecho',wiki:name,tags:['autoscout','rumor','mercado-2627'],difficulty:'media',source:'AutoScout Pro · creado desde noticia',aliases:[name],photo:makeSvgData(name)};
  data.players.push(player); return player;
}
function makeSvgData(name){
  const init=name.split(/\s+/).filter(Boolean).map(x=>x[0]).slice(0,2).join('').toUpperCase()||'AS';
  const svg=`<svg xmlns="http://www.w3.org/2000/svg" width="512" height="512" viewBox="0 0 512 512"><defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#4527a0"/><stop offset="1" stop-color="#d6b25e"/></linearGradient></defs><rect width="512" height="512" rx="36" fill="#f8fafc"/><rect width="512" height="170" fill="url(#g)"/><circle cx="256" cy="216" r="88" fill="#e2e8f0"/><circle cx="256" cy="190" r="46" fill="#cbd5e1"/><path d="M168 302c18-42 57-66 88-66s70 24 88 66v28H168z" fill="#cbd5e1"/><text x="256" y="94" font-family="Arial" font-size="58" font-weight="800" text-anchor="middle" fill="#fff">${init}</text><text x="256" y="404" font-family="Arial" font-size="28" font-weight="800" text-anchor="middle" fill="#0f172a">${escapeXml(name).slice(0,24)}</text><text x="256" y="438" font-family="Arial" font-size="18" text-anchor="middle" fill="#475569">AutoScout Pro</text></svg>`;
  return 'data:image/svg+xml;charset=utf-8,'+encodeURIComponent(svg);
}
function escapeXml(s){return String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&apos;'}[c]));}
function hash(s){let h=2166136261; for(const ch of String(s)){h^=ch.charCodeAt(0); h=Math.imul(h,16777619);} return (h>>>0).toString(16);}
function uniqueDetections(ds){const m=new Map(); for(const d of ds){const key=`${d.playerId}-${norm(d.status)}`; const prev=m.get(key); if(!prev||d.confidence>prev.confidence)m.set(key,d);} return [...m.values()];}
function mergeDetections(data,detections,now){
  data.rumors=data.rumors||[]; const cutoff=now.getTime()-AUTO_RUMOR_MAX_AGE_DAYS*86400000;
  data.rumors=data.rumors.filter(r=>!r.auto || !r.updatedAt || new Date(r.updatedAt).getTime()>=cutoff);
  for(const d of detections){
    const ex=data.rumors.find(r=>r.auto&&r.playerId===d.playerId&&norm(r.status)===norm(d.status));
    if(ex){ ex.confidence=Math.min(96,Math.max(ex.confidence||0,d.confidence)+4); ex.updatedAt=d.updatedAt; ex.lastTitle=d.lastTitle; ex.note=d.note; ex.source=d.source; ex.sourceUrl=d.sourceUrl; ex.sourceUrls=[...new Set([...(ex.sourceUrls||[]), ...(d.sourceUrls||[])])].slice(0,5); ex.sourceCount=(ex.sourceCount||1)+1; }
    else data.rumors.push(d);
  }
  data.rumors=data.rumors.sort((a,b)=>(b.auto?1:0)-(a.auto?1:0)||(b.confidence||0)-(a.confidence||0)).slice(0,MAX_AUTO_RUMORS);
}
function mergeSources(old,add){const seen=new Set(old.map(s=>s.url)); for(const s of add){if(!seen.has(s.url)){old.push(s); seen.add(s.url);}} return old;}

main().catch(err=>{console.error(err); process.exitCode=1;});
