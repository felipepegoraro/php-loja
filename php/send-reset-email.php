<?php
require 'config-cors.php';
require 'EmailService.php';
require "ResponseHandler.php";

$response = ["steps" => [], "errors" => []];

if ($_SERVER['REQUEST_METHOD'] != 'POST'){
    ResponseHandler::jsonResponse(false, "Erro ao fazer requisição", $response, null);
}

$data = json_decode(file_get_contents("php://input"), true);

if (!isset($data['email'])){
    ResponseHandler::jsonResponse(false, "Erro ao capturar email", $response, null);
}


$email = filter_var($data["email"], FILTER_SANITIZE_EMAIL);
$code = EmailService::sendCodeResetEmail($email);
$response["steps"][] = "Codigo recebido apos envio de email: " . $code;

if ($code == "00000"){
    ResponseHandler::jsonResponse(false, "Falha ao enviar email", $response, null);
}

ResponseHandler::jsonResponse(true, "Email enviado com sucesso", $response, $code);
?>
