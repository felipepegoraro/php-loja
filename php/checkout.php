<?php 
# handleRequestMethod() -> checkUserSession()  => Verifica se o usuário está logado
#     -> getCartItems()                        => Recupera os itens no carrinho do usuário
#         -> calculateOrderTotal()             => Calcula o total do pedido
#             -> createOrder()                 => Cria um novo pedido no banco
#                 -> insertOrderItems()        => Insere os itens no pedido
#                 -> removeCartItems()         => Remove os itens do carrinho
#                     -> commit()              => Finaliza a transação se não houver erro
#     -> resposta final (sucesso ou erro)      => Retorna o status da operação


$conn = include 'connect-db.php';

session_start();

$response = ["steps" => []];

function checkUserSession($response) {
    if (!$_SESSION['user']) {
        $response["steps"][] = "Sessão de usuário inválida.";
        echo json_encode(["success" => false, "message" => "Usuário inválido", "debug" => $response]);
        exit;
    }
    return $_SESSION['user']['id'];
}

function getCartItems($conn, $userId, $response) {
    $query = $conn->prepare("
        SELECT c.idItem, c.quantidade, i.preco 
        FROM tb_carrinho c
        JOIN tb_itens i ON c.idItem = i.id
        WHERE c.idUsuario = ? AND c.status = 'ativo'
    ");
    $query->bind_param('i', $userId);
    $query->execute();
    $result = $query->get_result();

    if ($result->num_rows <= 0) {
        $response["steps"][] = "Carrinho vazio para o usuário: $userId.";
        $query->close();
        $conn->close();
        echo json_encode(['success' => false, 'message' => 'Carrinho vazio', 'debug' => $response]);
        exit;
    }

    $items = $result->fetch_all(MYSQLI_ASSOC);

    $response["steps"][] = "Itens do carrinho recuperados: " . json_encode($items);
    $query->close();
    return $items;
}

function calculateOrderTotal($conn, $items, $response) {
    $totalPedido = 0;
    foreach ($items as &$item) {
        $sumQuery = $conn->prepare("SELECT preco FROM tb_itens WHERE id = ?");
        $sumQuery->bind_param('i', $item['idItem']);
        $sumQuery->execute();
        $sumResult = $sumQuery->get_result();

        if ($sumResult->num_rows > 0) {
            $sumRow = $sumResult->fetch_assoc();
            $item['preco'] = $sumRow['preco'];
            $totalPedido += $item['quantidade'] * $item['preco'];
        } else {
            $response["steps"][] = "[1] Preço não encontrado para o item ID: " . $item['idItem'];
            $sumQuery->close();
            echo json_encode(['success' => false, 'message' => 'Erro ao calcular o total. Preço não encontrado para um dos itens.', 'debug' => $response]);
            exit;
        }

        $sumQuery->close();
    }
    $response["steps"][] = "[2] Total do pedido calculado: $totalPedido.";
    return $totalPedido;
}

function createOrder($conn, $userId, $totalPedido, $response) {
    $pedidoQuery = $conn->prepare("INSERT INTO tb_pedido (idUsuario, data, status, total) VALUES (?, CURDATE(), 'pendente', ?)");
    $pedidoQuery->bind_param("id", $userId, $totalPedido);
    $pedidoQuery->execute();
    $pedidoId = $pedidoQuery->insert_id;
    $response["steps"][] = "[3] Pedido criado com ID: $pedidoId.";
    $pedidoQuery->close();
    return $pedidoId;
}

function insertOrderItems($conn, $userId, $items, $pedidoId, $response) {
    foreach ($items as $item) {
        if (is_null($item['preco'])) {
            $response["steps"][] = "[6] Preço nulo encontrado para o item ID: " . $item['idItem'];
            echo json_encode(['success' => false, 'message' => 'Erro ao realizar pedido. Preço nulo encontrado para um item.', 'debug' => $response]);
            exit;
        }

        $insertQuery = $conn->prepare("
            INSERT INTO tb_itens_pedido 
            (idUsuario, idItem, quantidade, preco, finalizado, idPedido)
            VALUES (?,?,?,?,TRUE,?)");

        $insertQuery->bind_param("iiidi", 
            $userId,
            $item['idItem'],
            $item['quantidade'],
            $item['preco'],
            $pedidoId
        );

        $insertQuery->execute();
        $response["steps"][] = "[4] Item inserido no pedido: " . json_encode($item);
        $insertQuery->close();
    }
}


function removeCartItems($conn, $userId, $response) {
    $deleteQuery = $conn->prepare("DELETE FROM tb_carrinho WHERE idUsuario = ? AND status = 'ativo'");
    $deleteQuery->bind_param('i', $userId);
    $deleteQuery->execute();
    $response["steps"][] = "[5] Itens do carrinho removidos para o usuário: $userId.";
    $deleteQuery->close();
}

function placeOrder($conn, $userId, $items, $response) {
    $totalPedido = calculateOrderTotal($conn, $items, $response);
    
    $conn->begin_transaction();
    try {
        $pedidoId = createOrder($conn, $userId, $totalPedido, $response);

        insertOrderItems($conn, $userId, $items, $pedidoId, $response);

        removeCartItems($conn, $userId, $response);

        $conn->commit();
        $response["steps"][] = "[6] Transação concluída com sucesso.";
        echo json_encode(['success' => true, 'message' => 'Pedido realizado com sucesso.', 'debug' => $response]);
        exit;

    } catch(Exception $e) {
        $conn->rollback();
        $response["steps"][] = "[7] Erro ao realizar transação: " . $e->getMessage();
        echo json_encode(['success' => false, 'message' => 'Erro ao realizar pedido.', 'debug' => $response]);
        exit;
    }
}

function handleRequestMethod($method, $conn, $response) {
    if ($method === 'POST') {
        $userId = checkUserSession($response);
        $response["steps"][] = "[8] Usuário identificado com ID: $userId.";
        
        $items = getCartItems($conn, $userId, $response);
        
        placeOrder($conn, $userId, $items, $response);
    } else {
        $response["steps"][] = "[9] Método de requisição inválido.";
        echo json_encode(["success" => false, "message" => "Requisição inválida", "debug" => $response]);
        $conn->close();
        exit;
    }
}

handleRequestMethod($_SERVER['REQUEST_METHOD'], $conn, $response);

$conn->close();
?>
