<?php 
$conn = include 'connect-db.php';

// salva os itens do carrinho na tabela tb_itens_pedido
// salva as informações do pedido na tabela tb_pedido
// remove os itens do carrinho
// TODO: simular pagamento e atualizar status de tb_pedido.

session_start();

if (!$_SESSION['user']){
    echo json_encode(["success" => false, "message" => "Usuario invalido"]);
    exit;
}

$userId = $_SESSION['user']['id'];

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $query = $conn->prepare("SELECT * FROM tb_carrinho WHERE idUsuario = ? AND status = 'ativo'");
    $query->bind_param('i', $userId);
    $query->execute();
    $result = $query->get_result();

    if ($result->num_rows === 0) {
        $query->close();
        $conn->close();
        echo json_encode(['success' => false, 'message' => 'Carrinho vazio: ' . $userId . "ok"]);
        exit;
    }

    $items = $result->fetch_all(MYSQLI_ASSOC);
    $query->close();

    $conn->begin_transaction();
    try {

        $pedidoQuery = $conn->prepare("INSERT INTO tb_pedido (idUsuario, data, status, total) VALUES (?, CURDATE(), 'pendente', ?)");

        $totalPedido = 0;
        foreach ($items as $item) {
            $totalPedido += $item['quantidade'] * $item['preco'];
        }

        $pedidoQuery->bind_param("id", $userId, $totalPedido);
        $pedidoQuery->execute();
        $pedidoId = $pedidoQuery->insert_id;
        $pedidoQuery->close();

        foreach ($items as $item){
            $insertQuery = $conn->prepare("
                INSERT INTO tb_itens_pedido 
                (idUsuario, idItem, quantidade, preco, finalizado, idPedido)
                VALUES (?,?,?,?,TRUE,?)");

            $insertQuery->bind_param("iiidi", 
                $item['idUsuario'],
                $item['idItem'],
                $item['quantidade'],
                $item['preco'],
                $pedidoId
            );

            $insertQuery->execute();
            $insertQuery->close();
        }

        $deleteQuery = $conn->prepare("DELETE FROM tb_carrinho WHERE idUsuario = ? AND status = 'ativo'");
        $deleteQuery->bind_param('i', $userId);
        $deleteQuery->execute();
        $deleteQuery->close();

        $conn->commit();
        echo json_encode(['success' => true, 'message' => 'Pedido realizado com sucesso.']);
        exit;

    } catch(Exception $e){
        $conn->rollback();
        echo json_encode(['success' => false, 'message' => 'Erro ao realizar pedido: ' . $e]);
        exit;
    }
    
}

echo json_encode(["success" => false, "message" => "requisição invalida"]);
$conn->close();
?>
