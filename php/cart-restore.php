<?php 
header('Content-Type: application/json');
header("Access-Control-Allow-Origin: http://localhost:3000");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With");
header("Access-Control-Allow-Credentials: true");

$conn = include 'connect-db.php';

session_start();

if (!isset($_SESSION['user'])) {
    echo json_encode(["success" => false, "message" => "Usuário não autenticado."]);
    $conn->close();
    exit;
}

$data = json_decode(file_get_contents('php://input'), true);

if (!isset($data['idUsuario'])) {
    echo json_encode(["success" => false, "message" => "Dados inválidos."]);
    $conn->close();
    exit;
}

$usuarioid = $data['idUsuario'];

$query = "UPDATE tb_carrinho SET status = 'ativo' WHERE idUsuario = ?";
$stmt = $conn->prepare($query);
$stmt->bind_param("i", $usuarioid);

if (!$stmt->execute()) {
    echo json_encode(["success" => false, "message" => "Erro ao restaurar os itens do carrinho."]);
    $stmt->close();
    $conn->close();
    exit;
}

if ($stmt->affected_rows <= 0) {
    echo json_encode(["success" => false, "message" => "Nenhum item foi encontrado para restaurar."]);
    $stmt->close();
    $conn->close();
    exit;
}

echo json_encode(["success" => true, "message" => "Todos os itens do carrinho foram restaurados com sucesso."]);
$stmt->close();
$conn->close();
?>
