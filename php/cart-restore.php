<?php 
include_once 'ResponseHandler.php';
include_once 'CartService.php';
include_once 'config-cors.php';

session_start();

$response = [];

if (!isset($_SESSION['user'])){
    ResponseHandler::jsonResponse(false, 'Usuário não autenticado.', $response);
}

$data = json_decode(file_get_contents('php://input'), true);

if (!isset($data['idUsuario'])) {
    ResponseHandler::jsonResponse(false, "Dados inválidos", $response);
}

$cs = new CartService();
$cs->restoreCart($data['idUsuario']);
?>
