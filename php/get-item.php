<?php

include 'connect-db.php'; // Inclui a conexão com o banco de dados

// Verifica se o ID do item foi passado
if (!isset($_GET['id']) || empty($_GET['id'])) {
    echo json_encode(["error" => "ID do item não fornecido."]);
    exit();
}

$itemId = (int)$_GET['id'];

// Query para buscar os detalhes do item
$query = "
    SELECT 
        i.id,
        i.nome,
        i.descricao,
        i.preco,
        i.foto,
        i.nota,
        s.nome AS subcategoria_nome,
        c.nome AS categoria_nome
    FROM
        tb_itens i
    INNER JOIN tb_subcategoria s ON i.idSubCategoria = s.id
    INNER JOIN tb_categoria c ON s.idCategoria = c.id
    WHERE i.id = ?
";

// Prepara a consulta
$stmt = $conn->prepare($query);
if (!$stmt) {
    echo json_encode(["error" => "Erro na preparação da consulta: " . $conn->error]);
    exit();
}

// Vincula o ID do item e executa a consulta
$stmt->bind_param("i", $itemId);
$stmt->execute();
$result = $stmt->get_result();

if ($result->num_rows === 0) {
    echo json_encode(["error" => "Item não encontrado."]);
    $conn->close();
    exit();
}

// Processa os dados do item
$item = $result->fetch_assoc();
if (!empty($item['foto'])) {
    $item['foto'] = base64_encode($item['foto']); // Converte a imagem para base64
} else {
    $item['foto'] = null;
}

// Monta o retorno em formato JSON
$response = [
    "id" => $item['id'],
    "nome" => $item['nome'],
    "descricao" => $item['descricao'],
    "preco" => $item['preco'],
    "foto" => $item['foto'],
    "nota" => $item['nota'],
    "categoria" => $item['categoria_nome'],
    "subcategoria" => $item['subcategoria_nome']
];

// Retorna o JSON
echo json_encode($response, JSON_UNESCAPED_UNICODE);

// Fecha a conexão
$conn->close();
?>
