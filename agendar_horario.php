<?php
include "db.php";
session_start();

header("Content-Type: application/json");

if (!isset($_SESSION["user_id"]) || $_SESSION["user_type"] !== "usuario") {
  echo json_encode(["success" => false, "message" => "Acesso negado."]);
  exit;
}

$usuario_id = $_SESSION["user_id"];
$horario_id = $_POST["horario_id"] ?? null;

if (!$horario_id) {
  echo json_encode(["success" => false, "message" => "Horário inválido."]);
  exit;
}

// 1️⃣ pega a data desse horário
$stmt = $pdo->prepare("SELECT data FROM horarios WHERE id = ?");
$stmt->execute([$horario_id]);
$horario = $stmt->fetch(PDO::FETCH_ASSOC);

if (!$horario) {
  echo json_encode(["success" => false, "message" => "Horário não encontrado."]);
  exit;
}

$data = $horario["data"];

// 2️⃣ verifica se o usuário já tem uma consulta nesse dia
$check = $pdo->prepare("
  SELECT COUNT(*) FROM horarios 
  WHERE usuario_id = ? AND data = ?
");
$check->execute([$usuario_id, $data]);
$existe = $check->fetchColumn();

if ($existe > 0) {
  echo json_encode(["success" => false, "message" => "Você já possui uma consulta neste dia."]);
  exit;
}

// 3️⃣ faz o agendamento
$stmt = $pdo->prepare("
  UPDATE horarios 
  SET status = 'ocupado', usuario_id = ? 
  WHERE id = ? AND status = 'disponivel'
");
$ok = $stmt->execute([$usuario_id, $horario_id]);

if ($ok) {
  echo json_encode(["success" => true, "message" => "Horário agendado com sucesso!"]);
} else {
  echo json_encode(["success" => false, "message" => "Erro ao agendar horário."]);
}

?>

