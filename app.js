// ═══════════════════════════════════════════════════════════════════
// EN BRUTO ESTUDIO — app.js (sitio principal enbrutoestudio.com.ar)
// Maneja: login con magic link + solicitud de nuevo acceso
// ═══════════════════════════════════════════════════════════════════

const APPS_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbyHjHN5w6-Bff7Wk88-ac4qRGD_fr_Vpqk96dc8dv4KjCqpzgfJdZG7cbsW9qE3BURbTw/exec';

// ── Red ───────────────────────────────────────────────────────────

async function postData(payload) {
const controller = new AbortController();
const timeoutId  = setTimeout(() => controller.abort(), 30000);

try {
const res  = await fetch(APPS_SCRIPT_URL, {
method:  'POST',
headers: { 'Content-Type': 'text/plain;charset=utf-8' },
body:    JSON.stringify(payload),
signal:  controller.signal,
});
clearTimeout(timeoutId);

const text = await res.text();
if (!res.ok) throw new Error('Error del servidor.');
try { return JSON.parse(text); }
catch { throw new Error('Respuesta inválida del servidor.'); }
} catch (err) {
clearTimeout(timeoutId);
if (err.name === 'AbortError') throw new Error('El servidor tardó demasiado. Intentá de nuevo.');
throw err;
}
}

// ── Helpers UI ────────────────────────────────────────────────────

function setMessage(id, text, type = '') {
const el = document.getElementById(id);
if (!el) return;
el.textContent = text;
el.classList.remove('is-error', 'is-success');
if (type) el.classList.add(type);
}

function setButtonState(btn, loading) {
if (!btn) return;
btn.disabled   = loading;
btn.innerHTML  = loading
? '<span class="btn-spinner"></span><span>Enviando…</span>'
: `<span>${btn.dataset.label || 'Enviar'}</span>`;
}

// ── TABS ──────────────────────────────────────────────────────────

function initTabs() {
  const tabs = document.querySelectorAll('.tab');
  const views = document.querySelectorAll('.view');

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      const target = tab.dataset.view;

      tabs.forEach(t => {
        t.classList.toggle('is-active', t === tab);
        t.setAttribute('aria-selected', t === tab ? 'true' : 'false');
      });

      views.forEach(v => {
        v.classList.toggle('is-active', v.dataset.content === target);
      });
    });
  });
}

// ── LOGIN — Solicitar magic link ──────────────────────────────────

async function handleLogin(e) {
  e.preventDefault();
  const email = document.getElementById('loginEmail')?.value.trim().toLowerCase() || '';
  const btn = e.currentTarget.querySelector('button[type="submit"]');

if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
setMessage('loginMessage', 'Ingresá un correo válido.', 'is-error');
return;
}

setMessage('loginMessage', '');
setButtonState(btn, true);

try {
// El backend responde siempre de forma genérica — no revela si el email existe
const data = await postData({ action: 'request_access', email });
if (!data.ok) throw new Error(data.error || 'No se pudo solicitar el enlace.');
showLoginSent();
} catch (err) {
setMessage('loginMessage', err.message || 'Error de conexión. Intentá de nuevo.', 'is-error');
setButtonState(btn, false);
}
}

function showLoginSent() {
document.getElementById('loginFormView').style.display = 'none';
document.getElementById('loginSentView').style.display = 'block';
}

function resetLoginForm() {
document.getElementById('loginFormView').style.display = 'block';
document.getElementById('loginSentView').style.display  = 'none';
const input = document.getElementById('loginEmail');
if (input) { input.value = ''; input.focus(); }
setMessage('loginMessage', '');
// Restaurar botón
const btn = document.querySelector('#loginForm button[type="submit"]');
if (btn) setButtonState(btn, false);
}

// ── SOLICITAR ACCESO — Alta de nuevo cliente ──────────────────────

async function handleRequest(e) {
e.preventDefault();
const studio = document.getElementById('requestStudio')?.value.trim() || '';
const email  = document.getElementById('requestEmail')?.value.trim().toLowerCase() || '';
const phone  = document.getElementById('requestPhone')?.value.trim() || '';
const btn    = e.currentTarget.querySelector('button[type="submit"]');

if (!studio) { setMessage('requestMessage', 'Ingresá el nombre del estudio.', 'is-error'); return; }
if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
setMessage('requestMessage', 'Ingresá un correo válido.', 'is-error'); return;
}
if (!phone) { setMessage('requestMessage', 'Ingresá un teléfono de contacto.', 'is-error'); return; }

setMessage('requestMessage', '');
setButtonState(btn, true);

try {
const data = await postData({ action: 'solicitar_acceso', studio, email, phone });
if (!data.ok) throw new Error(data.error || 'No se pudo enviar la solicitud.');
showRequestSent();
} catch (err) {
setMessage('requestMessage', err.message || 'Error de conexión. Intentá de nuevo.', 'is-error');
setButtonState(btn, false);
}
}

function showRequestSent() {
document.getElementById('requestFormView').style.display = 'none';
document.getElementById('requestSentView').style.display = 'block';
}

function resetRequestForm() {
document.getElementById('requestFormView').style.display = 'block';
document.getElementById('requestSentView').style.display  = 'none';
['requestStudio', 'requestEmail', 'requestPhone'].forEach(id => {
const el = document.getElementById(id);
if (el) el.value = '';
});
setMessage('requestMessage', '');
const btn = document.querySelector('#requestForm button[type="submit"]');
if (btn) setButtonState(btn, false);
document.getElementById('requestStudio')?.focus();
}

// ── INIT ──────────────────────────────────────────────────────────

document.addEventListener('DOMContentLoaded', () => {
// Guardar labels originales de los botones para restaurar tras loading
document.querySelectorAll('.primary-button').forEach(btn => {
btn.dataset.label = btn.querySelector('span')?.textContent || btn.textContent;
});

initTabs();

document.getElementById('loginForm')?.addEventListener('submit', handleLogin);
document.getElementById('requestForm')?.addEventListener('submit', handleRequest);
document.getElementById('loginResetBtn')?.addEventListener('click', resetLoginForm);
document.getElementById('requestResetBtn')?.addEventListener('click', resetRequestForm);
});
