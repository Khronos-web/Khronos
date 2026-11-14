const $ = id => document.getElementById(id);

let state = {
  lang: null,
  lesson: 0,
  filter: 'all',
  search: '',
  progress: JSON.parse(localStorage.getItem('chrona_progress') || '{}'),
  theme: localStorage.getItem('chrona_theme') || 'dark'
};

document.documentElement.setAttribute('data-theme', state.theme);

function save() {
  localStorage.setItem('chrona_progress', JSON.stringify(state.progress));
}

function getRank(completed) {
  if (completed >= 20) return 'Мастер кода';
  if (completed >= 15) return 'Специалист';
  if (completed >= 10) return 'Практик';
  if (completed >= 5) return 'Ученик';
  return 'Новичок';
}

function initTheme() {
  const btn = $('theme');
  if (btn) {
    btn.onclick = () => {
      state.theme = state.theme === 'dark' ? 'light' : 'dark';
      document.documentElement.setAttribute('data-theme', state.theme);
      localStorage.setItem('chrona_theme', state.theme);
    };
  }
}

function initJump() {
  const sel = $('jump');
  if (!sel) return;
  sel.innerHTML = '<option value="">Выбрать язык...</option>' + LANGS.map(l => `<option value="${l.id}">${l.name}</option>`).join('');
  sel.onchange = (e) => {
    if (e.target.value) {
      location.hash = '#' + e.target.value;
      sel.value = '';
    }
  };
}

function renderHome() {
  $('home').hidden = false;
  $('lang').hidden = true;
  document.title = 'Хрона кода — языки программирования';

  let totalLessons = 0;
  let completedLessons = 0;
  let totalCompleted = 0;

  LANGS.forEach(l => {
    const prog = state.progress[l.id] || [];
    const len = l.lessons.length;
    totalLessons += len;
    const doneCount = prog.filter(Boolean).length;
    completedLessons += doneCount;
    if (len > 0 && doneCount >= len) {
      totalCompleted++;
    }
  });

  $('stats').textContent = `Пройдено языков: ${totalCompleted} из ${LANGS.length}. Всего ${completedLessons} из ${totalLessons} уроков в ${LANGS.length} технологиях. Прогресс сохраняется в браузере.`;

  const maxLangs = LANGS.length;
  const rankPercent = maxLangs > 0 ? Math.min(100, (totalCompleted / maxLangs) * 100) : 0;
  const rankFill = $('rank-fill');
  if (rankFill) {
    rankFill.style.width = rankPercent + '%';
    $('rank-count').textContent = `${totalCompleted} / ${maxLangs}`;
    $('rank-title').textContent = getRank(totalCompleted);
  }

  // Chips
  const cats = [
    { id: 'all', name: 'Все' },
    { id: 'Универсальные', name: 'Универсальные' },
    { id: 'Веб', name: 'Веб' },
    { id: 'Системные', name: 'Системные' },
    { id: 'Мобильные', name: 'Мобильные' },
    { id: 'Скрипты', name: 'Скрипты' },
    { id: 'Данные', name: 'Данные' },
    { id: 'Документация', name: 'Документация' }
  ];

  $('chips').innerHTML = cats.map(c => `
    <button type="button" aria-pressed="${state.filter === c.id}" data-cat="${c.id}">${c.name}</button>
  `).join('');

  $('chips').querySelectorAll('button').forEach(btn => {
    btn.onclick = () => {
      state.filter = btn.dataset.cat;
      renderGrid();
      renderHomeChipsState();
    };
  });

  const q = $('q');
  if (q) {
    q.value = state.search;
    q.oninput = (e) => {
      state.search = e.target.value.toLowerCase().trim();
      renderGrid();
    };
  }

  const rnd = $('rnd');
  if (rnd) {
    rnd.onclick = () => {
      const randomLang = LANGS[Math.floor(Math.random() * LANGS.length)];
      location.hash = '#' + randomLang.id;
    };
  }

  renderGrid();
}

function renderHomeChipsState() {
  $('chips').querySelectorAll('button').forEach(btn => {
    btn.setAttribute('aria-pressed', btn.dataset.cat === state.filter ? 'true' : 'false');
  });
}

function renderGrid() {
  const grid = $('grid');
  const empty = $('empty');

  const filtered = LANGS.filter(l => {
    const matchCat = state.filter === 'all' || l.tag.toLowerCase().includes(state.filter.toLowerCase()) || (l.category && l.category === state.filter);
    const matchSearch = l.name.toLowerCase().includes(state.search) || l.tag.toLowerCase().includes(state.search);
    return matchCat && matchSearch;
  });

  empty.hidden = filtered.length > 0;

  grid.innerHTML = filtered.map(l => {
    const prog = state.progress[l.id] || [];
    const done = prog.filter(Boolean).length;
    const total = l.lessons.length;
    const pct = total > 0 ? (done / total) * 100 : 0;
    const shortName = l.name.length > 6 ? l.name.slice(0, 5) + '.' : l.name;

    return `
      <button class="card" type="button" data-id="${l.id}" style="--c:${l.color}; --o:${l.on}">
        <div class="tile">${shortName}</div>
        <b>${l.name}</b>
        <span>${l.tag}</span>
        <div class="bar2"><i style="width:${pct}%"></i></div>
        <span style="font-size:.8rem">${done} / ${total}</span>
      </button>
    `;
  }).join('');

  grid.querySelectorAll('.card').forEach(card => {
    card.onclick = () => {
      location.hash = '#' + card.dataset.id;
    };
  });
}

function renderLang() {
  const hash = location.hash.slice(1);
  const lang = LANGS.find(l => l.id === hash);

  if (!lang) {
    location.hash = '';
    return;
  }

  state.lang = lang;
  if (state.lesson >= lang.lessons.length) state.lesson = 0;

  $('home').hidden = true;
  $('lang').hidden = false;

  document.title = `${lang.name} — Хрона кода`;

  $('glyph').textContent = lang.name.length > 5 ? lang.name.slice(0, 4) + '.' : lang.name;
  $('glyph').style.background = lang.color;
  $('glyph').style.color = lang.on;

  $('name').textContent = lang.name;
  $('tag').textContent = lang.tag;
  $('about').textContent = lang.about;

  const prog = state.progress[lang.id] || [];
  const done = prog.filter(Boolean).length;
  const total = lang.lessons.length;
  const pct = total > 0 ? (done / total) * 100 : 0;

  $('meter').style.width = `${pct}%`;
  $('meter').style.background = lang.color;
  $('prog').textContent = `Пройдено уроков: ${done} из ${total}`;

  // Текущий урок (без списка всех уроков)
  const lesson = lang.lessons[state.lesson];
  const isLessonDone = !!prog[state.lesson];

  const badge = $('lesson-num-badge');
  if (badge) {
    badge.textContent = `Урок ${state.lesson + 1} из ${total}${isLessonDone ? ' (Выучено ✓)' : ''}`;
  }

  $('ltitle').textContent = lesson[0];
  $('ltext').textContent = lesson[2];
  $('code').textContent = lesson[1];
  $('file').textContent = lang.file[0] || 'code';

  const doneBtn = $('done');
  doneBtn.textContent = isLessonDone ? '✓ Выучено' : 'Отметить как выученное';
  doneBtn.style.background = isLessonDone ? '#2ea043' : '';
  doneBtn.style.color = isLessonDone ? '#fff' : '';
  doneBtn.onclick = () => {
    if (!state.progress[lang.id]) state.progress[lang.id] = [];
    state.progress[lang.id][state.lesson] = !state.progress[lang.id][state.lesson];
    save();
    renderLang();
  };

  $('prev').disabled = state.lesson === 0;
  $('prev').onclick = () => {
    if (state.lesson > 0) {
      state.lesson--;
      renderLang();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  $('next').disabled = state.lesson === lang.lessons.length - 1;
  $('next').onclick = () => {
    if (state.lesson < lang.lessons.length - 1) {
      state.lesson++;
      renderLang();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  $('note').textContent = lang.note;

  // Video search
  const query = encodeURIComponent(`${lang.name} урок ${lesson[0]}`);
  $('yt').href = `https://www.youtube.com/results?search_query=${query}`;
  $('video').innerHTML = '';

  const copyBtn = $('copy');
  copyBtn.onclick = () => {
    navigator.clipboard.writeText(lesson[1]).then(() => {
      copyBtn.textContent = 'Скопировано!';
      setTimeout(() => copyBtn.textContent = 'Копировать', 1500);
    });
  };

  document.querySelectorAll('.back').forEach(a => {
    a.onclick = (e) => {
      e.preventDefault();
      location.hash = '';
    };
  });
}

function handleRoute() {
  if (location.hash.length > 1) {
    renderLang();
  } else {
    renderHome();
  }
}

window.onhashchange = handleRoute;

window.onload = () => {
  initTheme();
  initJump();
  handleRoute();
};

window.addEventListener('keydown', (e) => {
  if (e.key === '/' && document.activeElement.tagName !== 'INPUT') {
    e.preventDefault();
    const q = $('q');
    if (q) q.focus();
  }
});
