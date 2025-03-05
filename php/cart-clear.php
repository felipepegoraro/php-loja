<?php 
# checkIfCartIsEmpty()        => Verifica se o carrinho está vazio
# clearCart()                 => Esvazia o carrinho do usuário
#     -> executa query DELETE => Remove todos os itens do carrinho
#     -> resposta final       => Retorna sucesso ou erro

include_once 'ResponseHandler.php';
include_once 'CartService.php';

session_start();

if (!isset($_SESSION['user'])) {
    ResponseHandler::jsonResponse(false, "Usuário não logado. Não há carrinho.", []);
}

$userId = $_SESSION['user']['id'];
$response = ['steps' => [], 'errors' => []];

$cs = new CartService();

if ($cs->checkIfCartIsEmpty($userId)) {
    ResponseHandler::jsonResponse(false, "Carrinho já vazio", $cs->getResponse());
}

// apaga tudo!
$cs->removeItemsFromCart($userId, true, true);
?>
