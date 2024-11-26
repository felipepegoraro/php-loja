<?php
$conn = include 'connect-db.php';

session_start();

// ver isso dps
// if (!isset($_SESSION['user']) || $_SESSION['user']['admin'] !== 1) {
//     echo json_encode(["success" => false, "message" => "Usuário inválido ou sem permissões"]);
//     exit;
// }

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
");

$query->bind_param("i", $limit);

if (!$query->execute()) {
    echo json_encode(["success" => false, "message" => "Erro ao executar a consulta: " . $query->error]);
    exit;
}

$result = $query->get_result();

if ($result->num_rows <= 0) {
    echo json_encode(["success" => true, "message" => "Nenhuma venda realizada", "special"=>true]);
    exit;
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

$query->close();
$conn->close();

echo json_encode(["success" => true, "data" => $vendas], JSON_UNESCAPED_UNICODE);
?>

