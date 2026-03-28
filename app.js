const PORTAL_URL = "https://portal.enbrutoestudio.com.ar";
const APPS_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbwN-0FLG5GAxrI7PB5cXSEziMegrkN4XHRQvdPZHuc7US34KX2OrFnzRRN1nlXoltJITQ/exec";

const tabs = document.querySelectorAll(".tab");
const views = document.querySelectorAll(".view");

function activateView(name) {
  tabs.forEach((tab) => {
    const isActive = tab.dataset.view === name;
    tab.classList.toggle("is-active", isActive);
    tab.setAttribute("aria-selected", isActive ? "true" : "false");
  });

  views.forEach((view) => {
    const isActive = view.dataset.content === name;
    view.classList.toggle("is-active", isActive);
  });
}

tabs.forEach((tab) => {
  tab.addEventListener("click", () => {
    activateView(tab.dataset.view);
  });
});

function setMessage(el, message, type) {
  el.textContent = message;
  el.classList.remove("is-error", "is-success");
  if (type) el.classList.add(type);
}

function setRichErrorMessage(el, html) {
  el.innerHTML = html;
  el.classList.remove("is-success");
  el.classList.add("is-error");
}

function setButtonLoading(btn, loading, loadingText, fallbackText) {
  btn.disabled = loading;

  if (loading) {
    btn.setAttribute("data-label", btn.textContent);
    btn.innerHTML = `<span class="btn-spinner"></span> ${loadingText}`;
  } else {
    btn.innerHTML = `<span>${btn.getAttribute("data-label") || fallbackText}</span>`;
  }
}

const loginForm = document.getElementById("loginForm");
const requestForm = document.getElementById("requestForm");

if (loginForm) {
  loginForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    const email = document.getElementById("loginEmail").value.trim().toLowerCase();
    const msg = document.getElementById("loginMessage");
    const btn = event.currentTarget.querySelector('button[type="submit"]');

    if (!email) {
      setMessage(msg, "Ingresá un correo válido.", "is-error");
      return;
    }

    setButtonLoading(btn, true, "VALIDANDO...", "ACCEDER");
    setMessage(msg, "");

    try {
      const res = await fetch(APPS_SCRIPT_URL, {
        method: "POST",
        headers: { "Content-Type": "text/plain;charset=utf-8" },
        body: JSON.stringify({
          action: "login",
          email
        })
      });

      const data = await res.json();

      if (!data.ok) {
        setRichErrorMessage(
          msg,
          'Ese correo no tiene acceso habilitado. ¿Querés <a class="msg-link" href="#">solicitar acceso</a>?'
        );

        const link = msg.querySelector(".msg-link");
        if (link) {
          link.addEventListener("click", (e) => {
            e.preventDefault();
            activateView("request");

            const reqEmail = document.getElementById("requestEmail");
            const reqStudio = document.getElementById("requestStudio");

            if (reqEmail) reqEmail.value = email;
            if (reqStudio) reqStudio.focus();
          });
        }
        return;
      }

      const profile = {
        estudio: data.estudio || "-",
        email: data.email || email,
        telefono: data.telefono || ""
      };

      const encoded = btoa(unescape(encodeURIComponent(JSON.stringify(profile))));
      setMessage(msg, "Acceso confirmado. Entrando...", "is-success");

      setTimeout(() => {
        window.location.href = `${PORTAL_URL}/panel.html?session=${encoded}`;
      }, 400);
    } catch (error) {
      setMessage(msg, "No se pudo conectar. Intentá de nuevo.", "is-error");
    } finally {
      setButtonLoading(btn, false, "VALIDANDO...", "ACCEDER");
    }
  });
}

if (requestForm) {
  requestForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    const form = event.currentTarget;
    const msg = document.getElementById("requestMessage");
    const btn = form.querySelector('button[type="submit"]');

    const payload = {
      action: "requestAccess",
      studio: form.studio.value.trim(),
      email: form.email.value.trim(),
      phone: form.phone.value.trim()
    };

    if (!payload.studio || !payload.email || !payload.phone) {
      setMessage(msg, "Completá todos los campos.", "is-error");
      return;
    }

    setButtonLoading(btn, true, "ENVIANDO...", "SOLICITAR ACCESO");
    setMessage(msg, "");

    try {
      const res = await fetch(APPS_SCRIPT_URL, {
        method: "POST",
        headers: { "Content-Type": "text/plain;charset=utf-8" },
        body: JSON.stringify(payload)
      });

      const data = await res.json();

      if (!data.ok) {
        throw new Error(data.error || "No se pudo enviar la solicitud.");
      }

      setMessage(msg, "Solicitud enviada. Te contactaremos por la vía habitual.", "is-success");
      form.reset();
    } catch (error) {
      setMessage(msg, error.message || "No se pudo enviar la solicitud.", "is-error");
    } finally {
      setButtonLoading(btn, false, "ENVIANDO...", "SOLICITAR ACCESO");
    }
  });
}
