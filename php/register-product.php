<?php
$conn = include "connect-db.php";

session_start();

if ((!isset($_SESSION['user'])) || $_SESSION['user']['admin'] !== 1) {
    echo json_encode([
        'success' => false,
        'message' => 'Acesso negado. Somente administradores podem cadastrar produtos.',
        'data' => $_SESSION['user']
    ]);
    exit;
}

if (isset($_POST['nome'], $_POST['descricao'], $_POST['preco'], $_POST['idSubCategoria'])) {
    $nome = $_POST['nome'];
    $descricao = $_POST['descricao'];
    $preco = floatval($_POST['preco']);
    $idSubCategoria = intval($_POST['idSubCategoria']);

    $foto = null;

    if (isset($_FILES['foto']) && $_FILES['foto']['error'] === UPLOAD_ERR_OK)
        $foto = file_get_contents($_FILES['foto']['tmp_name']);

    $stmt = $conn->prepare("INSERT INTO tb_itens (idSubCategoria, nome, descricao, foto, preco) VALUES (?, ?, ?, ?, ?)");

    if ($stmt) {
        $stmt->bind_param("isssd", $idSubCategoria, $nome, $descricao, $foto, $preco);
        if ($stmt->execute()) {
            echo json_encode(['success' => true, 'message' => 'Produto cadastrado com sucesso!']);
        } else {
            echo json_encode(['success' => false, 'message' => 'Erro ao cadastrar o produto.']);
        }

        $stmt->close();
    } else {
        echo json_encode(['success' => false, 'message' => 'Erro ao preparar a consulta: ' . $conn->error]);
    }
} else {
    echo json_encode(['success' => false, 'message' => 'Campos obrigatórios não preenchidos.']);
}

$conn->close();
?>
