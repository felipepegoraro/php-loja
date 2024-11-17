<?php
# rota: /cart/add
# tipo: post
# desc: adiciona um item ao carrinho de compras do usuário

header('Content-Type: application/json');
header("Access-Control-Allow-Origin: http://localhost:3000");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With");
header("Access-Control-Allow-Credentials: true");

if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    http_response_code(200);
    exit;
}

$data = json_decode(file_get_contents('php://input'), true);

$conn = include 'connect-db.php';

if (!$conn){
    echo json_encode(["success" => false, "message" => "erro ao conectar banco"]);
    exit;
}

if (
    !isset($data['idUsuario']) ||
    !isset($data['idItem']) ||
    !isset($data['quantidade']) ||
    !isset($data['preco']) ||
    !isset($data['status'])
) {
    echo json_encode(["success" => false, "message" => "requisição inválida"]);
    $conn->close();
    exit;
}

$stmt = $conn->prepare("INSERT INTO tb_carrinho (idUsuario, idItem, quantidade, preco, status) VALUES (?, ?, ?, ?, ?)");
if (!$stmt){
    echo json_encode(['success' => false, 'message' => 'Erro ao preparar a consulta: ' . $conn->error]);
    $conn->close();
    exit;
}

$stmt->bind_param("iiids",
    $data['idUsuario'], 
    $data['idItem'], 
    $data['quantidade'], 
    $data['preco'], 
    $data['status']
);

if ($stmt->execute()) {
    echo json_encode(['success' => true, 'message' => 'Adicionado ao carrinho com sucesso ['. $data['idItem'] . ']']);
} else {
    echo json_encode(['success' => false, 'message' => 'Erro ao adicionar produto ao carrinho.']);
}

$stmt->close();
$conn->close();
?>
