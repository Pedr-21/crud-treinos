/* =========================================================
   api.js
   Camada única de comunicação com o back-end Spring Boot.
   ========================================================= */

const Api = (() => {

  const STORAGE_KEY_TOKEN = "diario_treino_token";
  const STORAGE_KEY_BASE = "diario_treino_api_base";

  function getBaseUrl() {
    return localStorage.getItem(STORAGE_KEY_BASE) || "http://localhost:8080";
  }

  function setBaseUrl(url) {
    localStorage.setItem(STORAGE_KEY_BASE, url.replace(/\/$/, ""));
  }

  function getToken() {
    return localStorage.getItem(STORAGE_KEY_TOKEN);
  }

  function setToken(token) {
    localStorage.setItem(STORAGE_KEY_TOKEN, token);
  }

  function clearSession() {
    localStorage.removeItem(STORAGE_KEY_TOKEN);
  }

  function isLoggedIn() {
    return !!getToken();
  }

  async function request(path, { method = "GET", body, auth = true, isText = false } = {}) {
    const headers = {};

    if (body !== undefined) headers["Content-Type"] = "application/json";
    if (auth) {
      const token = getToken();
      if (token) headers["Authorization"] = "Bearer " + token;
    }

    const response = await fetch(getBaseUrl() + path, {
      method,
      headers,
      body: body !== undefined ? JSON.stringify(body) : undefined,
    });

    if (response.status === 401 || response.status === 403) {
      clearSession();
      if (!location.pathname.endsWith("login.html") && !location.pathname.endsWith("cadastro.html")) {
        location.href = "login.html";
      }
      throw new Error("Sessão expirada. Faça login novamente.");
    }

    if (!response.ok) {
      const text = await response.text().catch(() => "");
      throw new Error(text || `Erro na requisição (status ${response.status})`);
    }

    if (response.status === 204) return null;

    return isText ? response.text() : response.json();
  }

  return {
    getBaseUrl, setBaseUrl, getToken, setToken, clearSession, isLoggedIn,

    cadastrar: (dto) => request("/auth/cadastro", { method: "POST", body: dto, auth: false }),
    login: (dto) => request("/auth/login", { method: "POST", body: dto, auth: false, isText: true }),

    listarExercicios: () => request("/exercicios"),
    criarExercicio: (dto) => request("/exercicios", { method: "POST", body: dto }),
    deletarExercicio: (id) => request(`/exercicios/${id}`, { method: "DELETE" }),

    listarFichas: () => request("/fichas"),
    criarFicha: (dto) => request("/fichas", { method: "POST", body: dto }),
    deletarFicha: (id) => request(`/fichas/${id}`, { method: "DELETE" }),

    listarVinculos: (fichaId) => request(`/ficha-exercicios?fichaId=${fichaId}`),
    adicionarVinculo: (fichaId, exercicioId, series, repeticoes) =>
      request(`/ficha-exercicios?fichaId=${fichaId}&exercicioId=${exercicioId}&series=${series}&repeticoes=${repeticoes}`,
        { method: "POST" }),
    removerVinculo: (id) => request(`/ficha-exercicios/${id}`, { method: "DELETE" }),
  };
})();