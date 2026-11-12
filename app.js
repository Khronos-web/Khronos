const $ = id => document.getElementById(id);
const META = { // id: [категория, сложность 1-3, значок]
  python:['Универсальные',1,'Py'],javascript:['Веб',1,'JS'],typescript:['Веб',2,'TS'],java:['Универсальные',2,'Jv'],
  csharp:['Универсальные',2,'C#'],go:['Системные',2,'Go'],rust:['Системные',3,'Rs'],cpp:['Системные',3,'C++'],
  php:['Веб',1,'PHP'],kotlin:['Мобильные',2,'Kt'],swift:['Мобильные',2,'Sw'],dart:['Мобильные',2,'Da'],
  ruby:['Скрипты',1,'Rb'],sql:['Данные',1,'SQL'],bash:['Скрипты',1,'sh'],lua:['Скрипты',1,'Lua'],
  r:['Данные',2,'R'],haskell:['Универсальные',3,'λ'],elixir:['Универсальные',3,'Ex'],html:['Веб',1,'</>']
};
const LEVEL = ['', 'Легко', 'Средне', 'Сложно'];
const CATS = ['Все', ...new Set(Object.values(META).map(m => m[0]))];
const esc = s => s.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
const hi = s => esc(s)
  .replace(/"(?:[^"\n])*"/g, m => `<span class="s">${m}</span>`)
  .replace(/^(\s*(?:\/\/|#(?!include)|--).*)$/gm, '<span class="c">$1</span>');
const store = {
  get(k, d) { try { return JSON.parse(localStorage.getItem(k)) ?? d; } catch { return d; } },
  set(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch {} }
};
let done = store.get('cp-done', {}), cat = 'Все', lang, lesson = 0;
const doneCount = l => (done[l.id] || []).filter(Boolean).length;

function setAccent(c, o) {
  const r = document.documentElement.style;
  r.setProperty('--accent', c); r.setProperty('--on', o);
}

function renderHome() {
  setAccent('#7c8cff', '#fff'); document.title = 'Палитра кода — учим языки программирования';
  const q = $('q').value.trim().toLowerCase();
  const list = LANGS.filter(l => (cat === 'Все' || META[l.id][0] === cat) &&
    (l.name + ' ' + l.tag).toLowerCase().includes(q));
  $('grid').innerHTML = '';
  list.forEach(l => {
    const m = META[l.id], b = document.createElement('button');
    b.className = 'card'; b.style.cssText = `--c:${l.color};--o:${l.on}`;
    b.innerHTML = `<div class="tile">${esc(m[2])}</div><b>${l.name}</b><span>${l.tag}</span>
      <span>${m[0]} · ${LEVEL[m[1]]} · ${doneCount(l)}/${l.lessons.length}</span>
      <div class="bar2"><i style="width:${doneCount(l) / l.lessons.length * 100}%"></i></div>`;
    b.onclick = () => { location.hash = l.id; };
    $('grid').append(b);
  });
  $('empty').hidden = list.length > 0;
  const total = LANGS.reduce((n, l) => n + l.lessons.length, 0);
  $('stats').textContent = `${LANGS.length} языков, ${total} уроков. Прогресс сохраняется в твоём браузере.`;
}

function renderLang() {
  const m = META[lang.id], d = done[lang.id] || [];
  setAccent(lang.color, lang.on); document.title = lang.name + ' — Палитра кода';
  $('glyph').textContent = m[2]; $('name').textContent = lang.name;
  $('tag').textContent = lang.tag; $('about').textContent = lang.about;
  $('meter').style.width = doneCount(lang) / lang.lessons.length * 100 + '%';
  $('prog').textContent = `${m[0]} · ${LEVEL[m[1]]} · изучено ${doneCount(lang)} из ${lang.lessons.length}`;
  $('tabs').innerHTML = '';
  lang.lessons.forEach(([t], i) => {
    const b = document.createElement('button');
    b.textContent = (d[i] ? '✓ ' : '') + t; b.setAttribute('role', 'tab');
    b.setAttribute('aria-selected', i === lesson); b.onclick = () => { lesson = i; renderLang(); };
    $('tabs').append(b);
  });
  $('file').textContent = lang.file[lesson] || lang.file[0];
  $('code').innerHTML = hi(lang.lessons[lesson][1]);
  $('note').textContent = lang.note; $('jump').value = lang.id;
  $('prev').disabled = lesson === 0; $('next').disabled = lesson === lang.lessons.length - 1;
  $('done').textContent = d[lesson] ? 'Отменить «изучено»' : 'Отметить изученным';
}

function route() {
  const id = location.hash.slice(1), l = LANGS.find(x => x.id === id);
  $('home').hidden = !!l; $('lang').hidden = !l;
  if (l) { lang = l; lesson = 0; renderLang(); } else { $('jump').value = ''; renderHome(); }
  scrollTo(0, 0);
}

$('jump').innerHTML = '<option value="">Выбрать язык</option>' + LANGS.map(l => `<option value="${l.id}">${l.name}</option>`).join('');
$('jump').onchange = e => { location.hash = e.target.value; };
$('chips').innerHTML = '';
CATS.forEach(c => {
  const b = document.createElement('button'); b.textContent = c;
  b.setAttribute('aria-pressed', c === cat);
  b.onclick = () => { cat = c; [...$('chips').children].forEach(x => x.setAttribute('aria-pressed', x === b)); renderHome(); };
  $('chips').append(b);
});
$('q').oninput = renderHome;
$('rnd').onclick = () => { location.hash = LANGS[Math.floor(Math.random() * LANGS.length)].id; };
$('copy').onclick = async () => {
  try { await navigator.clipboard.writeText(lang.lessons[lesson][1]); $('copy').textContent = 'Скопировано'; }
  catch { $('copy').textContent = 'Не вышло'; }
  setTimeout(() => $('copy').textContent = 'Копировать', 1500);
};
$('prev').onclick = () => { lesson--; renderLang(); };
$('next').onclick = () => { lesson++; renderLang(); };
$('done').onclick = () => {
  const d = done[lang.id] || (done[lang.id] = []);
  d[lesson] = !d[lesson]; store.set('cp-done', done);
  if (d[lesson] && lesson < lang.lessons.length - 1) lesson++;
  renderLang();
};
const applyTheme = t => { document.documentElement.dataset.theme = t; store.set('cp-theme', t); };
applyTheme(store.get('cp-theme', matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark'));
$('theme').onclick = () => applyTheme(document.documentElement.dataset.theme === 'light' ? 'dark' : 'light');
addEventListener('keydown', e => {
  if (e.target.matches('input,select')) return;
  if (e.key === '/' && !$('home').hidden) { e.preventDefault(); $('q').focus(); }
  if (!$('lang').hidden) {
    if (e.key === 'ArrowRight' && lesson < lang.lessons.length - 1) { lesson++; renderLang(); }
    if (e.key === 'ArrowLeft' && lesson > 0) { lesson--; renderLang(); }
  }
});
addEventListener('hashchange', route);
route();
