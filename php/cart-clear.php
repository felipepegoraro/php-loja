<?php 
# checkIfCartIsEmpty()        => Verifica se o carrinho está vazio
# clearCart()                 => Esvazia o carrinho do usuário
#     -> executa query DELETE => Remove todos os itens do carrinho
#     -> resposta final       => Retorna sucesso ou erro

include_once 'ResponseHandler.php';
include_once 'Database.php';
$db = Database::getInstance();
$conn = $db->getConnection();

session_start();

if (!isset($_SESSION['user'])) {
    ResponseHandler::jsonResponse(false, "Usuário não logado. Não há carrinho.", []);
}

$userid = $_SESSION['user']['id'];
$username = $_SESSION['user']['nome'];
$response = ['steps' => [], 'errors' => []];

function checkIfCartIsEmpty($conn, $userid) {
    $queryCheck = "SELECT COUNT(*) FROM tb_carrinho WHERE idUsuario = ?";
    $stmtCheck = $conn->prepare($queryCheck);
    $stmtCheck->bind_param("i", $userid);
    $stmtCheck->execute();
    $stmtCheck->bind_result($itemcount);
    $stmtCheck->fetch();
    $stmtCheck->close();

    return $itemcount == 0;
}

function clearCart($conn, $userid, $username, &$response) {
    $query = "DELETE FROM tb_carrinho WHERE idUsuario = ?";
    $stmt = $conn->prepare($query);
    $stmt->bind_param("i", $userid);

    $res = $stmt->execute();

    if (!$res) {
        ResponseHandler::jsonResponse(false, "Erro ao esvaziar carrinho", $response);
    }

    if ($stmt->affected_rows > 0) {
        ResponseHandler::jsonResponse(true, "Carrinho esvaziado com sucesso", $response);
    }

    ResponseHandler::jsonResponse(false, "Erro ao esvaziar carrinho (já vazio!)", $response);
}

if (checkIfCartIsEmpty($conn, $userid)) {
    ResponseHandler::jsonResponse(false, "Carrinho já vazio", $response);
}

clearCart($conn, $userid, $username, $response);
?>
