$(document).ready(function () {
  let dataAtual = new Date();
  let horarioSelecionado = null;
  let userType = null;
  let userId = null;
  let horariosGlobais = [];

  // ====================
  // Utilitários de modal
  // ====================
  function showModal($el) {
    $el.css({ display: "flex", opacity: 0 }).animate({ opacity: 1 }, 180);
  }

  function hideModals() {
    $(".modal")
      .not("#messageModal")
      .animate({ opacity: 0 }, 160, function () {
        $(this).css("display", "none");
      });
  }

  // ====================
  // Funções auxiliares
  // ====================
  // parse seguro: transforma "YYYY-MM-DD" em Date no horário LOCAL (meia-noite local)
  function parseLocalDate(isoDateStr) {
    if (!isoDateStr) return null;
    if (isoDateStr instanceof Date)
      return new Date(
        isoDateStr.getFullYear(),
        isoDateStr.getMonth(),
        isoDateStr.getDate()
      );
    // evita passar strings com hora; aceita "YYYY-MM-DD" e "YYYY-MM-DD HH:MM:SS"
    const dateOnly = isoDateStr.split(" ")[0];
    const parts = dateOnly.split("-").map(Number);
    // parts = [YYYY, MM, DD]
    if (parts.length !== 3 || parts.some(isNaN)) return new Date(isoDateStr); // fallback
    return new Date(parts[0], parts[1] - 1, parts[2]);
  }

  function formatDate(date) {
    // retorna "YYYY-MM-DD" baseado em data LOCAL
    const d = parseLocalDate(date);
    const ano = d.getFullYear();
    const mes = String(d.getMonth() + 1).padStart(2, "0");
    const dia = String(d.getDate()).padStart(2, "0");
    return `${ano}-${mes}-${dia}`;
  }

  function formatarDataBR(dataISO) {
    if (!dataISO) return "";
    const d = parseLocalDate(dataISO);
    const dia = String(d.getDate()).padStart(2, "0");
    const mes = String(d.getMonth() + 1).padStart(2, "0");
    const ano = d.getFullYear();
    return `${dia}/${mes}/${ano}`;
  }

  function formatarHora(hora) {
    if (!hora) return "";
    return hora.slice(0, 5);
  }

  function getMonday(d) {
    const dt = parseLocalDate(d);
    const day = dt.getDay();
    const diff = dt.getDate() - day + (day === 0 ? -6 : 1);
    const monday = new Date(dt.getFullYear(), dt.getMonth(), dt.getDate()); // cópia limpa
    monday.setDate(diff);
    return monday;
  }

  // ====================
  // Carregar semana
  // ====================
  function carregarSemana(dataBase) {
    let segunda = getMonday(dataBase);
    let domingo = new Date(segunda);
    domingo.setDate(domingo.getDate() + 6);

    $("#semanaTitulo").text(
      `Semana de ${formatarDataBR(segunda)} a ${formatarDataBR(domingo)}`
    );

    $.ajax({
      url: "get_horarios.php",
      method: "GET",
      data: { inicio: formatDate(segunda), fim: formatDate(domingo) },
      dataType: "json",
    })
      .done(function (dados) {
        horariosGlobais = dados;
        montarTabela(segunda, dados);
      })
      .fail(function (xhr) {
        console.error("Erro get_horarios.php:", xhr.status, xhr.responseText);
        alert("Erro ao carregar horários. Veja console (Network).");
      });
  }

  // ====================
  // Montar tabela
  // ====================
  function montarTabela(segunda, horarios) {
    let tbody = $("#tabela-agenda tbody");
    tbody.empty();

    for (let h = 8; h <= 18; h++) {
      let row = $("<tr>");
      row.append(`<td>${h}:00</td>`);

      for (let i = 0; i < 7; i++) {
        // base segura: parseia "segunda" como local (string ou Date)
        let base = parseLocalDate(segunda);
        let dataCelula = new Date(
          base.getFullYear(),
          base.getMonth(),
          base.getDate()
        );
        dataCelula.setDate(base.getDate() + i);

        dataCelula.setDate(segunda.getDate() + i);
        let dataStr = formatDate(dataCelula);
        let horaStr = (h < 10 ? "0" : "") + h + ":00:00";

        let horariosCelula = horarios.filter(
          (hItem) => hItem.data === dataStr && hItem.hora === horaStr
        );

        let td = $("<td>");

        if (horariosCelula.length > 0) {
          let ocupadoSlot = horariosCelula.find((x) => x.status === "ocupado");
          let meuSlotOcupado = horariosCelula.find(
            (x) => x.dentista_id == userId && x.status === "ocupado"
          );
          let meuSlotDisponivel = horariosCelula.find(
            (x) => x.dentista_id == userId && x.status === "disponivel"
          );
          let meuHorarioUsuario = horariosCelula.find(
            (x) => x.usuario_id === userId && x.status === "ocupado"
          );
          let temDisponivel = horariosCelula.some(
            (x) => x.status === "disponivel"
          );

          if (userType === "dentista") {
            if (meuSlotOcupado) {
              td.addClass("finalizar")
                .text("Finalizar")
                .attr("data-action", "finalizar")
                .attr("data-horario-id", meuSlotOcupado.id)
                .attr("data-date", dataStr)
                .attr("data-hour", horaStr);
            } else if (meuSlotDisponivel) {
              td.addClass("disponivel")
                .text("Meu horário")
                .attr("data-action", "desmarcar")
                .attr("data-horario-id", meuSlotDisponivel.id)
                .attr("data-date", dataStr)
                .attr("data-hour", horaStr);
            } else if (horariosCelula.length >= 5) {
              td.addClass("ocupado").text("Indisponível");
            } else {
              td.text("-")
                .attr("data-action", "marcar")
                .attr("data-date", dataStr)
                .attr("data-hour", horaStr);
            }
          } else {
            if (meuHorarioUsuario) {
              td.addClass("ocupado").text("Agendado");
            } else if (temDisponivel) {
              td.addClass("disponivel")
                .text("Disponível")
                .attr("data-action", "agendar")
                .attr("data-date", dataStr)
                .attr("data-hour", horaStr);
            } else {
              td.text("-");
            }
          }
        } else {
          if (userType === "dentista") {
            td.text("-")
              .attr("data-action", "marcar")
              .attr("data-date", dataStr)
              .attr("data-hour", horaStr);
          } else {
            td.text("-");
          }
        }

        row.append(td);
      }

      tbody.append(row);
    }
  }

  // ====================
  // Modais
  // ====================
  function abrirModalAgendamento(data, hora, horariosCelula) {
    $("#modal-data").text(formatarDataBR(data));
    $("#modal-hora").text(formatarHora(hora));
    let select = $("#dentistaSelect");
    select.empty();

    horariosCelula
      .filter((h) => h.status === "disponivel")
      .forEach((h) => {
        const titulo = h.nome_completo
          ? `Dr(a) ${h.nome_completo}`
          : h.dentista;
        select.append(
          `<option value="${h.id}" data-dentista-id="${h.dentista_id}">${titulo}</option>`
        );
      });

    horarioSelecionado = { data, hora, horariosCelula };
    showModal($("#modal"));

    const dentistaIds = [
      ...new Set(horariosCelula.map((h) => h.dentista_id)),
    ].filter(Boolean);
    if (dentistaIds.length === 0) {
      $("#modal-local").text("Local não disponível");
      return;
    }

    $.ajax({
      url: "get_dentistas_info.php",
      method: "GET",
      data: { ids: dentistaIds.join(",") },
      dataType: "json",
    })
      .done(function (resp) {
        if (!resp.success) {
          $("#modal-local").text("Local não disponível");
          return;
        }

        const mapa = resp.data;
        $("#dentistaSelect option").each(function () {
          const dentId = $(this).data("dentista-id");
          const info = mapa[dentId];
          if (info) {
            const localResumido = ` ${
              info.nome_clinica ? info.nome_clinica + "<br>" : ""
            }Rua: ${info.rua_clinica ? info.rua_clinica + "," : ""} ${
              info.numero_clinica ? info.numero_clinica + "<br>" : ""
            }Bairro: ${
              info.bairro_clinica ? info.bairro_clinica + "<br>" : ""
            }CEP: ${info.cep_clinica ? "" + info.cep_clinica : ""}`;
            $(this).data("local", localResumido);
          } else {
            $(this).data("local", "Local não disponível");
          }
        });

        select.off("change").on("change", function () {
          const local =
            $(this).find(":selected").data("local") || "Local não disponível";
          $("#modal-local").html(local);
        });

        select.trigger("change");
      })
      .fail(function (xhr) {
        console.error(
          "Erro get_dentistas_info.php:",
          xhr.status,
          xhr.responseText
        );
        $("#modal-local").text("Local não disponível");
      });
  }

  function abrirModalMarcar(data, hora) {
    horarioSelecionado = { data, hora };
    $("#confirmTitle").text("Marcar horário");
    $("#confirmText").text(
      `Deseja liberar o horário ${formatarHora(hora)} em ${formatarDataBR(
        data
      )}?`
    );
    showModal($("#confirmModal"));
  }

  function abrirModalDesmarcar(id, data, hora) {
    horarioSelecionado = { id, data, hora };
    $("#confirmTitle").text("Remover horário");
    $("#confirmText").text(
      `Deseja remover o horário ${formatarHora(hora)} em ${formatarDataBR(
        data
      )}?`
    );
    showModal($("#confirmModal"));
  }

  function abrirMensagem(titulo, texto) {
    $("#messageTitle").text(titulo);
    $("#messageText").html(texto);
    showModal($("#messageModal"));
  }

  // ====================
  // Modal Finalizar Consulta
  // ====================
  function abrirModalFinalizar(horario_id, data, hora) {
    $("#finalizar-data").text(formatarDataBR(data));
    $("#finalizar-hora").text(formatarHora(hora));
    $("#procedimento").val("");
    $("#observacoes").val("");
    $("#finalizarModal").data("horario-id", horario_id);
    showModal($("#finalizarModal"));
  }

  // Confirma finalização
  $("#finalizarConfirmar")
    .off("click")
    .on("click", function () {
      const horario_id = $("#finalizarModal").data("horario-id");
      const procedimento = $("#procedimento").val().trim();
      const observacoes = $("#observacoes").val().trim();

      $.ajax({
        url: "finalizar_consulta.php",
        method: "POST",
        data: JSON.stringify({ horario_id, procedimento, observacoes }),
        contentType: "application/json",
        dataType: "json",
        success: function (res) {
          hideModals();
          abrirMensagem(res.success ? "Sucesso" : "Erro", res.message);
          if (res.success) carregarSemana(dataAtual);
        },
        error: function (xhr) {
          console.error(
            "Erro finalizar_consulta.php:",
            xhr.status,
            xhr.responseText
          );
        },
      });
    });

  $("#finalizarCancelar")
    .off("click")
    .on("click", function () {
      hideModals();
    });

  // ====================
  // Eventos dos Modais
  // ====================
  $(".close, #modal-cancelar, #confirmarNao")
    .off("click")
    .on("click", function () {
      hideModals();
    });

  $("#messageModal .ok")
    .off("click")
    .on("click", function (e) {
      e.stopPropagation();
      $("#messageModal").animate({ opacity: 0 }, 160, function () {
        $(this).css("display", "none");
      });
    });

  $("#modal-confirmar").on("click", function () {
    let horario_id_valor = $("#dentistaSelect").val(); // Renomeia a variável para evitar confusão de escopo

    if (!horario_id_valor) {
      abrirMensagem("Erro", "Selecione um dentista");
      return;
    }

    // 1. CHAMA O AGENDAMENTO
    $.post(
      "agendar_horario.php",
      { horario_id: horario_id_valor }, // Garante que está usando o valor correto
      function (res) {
        if (res.success) {
          abrirMensagem("Sucesso", "Horário agendado com sucesso!");
          carregarSemana(dataAtual);

          // 2. CHAMA O ENVIO DE EMAIL SOMENTE NO SUCESSO
          $.post(
            "enviar_email.php",
            { horario_id: horario_id_valor }, // Usa o valor garantido
            function (emailRes) {
              if (emailRes.success) {
                console.log("E-mails enviados com sucesso!");
              } else {
                // Se der 'horario_id não enviado', o problema está no PHP que
                // não está recebendo o POST, mesmo o JS enviando.
                console.warn("Erro ao enviar e-mails:", emailRes.message);
              }
            },
            "json"
          );
        } else {
          abrirMensagem("Erro", res.message || "Não foi possível agendar.");
        }
        hideModals();
      },
      "json"
    );
  });

  $("#confirmarSim").on("click", function () {
    if (horarioSelecionado && horarioSelecionado.id) {
      $.post(
        "desmarcar_horario.php",
        { id: horarioSelecionado.id },
        function (res) {
          if (res.success) {
            abrirMensagem("Sucesso", "Horário removido!");
            carregarSemana(dataAtual);
          } else {
            abrirMensagem("Erro", res.message || "Não foi possível remover.");
          }
          hideModals();
        },
        "json"
      );
    } else {
      $.post(
        "/projeto_ASBI-main/agendamento/marcar_horario.php",
        {
          data: horarioSelecionado.data,
          hora: horarioSelecionado.hora,
        },
        function (res) {
          if (res.success) {
            abrirMensagem(
              "Sucesso",
              "Horário liberado! <br> OBS: Não esquecer de finalizar pós consulta."
            );
            setTimeout(() => carregarSemana(dataAtual), 500)
          } else {
            abrirMensagem("Erro", res.message || "Não foi possível liberar.");
          }
          hideModals();
        },
        "json"
      );
    }
  });

  // ====================
  // Clique nas células
  // ====================
  $("#tabela-agenda tbody")
    .off("click", "td[data-action]")
    .on("click", "td[data-action]", function () {
      const action = $(this).attr("data-action");
      const horarioId = $(this).data("horario-id");
      const date = $(this).attr("data-date");
      const hour = $(this).attr("data-hour");

      const dataHoraClicada = new Date(`${date}T${hour}`);
      const agora = new Date();

      if (dataHoraClicada < agora) {
        if (userType === "dentista") {
          abrirMensagem(
            "Aviso",
            "Não é possível marcar ou alterar horários passados."
          );
        } else {
          abrirMensagem("Aviso", "Você não pode marcar horários passados.");
        }
        return;
      }

      if (action === "finalizar") {
        abrirModalFinalizar(horarioId, date, hour);
      } else if (action === "desmarcar") {
        abrirModalDesmarcar(horarioId, date, hour);
      } else if (action === "marcar") {
        abrirModalMarcar(date, hour);
      } else if (action === "agendar") {
        const horariosCelula = horariosGlobais.filter(
          (hItem) => hItem.data === date && hItem.hora === hour
        );
        abrirModalAgendamento(date, hour, horariosCelula);
      }
    });

  // ====================
  // Controles da semana
  // ====================
  $("#prevWeek").click(function () {
    dataAtual.setDate(dataAtual.getDate() - 7);
    carregarSemana(dataAtual);
  });

  $("#nextWeek").click(function () {
    dataAtual.setDate(dataAtual.getDate() + 7);
    carregarSemana(dataAtual);
  });

  $("#dataEscolhida").change(function () {
    dataAtual = parseLocalDate($(this).val());
    carregarSemana(dataAtual);
  });

  // ====================
  // Checar usuário logado
  // ====================
  $.getJSON("get_user.php", function (res) {
    if (!res.logged) {
      window.location.href = "projeto_ASBI-main/login.php";
    } else {
      userType = res.type;
      userId = res.id;
      console.log("Logado como:", userType, "ID:", userId);
      carregarSemana(dataAtual);
    }
  }).fail(function (xhr) {
    console.error("Erro get_user.php:", xhr.status, xhr.responseText);
  });
});
