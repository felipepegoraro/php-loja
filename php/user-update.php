<?php
include_once 'ResponseHandler.php';
include_once 'Database.php';

$db = Database::getInstance();
$conn = $db->getConnection();

$response = ['steps' => [], 'errors' => []];

session_start();

$fields = [
    'nome'  => ['value' => $_POST['nome']  ?? null, 'type' => 's'],
    'senha' => ['value' => $_POST['senha'] ?? null, 'type' => 's'],
    'foto' =>  ['value' => $_FILES['foto'] ?? null, 'type' => 'b']
];

if (!isset($_POST['email']) || empty($_POST['email'])) {
    ResponseHandler::jsonResponse(false, "Email do usuário não fornecido.", $response);
}

$userEmail = $_POST['email'];

function updateUser(mysqli $conn, string $userEmail, string $field, mixed $value, string $type, array &$response): bool {
    if ($field === 'senha') {
        $value = password_hash($value, PASSWORD_DEFAULT);
    }

    $sql = "UPDATE tb_usuario SET $field = ? WHERE email = ?";
    $result = ResponseHandler::executeQuery(
        $conn,
        $sql,
        [$type . 's', $value, $userEmail],
        $response,
        "Erro ao atualizar o campo '$field' do usuário."
    );

    return $result !== null;
}

foreach ($fields as $field => $fieldData) {
    if ($fieldData['value'] !== null) {

        if ($field == 'foto' && $fields['foto']['value'] != null) {
            $fieldData['value'] = file_get_contents($fields['foto']['value']['tmp_name']);
        }

        $result = updateUser($conn, $userEmail, $field, $fieldData['value'], $fieldData['type'], $response);

        if ($result) $response['steps'][] = "Campo '$field' atualizado.";
        else $response['steps'][] = "Campo '$field' não atualizado.";
    } else {
        $response['steps'][] = "Campo '$field' não foi atualizado (valor vazio).";
    }
}

ResponseHandler::jsonResponse(true, "Atualização concluída com sucesso.", $response);
?>
