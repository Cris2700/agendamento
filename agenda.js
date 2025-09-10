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
  const campoDentista = document.getElementById("modal-dentista");
  const campoLocal = document.getElementById("modal-local");
  const campoData = document.getElementById("modal-data");
  const campoHora = document.getElementById("modal-hora");

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
        td.dataset.dentista = "Dr. João";
        td.dataset.local = "Clínica ASBI - Centro";
        td.dataset.data = dia.toLocaleDateString("pt-BR");
        td.dataset.hora = `${hora}:00`;

        const chave = `${td.dataset.data}-${td.dataset.hora}`;

        // Verifica se já existe no agenda
        if (agenda[chave]) {
          td.classList.add(agenda[chave]);
          td.textContent = td.dataset.hora;
        }

        // Clique em cada célula
        td.addEventListener("click", () => {
          if (td.classList.contains("disponivel")) {
            if (modoAtual === "responsavel") {
              // Responsável agenda consulta
              slotSelecionado = td;
              campoDentista.textContent = td.dataset.dentista;
              campoLocal.textContent = td.dataset.local;
              campoData.textContent = td.dataset.data;
              campoHora.textContent = td.dataset.hora;
              modal.style.display = "flex";
            } 
          }  else {
            if (modoAtual === "dentista") {
              // Criar disponibilidade
              td.classList.add("disponivel");
              agenda[chave] = "disponivel"; // salva no estado
              td.textContent = td.dataset.hora;
              showMessage("Horário disponibilizado!");
            } else {
              showMessage("Esse horário ainda não foi liberado pelo dentista.");
            }
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
      slotSelecionado.classList.remove("disponivel");
      slotSelecionado.classList.add("ocupado");

      const chave = `${slotSelecionado.dataset.data}-${slotSelecionado.dataset.hora}`;
      agenda[chave] = "ocupado"; // salva no estado

      modal.style.display = "none";
      showMessage("Consulta confirmada!");
    }
  });
  function showMessage(titulo, texto, tipo = "aviso") {
  const modal = document.getElementById("messageModal");
  const title = document.getElementById("messageTitle");
  const text = document.getElementById("messageText");

  // aplica título e texto
  title.textContent = titulo;
  text.textContent = texto;

  // remove classes antigas e adiciona a nova
  modal.classList.remove("sucesso", "erro", "aviso");
  modal.classList.add(tipo);

  modal.style.display = "flex";

  // botão fechar e ok
  modal.querySelector(".close").onclick = () => modal.style.display = "none";
  modal.querySelector(".ok").onclick = () => modal.style.display = "none";

  // fechar clicando fora
  window.onclick = (event) => {
    if (event.target == modal) {
      modal.style.display = "none";
    }
  };
}


  // Primeira renderização
  gerarTabela(currentMonday);
});



