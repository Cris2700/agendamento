<?php
require 'vendor/autoload.php';
include 'db.php';
session_start();

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

header('Content-Type: application/json');

$horario_id = $_POST['horario_id'] ?? null;

if (!$horario_id) {
    echo json_encode(['success' => false, 'message' => 'Horário inválido.']);
    exit;
}

// Busca infos do horário, usuário e dentista
$stmt = $pdo->prepare("
    SELECT 
        h.id, h.data, h.hora,
        d.nome_completo AS dentista_nome, d.email AS dentista_email,
        d.nome_clinica, d.rua_clinica, d.numero_clinica, d.bairro_clinica, d.cep_clinica,
        u.nome_crianca AS usuario_nome, u.email AS usuario_email
    FROM horarios h
    JOIN dentistas d ON h.dentista_id=d.id
    JOIN usuario u ON h.usuario_id=u.id
    WHERE h.id=?
");
$stmt->execute([$horario_id]);
$consulta = $stmt->fetch(PDO::FETCH_ASSOC);

if (!$consulta) {
    echo json_encode(['success' => false, 'message' => 'Erro ao buscar dados do horário.']);
    exit;
}

// Função PHPMailer
function enviarEmail($to, $toNome, $subject, $body) {
    $mail = new PHPMailer(true);
    try {
        $mail->isSMTP();
        $mail->Host = 'smtp.gmail.com';
        $mail->SMTPAuth = true;
        $mail->Username = 'associacaoasbi@gmail.com'; // seu email
        $mail->Password = 'vrms jdfa ksos pnap'; // senha de app
        $mail->SMTPSecure = PHPMailer::ENCRYPTION_STARTTLS;
        $mail->Port = 587;

        $mail->setFrom('associacaoasbi@gmail.com', 'Associação ASBI');
        $mail->addAddress($to, $toNome);

        $mail->isHTML(true);
        $mail->CharSet = "UTF-8";
        $mail->Subject = $subject;
        $mail->Body = $body;

        $mail->send();
        return true;
    } catch (Exception $e) {
        error_log("Erro PHPMailer: " . $mail->ErrorInfo);
        return false;
    }
}

// Mensagens
$dataFormatada = date('d/m/Y', strtotime($consulta['data']));
$horaFormatada = substr($consulta['hora'], 0, 5);

$bodyUsuario = "
<p>Olá {$consulta['usuario_nome']},</p>
<p>Seu agendamento foi confirmado com o(a) Dr(a) {$consulta['dentista_nome']}.</p>
<p><strong>Data:</strong> {$dataFormatada}<br>
<strong>Hora:</strong> {$horaFormatada}<br>
<strong>Local:</strong> {$consulta['nome_clinica']}<br><strong>Rua:</strong> {$consulta['rua_clinica']}, {$consulta['numero_clinica']}<br>
<strong>Bairro:</strong> {$consulta['bairro_clinica']}<br>
CEP: {$consulta['cep_clinica']}</p>
<p>Por favor, chegue 10 minutos antes.</p> <br> <p><strong>Anteciosamente, ASBI.</strong></p>
";

$bodyDentista = "
<p>Olá Dr(a) {$consulta['dentista_nome']},</p>
<p>Uma nova consulta foi agendada.</p>
<p><strong>Paciente:</strong> {$consulta['usuario_nome']}<br>
<strong>Data:</strong> {$dataFormatada}<br>
<strong>Hora:</strong> {$horaFormatada}</p> <br> <p><strong>Anteciosamente, ASBI.</strong></p>
";

// Envia e-mails
enviarEmail($consulta['usuario_email'], $consulta['usuario_nome'], "Confirmação de Agendamento", $bodyUsuario);
enviarEmail($consulta['dentista_email'], $consulta['dentista_nome'], "Nova Consulta Agendada", $bodyDentista);

echo json_encode(['success' => true, 'message' => 'E-mails enviados!']);
