<?php
include "db.php";

try {
    
    $stmt = $pdo->prepare("
        DELETE FROM horarios
        WHERE data < CURDATE()
        AND id NOT IN (SELECT horario_id FROM consultas)
    ");
    $stmt->execute();

    echo json_encode(["success" => true, "message" => "Horários antigos limpos."]);
} catch (PDOException $e) {
    echo json_encode(["success" => false, "message" => $e->getMessage()]);
}
?>
