// ═══════════════════════════════════════════════════════════════════
// ANTES DE LA OBRA — preflight-app.js
// Cliente Fase 1: envío de PDF al Worker y render de resultados
// ═══════════════════════════════════════════════════════════════════

const WORKER_URL = (location.hostname === 'localhost' || location.hostname === '127.0.0.1')
  ? 'http://localhost:8787'
  : 'https://preflight-worker.1328copias.workers.dev';

// ── Auth check ──────────────────────────────────────────────────
(function checkAuth() {
  if (document.getElementById('orderForm')) return; // embebido en panel — ya autenticado
  if (location.hostname === 'localhost' || location.hostname === '127.0.0.1') return;
  try {
    const item = JSON.parse(localStorage.getItem('portalSid') || 'null');
    if (!item || new Date() > new Date(item.exp)) {
      window.location.replace('index.html');
    }
  } catch {
    window.location.replace('index.html');
  }
})();

// ── DOM refs ──────────────────────────────────────────────────────
const drop       = document.getElementById('pfDrop');
const fileInput  = document.getElementById('pfFile');
const dropInner  = document.getElementById('pfDropInner');
const statusBox  = document.getElementById('pfStatus');
const statusText = document.getElementById('pfStatusText');
const resultBox  = document.getElementById('pfResult');

// ── Nueva revisión + Enviar a imprimir ───────────────────────────
if (resultBox) {
  resultBox.addEventListener('click', e => {
    if (e.target.id === 'pfNewReview') {
      resultBox.style.display = 'none';
      resultBox.innerHTML = '';
      statusBox.style.display = 'none';
      if (fileInput) fileInput.value = '';
      if (drop) drop.scrollIntoView({ behavior: 'smooth', block: 'center' });
      return;
    }
    const sendBtn = e.target.closest('[data-pf-send]');
    if (sendBtn) {
      const fileName = sendBtn.dataset.filename || '';
      const obraInput = document.getElementById('obraName') || document.querySelector('#orderForm [name="obra"]');
      if (obraInput && fileName) {
        const baseName = fileName.replace(/\.pdf$/i, '').replace(/[_-]/g, ' ').trim();
        obraInput.value = baseName;
        obraInput.dispatchEvent(new Event('input', { bubbles: true }));
      }
      const orderForm = document.getElementById('orderFormBlock') || document.getElementById('orderForm');
      if (orderForm) {
        const pfToggle = document.getElementById('pfToggleBtn');
        if (pfToggle && pfToggle.getAttribute('aria-pressed') === 'true') pfToggle.click();
        orderForm.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }
  });
}

// ── Drop zone ─────────────────────────────────────────────────────
if (drop) {
  drop.addEventListener('click',    () => fileInput.click());
  drop.addEventListener('keydown',  e  => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); fileInput.click(); } });
  drop.addEventListener('dragover', e  => { e.preventDefault(); drop.classList.add('pf-drag-over'); });
  drop.addEventListener('dragleave',()  => drop.classList.remove('pf-drag-over'));
  drop.addEventListener('drop',     e  => {
    e.preventDefault();
    drop.classList.remove('pf-drag-over');
    handleFile(e.dataTransfer?.files?.[0]);
  });
  fileInput.addEventListener('change', () => handleFile(fileInput.files?.[0]));
}

// ── Core ──────────────────────────────────────────────────────────
async function handleFile(file) {
  if (!file) return;

  if (file.type !== 'application/pdf') {
    showStatus('Solo se admite PDF.', 'error'); return;
  }
  if (file.size > 10 * 1024 * 1024) {
    showStatus('Tamaño máximo 10 MB. Comprimir o dividir el archivo.', 'error'); return;
  }

  resultBox.style.display = 'none';
  resultBox.innerHTML     = '';

  showStatus('Leyendo estructura del PDF...', 'scanning');

  const narrativeSteps = [
    { delay: 1400,  msg: 'Analizando texto con IA...' },
    { delay: 4000,  msg: 'Verificando escala e indicadores técnicos...' },
    { delay: 8500,  msg: 'Revisión visual en curso...' },
    { delay: 16000, msg: 'Finalizando análisis...' },
  ];
  const narTimers = narrativeSteps.map(s => setTimeout(() => showStatus(s.msg, 'scanning'), s.delay));

  const form = new FormData();
  form.append('pdf', file);

  try {
    const controller = new AbortController();
    const timeout    = setTimeout(() => controller.abort(), 90000);

    const resp = await fetch(`${WORKER_URL}/api/preflight`, {
      method:  'POST',
      headers: { 'X-Preflight-Token': 'enbruto-pf-2026' },
      body:    form,
      signal:  controller.signal,
    });
    clearTimeout(timeout);
    narTimers.forEach(clearTimeout);

    const data = await resp.json();
    if (!data.ok) throw new Error(data.error || 'Error del servidor.');

    showStatus('Control completo.', 'ok');
    saveToHistory(data, file.name);
    renderResult(data, file.name);

  } catch (err) {
    narTimers.forEach(clearTimeout);
    const msg = err.name === 'AbortError'
      ? 'Tiempo de espera agotado. El Worker puede no estar corriendo.'
      : (err.message || 'Error de conexión.');
    showStatus(msg, 'error');
  }
}

// ── Render resultado ──────────────────────────────────────────────
function renderResult(d, fileName) {
  const t = d.technical;
  const semClass = { green: 'pf-green', yellow: 'pf-yellow', red: 'pf-red' }[d.semaphore] || 'pf-yellow';
  const semLabel = { green: 'LISTO PARA IMPRESIÓN', yellow: 'REVISIÓN RECOMENDADA', red: 'CORRECCIÓN NECESARIA' }[d.semaphore] || '—';
  const semIcon  = { green: '✓', yellow: '▲', red: '✕' }[d.semaphore] || '▲';

  const scaleDisplay = (t.scale || '').replace('_', ':');
  const conf = d.finalReview?.confidence ? Math.round(d.finalReview.confidence * 100) : null;

  const warnings = d.warnings || [];
  const critical = warnings.filter(w => w.severity === 'CRÍTICO');
  const warn     = warnings.filter(w => w.severity === 'advertencia');
  const info     = warnings.filter(w => w.severity === 'info');

  function warnGroup(items, cls, label) {
    if (!items.length) return '';
    return `<div class="pf-warn-group">
      <span class="pf-warn-group-label pf-warn-${cls}">${label}</span>
      ${items.map(w => `<div class="pf-warn-row pf-warn-${cls}"><span class="pf-warn-dot"></span><span class="pf-warn-msg">${w.message}</span></div>`).join('')}
    </div>`;
  }

  const warningBlock = critical.length || warn.length || info.length
    ? warnGroup(critical, 'critical', '● CRÍTICO') + warnGroup(warn, 'warn', '▲ Advertencia') + warnGroup(info, 'info', '○ Info')
    : '<div class="pf-warn-row pf-warn-info"><span class="pf-warn-dot"></span><span class="pf-warn-msg">Sin observaciones.</span></div>';

  resultBox.style.display = 'block';
  const scoreLabel = d.scoreLabel || '';

  resultBox.innerHTML = `
    <div class="pf-semaphore ${semClass}">
      <span class="pf-sem-dot">${semIcon}</span>
      <span class="pf-sem-label">${semLabel}</span>
    </div>

    ${scaleDisplay ? `
    <div class="pf-scale-hero">
      <span class="pf-scale-tag">ESCALA</span>
      <span class="pf-scale-value">${scaleDisplay}</span>
      ${conf !== null ? `<span class="pf-scale-conf">${conf}% confianza</span>` : ''}
    </div>` : ''}

    <div class="pf-score-row">
      <div class="pf-score-ring">${d.score}</div>
      <div class="pf-score-meta">
        <span class="pf-meta-label">ÍNDICE TÉCNICO</span>
        ${scoreLabel ? `<span class="pf-score-label">${scoreLabel}</span>` : ''}
        <span class="pf-meta-file">${fileName}</span>
      </div>
    </div>

    <div class="pf-checklist">
      <div class="pf-check-item">
        <span class="pf-check-label">Formato</span>
        <span class="pf-check-val ${t.format ? 'pf-val-ok' : 'pf-val-warn'}">${t.format || 'NO IDENTIFICADO'}</span>
      </div>
      <div class="pf-check-item">
        <span class="pf-check-label">Páginas</span>
        <span class="pf-check-val pf-val-ok">${t.pages}</span>
      </div>
      <div class="pf-check-item">
        <span class="pf-check-label">Texto vectorial</span>
        <span class="pf-check-val ${t.hasVectorText ? 'pf-val-ok' : 'pf-val-err'}">${t.hasVectorText ? 'SÍ' : 'NO — POSIBLE ESCANEO'}</span>
      </div>
      <div class="pf-check-item">
        <span class="pf-check-label">Rótulo</span>
        <span class="pf-check-val ${d.finalReview?.hasRotulo ? 'pf-val-ok' : 'pf-val-warn'}">${d.finalReview?.hasRotulo ? 'DETECTADO' : 'NO DETECTADO'}</span>
      </div>
    </div>

    <div class="pf-warnings">${warningBlock}</div>

    <div class="pf-submit-row">
      ${d.semaphore === 'red'
        ? `<button type="button" class="pf-submit-btn pf-submit-btn--warn" data-pf-send data-filename="${fileName}">Enviar de todas formas</button>
           <span class="pf-submit-note">El archivo presenta problemas críticos. El estudio puede rechazarlo o solicitar correcciones.</span>`
        : `<button type="button" class="pf-submit-btn" data-pf-send data-filename="${fileName}">Enviar a imprimir</button>`
      }
      <button type="button" class="pf-new-btn" id="pfNewReview">Nueva revisión</button>
    </div>

    <div class="pf-footer">
      <span class="pf-review-id">REV-${d.reviewId}</span>
      <span class="pf-ts">${new Date(d.timestamp).toLocaleString('es-AR')}</span>
      <span class="pf-analyzed-by pf-analyzed-${d.analyzedBy === 'cerebras' ? 'ai' : 'det'}">${d.analyzedBy === 'cerebras' ? '✶ IA (Cerebras)' + (d.visualReview ? ' + Visual' : '') : (d.analyzedBy === 'deterministic-fallback' ? '⚠ BÁSICO (fallback)' : 'BÁSICO')}</span>
    </div>
    ${d._aiError ? `<p style="font-size:0.65rem;color:#dc2626;margin:8px 0 0;word-break:break-all">Error IA: ${d._aiError}</p>` : ''}
    ${d._visualError ? `<p style="font-size:0.65rem;color:#d97706;margin:4px 0 0;word-break:break-all">Error visual: ${d._visualError}</p>` : ''}

    ${renderHistoryPanel()}
`;
}

// ── Historial ─────────────────────────────────────────────────────
const PF_HISTORY_KEY = 'pfHistory';

function saveToHistory(d, fileName) {
  try {
    const hist = JSON.parse(localStorage.getItem(PF_HISTORY_KEY) || '[]');
    hist.unshift({
      reviewId:  d.reviewId,
      fileName,
      semaphore: d.semaphore,
      score:     d.score,
      scale:     (d.technical?.scale || '').replace('_', ':'),
      ts:        d.timestamp,
    });
    localStorage.setItem(PF_HISTORY_KEY, JSON.stringify(hist.slice(0, 5)));
  } catch (_) {}
}

function renderHistoryPanel() {
  try {
    const hist = JSON.parse(localStorage.getItem(PF_HISTORY_KEY) || '[]');
    if (hist.length < 2) return '';
    const rows = hist.slice(1, 5).map(h => {
      const dot = { green: '●', yellow: '▲', red: '✕' }[h.semaphore] || '▲';
      const cls = { green: 'pf-val-ok', yellow: 'pf-val-warn', red: 'pf-val-err' }[h.semaphore] || 'pf-val-warn';
      const date = new Date(h.ts).toLocaleString('es-AR', { day:'2-digit', month:'2-digit', hour:'2-digit', minute:'2-digit' });
      return `<div class="pf-hist-row">
        <span class="pf-hist-dot ${cls}">${dot}</span>
        <span class="pf-hist-file">${h.fileName}</span>
        <span class="pf-hist-scale">${h.scale || '—'}</span>
        <span class="pf-hist-score">${h.score}pts</span>
        <span class="pf-hist-ts">${date}</span>
      </div>`;
    }).join('');
    return `<div class="pf-history">
      <span class="pf-history-label">Revisiones anteriores</span>
      ${rows}
    </div>`;
  } catch (_) { return ''; }
}

// ── Status helper ─────────────────────────────────────────────────
function showStatus(msg, state) {
  statusBox.style.display = 'flex';
  statusBox.className     = `pf-status pf-status-${state}`;
  statusText.textContent  = msg;
}
