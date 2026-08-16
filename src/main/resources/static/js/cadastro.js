/* =========================================================
   cadastro.js — lógica exclusiva da tela de cadastro (cadastro.html)
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

  const formCadastro = document.getElementById("form-cadastro");
  const cadastroMsg = document.getElementById("cadastro-msg");
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

  formCadastro.addEventListener("submit", async (e) => {
    e.preventDefault();
    setMsg(cadastroMsg, "Criando conta…", "");

    const dados = Object.fromEntries(new FormData(formCadastro));

    try {
      await Api.cadastrar(dados);
      setMsg(cadastroMsg, "Conta criada! Redirecionando para o login…", "ok");
      formCadastro.reset();
      setTimeout(() => { location.href = "login.html"; }, 1000);
    } catch (err) {
      setMsg(cadastroMsg, "Não foi possível criar a conta. O email já pode estar em uso.", "error");
    }
  });
})();