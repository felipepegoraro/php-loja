<?php
# rota: /cart/add
# tipo: post
# desc: adiciona um item ao carrinho de compras do usuário

$conn = include 'connect-db.php';

$data = json_decode(file_get_contents('php://input'), true);


if (!$conn){
    echo json_encode(["success" => false, "message" => "erro ao conectar banco"]);
    exit;
}

if (
    !isset($data['idUsuario']) ||
    !isset($data['idItem']) ||
    !isset($data['quantidade']) ||
    !isset($data['status'])
) {
    echo json_encode(["success" => false, "message" => "requisição inválida"]);
    $conn->close();
    exit;
}

$stmt_check = $conn->prepare("SELECT id FROM tb_carrinho WHERE idUsuario = ? AND idItem = ?");
if (!$stmt_check) {
    echo json_encode(['success' => false, 'message' => 'Erro ao preparar consulta de verificação: ' . $conn->error]);
    $conn->close();
    exit;
}

$stmt_check->bind_param("ii", $data['idUsuario'], $data['idItem']);
$stmt_check->execute();
$result = $stmt_check->get_result();

if ($result->num_rows > 0) { // CASO JA EEXISTA ESSE ITEM NO CARRIN OH NAO PRECISA INSERIR ELE DE NOVO BSSDTA AUMENTAR A QUANTIDADE
    $stmt_update = $conn->prepare("UPDATE tb_carrinho SET quantidade = quantidade + ? WHERE idUsuario = ? AND idItem = ?");
    if (!$stmt_update) {
        echo json_encode(['success' => false, 'message' => 'Erro ao preparar consulta de atualização: ' . $conn->error]);
        $conn->close();
        exit;
    }

    $stmt_update->bind_param("iii", $data['quantidade'], $data['idUsuario'], $data['idItem']);
    if ($stmt_update->execute()) {
        echo json_encode(['success' => true, 'message' => 'Quantidade atualizada no carrinho ['. $data['idItem'] . ']']);
    } else {
        echo json_encode(['success' => false, 'message' => 'Erro ao atualizar o carrinho.']);
    }
    $stmt_update->close();
} else {
    $stmt_insert = $conn->prepare("INSERT INTO tb_carrinho (idUsuario, idItem, quantidade, status) VALUES (?, ?, ?, ?)");
    if (!$stmt_insert) {
        echo json_encode(['success' => false, 'message' => 'Erro ao preparar a consulta de inserção: ' . $conn->error]);
        $conn->close();
        exit;
    }

    $stmt_insert->bind_param("iiis", $data['idUsuario'], $data['idItem'], $data['quantidade'], $data['status']);
    if ($stmt_insert->execute()) {
        echo json_encode(['success' => true, 'message' => 'Adicionado ao carrinho com sucesso ['. $data['idItem'] . ']']);
    } else {
        echo json_encode(['success' => false, 'message' => 'Erro ao adicionar produto ao carrinho.']);
    }
    $stmt_insert->close();
}

$stmt_check->close();
$conn->close();
?>
