/**
 * EASTER EGG — 20 películas / revelación 1/20 de Marina Bay Sands
 * Dataset centralizado · localStorage · TMDb API
 */

// ═══════════════════════════════════════════════════════════════════════════
// CONFIG
// ═══════════════════════════════════════════════════════════════════════════

// TMDb API key (read access token)
const TMDB_API_KEY = 'eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJiYzZiZjRjMWUzZGIxODg5MDEyYWNjNjIyYWQxYTAzNCIsIm5iZiI6MTc3NjA4Njk1Ni43MjgsInN1YiI6IjY5ZGNlZmFjMTQzN2I3YTE0NWQ5M2MxMSIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.0KIB2RqjiDroapsroFPgwe8RmpSHPulCccAMm3EmqSk';

// ═══════════════════════════════════════════════════════════════════════════
// DATASET — 20 películas exactas
// ═══════════════════════════════════════════════════════════════════════════

const MOVIES = [
  { id: 1,  title: 'The Fountainhead',                year: 1949, tmdbId: 21449,    summary: 'Arquitectura como ideología, autoría, ego y conflicto con el cliente. Un arquitecto se niega a comprometer su visión.', trailerQuery: 'The+Fountainhead+1949+trailer' },
  { id: 2,  title: 'Metropolis',                        year: 1927, tmdbId: 19,       summary: 'Ciudad, verticalidad y poder. Distopía expresionista sobre la brecha entre obreros y élite en una metrópolis futurista.', trailerQuery: 'Metropolis+1927+trailer' },
  { id: 3,  title: 'The Brutalist',                     year: 2024, tmdbId: 974950,   summary: 'Monumentalidad, brutalismo, trauma, inmigración, patronazgo, obra total. Un arquitecto húngaro reconstruye su vida en América.', trailerQuery: 'The+Brutalist+trailer' },
  { id: 4,  title: 'Columbus',                          year: 2017, tmdbId: 434097,   summary: 'Silencio, geometría, contemplación, modernismo. Dos extraños exploran la arquitectura de Columbus, Indiana.', trailerQuery: 'Columbus+2017+trailer' },
  { id: 5,  title: 'Blade Runner 2049',                 year: 2017, tmdbId: 335984,   summary: 'Escala, vacío, monumentalidad, materialidad, brutalismo. Un blade runner descubre un secreto que sacude los cimientos de la sociedad.', trailerQuery: 'Blade+Runner+2049+trailer' },
  { id: 6,  title: 'Inception',                         year: 2010, tmdbId: 27205,    summary: 'Arquitectura como construcción mental y espacial. Un ladrón de secretos penetra los sueños para implantar ideas.', trailerQuery: 'Inception+trailer' },
  { id: 7,  title: 'Her',                               year: 2013, tmdbId: 152601,   summary: 'Interiores, escala humana, ciudad futura cálida, diseño emocional. Un escritor desarrolla una relación con un sistema operativo.', trailerQuery: 'Her+2013+trailer' },
  { id: 8,  title: 'The Grand Budapest Hotel',          year: 2014, tmdbId: 120467,   summary: 'Composición, simetría, color, interiorismo. Las aventuras de un conserje legendario y su joven aprendiz.', trailerQuery: 'Grand+Budapest+Hotel+trailer' },
  { id: 9,  title: 'Ex Machina',                        year: 2014, tmdbId: 264660,   summary: 'Hormigón, vidrio, paisaje y silencio. Un programador evalúa la conciencia de una inteligencia artificial.', trailerQuery: 'Ex+Machina+trailer' },
  { id: 10, title: 'Parasite',                          year: 2019, tmdbId: 496243,   summary: 'La casa como narrativa, circulación, desniveles, jerarquía espacial. Dos familias, una casa, una intriga social.', trailerQuery: 'Parasite+2019+trailer' },
  { id: 11, title: 'The Last Black Man in San Francisco', year: 2019, tmdbId: 515500,   summary: 'Ciudad, vivienda, gentrificación, pertenencia. Un joven busca reclamar la casa que su abuelo construyó.', trailerQuery: 'Last+Black+Man+San+Francisco+trailer' },
  { id: 12, title: 'Roma',                              year: 2018, tmdbId: 426426,   summary: 'Espacio doméstico, barrio, ciudad y memoria. La vida de una empleada doméstica en la Ciudad de México de los 70.', trailerQuery: 'Roma+2018+trailer' },
  { id: 13, title: 'Black Panther',                     year: 2018, tmdbId: 284054,   summary: 'Arquitectura, identidad cultural y futuro. El rey de Wakanda defiende su trono y la tecnología de su nación.', trailerQuery: 'Black+Panther+trailer' },
  { id: 14, title: 'High-Rise',                         year: 2015, tmdbId: 303858,   summary: 'Torre, microciudad, desarrollo inmobiliario y horror social. El aislamiento de una torre de lujo desata el caos.', trailerQuery: 'High-Rise+trailer' },
  { id: 15, title: 'A Ghost Story',                     year: 2017, tmdbId: 425469,   summary: 'Espacio doméstico y memoria. Un fantasma observa el paso del tiempo en la casa que compartió con su pareja.', trailerQuery: 'A+Ghost+Story+trailer' },
  { id: 16, title: 'Enemy',                             year: 2013, tmdbId: 198277,   summary: 'Torres, repetición, alienación urbana. Un profesor descubre a su doble exacto en una película.', trailerQuery: 'Enemy+2013+trailer' },
  { id: 17, title: 'The International',                 year: 2009, tmdbId: 13781,    summary: 'Lenguaje arquitectónico y espacial. Un agente investiga un banco corrupto a través del diseño y la arquitectura.', trailerQuery: 'The+International+trailer' },
  { id: 18, title: 'Synecdoche, New York',              year: 2008, tmdbId: 13015,    summary: 'Construcción de mundos, escala y representación. Un director de teatro construye una réplica de Nueva York en un almacén.', trailerQuery: 'Synecdoche+New+York+trailer' },
  { id: 19, title: 'Midnight in Paris',                 year: 2011, tmdbId: 59436,    summary: 'Ciudad, atmósfera, patrimonio y romanticismo urbano. Un escritor viaja al París de los años 20.', trailerQuery: 'Midnight+in+Paris+trailer' },
  { id: 20, title: 'The Matrix',                        year: 1999, tmdbId: 603,      summary: 'Ciudad, estructura, simulación y espacio digital. Un hacker descubre la verdad sobre su realidad.', trailerQuery: 'The+Matrix+trailer' },
];

// ═══════════════════════════════════════════════════════════════════════════
// STATE
// ═══════════════════════════════════════════════════════════════════════════

const STORAGE_KEY = 'enbruto_easteregg_v1';

// Mapa de película a celda (orden aleatorizado para no revelar rápido)
let movieToCellMap = [];

// Estado de vistas
let watchedState = {};

// Cache de pósters TMDb
let posterCache = {};

// ═══════════════════════════════════════════════════════════════════════════
// INIT
// ═══════════════════════════════════════════════════════════════════════════

document.addEventListener('DOMContentLoaded', () => {
  loadState();
  generateRandomMapping();
  renderGrid();
  renderList();
  updateReveal();
  setupEventListeners();
});

// ═══════════════════════════════════════════════════════════════════════════
// LOCAL STORAGE
// ═══════════════════════════════════════════════════════════════════════════

function loadState() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      watchedState = JSON.parse(saved);
    }
  } catch (e) {
    watchedState = {};
  }
}

function saveState() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(watchedState));
  } catch (e) {}
}

// ═══════════════════════════════════════════════════════════════════════════
// RANDOM MAPPING (para no revelar el edificio de inmediato)
// ═══════════════════════════════════════════════════════════════════════════

function generateRandomMapping() {
  // Creamos un array de 0-19 y lo mezclamos aleatoriamente
  const indices = Array.from({ length: 20 }, (_, i) => i);
  
  // Fisher-Yates shuffle
  for (let i = indices.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [indices[i], indices[j]] = [indices[j], indices[i]];
  }
  
  // movieToCellMap[movieId - 1] = cellIndex
  movieToCellMap = indices;
  
  // Guardamos el mapping en localStorage para consistencia entre sesiones
  try {
    const savedMapping = localStorage.getItem('enbruto_easteregg_map');
    if (savedMapping) {
      movieToCellMap = JSON.parse(savedMapping);
    } else {
      localStorage.setItem('enbruto_easteregg_map', JSON.stringify(movieToCellMap));
    }
  } catch (e) {}
}

// ═══════════════════════════════════════════════════════════════════════════
// RENDER GRID (20 celdas)
// ═══════════════════════════════════════════════════════════════════════════

function renderGrid() {
  const grid = document.getElementById('revealGrid');
  grid.innerHTML = '';
  
  for (let i = 0; i < 20; i++) {
    const cell = document.createElement('div');
    cell.className = 'reveal-cell';
    cell.dataset.cellIndex = i;
    grid.appendChild(cell);
  }
}

// ═══════════════════════════════════════════════════════════════════════════
// RENDER LIST
// ═══════════════════════════════════════════════════════════════════════════

function renderList() {
  const list = document.getElementById('movieList');
  list.innerHTML = '';
  
  MOVIES.forEach((movie, index) => {
    const isWatched = watchedState[movie.id] || false;
    
    const li = document.createElement('li');
    li.className = `movie-item ${isWatched ? 'is-watched' : ''}`;
    li.dataset.movieId = movie.id;
    
    li.innerHTML = `
      <label class="movie-check-wrap" data-movie-id="${movie.id}">
        <input type="checkbox" ${isWatched ? 'checked' : ''} data-movie-id="${movie.id}">
        <span class="movie-check-box"></span>
      </label>
      <div class="movie-info">
        <span class="movie-title">${escapeHtml(movie.title)}</span>
        <span class="movie-year">${movie.year}</span>
      </div>
    `;
    
    list.appendChild(li);
  });
}

// ═══════════════════════════════════════════════════════════════════════════
// EVENT LISTENERS
// ═══════════════════════════════════════════════════════════════════════════

function setupEventListeners() {
  const list = document.getElementById('movieList');
  
  // Click en checkbox = marcar/desmarcar (no propaga a fila)
  list.addEventListener('click', (e) => {
    const checkboxWrap = e.target.closest('.movie-check-wrap');
    const checkbox = e.target.closest('input[type="checkbox"]');
    
    if (checkbox || checkboxWrap) {
      e.stopPropagation();
      const movieId = parseInt((checkbox || checkboxWrap.querySelector('input')).dataset.movieId);
      toggleWatched(movieId);
    }
  });
  
  // Click en fila (no checkbox) = abrir detalle
  list.addEventListener('click', (e) => {
    const item = e.target.closest('.movie-item');
    const checkboxWrap = e.target.closest('.movie-check-wrap');
    
    if (item && !checkboxWrap) {
      const movieId = parseInt(item.dataset.movieId);
      openMovieDetail(movieId);
    }
  });
  
  // Botón volver
  document.getElementById('backBtn').addEventListener('click', () => {
    closeMovieDetail();
  });
}

// ═══════════════════════════════════════════════════════════════════════════
// WATCHED STATE
// ═══════════════════════════════════════════════════════════════════════════

function toggleWatched(movieId) {
  watchedState[movieId] = !watchedState[movieId];
  saveState();
  
  // Actualizar UI
  const item = document.querySelector(`.movie-item[data-movie-id="${movieId}"]`);
  const checkbox = item.querySelector('input[type="checkbox"]');
  
  if (watchedState[movieId]) {
    item.classList.add('is-watched');
    checkbox.checked = true;
  } else {
    item.classList.remove('is-watched');
    checkbox.checked = false;
  }
  
  updateReveal();
}

// ═══════════════════════════════════════════════════════════════════════════
// REVEAL LOGIC
// ═══════════════════════════════════════════════════════════════════════════

function updateReveal() {
  const watchedCount = Object.values(watchedState).filter(Boolean).length;
  document.getElementById('revealCount').textContent = watchedCount;
  
  // Determinar qué celdas revelar
  MOVIES.forEach((movie, index) => {
    const cellIndex = movieToCellMap[index];
    const cell = document.querySelector(`.reveal-cell[data-cell-index="${cellIndex}"]`);
    
    if (cell) {
      if (watchedState[movie.id]) {
        cell.classList.add('is-revealed');
      } else {
        cell.classList.remove('is-revealed');
      }
    }
  });
}

// ═══════════════════════════════════════════════════════════════════════════
// MOVIE DETAIL
// ═══════════════════════════════════════════════════════════════════════════

async function openMovieDetail(movieId) {
  const movie = MOVIES.find(m => m.id === movieId);
  if (!movie) return;
  
  // Ocultar reveal, mostrar detail
  document.getElementById('revealView').style.display = 'none';
  document.getElementById('movieDetail').style.display = 'block';
  
  const content = document.getElementById('detailContent');
  content.innerHTML = '<div style="padding:40px 0;text-align:center;color:var(--muted);">Cargando...</div>';
  
  // Obtener póster
  const posterUrl = await fetchPoster(movie.tmdbId);
  
  // Buscar trailer en YouTube (embed)
  const trailerEmbed = `https://www.youtube.com/embed?listType=search&list=${encodeURIComponent(movie.trailerQuery)}`;
  
  content.innerHTML = `
    <div class="detail-poster-wrap">
      <img class="detail-poster" src="${posterUrl}" alt="${escapeHtml(movie.title)}" loading="lazy">
    </div>
    <div class="detail-info">
      <h2>${escapeHtml(movie.title)}</h2>
      <div class="detail-year">${movie.year}</div>
      <div class="detail-summary">${escapeHtml(movie.summary)}</div>
    </div>
    <div class="detail-trailer">
      <iframe src="${trailerEmbed}" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen loading="lazy"></iframe>
    </div>
  `;
}

function closeMovieDetail() {
  document.getElementById('movieDetail').style.display = 'none';
  document.getElementById('revealView').style.display = 'flex';
}

// ═══════════════════════════════════════════════════════════════════════════
// TMDb API
// ═══════════════════════════════════════════════════════════════════════════

async function fetchPoster(tmdbId) {
  // Cache
  if (posterCache[tmdbId]) {
    return posterCache[tmdbId];
  }
  
  try {
    const response = await fetch(`https://api.themoviedb.org/3/movie/${tmdbId}?language=es-ES`, {
      headers: {
        'Authorization': `Bearer ${TMDB_API_KEY}`,
        'Accept': 'application/json'
      }
    });
    
    if (!response.ok) throw new Error('TMDb error');
    
    const data = await response.json();
    const posterPath = data.poster_path;
    
    if (posterPath) {
      const url = `https://image.tmdb.org/t/p/w500${posterPath}`;
      posterCache[tmdbId] = url;
      return url;
    }
  } catch (e) {
    console.error('Error fetching poster:', e);
  }
  
  // Fallback
  return `https://via.placeholder.com/300x450/1a1a1a/666?text=${encodeURIComponent('Poster+no+disponible')}`;
}

// ═══════════════════════════════════════════════════════════════════════════
// UTILS
// ═══════════════════════════════════════════════════════════════════════════

function escapeHtml(str) {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}
