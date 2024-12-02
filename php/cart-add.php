<?php
# validateRequestData()   => Verifica dados da requisição
# finalizeItem()          => Processa o item no carrinho
#     -> checkQuery()     => Verifica se o item já está no carrinho
#         -> updateItem() => Atualiza o item (quantidade ou status)
#         -> insertItem() => Adiciona o item ao carrinho
#     -> resposta final   => Retorna o status da operação

include_once 'ResponseHandler.php';
include_once 'Database.php';

$db = Database::getInstance();
$conn = $db->getConnection();

$data = json_decode(file_get_contents('php://input'), true);
$response = ["steps" => [], "errors" => []];

function validateRequestData($data, &$response) {
    if (
        !isset($data['idUsuario']) || !isset($data['idItem']) ||
        !isset($data['quantidade']) || !isset($data['status'])
    ) {
        $response['errors'][] = 'Dados inválidos';
        ResponseHandler::jsonResponse(false, 'Dados inválidos', $response);
    }
}

function updateItem($conn, $quantidade, $idUsuario, $idItem, &$response, $status = null) {
    $query = $status 
    ? "UPDATE tb_carrinho SET quantidade = quantidade + ?, status = ? WHERE idUsuario = ? AND idItem = ?"
    : "UPDATE tb_carrinho SET quantidade = quantidade + ? WHERE idUsuario = ? AND idItem = ?";

    $params = $status ? 
        ["issi", $quantidade, $status, $idUsuario, $idItem] : 
        ["iii", $quantidade, $idUsuario, $idItem];

    ResponseHandler::executeQuery($conn, $query, $params, $response, 'Erro ao atualizar o carrinho.');

    $response['steps'][] = 'Quantidade atualizada no carrinho';
}

function insertItem($conn, $idUsuario, $idItem, $quantidade, $status, &$response) {
    $query = "INSERT INTO tb_carrinho (idUsuario, idItem, quantidade, status) VALUES (?, ?, ?, ?)";
    $params = ["iiis", $idUsuario, $idItem, $quantidade, $status];

    ResponseHandler::executeQuery($conn, $query, $params, $response, 'erro adicionar produto ao carrinho.');

    $response['steps'][] = 'Produto adicionado ao carrinho com sucesso';
}

function finalizeItem($conn, $data, &$response) {
    $checkQuery = "SELECT id, status FROM tb_carrinho WHERE idUsuario = ? AND idItem = ?";
    $params = ["ii", $data['idUsuario'], $data['idItem']];

    $result = ResponseHandler::executeQuery($conn, $checkQuery, $params, $response, 'Erro ao verificar item no carrinho.');

    if ($result->num_rows > 0) {
        $row = $result->fetch_assoc();
        
        if ($row['status'] == 'removido') {
            updateItem($conn, $data['quantidade'], $data['idUsuario'], $data['idItem'],$response,'ativo');
        } else {
            updateItem($conn, $data['quantidade'], $data['idUsuario'], $data['idItem'], $response);
        }
    } else {
        insertItem($conn, $data['idUsuario'], $data['idItem'], $data['quantidade'], $data['status'], $response);
    }

    ResponseHandler::jsonResponse(true, 'Operação concluída com sucesso.', $response);
}

validateRequestData($data, $response);
finalizeItem($conn, $data, $response);
?>
