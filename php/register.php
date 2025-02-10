<?php
$conn = include 'connect-db.php';
include 'send-email.php';

$data = json_decode(file_get_contents("php://input"), true);

try {
    if ($data) {
        $email = $data['email'];

        // Verifica se o email já existe
        $stmt = $conn->prepare("SELECT COUNT(*) FROM tb_usuario WHERE email = ?");
        $stmt->bind_param('s', $email);
        $stmt->execute();
        $stmt->bind_result($emailExists);
        $stmt->fetch();
        $stmt->close();

        if ($emailExists) {
            echo json_encode([
                'success' => false,
                'error' => 'O e-mail já está cadastrado.'
            ]);
        } else {
            $token = bin2hex(random_bytes(32)); // token único

            $stmt = $conn->prepare("INSERT INTO tb_usuario (nome, email, data_nascimento, telefone, senha, cep, rua, numero, bairro, complemento, cidade, estado, admin, verificado, token)
                                    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, false, ?)");

            $stmt->bind_param(
                'ssssssssssssss',
                $data['nome'],
                $data['email'],
                $data['dataNascimento'],
                $data['telefone'],
                password_hash($data['senha'], PASSWORD_DEFAULT),
                $data['cep'],
                $data['rua'],
                $data['numero'],
                $data['bairro'],
                $data['complemento'],
                $data['cidade'],
                $data['estado'],
                $data['admin'],
		$token,
            );

            if ($stmt->execute()) {
                // enviar email de confirmacao
                if (sendVerificationEmail($data['email'], $token)) {
                    echo json_encode([
                        'success' => true,
                        'message' => 'Cadastro iniciado! Verifique seu e-mail para ativar sua conta.',
                    ]);
                } else {
                    echo json_encode([
                        'success' => false,
                        'error' => 'Erro ao enviar e-mail de confirmação.',
                    ]);
                }
            } else {
                echo json_encode([
                    'success' => false,
                    'error' => 'Erro ao cadastrar o usuário.'
                ]);
            }
            $stmt->close();
        }
    } else {
        echo json_encode([
            'success' => false,
            'error' => 'Dados inválidos recebidos.',
        ]);
    }

    $conn->close();

} catch (Exception $e) {
    echo json_encode([
        'success' => false,
        'error' => 'Erro na comunicação com o banco de dados: ' . $e->getMessage(),
    ]);
}
?>
