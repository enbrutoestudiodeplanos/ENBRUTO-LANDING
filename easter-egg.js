'use strict';

/* ──────────────────────────────────────────────────────────
   DATA
   ────────────────────────────────────────────────────────── */
const FILMS = [
  {
    id: 1, title: 'METROPOLIS', year: 1927, director: 'Fritz Lang', tmdbId: 19,
    synopsis: 'Una ciudad vertical donde la élite habita el cielo y los obreros sostienen sus cimientos. El nacimiento del lenguaje visual urbano distópico.',
    imdb: '8.3', rt: '97%',
    trailer: 'https://www.youtube.com/watch?v=7PFNr-1svDk',
    img: 'https://images.unsplash.com/photo-1590736969955-71cc94901144?w=600&h=400&fit=crop&q=80'
  },
  {
    id: 2, title: 'THE FOUNTAINHEAD', year: 1949, director: 'King Vidor', tmdbId: 21449,
    synopsis: 'Howard Roark defiende su visión contra la mediocridad colectiva. La ética del diseño como religión personal y acto de resistencia.',
    imdb: '7.1', rt: '78%',
    trailer: 'https://www.youtube.com/watch?v=UlI24CTWxmE',
    img: 'https://images.unsplash.com/photo-1486325212027-8081e485255e?w=600&h=400&fit=crop&q=80'
  },
  {
    id: 3, title: 'MON ONCLE', year: 1958, director: 'Jacques Tati', tmdbId: 26703,
    synopsis: 'Tati desnuda al funcionalismo con humor sutil. La casa moderna como símbolo de vacío existencial disfrazado de comodidad y eficiencia.',
    imdb: '7.9', rt: '96%',
    trailer: 'https://www.youtube.com/watch?v=NHJcwMrqnJo',
    img: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=600&h=400&fit=crop&q=80'
  },
  {
    id: 4, title: 'PLAYTIME', year: 1967, director: 'Jacques Tati', tmdbId: 26566,
    synopsis: 'El cristal y el acero como escenario cómico. Rodada en un set construido ex-profeso: la crítica más costosa al urbanismo moderno.',
    imdb: '8.1', rt: '98%',
    trailer: 'https://www.youtube.com/watch?v=IZzbfGES1IY',
    img: 'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=600&h=400&fit=crop&q=80'
  },
  {
    id: 5, title: '2001: A SPACE ODYSSEY', year: 1968, director: 'Stanley Kubrick', tmdbId: 62,
    synopsis: 'El espacio como arquitectura pura. Kubrick convierte el vacío en volumen y la tecnología en catedral laica. Escala monumental, silencio absoluto.',
    imdb: '8.3', rt: '92%',
    trailer: 'https://www.youtube.com/watch?v=UgGCScAV7qU',
    img: 'https://images.unsplash.com/photo-1444492417251-9c84a5fa18e0?w=600&h=400&fit=crop&q=80'
  },
  {
    id: 6, title: 'THE SHINING', year: 1980, director: 'Stanley Kubrick', tmdbId: 694,
    synopsis: 'El Overlook Hotel como personaje central. Kubrick diseña corredores para oprimir: cada eje visual es un manifiesto sobre proporción y psique.',
    imdb: '8.4', rt: '83%',
    trailer: 'https://www.youtube.com/watch?v=S014oGZiSdI',
    img: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=600&h=400&fit=crop&q=80'
  },
  {
    id: 7, title: 'BLADE RUNNER', year: 1982, director: 'Ridley Scott', tmdbId: 78,
    synopsis: 'Los Ángeles 2019: capas de civilización apiladas sin plan maestro. El palimpsesto urbano como condición inevitable de la modernidad tardía.',
    imdb: '8.1', rt: '89%',
    trailer: 'https://www.youtube.com/watch?v=eogpIG53Cis',
    img: 'https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?w=600&h=400&fit=crop&q=80'
  },
  {
    id: 8, title: 'KOYAANISQATSI', year: 1982, director: 'Godfrey Reggio', tmdbId: 25307,
    synopsis: 'Sin diálogo. Solo ciudades, naturaleza y tiempo acelerado. Poema cinematográfico sobre la escala humana versus la escala de la máquina urbana.',
    imdb: '8.2', rt: '86%',
    trailer: 'https://www.youtube.com/watch?v=tDW-1JIa2gI',
    img: 'https://images.unsplash.com/photo-1480714378408-67cf0d13bc1b?w=600&h=400&fit=crop&q=80'
  },
  {
    id: 9, title: 'BRAZIL', year: 1985, director: 'Terry Gilliam', tmdbId: 403,
    synopsis: 'La burocracia hecha arquitectura. Gilliam construye un world-building que anticipa toda crítica al espacio institucional como mecanismo de control.',
    imdb: '8.0', rt: '98%',
    trailer: 'https://www.youtube.com/watch?v=NUR0aTWWZqA',
    img: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=600&h=400&fit=crop&q=80'
  },
  {
    id: 10, title: 'GHOST IN THE SHELL', year: 1995, director: 'Mamoru Oshii', tmdbId: 16908,
    synopsis: 'Hong Kong mutado en paisaje cyberpunk. La ciudad como cuerpo y el cuerpo como ciudad. Densidad vertical como condición espiritual urbana.',
    imdb: '8.0', rt: '96%',
    trailer: 'https://www.youtube.com/watch?v=5GjS0Vvs8KA',
    img: 'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=600&h=400&fit=crop&q=80'
  }
];

/* ──────────────────────────────────────────────────────────
   CONFIG
   ────────────────────────────────────────────────────────── */
const EE_CFG = {
  KONAMI      : ['ArrowUp','ArrowUp','ArrowDown','ArrowDown','ArrowLeft','ArrowRight','ArrowLeft','ArrowRight','b','a'],
  LONGPRESS_MS: 2000,
  STORAGE_KEY : 'enbruto_cine_progress',
  BG_IMAGE    : 'https://images.unsplash.com/photo-1487958449943-2429e8be8625?w=1920&q=85'
};

/* ──────────────────────────────────────────────────────────
   MODULE: Storage
   ────────────────────────────────────────────────────────── */
const EEStorage = {
  load () {
    try { return JSON.parse(localStorage.getItem(EE_CFG.STORAGE_KEY)) || {}; }
    catch { return {}; }
  },
  save (data) {
    try { localStorage.setItem(EE_CFG.STORAGE_KEY, JSON.stringify(data)); } catch {}
  }
};

/* ──────────────────────────────────────────────────────────
   MODULE: Cursor
   ────────────────────────────────────────────────────────── */
const EECursor = (() => {
  const dot  = document.getElementById('cur-dot');
  const ring = document.getElementById('cur-ring');

  document.addEventListener('mousemove', ({ clientX: x, clientY: y }) => {
    dot.style.left  = ring.style.left  = `${x}px`;
    dot.style.top   = ring.style.top   = `${y}px`;
  });

  return {
    expand (on) { document.body.classList.toggle('cur-expand', on); }
  };
})();

/* ──────────────────────────────────────────────────────────
   MODULE: Konami
   ────────────────────────────────────────────────────────── */
const Konami = (() => {
  let buf = [];
  return {
    listen (cb) {
      document.addEventListener('keydown', ({ key }) => {
        buf.push(key);
        if (buf.length > EE_CFG.KONAMI.length) buf.shift();
        if (buf.join() === EE_CFG.KONAMI.join()) { buf = []; cb(); }
      });
    }
  };
})();

/* ──────────────────────────────────────────────────────────
   MODULE: LongPress
   ────────────────────────────────────────────────────────── */
const LongPress = {
  attach (el, cb) {
    let timer;
    const start  = () => { el.classList.add('pressing'); timer = setTimeout(() => { el.classList.remove('pressing'); cb(); }, EE_CFG.LONGPRESS_MS); };
    const cancel = () => { clearTimeout(timer); el.classList.remove('pressing'); };
    el.addEventListener('mousedown',  start);
    el.addEventListener('touchstart', start, { passive: true });
    ['mouseup','mouseleave','touchend','touchcancel'].forEach(ev => el.addEventListener(ev, cancel));
  }
};

/* ──────────────────────────────────────────────────────────
   MODULE: Grid
   ────────────────────────────────────────────────────────── */
const Grid = (() => {
  const cells = [];
  return {
    build (container, imgUrl) {
      for (let i = 0; i < 10; i++) {
        const col = i % 5, row = Math.floor(i / 5);
        const cell = document.createElement('div');
        cell.className = 'bg-cell';
        cell.style.backgroundImage    = `url('${imgUrl}')`;
        cell.style.backgroundPosition = `${col * 25}% ${row * 100}%`;
        container.appendChild(cell);
        cells.push(cell);
      }
    },
    set (idx, on) { cells[idx]?.classList.toggle('on', on); }
  };
})();

/* ──────────────────────────────────────────────────────────
   MODULE: ProgressUI
   ────────────────────────────────────────────────────────── */
const EEProgress = (() => {
  const numEl  = document.getElementById('ee-prog-num');
  const fillEl = document.getElementById('ee-prog-fill');
  return {
    update (n) {
      numEl.textContent  = `${n}/10`;
      fillEl.style.width = `${n * 10}%`;
    }
  };
})();

/* ──────────────────────────────────────────────────────────
   MODULE: Card
   ────────────────────────────────────────────────────────── */
const Card = (() => {
  const el   = document.getElementById('card');
  const refs = {
    title: document.getElementById('ct'),
    dir  : document.getElementById('cd'),
    syn  : document.getElementById('cs'),
    imdb : document.getElementById('ci-imdb'),
    rt   : document.getElementById('ci-rt'),
    cta  : document.getElementById('cta')
  };

  return {
    show (film) {
      refs.title.textContent = film.title;
      refs.dir.textContent   = `${film.director} · ${film.year}`;
      refs.syn.textContent   = film.synopsis;
      refs.imdb.textContent  = film.imdb;
      refs.rt.textContent    = film.rt;
      refs.cta.href          = film.trailer;
      el.classList.add('show');
    },
    hide ()  { /* panel fijo — no se oculta al salir de la fila */ },
    reset () { el.classList.remove('show'); }
  };
})();

/* ──────────────────────────────────────────────────────────
   MODULE: Unlock
   ────────────────────────────────────────────────────────── */
const Unlock = (() => {
  const el = document.getElementById('unlock');
  document.getElementById('btn-unlock-close').addEventListener('click', () => el.classList.remove('show'));
  return { show () { el.classList.add('show'); } };
})();

/* ──────────────────────────────────────────────────────────
   MODULE: MovieList
   ────────────────────────────────────────────────────────── */
const MovieList = (() => {
  const container = document.getElementById('movie-list');
  let state = {};

  const countChecked = () => Object.values(state).filter(Boolean).length;

  const buildRow = (film, idx) => {
    const row = document.createElement('div');
    row.className = `m-row${state[film.id] ? ' done' : ''}`;
    row.style.setProperty('--i', idx);

    row.innerHTML = `
      <input class="m-chk" type="checkbox"${state[film.id] ? ' checked' : ''}>
      <div>
        <span class="m-title">${film.title}</span>
        <span class="m-year">${film.year}</span>
      </div>
      <span class="m-dir">${film.director}</span>
    `;

    row.querySelector('.m-chk').addEventListener('change', e => {
      state[film.id] = e.target.checked;
      EEStorage.save(state);
      row.classList.toggle('done', e.target.checked);
      Grid.set(idx, e.target.checked);
      EEProgress.update(countChecked());
      if (countChecked() === FILMS.length) setTimeout(Unlock.show, 900);
    });

    row.addEventListener('mouseenter', () => { EECursor.expand(true);  row.classList.add('active');    Card.show(film); });
    row.addEventListener('mouseleave', () => { EECursor.expand(false); row.classList.remove('active'); });

    return row;
  };

  return {
    init (savedState) {
      state = savedState;
      FILMS.forEach((film, i) => container.appendChild(buildRow(film, i)));
    }
  };
})();

/* ──────────────────────────────────────────────────────────
   MODULE: EE (orchestrator)
   ────────────────────────────────────────────────────────── */
const EE = (() => {
  const overlay = document.getElementById('ee');
  const flash   = document.getElementById('flash');
  let isOpen = false;

  const trigger = () => {
    if (isOpen) return;
    isOpen = true;
    document.body.classList.add('ee-active');
    flash.classList.add('on');
    setTimeout(() => flash.classList.remove('on'), 80);
    overlay.classList.add('active');
  };

  const close = () => {
    isOpen = false;
    document.body.classList.remove('ee-active');
    overlay.classList.remove('active');
    Card.reset();
  };

  return { trigger, close };
})();

/* ──────────────────────────────────────────────────────────
   INIT
   ────────────────────────────────────────────────────────── */
(() => {
  const state = EEStorage.load();

  Grid.build(document.getElementById('bg-grid'), EE_CFG.BG_IMAGE);
  MovieList.init(state);

  const savedCount = Object.values(state).filter(Boolean).length;
  EEProgress.update(savedCount);
  FILMS.forEach((f, i) => { if (state[f.id]) Grid.set(i, true); });

  Konami.listen(EE.trigger);
  LongPress.attach(document.getElementById('ee-trigger'), EE.trigger);
  document.getElementById('btn-close').addEventListener('click', EE.close);

  const btnClose = document.getElementById('btn-close');
  btnClose.addEventListener('mouseenter', () => EECursor.expand(true));
  btnClose.addEventListener('mouseleave', () => EECursor.expand(false));

  window.openEE = EE.trigger;
  console.log('%c🎬 Easter Egg cargado · openEE() para abrir', 'color:#888;font-size:11px');
})();
