javascript
const $ = id => document.getElementById(id);
const META = { // id: [категория, сложность 1-3, значок]
  python:['Универсальные',1,'Py'],javascript:['Веб',1,'JS'],typescript:['Веб',2,'TS'],java:['Универсальные',2,'Jv'],
  csharp:['Универсальные',2,'C#'],go:['Системные',2,'Go'],rust:['Системные',3,'Rs'],cpp:['Системные',3,'C++'],
  php:['Веб',1,'PHP'],kotlin:['Мобильные',2,'Kt'],swift:['Мобильные',2,'Sw'],dart:['Мобильные',2,'Da'],
  ruby:['Скрипты',1,'Rb'],sql:['Данные',1,'SQL'],bash:['Скрипты',1,'sh'],
  r:['Данные',2,'R'],html:['Веб',1,'</>'],lua:['Системные',2,'Lua'],
  clojure:['Универсальные',3,'Clj'],scala:['Универсальные',3,'Sc']
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
  setAccent('#7c8cff', '#fff'); document.title = 'Хрона кода — учим языки программирования';
  const q = $('q').value.trim().toLowerCase();
  const list = LANGS.filter(l => (cat === 'Все' || META[l.id][0] === cat) &&
    (l.name + ' ' + l.tag).toLowerCase().includes(q));
  $('grid').innerHTML = '';
  
  let completedLangsCount = 0;

  list.forEach(l => {
    const m = META[l.id], b = document.createElement('button');
    b.className = 'card'; b.style.cssText = `--c:${l.color};--o:${l.on}`;
    
    const dCount = doneCount(l);
    const totalLessons = l.lessons.length;
    const percent = Math.round((dCount / totalLessons) * 100);
    const isFullyCompleted = dCount >= totalLessons && totalLessons > 0;
    if (isFullyCompleted) completedLangsCount++;

    b.innerHTML = `
      <div class="tile">${esc(m[2])}</div>
      <b>${l.name}</b>
      <span>${l.tag}</span>
      <span class="card-meta">${m[0]} · ${LEVEL[m[1]]} · ${dCount}/${totalLessons}</span>
      <div class="home-meter"><div class="home-meter-bar" style="width: ${percent}%"></div></div>
    `;
    b.onclick = () => { location.hash = l.id; };
    $('grid').append(b);
  });

  $('empty').hidden = list.length > 0;
  const total = LANGS.reduce((n, l) => n + l.lessons.length, 0);
  
  // Подсчитываем общие завершенные языки по всему списку LANGS
  let totalCompleted = 0;
  LANGS.forEach(l => {
    if (doneCount(l) >= l.lessons.length && l.lessons.length > 0) totalCompleted++;
  });

  $('stats').textContent = `Пройдено языков: ${totalCompleted} из ${LANGS.length}. Всего ${total} уроков в ${LANGS.length} языках. Прогресс сохраняется в браузере.`;
}

function renderLang() {
  const m = META[lang.id], d = done[lang.id] || [];
  setAccent(lang.color, lang.on); document.title = lang.name + ' — Хрона кода';
  $('glyph').textContent = m[2]; $('name').textContent = lang.name;
  $('tag').textContent = lang.tag; $('about').textContent = lang.about;
  $('meter').style.width = doneCount(lang) / lang.lessons.length * 100 + '%';
  $('prog').textContent = `${m[0]} · ${LEVEL[m[1]]} · изучено ${doneCount(lang)} из ${lang.lessons.length}`;
  $('tabs').innerHTML = '';
  lang.lessons.forEach(([t], i) => {
    const b = document.createElement('button');
    b.textContent = lang.lessons.length > 8 ? (d[i] ? '✓' : i + 1) : (d[i] ? '✓ ' : '') + t; b.title = t; b.setAttribute('role', 'tab');
    b.setAttribute('aria-selected', i === lesson); b.onclick = () => { lesson = i; renderLang(); };
    $('tabs').append(b);
  });
  $('file').textContent = lang.file[lesson] || lang.file[0];
  $('code').innerHTML = hi(lang.lessons[lesson][1]);
  const L = lang.lessons[lesson];
  $('ltitle').textContent = `${lesson + 1}. ${L[0]}`; $('ltext').textContent = L[2] || '';
  $('video').innerHTML = L[3] ? `<iframe src="https://www.youtube-nocookie.com/embed/${L[3]}" title="Видеоурок" loading="lazy" allowfullscreen></iframe>` : '';
  $('yt').href = 'https://www.youtube.com/results?search_query=' + encodeURIComponent(`${lang.name} ${L[0]} урок`);
  $('note').textContent = lang.note + (lang.lessons.length < 100 ? ` Курс ещё пополняется: сейчас ${lang.lessons.length} из 100 уроков.` : ' Курс содержит полный комплект из 100 подробных уроков.'); $('jump').value = lang.id;
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
```[cite: 2]

---



Чтобы поломки стилей не было и полоски отображались аккуратно, добавь в файл `style.css` следующие строки:

```css
/* Стили для полоски прогресса в карточках */
.home-meter {
  width: 100%;
  height: 6px;
  background: rgba(128, 128, 128, 0.2);
  border-radius: 3px;
  overflow: hidden;
  margin-top: 10px;
}

.home-meter-bar {
  height: 100%;
  background: var(--c, #7c8cff);
  width: 0%;
  transition: width 0.3s ease;
}

.card span.card-meta {
  font-size: 13px;
  opacity: 0.8;
  margin-top: 2px;
}
