<?php
include 'Database.php';
include 'ResponseHandler.php';

$db = Database::getInstance();
$conn = $db->getConnection();

$response = ["steps" => [], "errors" => []];

$accessCode = $_GET['accessCode'] ?? null;
$byEmail = isset($_GET['byEmail']) ? $_GET['byEmail'] : null;
$byId = isset($_GET['byId']) ? $_GET['byId'] : null;

// TODO
if ($accessCode !== 'codigo_secreto_administrador')
    ResponseHandler::jsonResponse(false, "Acesso Negado", $response, null);

$params = [];
$types = "";
$sql = "SELECT id, nome, email, foto FROM tb_usuario WHERE 1=1";

if ($byEmail !== null) {
    $sql .= " AND email = ?";
    $params[] = $byEmail;
    $types .= "s";
}

if ($byId !== null) {
    $sql .= " AND id = ?";
    $params[] = $byId;
    $types .= "i";
}

if ($types != "") array_unshift($params, $types);

$result = ResponseHandler::executeQuery($conn, $sql, $params, $response, "Nenhum dado encontrado");

if ($result->num_rows <= 0){
    ResponseHandler::jsonResponse(true, "Nenhum Usuário encontrado", $response);
}

$dados = [];

while ($row = $result->fetch_assoc()) {
    if (!empty($row['foto'])) $row['foto'] = base64_encode($row['foto']);
    $dados[] = $row;
}

ResponseHandler::jsonResponse(true, "Usuário(s) encontrado(s)", $response, $dados);
?>
