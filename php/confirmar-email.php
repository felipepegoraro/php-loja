<?php
$conn = include 'connect-db.php';

if (isset($_GET['token'])) {
    $token = $_GET['token'];

    $stmt = $conn->prepare("SELECT id FROM tb_usuario WHERE token = ? AND verificado = FALSE");
    $stmt->bind_param('s', $token);
    $stmt->execute();
    $stmt->store_result();

    if ($stmt->num_rows > 0) {
        $stmt = $conn->prepare("UPDATE tb_usuario SET verificado = TRUE, token = NULL WHERE token = ?");
        $stmt->bind_param('s', $token);
        $stmt->execute();

        echo "Conta ativada com sucesso! Você pode agora fazer login.";
    } else {
        echo "Token inválido ou conta já ativada.";
    }
} else {
    echo "Token não fornecido.";
}
?>
