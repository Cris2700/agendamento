<?php
include "db.php";

if (session_status() === PHP_SESSION_NONE) {
    session_set_cookie_params(['path' => '/']); // 🔥 faz a sessão valer em todas as pastas
    session_start();
}



header("Content-Type: application/json");

if (!isset($_SESSION["id"]) || $_SESSION["tipo"] !== "medico") {
  echo json_encode(["success" => false, "message" => "Acesso negado."]);
  exit;
}

$dados = json_decode(file_get_contents("php://input"), true);
$horario_id = $dados["horario_id"] ?? null;
$procedimento = trim($dados["procedimento"] ?? "");
$observacoes = trim($dados["observacoes"] ?? "");

if (!$horario_id) {
  echo json_encode(["success" => false, "message" => "Horário inválido."]);
  exit;
}

try {
  // Pega info do horário (dentista, paciente, data)
  $stmt = $pdo->prepare("SELECT * FROM horarios WHERE id = ?");
  $stmt->execute([$horario_id]);
  $horario = $stmt->fetch(PDO::FETCH_ASSOC);

  if (!$horario) {
    echo json_encode(["success" => false, "message" => "Horário não encontrado."]);
    exit;
  }

  // Cria registro da consulta
  $insert = $pdo->prepare("INSERT INTO consultas (horario_id, dentista_id, usuario_id, data_consulta, procedimento, observacoes)
                           VALUES (?, ?, ?, ?, ?, ?)");
  $insert->execute([
    $horario_id,
    $horario["dentista_id"],
    $horario["usuario_id"],
    $horario["data"],
    $procedimento,
    $observacoes
  ]);

  // Atualiza o status do horário
  $update = $pdo->prepare("UPDATE horarios SET status = 'finalizado' WHERE id = ?");
  $update->execute([$horario_id]);

  echo json_encode(["success" => true, "message" => "Consulta finalizada com sucesso!"]);
} catch (Exception $e) {
  echo json_encode(["success" => false, "message" => "Erro: " . $e->getMessage()]);
}
?>
