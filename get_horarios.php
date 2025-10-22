<?php
include "db.php";

$inicioSemana = $_GET['inicio'] ?? date("Y-m-d");
$fimSemana    = $_GET['fim'] ?? date("Y-m-d");

$stmt = $pdo->prepare("
    SELECT 
        h.id,
        h.data,
        h.hora,
        h.status,
        h.dentista_id,
        d.nome_usuario AS dentista,
        d.nome_completo AS nome_completo,
        h.usuario_id,
        u.nome_usuario AS usuario
    FROM horarios h
    JOIN dentistas d ON h.dentista_id = d.id
    LEFT JOIN usuario u ON h.usuario_id = u.id
    WHERE h.data BETWEEN :inicio AND :fim
    ORDER BY h.data, h.hora
");
$stmt->execute([
    ":inicio" => $inicioSemana,
    ":fim"    => $fimSemana
]);

$horarios = $stmt->fetchAll(PDO::FETCH_ASSOC);

echo json_encode($horarios);