<?php
session_start();
include "db.php";
header("Content-Type: application/json");

// verifica se usuário está logado
if (!isset($_SESSION["user_id"])) {
    echo json_encode(["success" => false, "message" => "Usuário não logado"]);
    exit;
}

$usuario_id = $_SESSION["user_id"];

// retorna todos os dias que o usuário já foi atendido
$stmt = $pdo->prepare("
    SELECT DATE(data) as dia 
    FROM horarios 
    WHERE usuario_id = ? AND status = 'finalizado'
");
$stmt->execute([$usuario_id]);
$rows = $stmt->fetchAll(PDO::FETCH_ASSOC);

$datasBloqueadas = [];
foreach ($rows as $r) {
    $datasBloqueadas[$r['dia']] = true;
}

echo json_encode([
    "success" => true,
    "datasBloqueadas" => $datasBloqueadas
]);
?>
