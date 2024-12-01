<?php 
include_once 'Database.php';

$db = Database::getInstance();
$conn = $db->getConnection();

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
$quantidade = $data['quantidade'];

if ($_SESSION['user']['id'] !== $idUsuario) {
    echo json_encode(["success" => false, "message" => "Usuário não autorizado."]);
    $conn->close();
    exit;
}

$query = "UPDATE tb_carrinho SET status = 'removido', quantidade = ? WHERE idUsuario = ? AND idItem = ?";
$stmt = $conn->prepare($query);
$stmt->bind_param("iii", $quantidade, $idUsuario, $idItem);

if ($stmt->execute() && $stmt->affected_rows > 0) {
    echo json_encode(["success" => true, "message" => "Item removido do carrinho."]);
} else {
    echo json_encode(["success" => false, "message" => "Erro ao remover item ou item não encontrado."]);
}

$stmt->close();
$conn->close();
?>
