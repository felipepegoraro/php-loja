<?php
include_once 'ResponseHandler.php';
include_once 'Database.php';

$db = Database::getInstance();
$conn = $db->getConnection();

$response = ["steps" => [], "errors" => []];

$sql = "SELECT * FROM tb_categoria";
$result = ResponseHandler::executeQuery($conn, $sql, [], $response, 'Erro ao executar query');

$categories = [];

if ($result && $result->num_rows > 0) {
    while ($row = $result->fetch_assoc()) {
        $categories[] = [
            "id" => $row['id'],
            "nome" => $row['nome'],
            "foto" => base64_encode($row['foto'])
        ];
    }
    ResponseHandler::jsonResponse(true, "Categorias encontradas", $response, $categories);
} else {
    ResponseHandler::jsonResponse(false, "Nenhuma categoria encontrada", $response);
}
?>
