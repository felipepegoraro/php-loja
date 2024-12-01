<?php
include_once 'Database.php';

$db = Database::getInstance();
$conn = $db->getConnection();

session_start();

if (!isset($_SESSION['user'])){
    echo json_encode(["success"=>false, "message"=>"usuario nao logado"]);
    $conn->close();
    exit;
}

$idUsuario = $_SESSION['user']['id'];


$idItem = isset($_POST['idItem']) ? (int)$_POST['idItem'] : null;
$novaQuantidade = (int)$_POST['quantidade'];  

if ($idItem <= 0 || $novaQuantidade <= 0) {
    echo json_encode(["success" => false, "message" => "Dados inválidos: idItem ou quantidade menor ou igual a zero"]);
    $conn->close();
    exit;
}
// Atualizando a quantidade no carrinho
$sql = "
    UPDATE tb_carrinho 
    SET quantidade = ? 
    WHERE idItem = ? AND idUsuario = ? AND status = 'ativo'
";

$stmt = $conn->prepare($sql);

if (!$stmt) {
    echo json_encode(["success" => false, "message" => "Erro ao preparar SQL"]);
    $conn->close();
    exit;
}

$stmt->bind_param("iii", $novaQuantidade, $idItem, $idUsuario);

if ($stmt->execute()) {
    // Retornando sucesso
    echo json_encode(["success" => true, "message" => "Quantidade atualizada com sucesso"]);
} else {
    echo json_encode(["success" => false, "message" => "Erro ao atualizar quantidade"]);
}

$stmt->close();
$conn->close();
?>
