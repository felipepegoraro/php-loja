<?php
$conn = include 'connect-db.php';

$query = "
    SELECT 
        i.id,
        i.nome,
        i.descricao,
        i.preco,
        i.foto,
        s.nome AS subcategoria_nome,
        c.nome AS categoria_nome
    FROM
        tb_itens i
    INNER JOIN tb_subcategoria s ON i.idSubCategoria = s.id
    INNER JOIN tb_categoria c ON s.idCategoria = c.id
";


$categoriaId = isset($_GET['categoriaId']) ? (int)$_GET['categoriaId'] : 0;
$ordem = isset($_GET['ordem']) ? $_GET['ordem'] : null;
$searchTerm = isset($_GET['searchTerm']) ? $_GET['searchTerm'] : '';

if ($categoriaId > 0) {
    $query .= " WHERE c.id = ?";
}
if (!empty($searchTerm)) {
    $query .= ($categoriaId > 0 ? " AND " : " WHERE ") . "i.nome LIKE ?";
}
if ($ordem === 'ASC' || $ordem === 'DESC') {
    $query .= " ORDER BY i.preco " . $ordem;
}



$stmt = $conn->prepare($query);

if ($categoriaId > 0 && !empty($searchTerm)) {
    $searchTerm = $searchTerm . '%';
    $stmt->bind_param('is', $categoriaId, $searchTerm);
} elseif ($categoriaId > 0) {
    $stmt->bind_param('i', $categoriaId);
} elseif (!empty($searchTerm)) {
    $searchTerm = $searchTerm . '%';
    $stmt->bind_param('s', $searchTerm); 
}

$stmt->execute();
$result = $stmt->get_result();

if (!$result) {
    die('Erro na consulta: ' . $conn->error);
}

$products = [];

if ($result->num_rows > 0){
    while ($row = $result->fetch_assoc()){
        if (!empty($row['foto'])) {
            $row['foto'] = base64_encode($row['foto']);
        } else {
            $row['foto'] = null;
        }

        $products[] = [
            'id' => $row['id'],
            'nome' => $row['nome'],
            'descricao' => $row['descricao'],
            'preco' => $row['preco'],
            'foto' => $row['foto'],
            'categoria' => $row['categoria_nome'],
            'subcategoria' => $row['subcategoria_nome']
        ];
    }
} else {
    echo json_encode(["error" => "Nenhum produto encontrado"]);
    $conn->close();
    exit();
}

echo json_encode($products, JSON_UNESCAPED_UNICODE);
$conn->close();
?>
