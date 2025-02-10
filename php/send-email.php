<?php
function sendVerificationEmail($toEmail, $token) {
    $subject = "PHP-LOJA - Confirmação de Cadastro";
    $message = "Clique no link abaixo para confirmar seu cadastro:\n\n";
    $message .= "https://php-loja.com/AtivarEmail?token=$token";
    $headers = "From: no-reply@php-loja.com\r\n" .
               "Reply-To: no-reply@php-loja.com\r\n" .
               "X-Mailer: PHP/" . phpversion();

    return mail($toEmail, $subject, $message, $headers);
}
?>
~
