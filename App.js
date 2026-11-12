const $ = id => document.getElementById(id);
const esc = s => s.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
const hi = s => esc(s)
  .replace(/(&quot;|")(?:(?!\1).)*\1/g, m => `<span class="s">${m}</span>`)
  .replace(/^(\s*(?:\/\/|#(?!include)).*)$/gm, '<span class="c">$1</span>')
  .replace(/(\s)(\/\/ .*)$/gm, '$1<span class="c">$2</span>');
let lang, lesson = 0;

function render() {
  const r = document.documentElement.style;
  r.setProperty('--accent', lang.color);
  r.setProperty('--on', lang.on);
  document.title = lang.name + ' — Палитра кода';
  $('name').textContent = lang.name;
  $('tag').textContent = lang.tag;
  $('about').textContent = lang.about;
  document.querySelectorAll('#langs button').forEach(b =>
    b.setAttribute('aria-current', b.dataset.id === lang.id));
  $('tabs').innerHTML = '';
  lang.lessons.forEach(([title], i) => {
    const b = document.createElement('button');
    b.textContent = title; b.setAttribute('role', 'tab');
    b.setAttribute('aria-selected', i === lesson);
    b.onclick = () => { lesson = i; render(); };
    $('tabs').append(b);
  });
  $('file').textContent = lang.file[lesson] || lang.file[0];
  $('code').innerHTML = hi(lang.lessons[lesson][1]);
  $('note').textContent = lang.note;
}

function select(id) {
  lang = LANGS.find(l => l.id === id) || LANGS[0];
  lesson = 0; render();
}

LANGS.forEach(l => {
  const li = document.createElement('li'), b = document.createElement('button');
  b.textContent = l.name; b.dataset.id = l.id; b.style.setProperty('--c', l.color);
  b.onclick = () => { location.hash = l.id; };
  li.append(b); $('langs').append(li);
});
$('copy').onclick = async () => {
  try { await navigator.clipboard.writeText(lang.lessons[lesson][1]); $('copy').textContent = 'Скопировано'; }
  catch { $('copy').textContent = 'Не удалось скопировать'; }
  setTimeout(() => $('copy').textContent = 'Копировать', 1500);
};
addEventListener('hashchange', () => select(location.hash.slice(1)));
select(location.hash.slice(1));