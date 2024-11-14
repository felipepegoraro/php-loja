<?php
$conn = include 'connect-db.php';
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


            $user = (object) [
                'nome' => $data['nome'],
                'email' => $data['email'],
                'dataNascimento' => $data['dataNascimento'],
                'telefone' => $data['telefone'],
                'senha' => password_hash($data['senha'], PASSWORD_DEFAULT), // Hash da senha
                'cep' => $data['cep'],
                'rua' => $data['rua'],
                'numero' => $data['numero'],
                'bairro' => $data['bairro'],
                'complemento' => $data['complemento'],
                'cidade' => $data['cidade'],
                'estado' => $data['estado'],
            ];


            $stmt = $conn->prepare("INSERT INTO tb_usuario (nome, email, data_nascimento, telefone, senha, cep, rua, numero, bairro, complemento, cidade, estado) 
                                    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)");
            
            $stmt->bind_param(
                'ssssssssssss',
                $user->nome,
                $user->email,
                $user->dataNascimento,
                $user->telefone,
                $user->senha,
                $user->cep,
                $user->rua,
                $user->numero,
                $user->bairro,
                $user->complemento,
                $user->cidade,
                $user->estado
            );

            if ($stmt->execute()) {
                echo json_encode([
                    'success' => true,
                    'message' => 'Cadastro realizado com sucesso!',
                ]);
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
