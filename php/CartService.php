<?php
include_once 'ResponseHandler.php';
include_once 'Database.php';

class CartService {
    private ?mysqli $conn = null;
    private $response = [];

    public function __construct(){
        $db = Database::getInstance();
        $this->conn = $db->getConnection();
    }

    public function getCartItems(int $userId): mixed {
        $query = "SELECT c.idItem, c.quantidade, i.preco 
                  FROM tb_carrinho c
                  JOIN tb_itens i ON c.idItem = i.id
                  WHERE c.idUsuario = ? AND c.status = 'ativo'";

        $result = ResponseHandler::executeQuery(
            $this->conn,
            $query,
            ['i', $userId],
            $this->response,
            'Erro ao buscar itens do carrinho'
        );

        if ($result->num_rows <= 0) {
            $this->response["errors"][] = "Carrinho vazio para o usuário: $userId.";
            ResponseHandler::jsonResponse(false, 'Carrinho vazio', $this->response);
        }

        $items = $result->fetch_all(MYSQLI_ASSOC);

        $this->response["steps"][] = "Itens do carrinho recuperados";
        return $items;
    }

    public function removeCartItems(int $userId): void {
        $deleteQuery = "
            DELETE FROM tb_carrinho 
            WHERE idUsuario = ? AND status = 'ativo'";

        $params = ["i", $userId];

        ResponseHandler::executeQuery(
            $this->conn,
            $deleteQuery,
            $params,
            $this->response,
            "Erro ao remover itens do carrinho."
        );
        
        $this->response["steps"][] = "Itens do carrinho removidos para o usuário ID $userId.";
    }
};
?>
