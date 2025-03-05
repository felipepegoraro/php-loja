<?php 
include_once 'ResponseHandler.php';
include_once 'CartService.php';

session_start();

$cartService = new CartService();

function checkUserSession(&$response) {
    if (!isset($_SESSION['user'])) {
        $response["errors"][] = "[1] Usuário não autenticado.";
        ResponseHandler::jsonResponse(false, "Usuário não logado", $response);
    }
    return $_SESSION['user']['id'];
}

$idUsuario = checkUserSession($cartService->getResponse());

$idItem = isset($_POST['idItem']) ? (int)$_POST['idItem'] : null;
$novaQuantidade = isset($_POST['quantidade']) ? (int)$_POST['quantidade'] : 0;

if ($idItem <= 0 || $novaQuantidade <= 0) {
    ResponseHandler::jsonResponse(false, "Dados inválidos", $cartService->getResponse());
}

$cartService->finalizeItem([
    "idUsuario" => $idUsuario,
    "idItem" => $idItem,
    "quantidade" => $novaQuantidade,
    "status" => "ativo"
]);
?>
