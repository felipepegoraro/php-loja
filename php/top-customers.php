<?php
$conn = include 'connect-db.php';

session_start();

if (!isset($_SESSION['user']) || $_SESSION['user']['admin'] !== 1) {
    echo json_encode(["success" => false, "message" => "Usuário inválido ou sem permissões"]);
    exit;
}

$query = "
    SELECT u.nome, SUM(o.total) AS total_gasto
    FROM tb_usuario u
    INNER JOIN tb_pedido o ON u.id = o.idUsuario
    GROUP BY u.id
    ORDER BY total_gasto DESC
    LIMIT 5
";

$result = $conn->query($query);

if ($result->num_rows <= 0) {
    echo json_encode(["success" => false, "message" => "Nenhum comprador encontrado"]);
    exit;
}

$topCustomers = [];
while ($row = $result->fetch_assoc()) {
    $topCustomers[] = [
        'nome' => $row['nome'],
        'total' => $row['total_gasto']
    ];
}

$conn->close();

echo json_encode(["success" => true, "message" => $topCustomers]);
exit;
?>
