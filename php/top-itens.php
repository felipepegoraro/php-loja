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


$validOrderBy = [
    'quantidade' => "SUM(ip.quantidade)",
    'valor' => "SUM(ip.quantidade * ip.preco)"
];

$type = isset($_GET['type']) ? $_GET['type'] : 'valor';

if (!array_key_exists($type, $validOrderBy)) {
    ResponseHandler::jsonResponse(false, "Tipo de ordenação inválido", $response);
}

$orderBy = $validOrderBy[$type];

$limit = isset($_GET['limit']) && is_numeric($_GET['limit']) ? (int)$_GET['limit'] : 5;

$query = "
    SELECT 
        i.id AS id,
        i.nome AS nome,
        i.descricao AS descricao,
        i.foto AS foto,
        i.preco AS preco,
        i.idSubCategoria AS idSubCategoria,
        $orderBy AS totalVendido
    FROM 
        tb_itens_pedido ip
    INNER JOIN 
        tb_itens i ON ip.idItem = i.id
    GROUP BY 
        i.id, i.nome, i.descricao, i.foto, i.preco, i.idSubCategoria
    ORDER BY 
        totalVendido DESC
    LIMIT ?
";

$params = ['i', $limit];
$result = ResponseHandler::executeQuery($conn, $query, $params, $response, "Erro");

if ($result->num_rows == 0) {
    ResponseHandler::jsonResponse(true, "Nenhuma venda finalizada", $response, []);
}

$vendas = [];

while ($row = $result->fetch_assoc()) {
    $fotoBase64 = null;

    if (!empty($row['foto'])) {
        $fotoBase64 = base64_encode($row['foto']);
    }

    $vendas[] = [
        'id' => $row['id'],
        'nome' => $row['nome'],
        'descricao' => $row['descricao'],
        'foto' => $fotoBase64,
        'preco' => $row['preco'],
        'idSubCategoria' => $row['idSubCategoria'],
        'totalVendido' => $row['totalVendido']
    ];
}

ResponseHandler::jsonResponse(true, "Nenhuma venda finalizada", $response, $vendas);
?>
