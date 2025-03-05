<?php
include_once 'ResponseHandler.php';
include_once 'Database.php';

class CartService {
    private ?mysqli $conn = null;
    private array $res = [];

    public function __construct(){
        $db = Database::getInstance();
        $this->conn = $db->getConnection();
    }

    public function getResponse(): array { return $this->res; }

    public function getCartItems(int $idUsuario): array {
        $query = "SELECT c.idItem, c.quantidade, i.preco 
                  FROM tb_carrinho c
                  JOIN tb_itens i ON c.idItem = i.id
                  WHERE c.idUsuario = ? AND c.status = 'ativo'";

        $result = ResponseHandler::executeQuery(
            $this->conn,
            $query,
            ['i', $idUsuario],
            $this->res,
            'Erro ao buscar itens do carrinho'
        );

        if ($result->num_rows <= 0) {
            $this->res["errors"][] = "Carrinho vazio para o usuário: $idUsuario.";
            ResponseHandler::jsonResponse(false, 'Carrinho vazio', $this->res);
        }

        $items = $result->fetch_all(MYSQLI_ASSOC);

        $this->res["steps"][] = "Itens do carrinho recuperados";
        return $items;
    }

    public function updateItem(
        int $quantidade,
        int $idUsuario,
        int $idItem,
        string $status = null
    ): void {
        if ($status) {
            $query = "UPDATE tb_carrinho 
                      SET quantidade = ?, status = ? 
                      WHERE idUsuario = ? AND idItem = ?";
            $params = ["issi", $quantidade, $status, $idUsuario, $idItem];
        } else {
            $query = "UPDATE tb_carrinho 
                      SET quantidade = quantidade + ? 
                      WHERE idUsuario = ? AND idItem = ?";
            $params = ["iii", $quantidade, $idUsuario, $idItem];
        }

        $msg = "Erro ao atualizar o carrinho.";
        ResponseHandler::executeQuery($this->conn, $query, $params, $this->res, $msg);

        $this->res['steps'][] = 'Quantidade atualizada no carrinho';

        ResponseHandler::jsonResponse(
            true,
            "Quantidade atualizada com sucesso.",
            $this->res
        );
    }
    private function insertItem(
        int $idUsuario,
        int $idItem,
        int $quantidade,
        string $status
    ): void {
        $query  = "INSERT INTO tb_carrinho (idUsuario, idItem, quantidade, status) ";
        $query .= "VALUES (?, ?, ?, ?)";
        $params = ["iiis", $idUsuario, $idItem, $quantidade, $status];

        ResponseHandler::executeQuery(
            $this->conn, 
            $query,
            $params,
            $this->res,
            'Erro adicionar produto ao carrinho.'
        );

        $this->res['steps'][] = 'Produto adicionado ao carrinho com sucesso';

        ResponseHandler::jsonResponse(
            true,
            'Operação concluída com sucesso.',
            $this->res
        );
    }

    /**
     * finaliza a transferencia
     * @param array $data: dados recebidos
     * @return void
     */
    public function finalizeItem(array $data): void {
        $params = ["ii", $data['idUsuario'], $data['idItem']];

        $checkQuery 
            = "SELECT id, status FROM tb_carrinho WHERE idUsuario = ? "
            . "AND idItem = ?";
    
        $result = ResponseHandler::executeQuery(
            $this->conn,
            $checkQuery,
            $params,
            $this->res,
            'Erro ao verificar item no carrinho.'
        );

        if ($result->num_rows == 0) {
            $this->insertItem(
                $data['idUsuario'],
                $data['idItem'],
                $data['quantidade'],
                $data['status']
            );

            return;
        }

        $row = $result->fetch_assoc();
            
        if ($row['status'] == 'removido') {
            $this->updateItem(
                $data['quantidade'],
                $data['idUsuario'],
                $data['idItem'],
                'ativo'
            );

            return;
        }

        $this->updateItem(
            $data['quantidade'],
            $data['idUsuario'],
            $data['idItem']
        );
    }


    public function checkIfCartIsEmpty(int $userid): bool {
        $queryCheck = "SELECT COUNT(*) as total FROM tb_carrinho WHERE idUsuario = ?";
        $params = ["i", $userid];

        $result = ResponseHandler::executeQuery(
            $this->conn,
            $queryCheck,
            $params,
            $this->res,
            'Erro ao verificar item no carrinho.'
        );

        if ($result){
            $row = $result->fetch_assoc();
            return $row['total'] == 0;
        }

        return true;
    }


    // Remover apenas os itens 'ativos' mantém os itens 'removidos' no banco,
    // permitindo sua recuperação. Usar removeItemsFromCart($idUsuario) preserva os 
    // itens removidos. Já removeItemsFromCart($idUsuario, true) remove todos os itens,
    // incluindo os removidos, tornando impossível sua recuperação.
    // ser independente quer dizer que ele nao está "dentro" de outras chamadas
    // chamadas "puras" sao independentes: nao tem problema a chamada de exit()
    // dentro do jsonResponse :^)
    // @param int $idUsuario : id do usuario
    // @param bool $indep : independente ou nao
    // @param bool $removeAll : removo todos os itens (sem filtro de status)
    // @return void
    public function removeItemsFromCart(
        int $idUsuario,
        bool $indep,
        bool $removeAll = false
    ): void {
        $deleteQuery 
            = "DELETE FROM tb_carrinho WHERE idUsuario = ? "
            . ($removeAll ? "" : "AND status = 'ativo'");

        $params = ["i", $idUsuario];

        ResponseHandler::executeQuery(
            $this->conn,
            $deleteQuery,
            $params,
            $this->res,
            $removeAll 
                ? "Erro ao esvaziar o carrinho." 
                : "Erro ao remover itens do carrinho."
        );

        $message = $removeAll 
            ? "Carrinho esvaziado com sucesso" 
            : "Itens do carrinho removidos.";

        $this->res["steps"][] = $message;

        if ($indep){
            ResponseHandler::jsonResponse(true, $message, $this->res);
        }
    }


    public function restoreCart(int $idUsuario): void {
        $query = "UPDATE tb_carrinho SET status = 'ativo', quantidade = 1 "
               . "WHERE idUsuario = ?";
        
        $result = ResponseHandler::executeQuery(
            $this->conn,
            $query,
            ["i", $idUsuario],
            $this->res,
            "Erro ao restaurar os itens do carrinho."
        );
        
        ResponseHandler::jsonResponse(
            true,
            "Itens do carrinho restaurados com sucesso.",
            $this->res
        );
    }
};
?>
