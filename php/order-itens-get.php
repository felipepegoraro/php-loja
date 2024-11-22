<?php
$conn = include 'connect-db.php';

session_start();

if (!isset($_SESSION['user']) || $_SESSION['user']['admin'] !== 1) {
    echo json_encode(["success" => false, "message" => "Usuário inválido ou sem permissões"]);
    exit;
}

$query = $conn->prepare("SELECT * FROM tb_itens_pedido");
$query->execute();

$result = $query->get_result();

if ($result->num_rows <= 0) {
    $query->close();
    $conn->close();
    echo json_encode(["success" => false, "message" => "Nenhum item de pedido encontrado"]);
    exit;
}

$itens_pedido = [];

while ($row = $result->fetch_assoc()) {
    $itens_pedido[] = [
        'id' => $row['id'],
        'idUsuario' => $row['idUsuario'],
        'idItem' => $row['idItem'],
        'quantidade' => $row['quantidade'],
        'preco' => $row['preco'],
        'finalizado' => $row['finalizado'],
        'idPedido' => $row['idPedido'],
    ];
}

$query->close();
$conn->close();

echo json_encode(["success" => true, "message" => $itens_pedido]);
exit;
?>

