document.addEventListener("DOMContentLoaded", () => {
  const tabela = document.getElementById("tabela-agenda").querySelector("tbody");
  const semanaTitulo = document.getElementById("semanaTitulo");
  const btnPrev = document.getElementById("prevWeek");
  const btnNext = document.getElementById("nextWeek");

  // Modal (só para responsável)
  const modal = document.getElementById("modal");
  const btnFechar = document.querySelector(".close");
  const btnConfirmar = document.querySelector(".confirmar");
  const btnCancelar = document.querySelector(".cancelar");
  const campoData = document.getElementById("modal-data");
  const campoHora = document.getElementById("modal-hora");
  const selectDentista = document.getElementById("dentistaSelect");
  const campoLocal = document.getElementById("modal-local");

  let slotSelecionado = null;

  // ---- Simulação de papéis ----
  let modoAtual = "responsavel"; // padrão
  document.getElementById("modoResponsavel").addEventListener("click", () => {
    modoAtual = "responsavel";
    alert("Agora você está no modo RESPONSÁVEL");
  });
  document.getElementById("modoDentista").addEventListener("click", () => {
    modoAtual = "dentista";
    alert("Agora você está no modo DENTISTA");
  });

  // Lista de dentistas (simulação)
  const dentistas = [
    { id: 1, nome: "Dr. João", local: "Clínica ASBI - Centro" },
    { id: 2, nome: "Dra. Maria", local: "Clínica ASBI - Sul" },
    { id: 3, nome: "Dr. Pedro", local: "Clínica ASBI - Norte" }
  ];

  // Objeto para guardar os horários
  let agenda = {};

  // Data inicial = hoje
  let currentMonday = getMonday(new Date());

  // Função: achar segunda-feira
  function getMonday(d) {
    const date = new Date(d);
    const day = date.getDay();
    const diff = date.getDate() - day + (day === 0 ? -6 : 1);
    return new Date(date.setDate(diff));
  }

  // Gerar a tabela da semana
  function gerarTabela(monday) {
    tabela.innerHTML = "";

    const dias = [];
    for (let i = 0; i < 7; i++) {
      const d = new Date(monday);
      d.setDate(monday.getDate() + i);
      dias.push(d);
    }

    // Atualiza título com dia/mês/ano
    const options = { day: "2-digit", month: "2-digit", year: "numeric" };
    semanaTitulo.textContent =
      `Semana ${dias[0].toLocaleDateString("pt-BR", options)} até ${dias[6].toLocaleDateString("pt-BR", options)}`;

    // Horários 08:00 → 18:00
    for (let hora = 8; hora <= 18; hora++) {
      const tr = document.createElement("tr");

      const th = document.createElement("th");
      th.textContent = `${hora.toString().padStart(2, "0")}:00`;
      tr.appendChild(th);

      dias.forEach((dia) => {
        const td = document.createElement("td");

        // Dados do slot
        td.dataset.data = dia.toLocaleDateString("pt-BR");
        td.dataset.hora = `${hora}:00`;

        const chaveBase = td.dataset.data + "-" + td.dataset.hora;

        // Se já tiver status no agenda, aplica classe
        if (agenda[chaveBase]) {
          td.classList.add("disponivel");
          td.textContent = td.dataset.hora;
        }

        // Clique em cada célula
        td.addEventListener("click", () => {
          if (modoAtual === "responsavel") {
            if (td.classList.contains("disponivel")) {
              // Modal abre apenas se o horário estiver liberado
              slotSelecionado = td;
              campoData.textContent = td.dataset.data;
              campoHora.textContent = td.dataset.hora;

              // Popula dropdown com dentistas disponíveis
              selectDentista.innerHTML = "";
              dentistas.forEach(d => {
                const option = document.createElement("option");
                option.value = d.id;
                option.textContent = d.nome;
                selectDentista.appendChild(option);
              });

              // Atualiza o local do dentista selecionado
              const dentistaSelecionado = dentistas[0];
              campoLocal.textContent = dentistaSelecionado.local;

              selectDentista.onchange = () => {
                const idSelecionado = selectDentista.value;
                const dentista = dentistas.find(d => d.id == idSelecionado);
                campoLocal.textContent = dentista.local;
              };

              modal.style.display = "flex";
            } else {
              // Aviso se horário não foi liberado
              showMessage("Aviso", "Esse horário ainda não foi liberado pelo dentista.", "aviso");
            }
          } else if (modoAtual === "dentista") {
            // Dentista cria disponibilidade em qualquer célula
            td.classList.add("disponivel");
            agenda[chaveBase] = "disponivel";
            td.textContent = td.dataset.hora;
            showMessage("Sucesso", "Horário disponibilizado!", "sucesso");
          }
        });

        tr.appendChild(td);
      });

      tabela.appendChild(tr);
    }
  }

  // Botões de navegação
  btnPrev.addEventListener("click", () => {
    currentMonday.setDate(currentMonday.getDate() - 7);
    gerarTabela(currentMonday);
  });
  btnNext.addEventListener("click", () => {
    currentMonday.setDate(currentMonday.getDate() + 7);
    gerarTabela(currentMonday);
  });

  document.getElementById("dataEscolhida").addEventListener("change", (e) => {
    const dataEscolhida = new Date(e.target.value);
    currentMonday = getMonday(dataEscolhida);
    gerarTabela(currentMonday);
  });

  // Modal (responsável)
  btnFechar.addEventListener("click", () => modal.style.display = "none");
  btnCancelar.addEventListener("click", () => modal.style.display = "none");
  btnConfirmar.addEventListener("click", () => {
    if (slotSelecionado) {
      const dentistaId = selectDentista.value;
      const dentista = dentistas.find(d => d.id == dentistaId);

      slotSelecionado.classList.remove("disponivel");
      slotSelecionado.classList.add("ocupado");

      const chave = `${slotSelecionado.dataset.data}-${slotSelecionado.dataset.hora}-${dentistaId}`;
      agenda[chave] = {
        dentista: dentista.nome,
        local: dentista.local
      };

      modal.style.display = "none";
      showMessage("Sucesso", `Consulta confirmada com ${dentista.nome} em ${dentista.local}!`, "sucesso");
    }
  });

  // Função de mensagem
  function showMessage(titulo, texto, tipo = "aviso") {
    const modalMsg = document.getElementById("messageModal");
    const title = document.getElementById("messageTitle");
    const text = document.getElementById("messageText");

    title.textContent = titulo;
    text.textContent = texto;

    modalMsg.classList.remove("sucesso", "erro", "aviso");
    modalMsg.classList.add(tipo);

    modalMsg.style.display = "flex";

    modalMsg.querySelector(".close").onclick = () => modalMsg.style.display = "none";
    modalMsg.querySelector(".ok").onclick = () => modalMsg.style.display = "none";

    window.onclick = (event) => {
      if (event.target == modalMsg) {
        modalMsg.style.display = "none";
      }
    };
  }

  // Primeira renderização
  gerarTabela(currentMonday);
});








