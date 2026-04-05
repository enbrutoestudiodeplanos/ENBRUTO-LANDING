// set-password.js — Alta inicial: cliente crea su contraseña vía Apps Script (sin Supabase)

const SET_APPS_URL = 'https://script.google.com/macros/s/AKfycbyHjHN5w6-Bff7Wk88-ac4qRGD_fr_Vpqk96dc8dv4KjCqpzgfJdZG7cbsW9qE3BURbTw/exec';

function setMsg(text, type = '') {
  const el = document.getElementById('setPasswordMsg');
  if (!el) return;
  el.textContent = text;
  el.classList.remove('is-error', 'is-success');
  if (type) el.classList.add(type);
}

function show(id) {
  ['loadingView', 'formView', 'successView', 'errorView'].forEach(v => {
    const el = document.getElementById(v);
    if (el) el.style.display = (v === id) ? 'block' : 'none';
  });
}

async function appsPost(payload) {
  const ctrl = new AbortController();
  const tid  = setTimeout(() => ctrl.abort(), 30000);
  try {
    const res = await fetch(SET_APPS_URL, {
      method:  'POST',
      headers: { 'Content-Type': 'text/plain;charset=utf-8' },
      body:    JSON.stringify(payload),
      signal:  ctrl.signal,
    });
    clearTimeout(tid);
    return JSON.parse(await res.text());
  } catch (err) {
    clearTimeout(tid);
    throw err;
  }
}

document.addEventListener('DOMContentLoaded', () => {
  const token = new URLSearchParams(window.location.search).get('token') || '';

  if (!token || token.length < 20) {
    document.getElementById('errorText').textContent = 'El enlace es inválido o incompleto.';
    show('errorView');
    return;
  }

  show('formView');

  document.getElementById('setPasswordForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const pass    = document.getElementById('newPassword').value;
    const confirm = document.getElementById('confirmPassword').value;

    if (pass.length < 8) {
      setMsg('La contraseña debe tener al menos 8 caracteres.', 'is-error'); return;
    }
    if (pass !== confirm) {
      setMsg('Las contraseñas no coinciden.', 'is-error'); return;
    }

    setMsg('');
    const btn = e.currentTarget.querySelector('button[type="submit"]');
    if (btn) { btn.disabled = true; btn.innerHTML = '<span class="btn-spinner"></span><span>Guardando…</span>'; }

    try {
      const data = await appsPost({ action: 'set_password', token, password: pass });
      if (!data.ok) {
        setMsg(data.error || 'No se pudo guardar la contraseña.', 'is-error');
        if (btn) { btn.disabled = false; btn.innerHTML = '<span>Crear contraseña</span>'; }
        return;
      }
      show('successView');
    } catch {
      setMsg('Error de conexión. Intentá de nuevo.', 'is-error');
      if (btn) { btn.disabled = false; btn.innerHTML = '<span>Crear contraseña</span>'; }
    }
  });
});
