<?php
$conn = include 'connect-db.php';

session_start();

if (!isset($_SESSION['user']) || $_SESSION['user']['admin'] !== 1) {
    echo json_encode(["success" => false, "message" => "Usuário inválido ou sem permissões"]);
    exit;
}

$query = $conn->prepare("SELECT * FROM tb_pedido");
$query->execute();

$result = $query->get_result();

if ($result->num_rows <= 0) {
    $query->close();
    $conn->close();
    echo json_encode(["success" => false, "message" => "Nenhum pedido/venda encontrado"]);
    exit;
}

$pedidos = [];

while ($row = $result->fetch_assoc()) {
    $pedidos[] = [
        'id' => $row['id'],
        'idUsuario' => $row['idUsuario'],
        'data' => $row['data'],
        'status' => $row['status'],
        'total' => $row['total'],
    ];
}

$query->close();
$conn->close();

echo json_encode(["success" => true, "value" => $pedidos]);
exit;
?>
