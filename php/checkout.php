<?php
# handleRequestMethod() -> checkUserSession()  => Verifica se o usuário está logado
#     -> getCartItems()                        => Recupera os itens no carrinho do usuário
#         -> calculateOrderTotal()             => Calcula o total do pedido
#             -> createOrder()                 => Cria um novo pedido no banco
#                 -> insertOrderItems()        => Insere os itens no pedido
#                 -> removeCartItems()         => Remove os itens do carrinho
#                     -> commit()              => Finaliza a transação se não houver erro
#     -> resposta final (sucesso ou erro)      => Retorna o status da operação


include_once 'ResponseHandler.php';
include_once 'Database.php';
$db = Database::getInstance();
$conn = $db->getConnection();

session_start();

$response = ["steps" => [], "errors" => []];

function checkUserSession($response) {
    if (!$_SESSION['user']) {
        $response["errors"][] = "[1] Sessão de usuário inválida.";
        echo json_encode(["success" => false, "message" => "Usuário inválido", "debug" => $response]);
        exit;
    }
    return $_SESSION['user']['id'];
}

function getCartItems(mysqli $conn, int $userId, array &$response) {
    $query = "SELECT c.idItem, c.quantidade, i.preco 
              FROM tb_carrinho c
              JOIN tb_itens i ON c.idItem = i.id
              WHERE c.idUsuario = ? AND c.status = 'ativo'";

    $result = ResponseHandler::executeQuery($conn, $query, ['i', $userId], $response, 'Erro ao buscar itens do carrinho');

    if ($result->num_rows <= 0) {
        $response["errors"][] = "[2] Carrinho vazio para o usuário: $userId.";
        ResponseHandler::jsonResponse(false, 'Carrinho vazio', $response);
    }

    $items = $result->fetch_all(MYSQLI_ASSOC);

    $response["steps"][] = "[2] Itens do carrinho recuperados";
    return $items;
}

function calculateOrderTotal($conn, $items, &$response) {
    $totalPedido = 0;
    foreach ($items as &$item) {
        $sumQuery = "SELECT preco FROM tb_itens WHERE id = ?";
        $params = ["i", $item['idItem']];
        $sumResult = ResponseHandler::executeQuery($conn, $sumQuery, $params, $response, "Erro ao calcular o total.");

        if ($sumResult && $sumResult->num_rows > 0) {
            $sumRow = $sumResult->fetch_assoc();
            $item['preco'] = $sumRow['preco'];
            $totalPedido += $item['quantidade'] * $item['preco'];
        } else {
            $response["errors"][] = "[3] Preço não encontrado para o item ID: " . $item['idItem'];
            echo json_encode(['success' => false, 'message' => 'Erro ao calcular o total. Preço não encontrado para um dos itens.', 'debug' => $response]);
            exit;
        }
    }

    $response["steps"][] = "[3] Total do pedido calculado: $totalPedido.";
    return $totalPedido;
}

function createOrder($conn, $userId, $totalPedido, &$response) {
    $pedidoQuery = $conn->prepare(
        "INSERT INTO tb_pedido 
        (idUsuario, data, status, total) 
        VALUES (?, CURDATE(), 'pendente', ?)"
    );

    $pedidoQuery->bind_param("id", $userId, $totalPedido);
    $pedidoQuery->execute();
    
    if ($pedidoQuery->affected_rows === 0) {
        $response["errors"][] = "[4] Falha ao criar o pedido para o usuário: $userId.";
        echo json_encode(['success' => false, 'message' => 'Erro ao criar pedido.', 'debug' => $response]);
        exit;
    }

    $pedidoId = $pedidoQuery->insert_id;
    $response["steps"][] = "[4] Pedido criado com ID: $pedidoId.";
    $pedidoQuery->close();
    return $pedidoId;
}


function insertOrderItems($conn, $userId, $items, $pedidoId, &$response) {
    foreach ($items as $item) {
        if (is_null($item['preco'])) {
            $response["steps"][] = "[5] Preço nulo encontrado para o item ID: " . $item['idItem'];
            echo json_encode(['success' => false, 'message' => 'Erro ao realizar pedido. Preço nulo encontrado para um item.', 'debug' => $response]);
            exit;
        }

        $insertQuery = "
            INSERT INTO tb_itens_pedido 
            (idUsuario, idItem, quantidade, preco, finalizado, idPedido)
            VALUES (?,?,?,?,TRUE,?)";
        
        $params = [
            "iiidi",
            $userId,
            $item['idItem'],
            $item['quantidade'],
            $item['preco'],
            $pedidoId
        ];

        ResponseHandler::executeQuery($conn, $insertQuery, $params, $response, "Erro ao inserir item no pedido.");
    }

    $response["steps"][] = "[5] Item inserido no pedido.";
}

function removeCartItems($conn, $userId, &$response) {
    $deleteQuery = "
        DELETE FROM tb_carrinho 
        WHERE idUsuario = ? AND status = 'ativo'";

    $params = ["i", $userId];

    ResponseHandler::executeQuery($conn, $deleteQuery, $params, $response, "Erro ao remover itens do carrinho.");
    $response["steps"][] = "[6] Itens do carrinho removidos para o usuário ID $userId.";
}

function placeOrder($conn, $userId, $items, $response) {
    $totalPedido = calculateOrderTotal($conn, $items, $response);
    
    $conn->begin_transaction();
    try {
        $pedidoId = createOrder($conn, $userId, $totalPedido, $response);

        insertOrderItems($conn, $userId, $items, $pedidoId, $response);

        removeCartItems($conn, $userId, $response);

        $conn->commit();
        $response["steps"][] = "[7] Transação concluída com sucesso.";
        echo json_encode(['success' => true, 'message' => 'Pedido realizado com sucesso.', 'debug' => $response]);
        exit;

    } catch(Exception $e) {
        $conn->rollback();
        $response["errors"][] = "[7] Erro ao realizar transação: " . $e->getMessage();
        echo json_encode(['success' => false, 'message' => 'Erro ao realizar pedido.', 'debug' => $response]);
        exit;
    }
}

function handleRequestMethod($conn, $response) {
    // if ($method === 'POST') {
        $userId = checkUserSession($response);
        $response["steps"][] = "[1] Usuário identificado com ID: $userId.";
        
        $items = getCartItems($conn, $userId, $response);
        
        placeOrder($conn, $userId, $items, $response);
    // } else {
    //     $response["steps"][] = "[9] Método de requisição inválido.";
    //     echo json_encode(["success" => false, "message" => "Requisição inválida", "debug" => $response]);
    //     // $conn->close();
    //     exit;
    // }
}

handleRequestMethod($conn, $response);
?>
