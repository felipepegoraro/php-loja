<?php
include_once 'ResponseHandler.php';
include_once 'UserService.php';

header('Content-Type: application/json');

$rawData = file_get_contents("php://input");
$data = json_decode($rawData, true);
$response = [];

if (!$data) {
    ResponseHandler::jsonResponse(
        false,
        'Dados inválidos recebidos.',
        $response
    );
}

$us = new UserService();
$us->registerUser($data);
?>
