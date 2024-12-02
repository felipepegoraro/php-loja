<?php 
include_once 'ResponseHandler.php';
include_once 'Database.php';

$db = Database::getInstance();
$conn = $db->getConnection();

session_start();

$response = ["steps" => [], "errors" => []];

function checkUserSession(&$response) {
    if (!isset($_SESSION['user'])) {
        $response["errors"][] = "[1] Sessão de usuário inválida.";
        ResponseHandler::jsonResponse(false, 'Usuário não autenticado.', $response);
    }
    return $_SESSION['user']['id'];
}

$data = json_decode(file_get_contents('php://input'), true);

if (!isset($data['idUsuario'])) {
    $response["errors"][] = "[2] Dados inválidos.";
    ResponseHandler::jsonResponse(false, "Dados inválidos", $response);
}

$usuarioid = $data['idUsuario'];

checkUserSession($response);

$query = "UPDATE tb_carrinho SET status = 'ativo', quantidade = 1 WHERE idUsuario = ?";
$params = ["i", $usuarioid];

$result = ResponseHandler::executeQuery($conn, $query, $params, $response, "Erro ao restaurar os itens do carrinho.");

ResponseHandler::jsonResponse(true, "Itens do carrinho restaurados com sucesso.", $response);
?>
