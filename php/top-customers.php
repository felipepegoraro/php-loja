<?php
include 'ResponseHandler.php';
include 'Database.php';

$db = Database::getInstance();
$conn = $db->getConnection();
$response = ["steps" => [], "errors" => []];

session_start();

if (!isset($_SESSION['user']) || $_SESSION['user']['admin'] !== 1) {
    $msg = "Usuário inválido ou sem permissões";
    ResponseHandler::jsonResponse(false, $msg, $response);
}

$query = "SELECT u.nome, SUM(o.total) AS total_gasto "
       . "FROM tb_usuario u INNER JOIN tb_pedido o "
       . "ON u.id = o.idUsuario WHERE u.id != 1 "
       . "GROUP BY u.id ORDER BY total_gasto DESC LIMIT 5";

$result = ResponseHandler::executeQuery($conn, $query, [], $response, "Erro na Query");

if ($result->num_rows < 0) {
    ResponseHandler::jsonResponse(false, "Nenhum comprador encontrado", $response);
}

$topCustomers = [];

while ($row = $result->fetch_assoc()) {
    $topCustomers[] = [
        'nome' => $row['nome'],
        'total' => $row['total_gasto']
    ];
}

ResponseHandler::jsonResponse(true, "Finalizado com sucesso", $response, $topCustomers);
?>
