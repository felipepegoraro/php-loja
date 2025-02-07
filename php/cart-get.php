<?php
include_once 'ResponseHandler.php';
include_once 'Database.php';

$db = Database::getInstance();
$conn = $db->getConnection();

$response = ['steps' => [], 'errors' => []];

session_start();

if (!isset($_SESSION['user'])){
    ResponseHandler::jsonResponse(false, "Usuário não logado.", $response);
}

$idUsuario = $_SESSION['user']['id'];

$sql = "SELECT c.id AS cart_id,
        c.idUsuario,
        c.idItem,
        c.quantidade,
        c.status AS cart_status,
        i.nome AS nomeItem,
        i.descricao AS descricaoItem,
        i.preco AS precoItem,
        s.nome AS categoriaItem,
        sc.nome AS subcategoriaItem,
        i.foto AS fotoItem
    FROM tb_carrinho c
    JOIN tb_itens i ON c.idItem = i.id
    JOIN tb_subcategoria sc ON i.idSubCategoria = sc.id
    JOIN tb_categoria s ON sc.idCategoria = s.id
    WHERE c.idUsuario = ? AND c.status = 'ativo'
";

$result = ResponseHandler::executeQuery($conn, $sql, ['i', $idUsuario], $response, 'Erro ao pegar itens');

if ($result->num_rows <= 0) {
    ResponseHandler::jsonResponse(false, "Carrinho vazio", $response);
}

$cartItems = [];

while ($row = $result->fetch_assoc()) {
    $cartItems[] = [
        "id" => $row['cart_id'],
        "idUsuario" => $row['idUsuario'],
        "idItem" => $row['idItem'],
        "quantidade" => $row['quantidade'],
        "status" => $row['cart_status'],
        "nomeItem" => $row['nomeItem'],
        "descricaoItem" => $row['descricaoItem'],
        "precoItem" => $row['precoItem'],
        "categoriaItem" => $row['categoriaItem'],
        "subcategoriaItem" => $row['subcategoriaItem'],
        "fotoItem" => $row['fotoItem'] ? base64_encode($row['fotoItem']) : null
    ];
}

ResponseHandler::jsonResponse(true, "Carrinho OK", $response, $cartItems);
?>
