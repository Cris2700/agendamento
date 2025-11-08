<?php
// marcar_horario.php
session_start();
include "db.php";
header('Content-Type: application/json; charset=utf-8');

function input() {
    $ct = $_SERVER['CONTENT_TYPE'] ?? '';
    if (strpos($ct, 'application/json') !== false) {
        $d = json_decode(file_get_contents('php://input'), true);
        return is_array($d) ? $d : [];
    }
    return $_POST;
}

if (!isset($_SESSION['tipo']) || $_SESSION['tipo'] !== 'medico') {
    http_response_code(403);
    echo json_encode(["success" => false, "message" => "Apenas dentistas podem marcar horários."]);
    exit;
}

$dataIn = input();
$data = $dataIn['data'] ?? null;
$hora = $dataIn['hora'] ?? null;
$dentista_id = $_SESSION['id'];

if (!$data || !$hora) {
    http_response_code(400);
    echo json_encode(["success" => false, "message" => "Parâmetros 'data' e 'hora' são obrigatórios."]);
    exit;
}

try {
    // 1) verifica se esse dentista já marcou esse slot
    $stmt = $pdo->prepare("SELECT id FROM horarios WHERE dentista_id = :dentista AND data = :data AND hora = :hora LIMIT 1");
    $stmt->execute([":dentista"=>$dentista_id, ":data"=>$data, ":hora"=>$hora]);
    if ($stmt->fetch()) {
        echo json_encode(["success" => false, "message" => "Você já marcou esse horário."]);
        exit;
    }

    // 2) verifica limite total de dentistas nesse slot
    $stmt = $pdo->prepare("SELECT COUNT(*) as c FROM horarios WHERE data = :data AND hora = :hora");
    $stmt->execute([":data"=>$data, ":hora"=>$hora]);
    $count = (int)$stmt->fetchColumn();
    if ($count >= 5) {
        echo json_encode(["success" => false, "message" => "Limite de 5 dentistas atingido para este horário."]);
        exit;
    }

    // 3) insere novo registro como disponível
    $stmt = $pdo->prepare("INSERT INTO horarios (dentista_id, data, hora, status) VALUES (:dentista, :data, :hora, 'disponivel')");
    $stmt->execute([":dentista"=>$dentista_id, ":data"=>$data, ":hora"=>$hora]);

    echo json_encode(["success" => true, "message" => "Horário marcado com sucesso."]);
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(["success" => false, "message" => "Erro: ".$e->getMessage()]);
}



