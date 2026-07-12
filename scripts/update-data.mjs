import fs from 'node:fs/promises';
import crypto from 'node:crypto';

const DATA_PATH = new URL('../data.json', import.meta.url);

const DEFAULT_FEEDS = [
  {
    name: 'Google News · Real Madrid fichajes',
    type: 'rss',
    url: 'https://news.google.com/rss/search?q=Real%20Madrid%20fichajes%20rumores%20mercado%20OR%20traspaso&hl=es&gl=ES&ceid=ES:es',
    weight: 10
  },
  {
    name: 'Google News · Real Madrid transfers',
    type: 'rss',
    url: 'https://news.google.com/rss/search?q=Real%20Madrid%20transfer%20rumours%20target%20signing&hl=en-US&gl=US&ceid=US:en',
    weight: 10
  },
  {
    name: 'Google News · Fabrizio + Real Madrid',
    type: 'rss',
    url: 'https://news.google.com/rss/search?q=Fabrizio%20Romano%20Real%20Madrid%20transfer%20OR%20signing&hl=en-US&gl=US&ceid=US:en',
    weight: 18
  },
  {
    name: 'Bing News · Real Madrid transfer',
    type: 'rss',
    url: 'https://www.bing.com/news/search?q=Real+Madrid+transfer+rumours+Fabrizio+Romano&format=rss',
    weight: 8
  }
];

const POSITIONS = ['POR','DFC','LI','LD','CAI','CAD','MCD','MC','MCO','MI','MD','EI','ED','DC'];
const MAX_AUTO_RUMORS = 42;
const AUTO_RUMOR_MAX_AGE_DAYS = 18;

async function main(){
  const raw = await fs.readFile(DATA_PATH, 'utf8');
  const data = JSON.parse(raw);
  const now = new Date();
  const nowIso = now.toISOString();

  const feeds = data.autoMarket?.feeds?.length ? data.autoMarket.feeds : DEFAULT_FEEDS;
  const articles = await collectArticles(feeds);
  const xPosts = await collectXPostsIfConfigured();
  const allItems = [...articles, ...xPosts];

  const detections = detectRumors(allItems, data, nowIso);
  mergeDetections(data, detections, now);

  data.meta = data.meta || {};
  data.meta.version = '2.1.0-auto-market';
  data.meta.lastAutoUpdate = nowIso;
  data.meta.lastAutomationCheck = nowIso;
  data.meta.automationNote = 'AutoMarket actualiza rumores desde RSS/noticias públicas. X/Fabrizio se usa solo si configuras X_BEARER_TOKEN en GitHub Secrets.';
  data.meta.autoMarket = {
    enabled: true,
    lastRun: nowIso,
    feedCount: feeds.length,
    articlesFetched: allItems.length,
    detections: detections.length,
    autoRumors: (data.rumors || []).filter(r => r.auto).length,
    strategy: 'RSS gratuito + coincidencia con mercado interno + detección conservadora de nombres; sin scraping masivo de Transfermarkt.'
  };

  data.sources = mergeSources(data.sources || [], feeds.map(f => ({
    name: f.name,
    url: f.url,
    purpose: 'AutoMarket: detección automática de rumores desde titulares/noticias públicas'
  })));

  await fs.writeFile(DATA_PATH, JSON.stringify(data, null, 2) + '\n', 'utf8');
  console.log(`AutoMarket OK: ${allItems.length} items, ${detections.length} detections, ${(data.rumors || []).filter(r => r.auto).length} auto-rumors.`);
}

async function collectArticles(feeds){
  const out = [];
  for(const feed of feeds){
    try{
      const controller = new AbortController();
      const timer = setTimeout(() => controller.abort(), 12000);
      const res = await fetch(feed.url, {
        signal: controller.signal,
        headers: {
          'User-Agent': 'MadridPresidentSimulatorAutoMarket/2.1 (+https://github.com/)'
        }
      });
      clearTimeout(timer);
      if(!res.ok) throw new Error(`${res.status} ${res.statusText}`);
      const xml = await res.text();
      const items = parseRss(xml).map(item => ({...item, feedName: feed.name, feedWeight: feed.weight || 0}));
      out.push(...items);
      console.log(`${feed.name}: ${items.length} items`);
    }catch(err){
      console.warn(`Feed skipped: ${feed.name}: ${err.message}`);
    }
  }
  return dedupeArticles(out).slice(0, 120);
}

async function collectXPostsIfConfigured(){
  const token = process.env.X_BEARER_TOKEN;
  const username = process.env.X_USERNAME || 'FabrizioRomano';
  if(!token) return [];
  try{
    const userRes = await fetch(`https://api.x.com/2/users/by/username/${encodeURIComponent(username)}`, {
      headers: {Authorization: `Bearer ${token}`}
    });
    if(!userRes.ok) throw new Error(`X user lookup ${userRes.status}`);
    const user = await userRes.json();
    const id = user?.data?.id;
    if(!id) throw new Error('X user id not found');
    const tweetsRes = await fetch(`https://api.x.com/2/users/${id}/tweets?max_results=20&tweet.fields=created_at,entities&exclude=retweets,replies`, {
      headers: {Authorization: `Bearer ${token}`}
    });
    if(!tweetsRes.ok) throw new Error(`X tweets ${tweetsRes.status}`);
    const tweets = await tweetsRes.json();
    return (tweets.data || [])
      .filter(t => /real madrid|madrid|los blancos/i.test(t.text || ''))
      .map(t => ({
        title: cleanText(t.text).slice(0, 240),
        link: `https://x.com/${username}/status/${t.id}`,
        pubDate: t.created_at,
        feedName: `X · ${username}`,
        feedWeight: 28,
        fromX: true
      }));
  }catch(err){
    console.warn(`X skipped: ${err.message}`);
    return [];
  }
}

function parseRss(xml){
  const blocks = [...xml.matchAll(/<item\b[\s\S]*?<\/item>/gi)].map(m=>m[0]);
  const entries = blocks.length ? blocks : [...xml.matchAll(/<entry\b[\s\S]*?<\/entry>/gi)].map(m=>m[0]);
  return entries.map(block => {
    const title = htmlDecode(stripCdata(tag(block, 'title')));
    let link = htmlDecode(stripCdata(tag(block, 'link')));
    const href = block.match(/<link[^>]+href=["']([^"']+)["']/i)?.[1];
    if(href) link = htmlDecode(href);
    const pubDate = htmlDecode(stripCdata(tag(block, 'pubDate') || tag(block, 'published') || tag(block, 'updated')));
    const source = htmlDecode(stripCdata(tag(block, 'source')));
    return {title: cleanText(title), link, pubDate, source};
  }).filter(x => x.title);
}

function tag(block, name){
  return block.match(new RegExp(`<${name}[^>]*>([\\s\\S]*?)<\\/${name}>`, 'i'))?.[1] || '';
}
function stripCdata(s){ return String(s || '').replace(/^<!\[CDATA\[/, '').replace(/\]\]>$/, ''); }
function htmlDecode(s){
  return String(s || '')
    .replace(/&amp;/g,'&').replace(/&quot;/g,'"').replace(/&#39;/g,"'")
    .replace(/&apos;/g,"'").replace(/&lt;/g,'<').replace(/&gt;/g,'>')
    .replace(/&#(\d+);/g, (_,n)=>String.fromCharCode(Number(n)));
}
function cleanText(s){ return String(s || '').replace(/<[^>]+>/g,' ').replace(/\s+/g,' ').trim(); }
function norm(s){ return String(s || '').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase(); }
function slugify(s){ return norm(s).replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'').slice(0,60); }

function dedupeArticles(items){
  const seen = new Set();
  const out = [];
  for(const item of items){
    const key = norm(item.title).replace(/\W+/g,' ').trim().slice(0,140);
    if(seen.has(key)) continue;
    seen.add(key);
    out.push(item);
  }
  return out;
}

function detectRumors(items, data, nowIso){
  const players = data.players || [];
  const known = players.map(p => ({...p, aliases: buildAliases(p)}));
  const detections = [];

  for(const item of items){
    const full = `${item.title} ${item.source || ''}`;
    const normalized = norm(full);
    if(!isMadridMarketText(normalized)) continue;

    const matched = [];
    for(const p of known){
      if(p.status === 'former') continue;
      if(p.aliases.some(a => a.length >= 4 && normalized.includes(a))){
        matched.push(p);
      }
    }

    if(matched.length){
      for(const p of matched.slice(0, 4)){
        detections.push(buildDetectionForPlayer(p, item, nowIso));
      }
      continue;
    }

    const guessedName = guessUnknownPlayerName(item.title);
    if(guessedName){
      const player = ensureAutoPlayer(data, guessedName, item);
      detections.push(buildDetectionForPlayer(player, item, nowIso, true));
    }
  }

  return uniqueDetections(detections);
}

function isMadridMarketText(t){
  const madrid = /real madrid|los blancos|madrid/.test(t);
  const market = /transfer|fichaje|fichajes|mercado|rumor|rumour|target|interes|interested|linked|signing|deal|negoci|traspas|salida|exit|move|offer|bid|here we go|acuerdo|agreement|precio|clausula/.test(t);
  return madrid && market;
}

function buildAliases(p){
  const parts = [p.name, ...(p.aliases || [])];
  const chunks = String(p.name || '').split(/\s+/);
  if(chunks.length >= 2){
    parts.push(`${chunks[0]} ${chunks[chunks.length-1]}`);
    parts.push(chunks[chunks.length-1]);
  }
  return [...new Set(parts.map(norm).filter(Boolean))];
}

function buildDetectionForPlayer(player, item, nowIso, guessed=false){
  const status = classifyStatus(item.title);
  const confidence = scoreConfidence(item, status, player, guessed);
  const note = guessed
    ? `Detectado automáticamente como posible nombre de mercado. Titular: ${item.title}`
    : `Detectado automáticamente en noticias recientes. Titular: ${item.title}`;
  return {
    id: `auto-${player.id}`,
    playerId: player.id,
    status,
    confidence,
    source: item.feedName || item.source || 'AutoMarket',
    sourceUrl: item.link || '',
    note: note.slice(0, 360),
    auto: true,
    updatedAt: nowIso,
    detectedFrom: item.fromX ? 'x-api' : 'rss-news',
    headlineHash: hash(item.title)
  };
}

function classifyStatus(title){
  const t = norm(title);
  if(/here we go|official|oficial|completed|done deal|agreement|acuerdo|closed|cerrado|signs|ficha por|ha fichado/.test(t)) return 'Muy avanzado';
  if(/talks|negotiat|negocia|negociacion|bid|offer|oferta|contacts|contactos/.test(t)) return 'Negociación';
  if(/reject|rules out|unlikely|descarta|descartado|no ira|no va|denied|desmiente/.test(t)) return 'Descartado';
  if(/interested|target|linked|eye|want|wants|plot|priorit|interes|sigue|quiere|objetivo/.test(t)) return 'Interés';
  if(/exit|salida|sale|sell|leave|leaving|se va|vende/.test(t)) return 'Posible salida';
  return 'Rumor';
}

function scoreConfidence(item, status, player, guessed){
  let score = 34 + (item.feedWeight || 0);
  const t = norm(`${item.title} ${item.feedName || ''}`);
  if(/fabrizio|romano|here we go/.test(t)) score += 16;
  if(status === 'Muy avanzado') score += 22;
  if(status === 'Negociación') score += 12;
  if(status === 'Interés') score += 7;
  if(status === 'Descartado') score -= 10;
  if(player.status === 'squad') score -= 8;
  if(guessed) score -= 12;
  if(/report|according|segun|fuentes/.test(t)) score += 4;
  return Math.max(12, Math.min(91, Math.round(score)));
}

function guessUnknownPlayerName(title){
  const cleaned = cleanText(title).replace(/ - .+$/, '');
  const patterns = [
    /Real Madrid (?:target|eye|want|plot move for|interested in|linked with|make move for|considering|set sights on) ([A-ZÀ-Ý][A-Za-zÀ-ÿ'’-]+(?:\s+[A-ZÀ-Ý][A-Za-zÀ-ÿ'’-]+){0,3})/,
    /([A-ZÀ-Ý][A-Za-zÀ-ÿ'’-]+(?:\s+[A-ZÀ-Ý][A-Za-zÀ-ÿ'’-]+){1,3}) (?:to|for) Real Madrid/,
    /Real Madrid (?:se interesa por|quiere|sigue a|va a por|pregunta por|negocia por) ([A-ZÁÉÍÓÚÑ][A-Za-zÁÉÍÓÚÑáéíóúñ'’-]+(?:\s+[A-ZÁÉÍÓÚÑ][A-Za-zÁÉÍÓÚÑáéíóúñ'’-]+){0,3})/,
    /([A-ZÁÉÍÓÚÑ][A-Za-zÁÉÍÓÚÑáéíóúñ'’-]+(?:\s+[A-ZÁÉÍÓÚÑ][A-Za-zÁÉÍÓÚÑáéíóúñ'’-]+){1,3}) (?:al|para el|por el) Real Madrid/
  ];
  for(const re of patterns){
    const m = cleaned.match(re);
    if(m?.[1]){
      const name = m[1].replace(/\b(Transfer|Rumour|Rumor|Target|Deal|Star|Ace|Wonderkid|Agreement|Fichaje|Mercado|Oferta|Objetivo)\b/gi,'').trim();
      if(isPlausibleName(name)) return name;
    }
  }
  return null;
}
function isPlausibleName(name){
  const bad = /Real Madrid|Manchester|Liverpool|Arsenal|Chelsea|Barcelona|PSG|Bayern|Juventus|Milan|Transfer|Rumor|Rumour|Fichaje/i;
  return name.length >= 5 && name.length <= 45 && !bad.test(name) && /\s/.test(name);
}

function ensureAutoPlayer(data, name, item){
  const existing = (data.players || []).find(p => norm(p.name) === norm(name));
  if(existing) return existing;
  const id = `auto-player-${slugify(name)}`;
  const player = {
    id,
    name,
    age: 24,
    position: inferPositionFromText(item.title),
    secondary: [],
    value: 35,
    salary: 5,
    club: 'Por confirmar',
    nationality: '—',
    role: 'Rumor detectado',
    status: 'market',
    potential: 84,
    rating: 80,
    foot: '—',
    wiki: name,
    tags: ['auto-rumor','mercado'],
    difficulty: 'media',
    source: 'AutoMarket',
    auto: true,
    createdAt: new Date().toISOString()
  };
  data.players.push(player);
  return player;
}

function inferPositionFromText(title){
  const t = norm(title);
  if(/goalkeeper|portero|keeper/.test(t)) return 'POR';
  if(/centre-back|center-back|central|defender|defensa/.test(t)) return 'DFC';
  if(/left-back|lateral izquierdo|cucurella/.test(t)) return 'LI';
  if(/right-back|lateral derecho|full-back/.test(t)) return 'LD';
  if(/defensive midfielder|pivote|mediocentro defensivo/.test(t)) return 'MCD';
  if(/midfielder|centrocampista|interior/.test(t)) return 'MC';
  if(/winger|extremo/.test(t)) return 'EI';
  if(/striker|forward|delantero|nueve/.test(t)) return 'DC';
  return 'MCO';
}

function uniqueDetections(detections){
  const byPlayer = new Map();
  for(const d of detections){
    const prev = byPlayer.get(d.playerId);
    if(!prev || d.confidence > prev.confidence) byPlayer.set(d.playerId, d);
  }
  return [...byPlayer.values()].sort((a,b)=>b.confidence-a.confidence);
}

function mergeDetections(data, detections, now){
  data.rumors = data.rumors || [];
  const cutoff = now.getTime() - AUTO_RUMOR_MAX_AGE_DAYS * 24 * 60 * 60 * 1000;
  data.rumors = data.rumors.filter(r => {
    if(!r.auto) return true;
    const t = Date.parse(r.updatedAt || r.createdAt || 0);
    return Number.isFinite(t) && t >= cutoff;
  });
  const map = new Map(data.rumors.map(r => [r.id, r]));
  for(const det of detections){
    const existing = map.get(det.id);
    if(existing){
      Object.assign(existing, {
        status: det.status,
        confidence: Math.max(existing.confidence || 0, det.confidence),
        source: det.source,
        sourceUrl: det.sourceUrl,
        note: det.note,
        auto: true,
        updatedAt: det.updatedAt,
        detectedFrom: det.detectedFrom,
        headlineHash: det.headlineHash
      });
    }else{
      data.rumors.push(det);
    }
  }
  const manual = data.rumors.filter(r => !r.auto);
  const auto = data.rumors.filter(r => r.auto).sort((a,b)=>(b.confidence||0)-(a.confidence||0)).slice(0, MAX_AUTO_RUMORS);
  data.rumors = [...manual, ...auto];
}

function mergeSources(existing, additions){
  const byUrl = new Map(existing.map(s => [s.url, s]));
  for(const src of additions){ if(!byUrl.has(src.url)) byUrl.set(src.url, src); }
  return [...byUrl.values()];
}

function hash(s){ return crypto.createHash('sha1').update(String(s || '')).digest('hex').slice(0, 12); }

main().catch(err => { console.error(err); process.exit(1); });
