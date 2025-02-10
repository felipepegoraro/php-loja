<?php
include_once 'ResponseHandler.php';
include_once 'Database.php';

$db = Database::getInstance();
$conn = $db->getConnection();

$response = ['steps' => [], 'errors' => []];

$response['steps'][] = "1. verificando token na URL";
if (!isset($_GET['token'])) {
    ResponseHandler::jsonResponse(false, "Token não fornecido.", $response, null);
}

$token = $_GET['token'];
$response['steps'][] = "2. capturando token na URL";

$sql = 'SELECT id FROM tb_usuario WHERE token = ? AND verificado = FALSE';
$response['steps'][] = "3. pesquisando usuário";

$result = ResponseHandler::executeQuery($conn, $sql, ['s', $token], $response, "Erro ao buscar usuário");

if ($result === null || $result->num_rows <= 0) {
    $response['steps'][] = "4. token inválido";
    ResponseHandler::jsonResponse(false, "Token inválido ou conta já ativada", $response, null);
}

$response['steps'][] = "4. token válido";

$sqlUpdate = "UPDATE tb_usuario SET verificado = TRUE, token = NULL WHERE token = ?";
ResponseHandler::executeQuery($conn, $sqlUpdate, ['s', $token], $response, "Erro ao atualizar usuário");

$response['steps'][] = "5. usuário atualizado | conta ativada";

$msg = "Conta ativada com sucesso. Você pode fazer login agora.";
ResponseHandler::jsonResponse(true, $msg, $response, null);
?>
