// Portal: a "sala" com o boneco do jogador olhando pra TV, que mostra o jogo escolhido.
// O boneco vem do perfil único (Firebase, mesmo login dos jogos). Mudou aqui, muda em todos.
const $ = id => document.getElementById(id);
const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

// o que o boneco fala de cada jogo, e o "efeitinho" que aparece do lado dele
const FALAS = {
  'forma-palavras': { reacao: 'brilho', frases: ['Caça-palavras? Eu acho a maior!', 'Aposto que acho mais palavras que você 😏', 'Três minutos… valendo!'] },
  'pe-na-tabua': { reacao: 'exclama', frases: ['Corrida? Me deixa dirigir!', 'Pé na tábua, sem freio!', 'Cuidado com o dragão na pista!'] },
  'torre-bamba': { reacao: 'exclama', frases: ['Essa balança! Quem derruba primeiro?', 'Devagar… devagar… CAIU!', 'Bora empilhar até o céu!'] },
  'palhetada': { reacao: 'nota', frases: ['Palhetada! Bora fazer combo?', 'Solta o som! 🎸', 'Eu sou a estrela desse palco!'] },
  'cripta-de-cristal': { reacao: 'brilho', frases: ['Uma aventura! Pega a espada!', 'Lá embaixo tem monstro…', 'Cripta de Cristal? Que corajosa a gente!'] },
};
const OCIOSO = ['Escolhe um jogo aí! 👇', 'Tô pronto pra jogar!', 'Qual vai ser hoje?'];
const REACOES = {
  brilho: '<svg viewBox="0 0 40 40" aria-hidden="true"><g fill="#ffd23f"><path d="M14 2 L17 11 L26 14 L17 17 L14 26 L11 17 L2 14 L11 11 Z"/><path d="M30 22 L32 27 L37 29 L32 31 L30 36 L28 31 L23 29 L28 27 Z"/></g></svg>',
  exclama: '<svg viewBox="0 0 40 40" aria-hidden="true"><circle cx="20" cy="20" r="15" fill="#ff3d8b" stroke="#1b1440" stroke-width="4"/><rect x="17.5" y="10" width="5" height="12" rx="2.5" fill="#fff"/><circle cx="20" cy="27.5" r="2.8" fill="#fff"/></svg>',
  nota: '<svg viewBox="0 0 40 40" aria-hidden="true"><path d="M12 6 L32 2 L32 26 A6 5 0 1 1 28 21.5 L28 10 L16 12.5 L16 30 A6 5 0 1 1 12 25.5 Z" fill="#9fe6ff" stroke="#1b1440" stroke-width="2"/></svg>',
  coracao: '<svg viewBox="0 0 40 40" aria-hidden="true"><path d="M20 35 C2 23 5 6 14 6 C18 6 20 10 20 10 C20 10 22 6 26 6 C35 6 38 23 20 35 Z" fill="#ff5f6d" stroke="#1b1440" stroke-width="3"/></svg>',
};

let AV = null, VIVO = null, perfil = { tag: '', look: null, xp: 0, ach: {} }, B = null;
let selecionado = null;

// ---------- o boneco ----------
function desenharBoneco() {
  const look = perfil.look || (AV ? AV.lookPadrao() : null);
  if (!perfil.look && look) perfil.look = look;
  const fundoCor = AV && look ? ((AV.CATALOGO.fundo.find(f => f.id === look.fundo) || {}).cor || '#e9e2ff') : '#e9e2ff';
  $('rosto').style.background = fundoCor;
  $('rostoSvg').innerHTML = AV && look ? AV.avatarSVG(look, 120, { semFundo: true }) : '';
  $('nomeChip').textContent = perfil.tag ? `${perfil.tag} · nv. ${AV ? AV.nivelDe(perfil.xp || 0) : 1}` : 'Crie seu boneco';
}
// pra onde ele olha: x (-1 esquerda … 1 direita), y (-1 cima … 1 baixo)
function olhar(x, y = 0) {
  const r = $('rostoSvg');
  r.style.transform = `translate(${x * 13}%, ${y * 9}%) rotate(${x * 13 - y * 3}deg)`;
}
let falaT = 0, reacaoT = 0;
function falar(txt, ms = 2600) {
  const b = $('balao');
  b.textContent = txt; b.hidden = false;
  b.classList.remove('pop'); void b.offsetWidth; b.classList.add('pop');
  if (VIVO) VIVO.falar(Math.min(ms - 400, 300 + txt.length * 45));
  clearTimeout(falaT); falaT = setTimeout(() => { b.hidden = true; }, ms);
}
function reagir(tipo) {
  const r = $('reacao');
  r.innerHTML = REACOES[tipo] || ''; r.hidden = false;
  r.classList.remove('pop'); void r.offsetWidth; r.classList.add('pop');
  clearTimeout(reacaoT); reacaoT = setTimeout(() => { r.hidden = true; }, 2400);
}
// parado: de vez em quando olha em volta
let ocioso = 0;
function olharEmVolta() {
  clearTimeout(ocioso);
  ocioso = setTimeout(() => {
    if (!selecionado || Math.random() < 0.35) {
      const alvos = [[-0.6, -0.2], [0.2, 0.4], [0.9, -0.1], [0, 0]];
      const [x, y] = alvos[Math.floor(Math.random() * alvos.length)];
      olhar(x, y);
      if (selecionado) setTimeout(() => olhar(1, -0.1), 1300);
    }
    olharEmVolta();
  }, 3500 + Math.random() * 4000);
}

// ---------- escolher um jogo ----------
function escolher(slug, { falando = true } = {}) {
  selecionado = slug;
  document.querySelectorAll('.jogo').forEach(a => a.classList.toggle('on', a.dataset.jogo === slug));
  const tile = document.querySelector(`.jogo[data-jogo="${slug}"]`);
  $('tvTela').innerHTML = tile.querySelector('.arte').innerHTML;
  $('tvNome').textContent = tile.dataset.nome;
  $('tvJogar').href = tile.getAttribute('href');
  $('tvJogar').setAttribute('aria-label', 'Jogar ' + tile.dataset.nome);
  $('tv').classList.remove('liga'); void $('tv').offsetWidth; $('tv').classList.add('liga');
  try { localStorage.setItem('hub_ultimo', slug); } catch {}
  if (!falando) { olhar(1, -0.1); return; }
  // olha pro jogo tocado (lá embaixo) e depois pra TV
  olhar(0.5, 1);
  setTimeout(() => {
    olhar(1, -0.1);
    const f = FALAS[slug] || { reacao: 'coracao', frases: ['Bora!'] };
    reagir(Math.random() < 0.2 ? 'coracao' : f.reacao);
    falar(f.frases[Math.floor(Math.random() * f.frases.length)]);
    $('boneco').classList.remove('pulinho'); void $('boneco').offsetWidth; $('boneco').classList.add('pulinho');
  }, 380);
}
document.querySelectorAll('.jogo').forEach(a => {
  a.addEventListener('click', e => {
    if (selecionado === a.dataset.jogo) return;     // segundo toque: entra no jogo
    e.preventDefault();
    escolher(a.dataset.jogo);
    if (document.querySelector('.sala').classList.contains('compacta')) $('tv').scrollIntoView({ block: 'nearest' });
  });
});

// a sala encolhe quando a lista rola
const sala = document.querySelector('.sala');
// (com folga entre abrir e fechar, e espaço extra embaixo pra página não "pular" quando a sala encolhe)
addEventListener('scroll', () => {
  const c = sala.classList.contains('compacta');
  if (!c && scrollY > 40) { sala.classList.add('compacta'); document.body.classList.add('rolou'); }
  else if (c && scrollY < 8) { sala.classList.remove('compacta'); document.body.classList.remove('rolou'); }
}, { passive: true });

// ---------- perfil (Firebase, o mesmo dos jogos) ----------
async function conectar() {
  const { firebaseConfig } = await import('/forma-palavras/js/config.js');
  const V = '11.0.2';
  const [{ initializeApp, getApps }, A, D] = await Promise.all([
    import(`https://www.gstatic.com/firebasejs/${V}/firebase-app.js`),
    import(`https://www.gstatic.com/firebasejs/${V}/firebase-auth.js`),
    import(`https://www.gstatic.com/firebasejs/${V}/firebase-database.js`),
  ]);
  const app = getApps().find(a => a.name === 'cacapalavras') || initializeApp(firebaseConfig, 'cacapalavras');
  const auth = A.getAuth(app), db = D.getDatabase(app);
  await auth.authStateReady();
  if (!auth.currentUser) await A.signInAnonymously(auth);
  const uid = auth.currentUser.uid, ref = p => D.ref(db, 'cacapalavras/' + p);
  return {
    ler: async () => (await D.get(ref('profiles/' + uid))).val(),
    salvar: d => D.update(ref('profiles/' + uid), d),
    async reservar(tag, antiga) {
      const k = tag.toLowerCase(), dono = (await D.get(ref('tags/' + k))).val();
      if (dono && dono !== uid) return false;
      await D.set(ref('tags/' + k), uid);
      if (antiga && antiga.toLowerCase() !== k && (await D.get(ref('tags/' + antiga.toLowerCase()))).val() === uid) await D.remove(ref('tags/' + antiga.toLowerCase())).catch(() => {});
      return true;
    },
  };
}
const LOCAL_K = 'hub_perfil';
async function salvarPerfil({ look, tag }) {
  if (B) {
    if (tag && tag !== perfil.tag && !(await B.reservar(tag, perfil.tag))) return 'Esse nome já tem dono 😬 Tenta outro';
    await B.salvar(tag ? { look, tag } : { look });
  }
  perfil = { ...perfil, look, tag: tag || perfil.tag };
  try { localStorage.setItem(LOCAL_K, JSON.stringify({ look: perfil.look, tag: perfil.tag })); } catch {}
  // o Forma Palavras guarda uma cópia no aparelho: atualiza pra ele já abrir com o boneco novo
  try { const k = 'cp_perfil2', p = JSON.parse(localStorage.getItem(k) || 'null'); if (p) localStorage.setItem(k, JSON.stringify({ ...p, look, ...(tag ? { tag } : {}) })); } catch {}
  return null;
}
async function personalizar() {
  let ed;
  try { ed = await import('/forma-palavras/js/boneco-editor.js'); } catch { ed = await import('./boneco-editor.js'); }
  const novo = await ed.abrirEditorBoneco({ perfil, salvar: salvarPerfil, pedirNome: !perfil.tag });
  if (novo) {
    desenharBoneco(); if (VIVO) VIVO.parar(); VIVO = vivoMod ? vivoMod.darVida($('rosto')) : null;
    olhar(0, 0); falar('Ficou bom, né? 😎'); reagir('coracao');
  }
}
$('btnPersonalizar').onclick = personalizar;
$('btnPersonalizar2').onclick = personalizar;
$('rosto').onclick = personalizar;

let vivoMod = null;
async function iniciar() {
  try { perfil = { ...perfil, ...JSON.parse(localStorage.getItem(LOCAL_K) || '{}') }; } catch {}
  try { AV = await import('/forma-palavras/js/avatar.js'); } catch { try { AV = await import('./avatar.js'); } catch { AV = null; } }
  try { vivoMod = await import('/forma-palavras/js/boneco-vivo.js'); } catch { try { vivoMod = await import('./boneco-vivo.js'); } catch {} }
  desenharBoneco();
  if (vivoMod) VIVO = vivoMod.darVida($('rosto'));
  let ultimo = 'palhetada';
  try { ultimo = localStorage.getItem('hub_ultimo') || ultimo; } catch {}
  if (!document.querySelector(`.jogo[data-jogo="${ultimo}"]`)) ultimo = document.querySelector('.jogo').dataset.jogo;
  escolher(ultimo, { falando: false });
  setTimeout(() => falar(perfil.tag ? `Oi, ${perfil.tag}! ${OCIOSO[Math.floor(Math.random() * OCIOSO.length)]}` : 'Oi! Toca em mim pra me deixar com a sua cara 👆', 3200), 700);
  olharEmVolta();
  try {
    B = await conectar();
    const p = await B.ler();
    if (p) { perfil = { ...perfil, ...p }; desenharBoneco(); }
  } catch (e) { console.warn('Portal sem conexão com o servidor (tudo bem: o boneco fica neste aparelho)', e); }
}
iniciar();
