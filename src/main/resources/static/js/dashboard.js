/* =========================================================
   dashboard.js — lógica do painel principal (dashboard.html)
   ========================================================= */

(() => {
  if (!Api.isLoggedIn()) {
    location.href = "login.html";
    return;
  }

  // ---------- helpers ----------

  function emailDoToken() {
    try {
      const payload = Api.getToken().split(".")[1];
      const decoded = JSON.parse(atob(payload.replace(/-/g, "+").replace(/_/g, "/")));
      return decoded.sub || "";
    } catch {
      return "";
    }
  }

  function escapeHtml(str) {
    return String(str).replace(/[&<>"']/g, (c) => ({
      "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"
    }[c]));
  }

  // ---------- topbar ----------

  document.getElementById("user-chip").textContent = emailDoToken();
  document.getElementById("btn-logout").addEventListener("click", () => {
    Api.clearSession();
    location.href = "login.html";
  });

  // ---------- navegação entre views ----------

  const tabs = document.querySelectorAll(".tabs--section .tab");
  const views = {
    fichas: document.getElementById("view-fichas"),
    exercicios: document.getElementById("view-exercicios"),
  };

  tabs.forEach((tab) => {
    tab.addEventListener("click", () => {
      tabs.forEach((t) => { t.classList.remove("active"); t.setAttribute("aria-selected", "false"); });
      tab.classList.add("active");
      tab.setAttribute("aria-selected", "true");

      Object.values(views).forEach((v) => v.classList.add("hidden"));
      views[tab.dataset.view].classList.remove("hidden");

      if (tab.dataset.view === "exercicios") carregarExercicios();
    });
  });

  // =========================================================
  // FICHAS
  // =========================================================

  const fichasGrid = document.getElementById("fichas-grid");
  const fichasEmpty = document.getElementById("fichas-empty");
  const btnNovaFicha = document.getElementById("btn-nova-ficha");
  const formFicha = document.getElementById("form-ficha");
  const btnCancelarFicha = document.getElementById("btn-cancelar-ficha");

  let exerciciosCache = [];

  btnNovaFicha.addEventListener("click", () => {
    formFicha.classList.toggle("hidden");
    if (!formFicha.classList.contains("hidden")) formFicha.querySelector("input").focus();
  });

  btnCancelarFicha.addEventListener("click", () => {
    formFicha.reset();
    formFicha.classList.add("hidden");
  });

  formFicha.addEventListener("submit", async (e) => {
    e.preventDefault();
    const dados = Object.fromEntries(new FormData(formFicha));
    try {
      await Api.criarFicha(dados);
      formFicha.reset();
      formFicha.classList.add("hidden");
      carregarFichas();
    } catch (err) {
      alert("Não foi possível criar a ficha: " + err.message);
    }
  });

  async function carregarFichas() {
    let fichas = [];
    try {
      fichas = await Api.listarFichas();
    } catch (err) {
      alert("Não foi possível carregar as fichas: " + err.message);
      return;
    }

    fichasEmpty.classList.toggle("hidden", fichas.length > 0);
    fichasGrid.innerHTML = "";

    for (const ficha of fichas) {
      const card = document.createElement("div");
      card.className = "ficha-card";
      card.innerHTML = `
        <button class="ficha-delete" title="Excluir ficha" aria-label="Excluir ficha">✕</button>
        <h3>${escapeHtml(ficha.nome)}</h3>
        <span class="ficha-count">ver exercícios →</span>
      `;

      card.querySelector(".ficha-delete").addEventListener("click", async (ev) => {
        ev.stopPropagation();
        if (!confirm(`Excluir a ficha "${ficha.nome}"?`)) return;
        try {
          await Api.deletarFicha(ficha.id);
          carregarFichas();
        } catch (err) {
          alert("Não foi possível excluir: " + err.message);
        }
      });

      card.addEventListener("click", () => abrirModalFicha(ficha));
      fichasGrid.appendChild(card);
    }
  }

  // =========================================================
  // EXERCICIOS
  // =========================================================

  const exerciciosTbody = document.getElementById("exercicios-tbody");
  const exerciciosEmpty = document.getElementById("exercicios-empty");
  const btnNovoExercicio = document.getElementById("btn-novo-exercicio");
  const formExercicio = document.getElementById("form-exercicio");
  const btnCancelarExercicio = document.getElementById("btn-cancelar-exercicio");

  btnNovoExercicio.addEventListener("click", () => {
    formExercicio.classList.toggle("hidden");
    if (!formExercicio.classList.contains("hidden")) formExercicio.querySelector("input").focus();
  });

  btnCancelarExercicio.addEventListener("click", () => {
    formExercicio.reset();
    formExercicio.classList.add("hidden");
  });

  formExercicio.addEventListener("submit", async (e) => {
    e.preventDefault();
    const dados = Object.fromEntries(new FormData(formExercicio));
    try {
      await Api.criarExercicio(dados);
      formExercicio.reset();
      formExercicio.classList.add("hidden");
      carregarExercicios();
    } catch (err) {
      alert("Não foi possível criar o exercício: " + err.message);
    }
  });

  async function carregarExercicios() {
    try {
      exerciciosCache = await Api.listarExercicios();
    } catch (err) {
      alert("Não foi possível carregar os exercícios: " + err.message);
      return;
    }

    exerciciosEmpty.classList.toggle("hidden", exerciciosCache.length > 0);
    exerciciosTbody.innerHTML = "";

    const grupos = {};
    for (const ex of exerciciosCache) {
      const chave = (ex.grupoMuscular || "Outros").trim() || "Outros";
      if (!grupos[chave]) grupos[chave] = [];
      grupos[chave].push(ex);
    }

    const nomesGrupos = Object.keys(grupos).sort((a, b) => a.localeCompare(b, "pt-BR"));

    for (const nomeGrupo of nomesGrupos) {
      const trGrupo = document.createElement("tr");
      trGrupo.className = "group-row";
      trGrupo.innerHTML = `<td colspan="3">${escapeHtml(nomeGrupo)}</td>`;
      exerciciosTbody.appendChild(trGrupo);

      for (const ex of grupos[nomeGrupo]) {
        const tr = document.createElement("tr");
        tr.innerHTML = `
          <td>${escapeHtml(ex.nome)}</td>
          <td>${escapeHtml(ex.grupoMuscular || "—")}</td>
          <td><button class="row-delete" title="Excluir">✕</button></td>
        `;
        tr.querySelector(".row-delete").addEventListener("click", async () => {
          if (!confirm(`Excluir o exercício "${ex.nome}"?`)) return;
          try {
            await Api.deletarExercicio(ex.id);
            carregarExercicios();
          } catch (err) {
            alert("Não foi possível excluir: " + err.message);
          }
        });
        exerciciosTbody.appendChild(tr);
      }
    }
  }

  // =========================================================
  // MODAL: vincular exercícios a uma ficha
  // =========================================================

  const modal = document.getElementById("modal-ficha");
  const modalTitulo = document.getElementById("modal-ficha-titulo");
  const btnFecharModal = document.getElementById("btn-fechar-modal");
  const formVincular = document.getElementById("form-vincular");
  const selectExercicio = document.getElementById("select-exercicio");
  const vinculosList = document.getElementById("vinculos-list");
  const vinculosEmpty = document.getElementById("vinculos-empty");

  let fichaAtual = null;

  async function abrirModalFicha(ficha) {
    fichaAtual = ficha;
    modalTitulo.textContent = ficha.nome;

    if (exerciciosCache.length === 0) {
      try { exerciciosCache = await Api.listarExercicios(); } catch { /* segue mesmo assim */ }
    }

    const gruposSelect = {};
    for (const ex of exerciciosCache) {
      const chave = (ex.grupoMuscular || "Outros").trim() || "Outros";
      if (!gruposSelect[chave]) gruposSelect[chave] = [];
      gruposSelect[chave].push(ex);
    }
    const nomesGruposSelect = Object.keys(gruposSelect).sort((a, b) => a.localeCompare(b, "pt-BR"));

    selectExercicio.innerHTML = `<option value="">Escolha um exercício…</option>` +
      nomesGruposSelect.map((nomeGrupo) => `
        <optgroup label="${escapeHtml(nomeGrupo)}">
          ${gruposSelect[nomeGrupo].map((ex) => `<option value="${ex.id}">${escapeHtml(ex.nome)}</option>`).join("")}
        </optgroup>
      `).join("");

    modal.classList.remove("hidden");
    await carregarVinculos();
  }

  btnFecharModal.addEventListener("click", () => modal.classList.add("hidden"));
  modal.addEventListener("click", (e) => { if (e.target === modal) modal.classList.add("hidden"); });

  async function carregarVinculos() {
    let vinculos = [];
    try {
      vinculos = await Api.listarVinculos(fichaAtual.id);
    } catch (err) {
      alert("Não foi possível carregar os exercícios da ficha: " + err.message);
      return;
    }

    vinculosEmpty.classList.toggle("hidden", vinculos.length > 0);
    vinculosList.innerHTML = "";

    for (const v of vinculos) {
      const li = document.createElement("li");
      li.innerHTML = `
        <span class="ex-name">${escapeHtml(v.exercicio.nome)}</span>
        <span class="ex-meta">${v.series} × ${v.repeticoes}</span>
        <button class="ex-remove" title="Remover">✕</button>
      `;
      li.querySelector(".ex-remove").addEventListener("click", async () => {
        try {
          await Api.removerVinculo(v.id);
          carregarVinculos();
        } catch (err) {
          alert("Não foi possível remover: " + err.message);
        }
      });
      vinculosList.appendChild(li);
    }
  }

  formVincular.addEventListener("submit", async (e) => {
    e.preventDefault();
    const dados = Object.fromEntries(new FormData(formVincular));
    if (!dados.exercicioId) return;

    try {
      await Api.adicionarVinculo(fichaAtual.id, dados.exercicioId, dados.series, dados.repeticoes);
      formVincular.reset();
      carregarVinculos();
    } catch (err) {
      alert("Não foi possível adicionar: " + err.message);
    }
  });

  // ---------- start ----------
  carregarFichas();
  carregarExercicios();
})();