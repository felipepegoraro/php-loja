<?php
# validateRequestData()   => Verifica dados da requisição
# finalizeItem()          => Processa o item no carrinho
#     -> checkQuery()     => Verifica se o item já está no carrinho
#         -> updateItem() => Atualiza o item (quantidade ou status)
#         -> insertItem() => Adiciona o item ao carrinho
#     -> resposta final   => Retorna o status da operação

include_once 'CartService.php';
include_once 'ResponseHandler.php';

$data = json_decode(file_get_contents('php://input'), true);

function validateRequestData($data, &$response) {
    if (
        !isset($data['idUsuario']) || !isset($data['idItem']) ||
        !isset($data['quantidade']) || !isset($data['status'])
    ) {
        $response['errors'][] = 'Dados inválidos';
        ResponseHandler::jsonResponse(false, 'Dados inválidos', $response);
    }
}

$cs = new CartService();
$res = $cs->getResponse();

validateRequestData($data, $res);
$cs->finalizeItem($data);
?>
