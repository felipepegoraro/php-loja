<?php
include_once 'ResponseHandler.php';
include_once 'Database.php';

$db = Database::getInstance();
$conn = $db->getConnection();

$response = ['steps' => [], 'errors' => []];

session_start();

$fields = [
    'nome'  => ['value' => $_POST['nome']  ?? null, 'type' => 's'], // VARCHAR
    'email' => ['value' => $_POST['email'] ?? null, 'type' => 's'], // VARCHAR
    'senha' => ['value' => $_POST['senha'] ?? null, 'type' => 's'], // VARCHAR
];

$file = $_FILES['foto'] ?? null;
if ($file && $file['error'] === UPLOAD_ERR_OK) {
    $fields['foto'] = ['value' => file_get_contents($file['tmp_name']), 'type' => 'b']; // MEDIUMBLOB
}

if (!isset($_POST['id']) || empty($_POST['id'])) {
    ResponseHandler::jsonResponse(false, "ID do usuário não fornecido.", $response);
}

$userId = intval($_POST['id']);

function updateUser(mysqli $conn, int $userId, string $field, mixed $value, string $type, array &$response): bool {
    if ($value === null) {
        $response['errors'][] = "Campo '$field' não possui valor.";
        return false;
    }

    if ($field === 'senha') {
        $value = password_hash($value, PASSWORD_DEFAULT);
    }

    $sql = "UPDATE tb_usuario SET $field = ? WHERE id = ?";
    $result = ResponseHandler::executeQuery(
        $conn,
        $sql,
        [$type . 'i', $value, $userId],
        $response,
        "Erro ao atualizar o campo '$field' do usuário."
    );

    return $result !== null;
}

foreach ($fields as $field => $fieldData) {
    if ($fieldData['value'] !== null) {
        $result = updateUser($conn, $userId, $field, $fieldData['value'], $fieldData['type'], $response);
        $response['steps'][] = "Campo '$field' atualizado.";
    } else {
        $response['steps'][] = "Campo '$field' não foi atualizado (valor vazio).";
    }
}

ResponseHandler::jsonResponse(true, "Atualização concluída com sucesso.", $response);
?>
