/* =========================================================
   auth.js — lógica da tela de login/cadastro (index.html)
   ========================================================= */

(() => {
  // Se já estiver logado, pula direto pro painel
  if (Api.isLoggedIn()) {
    location.href = "dashboard.html";
    return;
  }

  const tabLogin = document.getElementById("tab-login");
  const tabCadastro = document.getElementById("tab-cadastro");
  const formLogin = document.getElementById("form-login");
  const formCadastro = document.getElementById("form-cadastro");
  const loginMsg = document.getElementById("login-msg");
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

  function showTab(which) {
    const isLogin = which === "login";
    tabLogin.classList.toggle("active", isLogin);
    tabCadastro.classList.toggle("active", !isLogin);
    tabLogin.setAttribute("aria-selected", String(isLogin));
    tabCadastro.setAttribute("aria-selected", String(!isLogin));
    formLogin.classList.toggle("hidden", !isLogin);
    formCadastro.classList.toggle("hidden", isLogin);
  }

  tabLogin.addEventListener("click", () => showTab("login"));
  tabCadastro.addEventListener("click", () => showTab("cadastro"));

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

  formCadastro.addEventListener("submit", async (e) => {
    e.preventDefault();
    setMsg(cadastroMsg, "Criando conta…", "");

    const dados = Object.fromEntries(new FormData(formCadastro));

    try {
      await Api.cadastrar(dados);
      setMsg(cadastroMsg, "Conta criada! Faça login para continuar.", "ok");
      formCadastro.reset();
      setTimeout(() => showTab("login"), 900);
    } catch (err) {
          setMsg(cadastroMsg, "Não foi possível criar a conta. O email já pode estar em uso.", "error");
    }
  });
})();