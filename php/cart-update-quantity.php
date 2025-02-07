<?php 
include_once 'ResponseHandler.php';
include_once 'Database.php';

$db = Database::getInstance();
$conn = $db->getConnection();

session_start();

$response = ["steps" => [], "errors" => []];

// TODO: modularizar função de verificação de sessão de usuário
function checkUserSession(&$response) {
    if (!isset($_SESSION['user'])) {
        $response["errors"][] = "[1] Usuário não autenticado.";
        ResponseHandler::jsonResponse(false, "Usuário não logado", $response);
    }
    return $_SESSION['user']['id'];
}

checkUserSession($response);

$idUsuario = $_SESSION['user']['id'];

$idItem = isset($_POST['idItem']) ? (int)$_POST['idItem'] : null;
$novaQuantidade = isset($_POST['quantidade']) ? (int)$_POST['quantidade'] : 0;

if ($idItem <= 0 || $novaQuantidade <= 0) {
    $response["errors"][] = "[2] Dados inválidos: idItem ou quantidade menor ou igual a zero.";
    ResponseHandler::jsonResponse(false, "Dados inválidos", $response);
}

$query = "
    UPDATE tb_carrinho 
    SET quantidade = ? 
    WHERE idItem = ? AND idUsuario = ? AND status = 'ativo'";

$params = ["iii", $novaQuantidade, $idItem, $idUsuario];

$result = ResponseHandler::executeQuery($conn, $query, $params, $response, "Erro ao atualizar a quantidade");

ResponseHandler::jsonResponse(true, "Quantidade atualizada com sucesso.", $response);
?>

