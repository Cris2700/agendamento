document.addEventListener("DOMContentLoaded", () => {
  const tabela = document.getElementById("tabela-agenda").querySelector("tbody");
  const semanaTitulo = document.getElementById("semanaTitulo");
  const btnPrev = document.getElementById("prevWeek");
  const btnNext = document.getElementById("nextWeek");

  // Modal de agendamento (responsável) - assume que existem esses elementos no HTML
  const modal = document.getElementById("modal");
  const btnFechar = document.querySelector(".close");
  const btnConfirmar = document.querySelector(".confirmar");
  const btnCancelar = document.querySelector(".cancelar");
  const campoDentista = document.getElementById("modal-dentista");
  const campoLocal = document.getElementById("modal-local");
  const campoData = document.getElementById("modal-data");
  const campoHora = document.getElementById("modal-hora");
  const selectDentista = document.getElementById("dentistaSelect"); // dropdown do modal

  let slotSelecionado = null;

  // ---- Simulação de papéis ----
  let modoAtual = "responsavel"; // padrão
  document.getElementById("modoResponsavel").addEventListener("click", () => {
    modoAtual = "responsavel";
    showMessage("Modo alterado", "Agora você está no modo RESPONSÁVEL", "aviso");
  });
  document.getElementById("modoDentista").addEventListener("click", () => {
    modoAtual = "dentista";
    showMessage("Modo alterado", "Agora você está no modo DENTISTA", "aviso");
  });

  // Lista de dentistas (simulação)
  const dentistas = [
    { id: 1, nome: "Dr. João", local: "Clínica ASBI - Centro" },
    { id: 2, nome: "Dra. Maria", local: "Clínica ASBI - Sul" },
    { id: 3, nome: "Dr. Pedro", local: "Clínica ASBI - Norte" }
  ];

  // ESTADO: sempre usar chave base "dd/mm/aaaa-hh:00" e objeto como valor:
  // agenda[chave] = { status: 'disponivel' } ou { status: 'ocupado', dentista, local }
  let agenda = {};

  // Data inicial = hoje (ajusta pra segunda)
  let currentMonday = getMonday(new Date());

  function getMonday(d) {
    const date = new Date(d);
    const day = date.getDay();
    const diff = date.getDate() - day + (day === 0 ? -6 : 1);
    return new Date(date.setDate(diff));
  }

  // Renderiza célula conforme estado
  function aplicarEstadoNaCelula(td, estado) {
    td.classList.remove("disponivel", "ocupado");
    td.textContent = ""; // por padrão vazio, depois setamos conteúdo
    if (!estado) {
      // célula sem estado - mostra vazia (ou hora se preferir)
      td.textContent = ""; // deixa em branco para demonstrar "não liberado"
      return;
    }
    if (estado.status === "disponivel") {
      td.classList.add("disponivel");
      td.textContent = td.dataset.hora;
    } else if (estado.status === "ocupado") {
      td.classList.add("ocupado");
      // mostra hora + nome do dentista pra ficar claro
      td.textContent = `${td.dataset.hora} — ${estado.dentista || ""}`;
    }
  }

  // Gera a tabela
  function gerarTabela(monday) {
    tabela.innerHTML = "";

    const dias = [];
    for (let i = 0; i < 7; i++) {
      const d = new Date(monday);
      d.setDate(monday.getDate() + i);
      dias.push(d);
    }

    const options = { day: "2-digit", month: "2-digit", year: "numeric" };
    semanaTitulo.textContent =
      `Semana ${dias[0].toLocaleDateString("pt-BR", options)} até ${dias[6].toLocaleDateString("pt-BR", options)}`;

    for (let hora = 8; hora <= 18; hora++) {
      const tr = document.createElement("tr");
      const th = document.createElement("th");
      th.textContent = `${hora.toString().padStart(2, "0")}:00`;
      tr.appendChild(th);

      dias.forEach((dia) => {
        const td = document.createElement("td");

        td.dataset.data = dia.toLocaleDateString("pt-BR");
        td.dataset.hora = `${hora}:00`;
        // chave base (sempre esta)
        const chave = `${td.dataset.data}-${td.dataset.hora}`;

        // estado atual para essa célula (pode ser undefined)
        const estado = agenda[chave];

        // aplica estado visual
        aplicarEstadoNaCelula(td, estado);

        // Clique na célula
        td.addEventListener("click", () => {
          // MODO RESPONSÁVEL: só abre modal se estiver disponível
          if (modoAtual === "responsavel") {
            if (estado && estado.status === "disponivel") {
              slotSelecionado = td;
              campoData.textContent = td.dataset.data;
              campoHora.textContent = td.dataset.hora;

              // popula dropdown de dentistas
              if (selectDentista) {
                selectDentista.innerHTML = "";
                dentistas.forEach(d => {
                  const opt = document.createElement("option");
                  opt.value = d.id;
                  opt.textContent = `${d.nome} — ${d.local}`;
                  selectDentista.appendChild(opt);
                });
              }

              // mostra modal
              modal.style.display = "flex";
               } else if (estado && estado.status === "ocupado") {
    
     showMessage(
      "Horário ocupado",
      `Este horário já foi marcado com ${estado.dentista} em ${estado.local}.`,
      "aviso"
    );
            } else {
              showMessage("Aviso", "Esse horário ainda não foi liberado pelo dentista.", "aviso");
            }
            return;
          }

          // MODO DENTISTA: pode criar disponibilidade, ou confirmar remoção se já disponivel
          if (modoAtual === "dentista") {
            if (estado && estado.status === "disponivel") {
              // já disponível → pedir confirmação para remover
              showConfirm("Remover horário", "Deseja realmente remover este horário disponível?", () => {
                delete agenda[chave];
                gerarTabela(currentMonday); // re-render para manter DOM x estado sincronizados
                showMessage("Sucesso", "Horário removido com sucesso.", "sucesso");
              });
            } else if (estado && estado.status === "ocupado") {
              // horário já agendado — não pode ser mexido pelo dentista aqui
              showMessage("Indisponível", "Este horário já foi agendado por um responsável.", "aviso");
            } else {
              // célula vazia → criar disponibilidade
              agenda[chave] = { status: "disponivel" };
              gerarTabela(currentMonday); // re-render para aplicar classe
              showMessage("Sucesso", "Horário disponibilizado!", "sucesso");
            }
            return;
          }
        });

        tr.appendChild(td);
      });

      tabela.appendChild(tr);
    }
  }

  // navegação semanas
  btnPrev.addEventListener("click", () => {
    currentMonday.setDate(currentMonday.getDate() - 7);
    gerarTabela(currentMonday);
  });
  btnNext.addEventListener("click", () => {
    currentMonday.setDate(currentMonday.getDate() + 7);
    gerarTabela(currentMonday);
  });

  // seleção por data
  const inputData = document.getElementById("dataEscolhida");
  if (inputData) {
    inputData.addEventListener("change", (e) => {
      const dataEscolhida = new Date(e.target.value);
      currentMonday = getMonday(dataEscolhida);
      gerarTabela(currentMonday);
    });
  }

  // handlers do modal de agendamento (responsável)
  if (btnFechar) btnFechar.addEventListener("click", () => modal.style.display = "none");
  if (btnCancelar) btnCancelar.addEventListener("click", () => modal.style.display = "none");

  if (btnConfirmar) {
    btnConfirmar.addEventListener("click", () => {
      if (!slotSelecionado) return showMessage("Erro", "Nenhum horário selecionado.", "erro");

      // pega dentista escolhido no dropdown
      let dentistaObj = null;
      if (selectDentista) {
        const id = selectDentista.value;
        dentistaObj = dentistas.find(d => String(d.id) === String(id));
      }
      // se não tiver dropdown, assume dentista default (padrão)
      if (!dentistaObj) dentistaObj = { nome: slotSelecionado.dataset.dentista || "Dentista", local: slotSelecionado.dataset.local || "Local" };

      const chave = `${slotSelecionado.dataset.data}-${slotSelecionado.dataset.hora}`;

      // marca como ocupado com info do dentista
      agenda[chave] = {
        status: "ocupado",
        dentista: dentistaObj.nome,
        local: dentistaObj.local
      };

      modal.style.display = "none";
      gerarTabela(currentMonday); // re-render para mostrar ocupado
      showMessage("Sucesso", `Consulta confirmada com ${dentistaObj.nome} em ${dentistaObj.local}!`, "sucesso");
    });
  }

  // Função de mensagens (messageModal precisa existir no HTML)
  function showMessage(titulo, texto, tipo = "aviso") {
    const modalMsg = document.getElementById("messageModal");
    const title = document.getElementById("messageTitle");
    const text = document.getElementById("messageText");
    if (!modalMsg || !title || !text) {
      // fallback simples se modal não existir
      console.log(titulo, texto);
      return;
    }
    title.textContent = titulo;
    text.textContent = texto;

    modalMsg.classList.remove("sucesso", "erro", "aviso");
    modalMsg.classList.add(tipo);
    modalMsg.style.display = "flex";

    modalMsg.querySelector(".close").onclick = () => modalMsg.style.display = "none";
    const okBtn = modalMsg.querySelector(".ok");
    if (okBtn) okBtn.onclick = () => modalMsg.style.display = "none";

    window.onclick = (event) => {
      if (event.target == modalMsg) modalMsg.style.display = "none";
    };
  }

  // Função de confirmação estilizada (confirmModal precisa existir no HTML)
  function showConfirm(titulo, texto, onConfirm) {
    const modalConfirm = document.getElementById("confirmModal");
    const title = document.getElementById("confirmTitle");
    const text = document.getElementById("confirmText");
    if (!modalConfirm || !title || !text) {
      // fallback para prompt se modal não existir
      if (confirm(texto)) { if (onConfirm) onConfirm(); }
      return;
    }

    title.textContent = titulo;
    text.textContent = texto;
    modalConfirm.style.display = "flex";

    const btnConf = modalConfirm.querySelector(".confirmar");
    const btnCanc = modalConfirm.querySelector(".cancelar");
    const btnClose = modalConfirm.querySelector(".close");

    // limpa listeners anteriores (substitui)
    btnConf.onclick = () => {
      modalConfirm.style.display = "none";
      if (onConfirm) onConfirm();
    };
    btnCanc.onclick = () => modalConfirm.style.display = "none";
    btnClose.onclick = () => modalConfirm.style.display = "none";

    window.onclick = (event) => {
      if (event.target == modalConfirm) modalConfirm.style.display = "none";
    };
  }

  // primeira renderização
  gerarTabela(currentMonday);
});










