<?php 

header('Content-Type: application/json');
header("Access-Control-Allow-Origin: http://localhost:3000");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With");
header("Access-Control-Allow-Credentials: true");

if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    http_response_code(200);
    exit;
}

$conn = include 'connect-db.php';

session_start();

if (!isset($_SESSION['user'])) {
    echo json_encode(["success" => false, "message" => "Usuário não logado. Não há carrinho."]);
    $conn->close();
    exit;
}

$userid = $_SESSION['user']['id'];
$username = $_SESSION['user']['nome'];

$queryCheck = "SELECT COUNT(*) FROM tb_carrinho WHERE idUsuario = ?";
$stmtCheck = $conn->prepare($queryCheck);
$stmtCheck->bind_param("i", $userid);
$stmtCheck->execute();
$stmtCheck->bind_result($itemcount);
$stmtCheck->fetch();
$stmtCheck->close();

if ($itemcount == 0) {
    echo json_encode(["success" => false, "message" => "O carrinho já está vazio."]);
    $conn->close();
    exit;
}

$query = "DELETE FROM tb_carrinho WHERE idUsuario = ?";
$stmt = $conn->prepare($query);
$stmt->bind_param("i", $userid);

$res = $stmt->execute();

if ($res) {
    if ($stmt->affected_rows > 0) {
        echo json_encode([
            "success" => true,
            "message" => "Carrinho do usuário {$username} esvaziado com sucesso."
        ]);
    } else {
        echo json_encode([
            "success" => false,
            "message" => "Erro ao esvaziar o carrinho. Nenhuma linha foi afetada."
        ]);
    }
} else {
    echo json_encode([
        "success" => false,
        "message" => "Erro ao esvaziar carrinho."
    ]);
}

$stmt->close();
$conn->close();
?>

