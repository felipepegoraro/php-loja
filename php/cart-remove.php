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
if (!isset($data['idUsuario'], $data['idItem'])) {
    echo json_encode(["success" => false, "message" => "Dados inválidos."]);
    $conn->close();
    exit;
}

$idUsuario = $data['idUsuario'];
$idItem = $data['idItem'];

if ($_SESSION['user']['id'] !== $idUsuario) {
    echo json_encode(["success" => false, "message" => "Usuário não autorizado."]);
    $conn->close();
    exit;
}

$query = "UPDATE tb_carrinho SET status = 'removido' WHERE idUsuario = ? AND idItem = ?";
$stmt = $conn->prepare($query);
$stmt->bind_param("ii", $idUsuario, $idItem);

if ($stmt->execute() && $stmt->affected_rows > 0) {
    echo json_encode(["success" => true, "message" => "Item removido do carrinho."]);
} else {
    echo json_encode(["success" => false, "message" => "Erro ao remover item ou item não encontrado."]);
}

$stmt->close();
$conn->close();
?>
