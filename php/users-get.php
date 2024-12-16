<?php
$conn = include 'connect-db.php';

$codigoAcesso = isset($_GET['codigoAcesso']) ? $_GET['codigoAcesso'] : null;

// cara dps tem q dar um jeito de salvar esse "codigo_secreto_administrador" em outro lugar 
// e obviamente trocar de codigo
if ($codigoAcesso !== 'codigo_secreto_administrador') {
    echo json_encode(["error" => "Acesso negado"]);
    $conn->close();
    exit;
}

$sql = "SELECT id, nome, email, foto FROM tb_usuario";
$result = $conn->query($sql);

if ($result->num_rows > 0) {
    $dados = [];
    while ($row = $result->fetch_assoc()) {
        if (!empty($row['foto'])) {
            $row['foto'] = base64_encode($row['foto']);
        }
        $dados[] = $row;
    }
    echo json_encode($dados);
} else {
    echo json_encode(["error" => "Nenhum dado encontrado"]);
}

$conn->close();
?>

