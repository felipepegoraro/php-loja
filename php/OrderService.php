<?php
# endpoint: /checkout:
# orderCheckout() -> checkUserSession()     => Verifica se o usuário está logado
#     -> getCartItems()                     => Recupera os itens no carrinho do usuário
#         -> calculateOrderTotal()          => Calcula o total do pedido
#             -> createOrder()              => Cria um novo pedido no banco
#                 -> insertOrderItems()     => Insere os itens no pedido
#                 -> removeCartItems()      => Remove os itens do carrinho
#                     -> commit()           => Finaliza a transação se não houver erro
#     -> resposta final (sucesso ou erro)   => Retorna o status da operação
 
include_once 'config-cors.php';
include_once 'ResponseHandler.php';
include_once 'Database.php';
include_once 'CartService.php';

class OrderService {
    private ?mysqli $conn = null;
    private CartService $cartService;
    private array $response = [];

    /**
     * inicialia a conexão e o CartService
     * verifica se a sessão ainda não se iniciou, e a inicia.
     */
    public function __construct(){
        $db = Database::getInstance();
        $this->conn = $db->getConnection();
        $this->cartService = new CartService();

        if (session_status() === PHP_SESSION_NONE) {
            session_start();
        }
    }


     /**
     * verifica se há um usuário autenticado na sessão.
     * se não houver, retorna uma resposta de erro.
     * 
     * @return int O ID do usuário autenticado.
     */
    private function checkUserSession(): int {
        if (!isset($_SESSION['user']))
            ResponseHandler::jsonResponse(false, 'Usuário inválido', []);
        return $_SESSION['user']['id'];
    }


    /**
     * verifica se o usuário autenticado possui privilégios de administrador.
     * se não for um administrador, retorna uma resposta de erro.
     */
    private function checkAdmin(): void {

        if (!isset($_SESSION['user']) || $_SESSION['user']['admin'] !== 1) {
            ResponseHandler::jsonResponse(
                false,
                'Usuário inválido ou sem permissões',
                $this->response
            );
        }
    }


    /**
     * REFAZER: 
     * calcula o valor total do pedido (todos preços dos itens multiplicados por suas quantidades)
     * se não houver itens no pedido, retorna uma resposta de erro.
     * caso um item não tenha preço registrado, também retorna erro.
     * 
     * @param array $items Lista de itens do pedido.
     * @return float O valor total do pedido.
     */
    private function calculateOrderTotal(array $items): float {
        $totalPedido = 0.0;

        if (empty($items)) ResponseHandler::jsonResponse(false, 'Nenhum item no pedido.', $this->response);

        foreach ($items as &$item){
            $sumQuery = "SELECT preco FROM tb_itens WHERE id = ?";
            $params = ["i", $item['idItem']];

            $sumResult = ResponseHandler::executeQuery(
                $this->conn, 
                $sumQuery,
                $params,
                $this->response,
                "Erro ao calcular o total."
            );

            if ($sumResult && $sumResult->num_rows > 0){
                $sumRow = $sumResult->fetch_assoc();
                $item['preco'] = $sumRow['preco'];
                $totalPedido += $item['quantidade'] * $item['preco'];
            } else {
                $this->response["errors"][] = "[3] Preço não encontrado para o item ID: " . $item['idItem'];
                ResponseHandler::jsonResponse(false, 'Erro ao calcular total', $this->response);
            }
        }

        $this->response["steps"][] = "Total do pedido calculado: $totalPedido.";
        return $totalPedido;
    }


    /**
     * insere o pedido em tb_pedido, para o usuário(id=$userId)
     * deixa como 'pendente' (enquanto nao houver pagamento)
     * em caso de falha, retorna erro.
     *
     * @param int $userId ID do usuário que está realizando o pedido.
     * @param float $totalPedido Valor total do pedido.
     * @return int ID do pedido recém-criado.
     */
    private function createOrder(int $userId, float $totalPedido): int {

        $pedidoQuery = "INSERT INTO tb_pedido (idUsuario, data, status, total) VALUES (?, CURDATE(), 'pendente', ?)";
        $params = ["id", $userId, $totalPedido];

        $result = ResponseHandler::executeQuery($this->conn, $pedidoQuery, $params, $this->response, "Erro ao criar pedido");
        
        if ($this->conn->affected_rows === 0) {
            $this->response["errors"][] = "Falha ao criar o pedido para o usuário: $userId.";
            ResponseHandler::jsonResponse(false, 'Erro ao criar pedido', $this->response);
        }

        $pedidoId = $this->conn->insert_id;
        $this->response["steps"][] = "Pedido criado com ID: $pedidoId.";

        return $pedidoId;
    }


    /**
     *  insere cada item do pedido(Id=pedidoId) na tabela de tb_itens_pedido
     *
     *  @param int $userId Id do usuário comprador
     *  @param array $items Todos itens do pedido
     *  @param int $pedidoId Id do Pedido 
     *  @return void
     */
    private function insertOrderItems(int $userId, array $items, int $pedidoId): void {

        foreach ($items as $item) {
            if (is_null($item['preco'])) {
                $this->response["steps"][] = "[5] Preço nulo encontrado para o item ID: " . $item['idItem'];
                ResponseHandler::jsonResponse(false, 'Erro ao realizar pedido (preco nulo)', $this->response);
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

            ResponseHandler::executeQuery($this->conn, $insertQuery, $params, $this->response, "Erro ao inserir item no pedido.");
        }

        $this->response["steps"][] = "Item inserido no pedido.";
    }


    /**
     * realiza o processamento de um pedido, incluindo cálculo do total, criação do pedido, 
     * inserção dos itens no banco e remoção dos itens do carrinho.
     *
     * @param int $userId O ID do usuário que está realizando o pedido.
     * @param array $items Lista de itens no carrinho do usuário.
     * @return void
     */
    private function placeOrder(int $userId, array $items): void {

        $totalPedido = $this->calculateOrderTotal($items);
        
        $this->conn->begin_transaction();
        try {
            $pedidoId = $this->createOrder($userId, $totalPedido);

            $this->insertOrderItems($userId, $items, $pedidoId);

            // indep == false => nao tem "retorno precoce"
            $this->cartService->removeItemsFromCart($userId, false, true);

            $this->conn->commit();
            $this->response["steps"][] = "Transação concluída com sucesso.";
            ResponseHandler::jsonResponse(true, 'Pedido realizado com sucesso.', $this->response);

        } catch(Exception $e) {
            $this->conn->rollback();
            $this->response["errors"][] = "Erro ao realizar transação: " . $e->getMessage();
            ResponseHandler::jsonResponse(false, 'Erro ao realizar pedido', $this->response);
        }
    }


    /**
     * processa o checkout do pedido para o usuário autenticado.
     * verifica a sessão do usuário, obtém os itens do carrinho e finaliza o pedido.
     * se não houver itens no carrinho, a função retorna sem realizar nenhuma ação.
     * 
     * @return void
     */
    public function orderCheckout(): void {

        $userId = $this->checkUserSession();
        $this->response["steps"][] = "[1] Usuário identificado com ID: $userId.";
        
        $items = $this->cartService->getCartItems($userId);
        if (!$items) return;
        
        $this->placeOrder($userId, $items);
    }


    /**
     * (apenas via admin)
     * obtém a lista de todos os pedidos cadastrados no sistema.
     * se não houver pedidos cadastrados, retorna uma resposta de erro.
     * 
     * @return void
     */
    public function getOrders(): void {
        $this->checkAdmin();

        $sql = "SELECT * from tb_pedido";
        $msg = "Erro ao executar query";

        $result = ResponseHandler::executeQuery($this->conn, $sql, [], $this->response, $msg);
        if (!$result) return;

        
        if ($result->num_rows <= 0) {
            ResponseHandler::jsonResponse(false, 'Nenhum pedido encontrado', $this->response);
        }

        $pedidos = [];
        
        while ($row = $result->fetch_assoc()){
            $pedidos[] = [
                'id' => $row['id'],
                'idUsuario' => $row['idUsuario'],
                'data' => $row['data'],
                'status' => $row['status'],
                'total' => $row['total']
            ];
        }

        ResponseHandler::jsonResponse(true, 'Pedidos recuperados', $this->response, $pedidos);
    }


    /**
     * (apenas via admin)
     * recupera todos os itens dos pedidos cadastrados no sistema.
     * se não houver itens registrados, retorna uma resposta de erro.
     *
     * @return void
     */
    public function getOrderItems(): void {
        $this->checkAdmin();
        $sql = "SELECT * FROM tb_itens_pedido";
        $result = ResponseHandler::executeQuery(
            $this->conn, $sql, [], $this->response, 
            "Erro ao executar query"
        );

        if (!$result) return;

        if ($result->num_rows <= 0){
            ResponseHandler::jsonResponse(false, "Nenhum item encontrado", $this->response);
        }

        $itens_pedido = [];

        // id | idUsuario | idItem | quantidade | preco  | finalizado | idPedido
        while ($row = $result->fetch_assoc()) {
            $itens_pedido[] = [
                'id' => $row['id'],
                'idUsuario' => $row['idUsuario'],
                'idItem' => $row['idItem'],
                'quantidade' => $row['quantidade'],
                'preco' => $row['preco'],
                'finalizado' => $row['finalizado'],
                'idPedido' => $row['idPedido'],
            ];
        }

        ResponseHandler::jsonResponse(true, "Pedidos encontrados", $this->response, $itens_pedido);
    }
}
?>
