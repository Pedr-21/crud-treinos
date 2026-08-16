/* =========================================================
   login.js — lógica exclusiva da tela de login (login.html)
   ========================================================= */

(() => {
  if (Api.isLoggedIn()) {
    location.href = "dashboard.html";
    return;
  }

  // olho de mostrar/ocultar senha
  document.querySelectorAll(".toggle-password").forEach((btn) => {
    btn.addEventListener("click", () => {
      const input = document.getElementById(btn.dataset.target);
      const mostrando = input.type === "text";
      input.type = mostrando ? "password" : "text";
      btn.classList.toggle("is-visible", !mostrando);
      btn.setAttribute("aria-label", mostrando ? "Mostrar senha" : "Ocultar senha");
    });
  });

  const formLogin = document.getElementById("form-login");
  const loginMsg = document.getElementById("login-msg");
  const apiBaseLabel = document.getElementById("api-base-label");
  const btnChangeApi = document.getElementById("btn-change-api");

  apiBaseLabel.textContent = Api.getBaseUrl();

  btnChangeApi.addEventListener("click", () => {
    const novaUrl = prompt("Endereço da API (ex: http://localhost:8080):", Api.getBaseUrl());
    if (novaUrl) {
      Api.setBaseUrl(novaUrl);
      apiBaseLabel.textContent = Api.getBaseUrl();
    }
  });

  function setMsg(el, text, tone) {
    el.textContent = text;
    el.dataset.tone = tone || "";
  }

  formLogin.addEventListener("submit", async (e) => {
    e.preventDefault();
    setMsg(loginMsg, "Entrando…", "");

    const dados = Object.fromEntries(new FormData(formLogin));

    try {
      const token = await Api.login(dados);
      Api.setToken(token);
      location.href = "dashboard.html";
    } catch (err) {
      setMsg(loginMsg, "Email ou senha inválidos.", "error");
    }
  });
})();