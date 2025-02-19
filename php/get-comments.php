<?php 
include_once 'ResponseHandler.php';
include_once 'Database.php';

$db = Database::getInstance();
$conn = $db->getConnection();

$response = ['steps' => [], 'errors' => []];

$itemId = $_GET['itemId'] ?? null;
$sql = "SELECT c.id, c.idUsuario, c.idProduto, c.nota, c.titulo, c.comentario, c.data_comentario, c.ultima_atualizacao, u.nome AS nome_usuario FROM tb_comentarios AS c INNER JOIN tb_usuario AS u ON c.idUsuario = u.id WHERE c.idProduto = ?;";
$params = ["i", $itemId];

$result = ResponseHandler::executeQuery($conn, $sql, $params, $response, 'Erro ao executar query');

$comments = [];

if ($result && $result->num_rows > 0) {
    while ($row = $result->fetch_assoc()) {
        $comments[] = [
            'id' => $row['id'],
            'idUsuario' => $row['idUsuario'],
            'idProduto' => $row['idProduto'],
            'nota' => $row['nota'],
            'titulo' => $row['titulo'],
            'comentario' => $row['comentario'],
            'data_comentario' => $row['data_comentario'],
            'ultima_atualizacao' => $row['ultima_atualizacao'],
            'nome_usuario' => $row['nome_usuario']
        ];
    }
}

ResponseHandler::jsonResponse(true, "Comentários encontrados", $response, $comments);
?>
