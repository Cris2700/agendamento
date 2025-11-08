<?php
include "db.php";

try {
    $stmt = $pdo->prepare("
        DELETE FROM horarios
        WHERE data < CURDATE()
        AND id NOT IN (SELECT horario_id FROM consultas)
    ");
    $stmt->execute();

    
    $count = $stmt->rowCount();
    error_log("[$_SERVER[REQUEST_TIME]] Limpeza executada: $count horários removidos.");
} catch (PDOException $e) {
    error_log("Erro ao limpar horários antigos: " . $e->getMessage());
}
?>
