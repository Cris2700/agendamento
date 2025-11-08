<?php

if (session_status() === PHP_SESSION_NONE) {
    session_set_cookie_params(['path' => '/']); // 🔥 faz a sessão valer em todas as pastas
    session_start();
}


include "db.php";
header("Content-Type: application/json");

if (!isset($_SESSION['id']) || $_SESSION['tipo'] !== "medico") {
    echo json_encode(["success" => false, "message" => "Apenas dentistas podem desmarcar."]);
    exit;
}

$id = $_POST['id'] ?? null;
$dentista_id = $_SESSION['id'];

if (!$id) {
    echo json_encode(["success" => false, "message" => "ID do horário obrigatório"]);
    exit;
}

try {
    // Só remover se o horário for do dentista logado
    $stmt = $pdo->prepare("DELETE FROM horarios WHERE id = :id AND dentista_id = :dentista_id");
    $stmt->execute([":id" => $id, ":dentista_id" => $dentista_id]);

    if ($stmt->rowCount() > 0) {
        echo json_encode(["success" => true, "message" => "Horário removido com sucesso"]);
    } else {
        echo json_encode(["success" => false, "message" => "Você não pode remover esse horário"]);
    }
} catch (Exception $e) {
    echo json_encode(["success" => false, "message" => $e->getMessage()]);
}


