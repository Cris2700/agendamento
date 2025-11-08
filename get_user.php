<?php
if (session_status() === PHP_SESSION_NONE) {
    session_set_cookie_params(['path' => '/']);
    session_start();
}

header('Content-Type: application/json');

if (!isset($_SESSION['id']) || !isset($_SESSION['tipo'])) {
    echo json_encode(["logged" => false]);
    exit;
}

$tipo = $_SESSION['tipo'];

// converte nomes antigos
if ($tipo === 'medico') $tipo = 'dentista';
if ($tipo === 'cliente') $tipo = 'usuario';

echo json_encode([
    "logged" => true,
    "id" => $_SESSION['id'],
    "type" => $tipo
]);
