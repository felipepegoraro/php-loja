<?php
$conn = include 'connect-db.php';
include 'verifica-ip.php';

session_start();

$data = json_decode(file_get_contents("php://input"), true);
$user = $data['email'];
$pass = $data['senha'];

$stmt = $conn->prepare("SELECT * FROM tb_usuario WHERE email = ?");
$stmt->bind_param("s", $user);
$stmt->execute();
$result = $stmt->get_result();

if ($result->num_rows > 0) {
    $row = $result->fetch_assoc();
    if (!$row['verificado']) {
        echo json_encode(["message" => "Por favor, verifique seu e-mail antes de fazer login."]);
    } else {
        if (password_verify($pass, $row['senha'])) {
            $_SESSION['user'] = [
                'id' => $row['id'],
                'email' => $row['email'],
                'nome' => $row['nome'],
                'admin' => $row['admin'],
                'foto' => base64_encode($row['foto'])
            ];

            session_write_close();

            echo json_encode([
                "success" => true,
                "data" => [
                    "id" => $row['id'],
                    "email" => $row['email'],
                    "nome" => $row['nome'],
                    "admin" => $row['admin'],
                    "foto" => base64_encode($row['foto'])
                ]
            ], JSON_UNESCAPED_UNICODE);
        } else {
            echo json_encode([
                "success" => false,
                "message" => "Senha incorreta"
            ]);
        }
    }
} else {
    echo json_encode([
        "success" => false,
        "message" => "Usuario invalido"
    ]);
}

$stmt->close();
$conn->close();
?>
