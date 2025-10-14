<?php
session_start();
include "db.php";
header('Content-Type: application/json');

$email = $_POST['email'] ?? '';
$senha = $_POST['senha'] ?? '';

if (empty($email) || empty($senha)) {
    echo json_encode(["success" => false, "message" => "Email e senha são obrigatórios"]);
    exit;
}

try {
    // tenta usuario
    $stmt = $pdo->prepare("SELECT * FROM usuario WHERE email = :email AND senha = :senha LIMIT 1");
    $stmt->execute([":email" => $email, ":senha" => $senha]);
    $user = $stmt->fetch();

    if ($user) {
        $_SESSION['user_id'] = $user['id'];
        $_SESSION['user_type'] = "usuario";
        echo json_encode(["success" => true, "type" => "usuario"]);
        exit;
    }

    // tenta dentista
    $stmt = $pdo->prepare("SELECT * FROM dentistas WHERE email = :email AND senha = :senha LIMIT 1");
    $stmt->execute([":email" => $email, ":senha" => $senha]);
    $dent = $stmt->fetch();

    if ($dent) {
        $_SESSION['user_id'] = $dent['id'];
        $_SESSION['user_type'] = "dentista";
        echo json_encode(["success" => true, "type" => "dentista"]);
        exit;
    }

    echo json_encode(["success" => false, "message" => "Credenciais inválidas"]);
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(["success" => false, "message" => "Erro: " . $e->getMessage()]);
}


