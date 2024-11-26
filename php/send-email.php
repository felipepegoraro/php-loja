<?php
// testando!!!!!!!
include 'config-cors.php';

if (!$_SERVER['REQUEST_METHOD'] == 'POST'){
    echo json_encode(['success' => false, 'message' => 'Método de requisição inválido.']);
    exit;
}

$data = json_decode(file_get_contents('php://input'), true);

if (!isset($data['email']) || !isset($data['verification_code'])) {
    echo json_encode(['success' => false, 'message' => 'E-mail e código de verificação são obrigatórios.']);
    exit;
}

$email = $data['email'];
$verification_code = $data['verification_code'];

$subject = 'Código de Verificação';
$message = "Seu código de verificação é: $verification_code";
$headers = 'From: no-reply@exemplo.com' . "\r\n" .
           'Reply-To: no-reply@exemplo.com' . "\r\n" .
           'X-Mailer: PHP/' . phpversion();

$mail_sent = mail($email, $subject, $message, $headers);

if ($mail_sent) {
    echo json_encode(['success' => true, 'message' => 'Código de verificação enviado com sucesso!']);
} else {
    echo json_encode(['success' => false, 'message' => 'Erro ao enviar o e-mail.']);
}
?>
