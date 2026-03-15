const PORTAL_URL = 'https://portal.enbrutoestudio.com.ar';
const APPS_SCRIPT_URL = 'PEGAR_AQUI_TU_URL_DE_APPS_SCRIPT';

const tabs = document.querySelectorAll('.tab');
const views = document.querySelectorAll('.view');

function activateView(name) {
  tabs.forEach((tab) => tab.classList.toggle('is-active', tab.dataset.view === name));
  views.forEach((view) => view.classList.toggle('is-active', view.dataset.content === name));
}

tabs.forEach((tab) => {
  tab.addEventListener('click', () => activateView(tab.dataset.view));
});

function setMessage(el, message, type = '') {
  el.textContent = message;
  el.classList.remove('is-error', 'is-success');
  if (type) el.classList.add(type);
}

document.getElementById('loginForm').addEventListener('submit', (event) => {
  event.preventDefault();
  const email = document.getElementById('loginEmail').value.trim();
  const msg = document.getElementById('loginMessage');
  if (!email) {
    setMessage(msg, 'Ingresá un correo válido.', 'is-error');
    return;
  }
  setMessage(msg, 'Abriendo portal…');
  const target = `${PORTAL_URL}?email=${encodeURIComponent(email)}`;
  setTimeout(() => { window.location.href = target; }, 250);
});

document.getElementById('requestForm').addEventListener('submit', async (event) => {
  event.preventDefault();
  const form = event.currentTarget;
  const msg = document.getElementById('requestMessage');
  const payload = {
    action: 'requestAccess',
    studio: form.studio.value.trim(),
    email: form.email.value.trim(),
    phone: form.phone.value.trim()
  };

  if (!payload.studio || !payload.email || !payload.phone) {
    setMessage(msg, 'Completá todos los campos.', 'is-error');
    return;
  }

  if (APPS_SCRIPT_URL.includes('PEGAR_AQUI')) {
    setMessage(msg, 'Solicitud registrada en modo demo. Después la conectamos al backend.', 'is-success');
    form.reset();
    return;
  }

  try {
    setMessage(msg, 'Enviando solicitud…');
    const response = await fetch(APPS_SCRIPT_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'text/plain;charset=utf-8' },
      body: JSON.stringify(payload)
    });
    const data = await response.json();
    if (data.ok) {
      setMessage(msg, 'Solicitud enviada. Te contactaremos por la vía habitual.', 'is-success');
      form.reset();
    } else {
      throw new Error(data.error || 'No se pudo enviar la solicitud.');
    }
  } catch (error) {
    setMessage(msg, error.message || 'No se pudo enviar la solicitud.', 'is-error');
  }
});
