<?php
$conn = include 'connect-db.php';

$query = "SELECT id, idSubCategoria, nome, descricao, preco, foto FROM tb_itens";
$result = $conn->query($query);

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

        $products[] = $row;
    }
} else {
    echo json_encode(["error" => "Nenhum produto encontrado"]);
    $conn->close();
    exit();
}

echo json_encode($products, JSON_UNESCAPED_UNICODE);
$conn->close();
?>
