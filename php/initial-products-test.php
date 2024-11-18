<?php
function imageToBlob($imagePath) {
    return file_get_contents($imagePath);
}

$conn = include 'connect-db.php';

$user = [
    'ADMIN',
    'admin@developer.com',
    '2000-01-01',
    '00000000000',
    'senha123',
    '', '', '', '', '', '', '',
    1
];

$stmt_user = $conn->prepare("
    INSERT INTO tb_usuario (
        nome, email, data_nascimento, telefone, senha, cep, rua, numero, bairro, complemento, cidade, estado, admin) 
    VALUES 
        (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)"
);

$hashedPassword = password_hash($user[4], PASSWORD_BCRYPT);

$stmt_user->bind_param("sssssssssssss", $user[0], $user[1], $user[2], 
    $user[3], $hashedPassword, $user[5], $user[6], $user[7], $user[8], 
    $user[9], $user[10], $user[11], $user[12]
);
    
if (!$stmt_user->execute()) {
    echo "Erro ao inserir usuário: " . $stmt_user->error;
}

$stmt_user->close();
$conn->close();
?>
