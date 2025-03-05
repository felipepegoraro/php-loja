<?php 
include_once 'ResponseHandler.php';
include_once 'CartService.php';
include_once 'config-cors.php';

session_start();

$response = ["steps" => [], "errors" => []];

function checkUserSession(&$response) {
    if (!isset($_SESSION['user'])) {
        $response["errors"][] = "[1] Sessão de usuário inválida.";
        ResponseHandler::jsonResponse(false, 'Usuário inválido', $response);
    }
    return $_SESSION['user']['id'];
}

$data = json_decode(file_get_contents('php://input'), true);

if (!isset($data['idUsuario'], $data['idItem'], $data['quantidade'])) {
    $response["errors"][] = "[2] Dados enviados são inválidos.";
    ResponseHandler::jsonResponse(false, "Dados inválidos", $response);
}

$idUsuario = checkUserSession($response);

if ($idUsuario !== $data['idUsuario']) {
    $response["errors"][] = "[3] Usuário não autorizado.";
    ResponseHandler::jsonResponse(false, "Usuário não autorizado", $response);
}

$cartService = new CartService();
$cartService->updateItem(
    (int)$data['quantidade'],
    (int)$idUsuario,
    (int)$data['idItem'],
    'removido'
);
?>
