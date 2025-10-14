<?php
$host = "127.0.0.1:3316";   
$dbname = "clinica_1";   
$user = "root";        
$pass = "";           

try {
    $pdo = new PDO("mysql:host=$host;dbname=$dbname;charset=utf8", $user, $pass);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    
    $stmt = $pdo->query("SELECT DATABASE() as db");
    $dbName = $stmt->fetch(PDO::FETCH_ASSOC);
    error_log("✅ Conectado no banco: " . $dbName['db']); 
} catch (PDOException $e) {
    die("❌ Erro na conexão: " . $e->getMessage());
}
