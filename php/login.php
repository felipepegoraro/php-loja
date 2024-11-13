<?php
$conn = include 'connect-db.php';

$data = json_decode(file_get_contents("php://input"), true);
$user = $data['email'];
$pass = $data['senha'];

$stmt = $conn->prepare("SELECT * FROM tb_usuario WHERE email = ?");
$stmt->bind_param("s", $user);
$stmt->execute();
$result = $stmt->get_result();

if ($result->num_rows > 0) {
    $row = $result->fetch_assoc();
    if ($pass === $row['senha']){
    // if (password_verify($pass, $row['senha'])) { // USAR QND COLOCAR HASH
        echo json_encode(["success" => true]);
    } else {
        echo json_encode(["error" => "Senha incorreta"]);
    }
} else {
    echo json_encode(["error" => "Usuario invalido"]);
}

$stmt->close();
$conn->close();
?>

