// ─────────────────────────────────────────────────────────────────────────────
// CONFIGURACIÓN — reemplazá estos dos valores con los tuyos
// ─────────────────────────────────────────────────────────────────────────────
const PORTAL_URL      = ‘https://portal.enbrutoestudio.com.ar’;
const APPS_SCRIPT_URL = ‘https://script.google.com/macros/s/AKfycbyOXk1eSBz_OuVeDagtYTbMYQvjVtdcBRaXTHf-X926DcOGp-XFWEveAvKJp0RoYI4ftg/’;
// ─────────────────────────────────────────────────────────────────────────────

const tabs  = document.querySelectorAll(’.tab’);
const views = document.querySelectorAll(’.view’);

function activateView(name) {
tabs.forEach( t => t.classList.toggle(‘is-active’,  t.dataset.view    === name));
views.forEach(v => v.classList.toggle(‘is-active’,  v.dataset.content === name));
}

tabs.forEach(tab => tab.addEventListener(‘click’, () => activateView(tab.dataset.view)));

function setMessage(el, message, type) {
el.textContent = message;
el.classList.remove(‘is-error’, ‘is-success’);
if (type) el.classList.add(type);
}

function setButtonLoading(btn, loading) {
btn.disabled = loading;
if (loading) {
btn.setAttribute(‘data-label’, btn.textContent);
btn.innerHTML = ‘<span class="btn-spinner"></span> VALIDANDO…’;
} else {
btn.textContent = btn.getAttribute(‘data-label’) || ‘ACCEDER’;
}
}

document.getElementById(‘loginForm’).addEventListener(‘submit’, async (event) => {
event.preventDefault();

const email = document.getElementById(‘loginEmail’).value.trim().toLowerCase();
const msg   = document.getElementById(‘loginMessage’);
const btn   = event.currentTarget.querySelector(‘button[type=“submit”]’);

if (!email) {
setMessage(msg, ‘Ingresá un correo válido.’, ‘is-error’);
return;
}

if (APPS_SCRIPT_URL.includes(‘PEGAR_AQUI’)) {
setMessage(msg, ‘Acceso confirmado. Entrando…’, ‘is-success’);
setTimeout(() => { window.location.href = PORTAL_URL + ‘/panel.html’; }, 500);
return;
}

setButtonLoading(btn, true);
setMessage(msg, ‘’);

try {
const res  = await fetch(APPS_SCRIPT_URL, {
method:  ‘POST’,
headers: { ‘Content-Type’: ‘text/plain;charset=utf-8’ },
body:    JSON.stringify({ action: ‘login’, email })
});

```
const data = await res.json();

if (!data.ok) {
  msg.innerHTML = 'Ese correo no tiene acceso habilitado. &iquest;Quer&eacute;s <a class="msg-link" href="#">solicitar acceso</a>?';
  msg.classList.add('is-error');

  msg.querySelector('.msg-link').addEventListener('click', (e) => {
    e.preventDefault();
    activateView('request');
    const reqEmail = document.getElementById('requestEmail');
    if (reqEmail) reqEmail.value = email;
    document.getElementById('requestStudio') && document.getElementById('requestStudio').focus();
  });
  return;
}

const profile = {
  estudio:  data.estudio  || '-',
  email:    data.email    || email,
  telefono: data.telefono || ''
};

const encoded = btoa(unescape(encodeURIComponent(JSON.stringify(profile))));
setMessage(msg, 'Acceso confirmado. Entrando…', 'is-success');
setTimeout(() => {
  window.location.href = PORTAL_URL + '/panel.html?session=' + encoded;
}, 400);
```

} catch (err) {
setMessage(msg, ‘No se pudo conectar. Intentá de nuevo.’, ‘is-error’);
} finally {
setButtonLoading(btn, false);
}
});

document.getElementById(‘requestForm’).addEventListener(‘submit’, async (event) => {
event.preventDefault();

const form = event.currentTarget;
const msg  = document.getElementById(‘requestMessage’);
const btn  = form.querySelector(‘button[type=“submit”]’);

const payload = {
action: ‘requestAccess’,
studio: form.studio.value.trim(),
email:  form.email.value.trim(),
phone:  form.phone.value.trim()
};

if (!payload.studio || !payload.email || !payload.phone) {
setMessage(msg, ‘Completá todos los campos.’, ‘is-error’);
return;
}

if (APPS_SCRIPT_URL.includes(‘PEGAR_AQUI’)) {
setMessage(msg, ‘Solicitud registrada. Te contactaremos pronto.’, ‘is-success’);
form.reset();
return;
}

btn.disabled = true;
btn.textContent = ‘ENVIANDO…’;
setMessage(msg, ‘’);

try {
const res  = await fetch(APPS_SCRIPT_URL, {
method:  ‘POST’,
headers: { ‘Content-Type’: ‘text/plain;charset=utf-8’ },
body:    JSON.stringify(payload)
});
const data = await res.json();

```
if (data.ok) {
  setMessage(msg, 'Solicitud enviada. Te contactaremos por la vía habitual.', 'is-success');
  form.reset();
} else {
  throw new Error(data.error || 'No se pudo enviar la solicitud.');
}
```

} catch (error) {
setMessage(msg, error.message || ‘No se pudo enviar la solicitud.’, ‘is-error’);
} finally {
btn.disabled = false;
btn.textContent = ‘SOLICITAR ACCESO’;
}
});
