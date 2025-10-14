<?php
session_start();
header('Content-Type: application/json');

if (!isset($_SESSION['user_id']) || !isset($_SESSION['user_type'])) {
    echo json_encode(["logged" => false]);
    exit;
}

echo json_encode([
    "logged" => true,
    "id" => $_SESSION['user_id'],
    "type" => $_SESSION['user_type']
]);
