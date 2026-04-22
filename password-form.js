// password-form.js — Contraseña via Apps Script (reset y alta inicial)
// Usado por reset-password.html y set-password.html

const _PWD_APPS_URL = 'https://script.google.com/macros/s/AKfycbyHjHN5w6-Bff7Wk88-ac4qRGD_fr_Vpqk96dc8dv4KjCqpzgfJdZG7cbsW9qE3BURbTw/exec';

function _pwdSetMsg(el, text, type = '') {
  if (!el) return;
  el.textContent = text;
  el.classList.remove('is-error', 'is-success');
  if (type) el.classList.add(type);
}

function _pwdShow(id) {
  ['loadingView', 'formView', 'successView', 'errorView'].forEach(v => {
    const el = document.getElementById(v);
    if (el) el.style.display = (v === id) ? 'block' : 'none';
  });
}

async function _pwdAppsPost(payload) {
  const ctrl = new AbortController();
  const tid  = setTimeout(() => ctrl.abort(), 30000);
  try {
    const res = await fetch(_PWD_APPS_URL, {
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
  const isReset = !!document.getElementById('resetForm');
  const form    = document.getElementById(isReset ? 'resetForm' : 'setPasswordForm');
  const msgEl   = document.getElementById(isReset ? 'resetMsg' : 'setPasswordMsg');
  const btnLabel = isReset ? 'Guardar contraseña' : 'Crear contraseña';

  const token = new URLSearchParams(window.location.search).get('token') || '';

  if (!token || token.length < 20) {
    document.getElementById('errorText').textContent = 'El enlace es inválido o incompleto.';
    _pwdShow('errorView');
    return;
  }

  _pwdShow('formView');

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const pass    = document.getElementById('newPassword').value;
    const confirm = document.getElementById('confirmPassword').value;

    if (pass.length < 8) {
      _pwdSetMsg(msgEl, 'La contraseña debe tener al menos 8 caracteres.', 'is-error'); return;
    }
    if (pass !== confirm) {
      _pwdSetMsg(msgEl, 'Las contraseñas no coinciden.', 'is-error'); return;
    }

    _pwdSetMsg(msgEl, '');
    const btn = form.querySelector('button[type="submit"]');
    if (btn) { btn.disabled = true; btn.innerHTML = '<span class="btn-spinner"></span><span>Guardando…</span>'; }

    try {
      const data = await _pwdAppsPost({ action: 'set_password', token, password: pass });
      if (!data.ok) {
        _pwdSetMsg(msgEl, data.error || 'No se pudo guardar la contraseña.', 'is-error');
        if (btn) { btn.disabled = false; btn.innerHTML = `<span>${btnLabel}</span>`; }
        return;
      }
      _pwdShow('successView');
    } catch {
      _pwdSetMsg(msgEl, 'Error de conexión. Intentá de nuevo.', 'is-error');
      if (btn) { btn.disabled = false; btn.innerHTML = `<span>${btnLabel}</span>`; }
    }
  });
});
