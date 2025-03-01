<?php 
include_once 'ResponseHandler.php';
include_once 'CommentService.php';
include_once 'verifica-ip.php';
include_once 'config-cors.php';

$response = ['steps' => [], 'errors' => []];

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    ResponseHandler::jsonResponse(false, "Método não aceito", $response);
}

session_start();

$data = json_decode(file_get_contents('php://input'), true);
$response['steps'][] = 'Dados recebidos e decodificados';

if (!isset($data['idUsuario'], $data['idProduto'], $data['nota'], $data['titulo'], $data['comentario'])) {
    $response['errors'][] = 'Dados inválidos ou faltantes';
    ResponseHandler::jsonResponse(false, "Erro nos dados enviados", $response);
}

$commentService = new CommentService();

$commentService->addComment(
    $data['idUsuario'],
    $data['idProduto'],
    $data['nota'],
    $data['titulo'],
    $data['comentario']
);
?>
