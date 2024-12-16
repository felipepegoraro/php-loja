<?php 
include_once 'ResponseHandler.php';
include_once 'Database.php';

$db = Database::getInstance();
$conn = $db->getConnection();

$response = ['steps' => [], 'errors' => []];

// Verificando se o método da requisição é POST
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    $response['steps'][] = '[1] Método de requisição verificado';
    ResponseHandler::jsonResponse(false, "Método não aceito", $response);
}

// Iniciando sessão e verificando login
session_start();
$response['steps'][] = '[2] Sessão iniciada';

// if (!isset($_SESSION['user'])) {
//     $response['errors'][] = '[1] Sessão de usuário inválida.';
//     ResponseHandler::jsonResponse(false, "Usuário não logado.", $response);
// }

// Obtendo e decodificando os dados da requisição
$data = json_decode(file_get_contents('php://input'), true);
$response['steps'][] = '[3] Dados recebidos e decodificados';

if (!isset($data['idUsuario'], $data['idProduto'], $data['nota'], $data['titulo'], $data['comentario'])) {
    $response['errors'][] = '[2] Dados inválidos ou faltantes';
    ResponseHandler::jsonResponse(false, "Erro nos dados enviados", $response);
}

// Preparando a query SQL
$sql = "INSERT INTO tb_comentarios (idUsuario, idProduto, nota, titulo, comentario) VALUES (?, ?, ?, ?, ?)";
$params = ['iidss', $data['idUsuario'], $data['idProduto'], $data['nota'], $data['titulo'], $data['comentario']];
$response['steps'][] = '[4] Query SQL preparada';

// Executando a query
$result = ResponseHandler::executeQuery($conn, $sql, $params, $response, "Erro ao inserir comentário");

// Verificando se a inserção foi bem-sucedida
if ($result === null) {
    $response['steps'][] = '[5] Inserção bem-sucedida';
    ResponseHandler::jsonResponse(true, "Comentário inserido com sucesso", $response);
} else {
    $response['errors'][] = '[3] Erro desconhecido durante a inserção';
    ResponseHandler::jsonResponse(false, "Falha ao inserir comentário", $response);
}

