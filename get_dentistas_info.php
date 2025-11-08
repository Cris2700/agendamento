<?php
// get_dentistas_info.php
include "db.php";
header("Content-Type: application/json");

$ids = $_GET['ids'] ?? '';

if (empty($ids)) {
    echo json_encode(["success" => false, "message" => "Nenhum id informado"]);
    exit;
}

// sanitize: manter apenas números e vírgulas
$ids = preg_replace('/[^0-9,]/', '', $ids);
$idsArr = array_filter(array_map('intval', explode(',', $ids)));

if (count($idsArr) === 0) {
    echo json_encode(["success" => false, "message" => "IDs inválidos"]);
    exit;
}

// construir placeholders para prepared statement
$placeholders = implode(',', array_fill(0, count($idsArr), '?'));

$sql = "
    SELECT id,
           nome_completo,
           nome_clinica,
           cep_clinica,
           bairro_clinica,
           rua_clinica,
           numero_clinica
    FROM dentistas
    WHERE id IN ($placeholders)
";

$stmt = $pdo->prepare($sql);
$stmt->execute($idsArr);
$rows = $stmt->fetchAll(PDO::FETCH_ASSOC);

// montar mapa por id para acesso rápido no JS
$result = [];
foreach ($rows as $r) {
    $result[$r['id']] = $r;
}

echo json_encode(["success" => true, "data" => $result]);
