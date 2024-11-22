<?php
$conn = include 'connect-db.php';

session_start();

if (!isset($_SESSION['user']) || $_SESSION['user']['admin'] !== 1) {
    echo json_encode(["success" => false, "message" => "Usuário inválido ou sem permissões"]);
    exit;
}

$validOrderBy = [
    'quantidade' => "SUM(ip.quantidade)",
    'valor' => "SUM(ip.quantidade * ip.preco)"
];

$type = isset($_GET['type']) ? $_GET['type'] : 'valor';

if (!array_key_exists($type, $validOrderBy)) {
    echo json_encode(["success" => false, "message" => "Tipo de ordenação inválido"]);
    exit;
}

$orderBy = $validOrderBy[$type];

$limit = isset($_GET['limit']) && is_numeric($_GET['limit']) ? (int)$_GET['limit'] : 5;

$query = $conn->prepare("
    SELECT 
        i.id AS itemId,
        i.nome AS itemNome,
        $orderBy AS total
    FROM 
        tb_itens_pedido ip
    INNER JOIN 
        tb_itens i ON ip.idItem = i.id
    GROUP BY 
        i.id, i.nome
    ORDER BY 
        total DESC
    LIMIT ?
");

$query->bind_param("i", $limit);

$query->execute();
$result = $query->get_result();

if ($result->num_rows <= 0) {
    $query->close();
    $conn->close();
    echo json_encode(["success" => false, "message" => "Nenhuma venda realizada"]);
    exit;
}

$vendas = [];
while ($row = $result->fetch_assoc()) {
    $vendas[] = [
        'itemId' => $row['itemId'],
        'itemNome' => $row['itemNome'],
        'total' => $row['total']
    ];
}

$query->close();
$conn->close();

echo json_encode(["success" => true, "data" => $vendas]);
?>
