<?php 
include_once 'ResponseHandler.php';
include_once 'Database.php';
$db = Database::getInstance();
$conn = $db->getConnection();

session_start();

$response = ["steps" => [], "errors" => []];

// TODO: modularizar//reutilizar essa função pois será usada em varios arquivos
function checkUserSession(&$response) {
    if (!$_SESSION['user']) {
        $response["errors"][] = "[1] Sessão de usuário inválida.";
        ResponseHandler::jsonResponse(false, 'Usuário inválido', $response);
    }
    return $_SESSION['user']['id'];
}

$data = json_decode(file_get_contents('php://input'), true);

if (!isset($data['idUsuario'], $data['idItem'])) {
    $response["errors"][] = "[2] Dados enviados são inválidos.";
    ResponseHandler::jsonResponse(false, "Dados inválidos", $response);
}

$idUsuario = $data['idUsuario'];
$idItem = $data['idItem'];
$quantidade = $data['quantidade'];

if ($_SESSION['user']['id'] !== $idUsuario) {
    $response["errors"][] = "[3] Dados enviados são inválidos.";
    ResponseHandler::jsonResponse(false, "Usuário não autoriazado", $response);
}

$query = "UPDATE tb_carrinho SET status = 'removido', quantidade = ? WHERE idUsuario = ? AND idItem = ?";
$params = ["iii", $quantidade, $idUsuario, $idItem];

$result = ResponseHandler::executeQuery($conn, $query, $params, $response, "Erro ao remover item do carrinho.");

ResponseHandler::jsonResponse(true, "Item removido do carrinho.", $response);
?>
