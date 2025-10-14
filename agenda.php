<?php 
    include "limpar_horario.php";
?>

<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Agenda ASBI</title>
  <link rel="stylesheet" href="style.css">
  <script src="https://code.jquery.com/jquery-3.7.1.js"></script>
</head>
<body>
<header>
  <h1>Agenda ASBI</h1>
  <div class="user-actions">
    <a href="logout.php" id="logoutBtn" class="logout-btn">Logout</a>
  </div>
</header>

<main>
  <!-- Seleção de data -->
  <div class="data-selector">
    <label for="dataEscolhida">Escolher data:</label>
    <input type="date" id="dataEscolhida">
  </div>

  <!-- Controles da semana -->
  <div class="semana-controles">
    <button id="prevWeek">⬅️</button>
    <h2 id="semanaTitulo">Semana atual</h2>
    <button id="nextWeek">➡️</button>
  </div>

 

  <!-- Tabela de horários -->
  <table id="tabela-agenda">
    <thead>
      <tr>
        <th>Hora</th>
        <th>Segunda</th>
        <th>Terça</th>
        <th>Quarta</th>
        <th>Quinta</th>
        <th>Sexta</th>
        <th>Sábado</th>
        <th>Domingo</th>
      </tr>
    </thead>
    <tbody>
      <!-- JS vai preencher -->
    </tbody>
  </table>
</main>

<!-- Modal de agendamento -->
<div id="modal" class="modal">
  <div class="modal-content">
    <span class="close">&times;</span>
    <h3>Confirmar Agendamento</h3>
    <p><strong>Data:</strong> <span id="modal-data"></span></p>
    <p><strong>Hora:</strong> <span id="modal-hora"></span></p>
    <label for="dentistaSelect"><strong>Dentista:</strong></label>
    <select id="dentistaSelect"></select>
    <p><strong>Local:</strong> <span id="modal-local"></span></p>
    <button id="modal-confirmar" class="confirmar">Sim</button>
    <button id="modal-cancelar" class="cancelar">Não</button>
  </div>
</div>

<!-- Modal de mensagens -->
<div id="messageModal" class="modal">
  <div class="modal-content">
    <span class="close">&times;</span>
    <h3 id="messageTitle" class="messageTitle"></h3>
    <p id="messageText" class="messageText"></p>
    <button class="btn ok">OK</button>
  </div>
</div>

<!-- Modal de confirmação -->
<div id="confirmModal" class="modal">
  <div class="modal-content">
    <span class="close">&times;</span>
    <h2 id="confirmTitle">Confirmar ação</h2>
    <p id="confirmText">Deseja realmente remover este horário disponível?</p>
    <div class="buttons">
      <button id="confirmarSim" class="confirmar">Sim</button>
      <button id="confirmarNao" class="cancelar">Não</button>
    </div>
  </div>
</div>
<!-- Modal Finalizar Consulta -->
<div id="finalizarModal" class="modal">
  <div class="modal-content">
    <span class="close">&times;</span>
    <h3>Finalizar Consulta</h3>

    <p><strong>Data:</strong> <span id="finalizar-data"></span></p>
    <p><strong>Hora:</strong> <span id="finalizar-hora"></span></p>

    <label for="procedimento"><strong>Procedimento:</strong></label>
    <textarea id="procedimento" rows="3"  placeholder="Ex: Limpeza, extração..." style="width: 100%; padding: 6px; margin-bottom: 10px;"></textarea>

    <label for="observacoes"><strong>Observações:</strong></label>
    <textarea id="observacoes" placeholder="Escreva as observações..." rows="4" style="width: 100%; padding: 6px;"></textarea>

    <div style="margin-top: 15px;">
      <button id="finalizarConfirmar" class="confirmar">Salvar</button>
      <button id="finalizarCancelar" class="cancelar">Cancelar</button>
    </div>
  </div>
</div>

<script src="agenda.js"></script>
</body>
</html>

