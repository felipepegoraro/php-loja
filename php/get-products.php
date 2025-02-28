<?php
include_once 'ResponseHandler.php';
include_once 'Database.php';

$db = Database::getInstance();
$conn = $db->getConnection();

$response = ["steps" => [], "errors" => []];

$query = "SELECT i.id, i.nome, i.descricao, i.preco, i.foto, s.nome AS subcategoria_nome, c.nome AS categoria_nome FROM tb_itens i INNER JOIN tb_subcategoria s ON i.idSubCategoria = s.id INNER JOIN tb_categoria c ON s.idCategoria = c.id";

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

$params = [];

if (!empty($searchTerm)){
    $searchTerm = '%' . $searchTerm . '%';
}

if ($categoriaId > 0 && !empty($searchTerm)) {
    $params = ['is', $categoriaId, $searchTerm];
    $response["steps"][] = "ambos, categoria id e texto + wildcard setado";
} elseif ($categoriaId > 0) {
    $params = ['i', $categoriaId];
    $response["steps"][] = "apenas categoria id setado";
} elseif (!empty($searchTerm)) {
    $params = ['s', $searchTerm];   
    $response["steps"][] = "apenas texto + wildcard setado";
}

$result = ResponseHandler::executeQuery(
    $conn,
    $query,
    $params,
    $response,
    "Erro a executar a query de busca"
);

$products = [];

if ($result && $result->num_rows > 0){
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
    ResponseHandler::jsonResponse(
        false,
        "Nenhum produto encontrado",
        $response,
        $result
    );
}

ResponseHandler::jsonResponse(true, "Produtos encontrados!", $response, $products);
?>
