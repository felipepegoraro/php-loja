<?php
require 'connect-db.php';
require 'send-email.php';
include_once 'ResponseHandler.php';
include_once 'Database.php';

header('Content-Type: application/json');

$rawData = file_get_contents("php://input");
$data = json_decode($rawData, true);
$response = [];

$db = Database::getInstance();
$conn = $db->getConnection();

if (!$data) {
    ResponseHandler::jsonResponse(false, 'Dados inválidos recebidos.', $response, null);
}

$email = $data['email'];

try {
    $query = "SELECT COUNT(*) FROM tb_usuario WHERE email = ?";
    $result = ResponseHandler::executeQuery($conn, $query, ['s', $email], $response, 'Erro ao verificar e-mail.');
    
    $emailExists = $result->fetch_row()[0] ?? 0;
    if ($emailExists) {
        ResponseHandler::jsonResponse(false, 'O e-mail já está cadastrado.', $response, null);
    }

    $token = bin2hex(random_bytes(32));
    
    $query = "INSERT INTO tb_usuario (
        nome, email, data_nascimento, telefone, senha, cep, rua, numero, 
        bairro, complemento, cidade, estado, admin, verificado, token
    ) VALUES (
        ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, false, ?
    )";

    ResponseHandler::executeQuery(
        $conn,
        $query,
        [
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
            $token
        ],
        $response,
        'Erro ao cadastrar o usuário.'
    );
    
    if (!sendVerificationEmail($data['email'], $token)) {
        ResponseHandler::jsonResponse(true, 'Erro ao enviar e-mail de confirmação.', $response, null);
    }

    ResponseHandler::jsonResponse(true, 'Cadastro iniciado! Verifique seu e-mail para ativar sua conta.', $response, null);
} catch (Exception $e) {
    ResponseHandler::jsonResponse(false, 'Erro na comunicação com o banco de dados: ' . $e->getMessage(), $response);
}

$conn->close();
?>
