<?php
include_once 'Database.php';

$db = Database::getInstance();
$conn = $db->getConnection();

$data = json_decode(file_get_contents('php://input'), true);

function response($success, $message) {
    echo json_encode(['success' => $success, 'message' => $message]);
    exit;
}

function checkConnection($conn) {
    if (!$conn) {
        response(false, "Erro ao conectar banco");
    }
}

function validateRequestData($data) {
    if (!isset($data['idUsuario']) || !isset($data['idItem']) || !isset($data['quantidade']) || !isset($data['status'])) {
        response(false, "Requisição inválida");
    }
}

function prepareStatement($conn, $query) {
    $stmt = $conn->prepare($query);
    if (!$stmt) {
        response(false, "Erro ao preparar a consulta: " . $conn->error);
    }
    return $stmt;
}

function updateItem($conn, $quantidade, $idUsuario, $idItem, $status = null) {
    $query = $status ? 
        "UPDATE tb_carrinho SET quantidade = quantidade + ?, status = ? WHERE idUsuario = ? AND idItem = ?" :
        "UPDATE tb_carrinho SET quantidade = quantidade + ? WHERE idUsuario = ? AND idItem = ?";
    
    $stmt = prepareStatement($conn, $query);
    if ($status) {
        $stmt->bind_param("issi", $quantidade, $status, $idUsuario, $idItem);
    } else {
        $stmt->bind_param("iii", $quantidade, $idUsuario, $idItem);
    }

    if ($stmt->execute()) {
        response(true, 'Quantidade atualizada no carrinho [' . $idItem . ']');
    } else {
        response(false, 'Erro ao atualizar o carrinho.');
    }
}

function insertItem($conn, $idUsuario, $idItem, $quantidade, $status) {
    $stmt = prepareStatement($conn, "INSERT INTO tb_carrinho (idUsuario, idItem, quantidade, status) VALUES (?, ?, ?, ?)");
    $stmt->bind_param("iiis", $idUsuario, $idItem, $quantidade, $status);

    if ($stmt->execute()) {
        response(true, 'Adicionado ao carrinho com sucesso [' . $idItem . ']');
    } else {
        response(false, 'Erro ao adicionar produto ao carrinho.');
    }
}

checkConnection($conn);
validateRequestData($data);

$stmt_check = prepareStatement($conn, "SELECT id, status FROM tb_carrinho WHERE idUsuario = ? AND idItem = ?");
$stmt_check->bind_param("ii", $data['idUsuario'], $data['idItem']);
$stmt_check->execute();
$result = $stmt_check->get_result();

if ($result->num_rows > 0) {
    $row = $result->fetch_assoc();
    if ($row['status'] == 'removido') {
        updateItem($conn, $data['quantidade'], $data['idUsuario'], $data['idItem'], 'ativo');
    } else {
        updateItem($conn, $data['quantidade'], $data['idUsuario'], $data['idItem']);
    }
} else {
    insertItem($conn, $data['idUsuario'], $data['idItem'], $data['quantidade'], $data['status']);
}

$stmt_check->close();
$conn->close();
?>
