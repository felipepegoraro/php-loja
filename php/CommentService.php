<?php
include_once 'Database.php';
include_once 'ResponseHandler.php';

class CommentService {
    private mysqli $conn;
    private string $tb;
    private int $deletedUserId;

    public function __construct() {
        $db = Database::getInstance();
        $this->conn = $db->getConnection();
        $this->tb = "tb_comentarios";
        $this->deletedUserId = 0;
    }

    /**
     * Atualiza a nota média de um item com base nos comentários.
     *
     * @param string $idProduto  ID do produto a ser atualizado.
     * @param array $response  Referência para o array de resposta onde os erros e status serão armazenados.
     * @return void
     */
    private function _updateItemRating(string $idProduto, array &$response): void {
        $sql = "
        UPDATE tb_itens i
        SET i.nota = (
            SELECT AVG(c.nota)
            FROM tb_comentarios c
            WHERE c.idProduto = i.id
        )
        WHERE i.id = ?";

        ResponseHandler::executeQuery(
            $this->conn,
            $sql,
            ['d', $idProduto],
            $response,
            "Erro ao atualizar nota"
        );
    }

    public function addComment(
        string $idUsuario,
        string $idProduto,
        float $nota,
        string $titulo,
        string $comentario
    ): void {
        $response = [];
        $sql = 
        "INSERT INTO " . $this->tb .  " (
            idUsuario, idProduto, nota, titulo, comentario, data_comentario
        ) VALUES (?, ?, ?, ?, ?, UTC_TIMESTAMP())";

        $params = ['iidss', $idUsuario, $idProduto, $nota, $titulo, $comentario];

        $result = ResponseHandler::executeQuery(
            $this->conn, $sql, $params, $response, "Erro ao inserir comentário"
        );

        if ($result === null) {
            $response['steps'][] = 'Inserção bem-sucedida';
            $this->_updateItemRating($idProduto, $response);
            ResponseHandler::jsonResponse(true, "Comentário inserido com sucesso", $response);
        } else {
            $response['errors'][] = 'Erro desconhecido durante a inserção';
            ResponseHandler::jsonResponse(false, "Falha ao inserir comentário", $response);
        }
    }

    public function getComments(int $itemId): void {
        $sql  = "SELECT c.id, c.idUsuario, c.idProduto, c.nota, c.titulo, c.comentario";
        $sql .= ", c.data_comentario, c.ultima_atualizacao, u.nome AS nome_usuario ";
        $sql .= "FROM " . $this->tb . " AS c INNER JOIN tb_usuario AS u ";
        $sql .= "ON c.idUsuario = u.id ";
        $sql .= "WHERE c.idProduto = ?";

        $response = [];
        $params = ["i", $itemId];
        
        $result = ResponseHandler::executeQuery(
            $this->conn,
            $sql,
            $params,
            $response,
            'Erro ao executar query'
        );

        $comments = [];

        if ($result && $result->num_rows > 0) {
            while ($row = $result->fetch_assoc()) {
                $comments[] = [
                    'id' => $row['id'],
                    'idUsuario' => $row['idUsuario'],
                    'idProduto' => $row['idProduto'],
                    'nota' => $row['nota'],
                    'titulo' => $row['titulo'],
                    'comentario' => $row['comentario'],
                    'data_comentario' => $row['data_comentario'],
                    'ultima_atualizacao' => $row['ultima_atualizacao'],
                    'nome_usuario' => $row['nome_usuario']
                ];
            }
        }

        ResponseHandler::jsonResponse(
            true,
            "Comentários encontrados",
            $response,
            $comments
        );
    }



    public function userDeleteComment(int $commentId): void {
        $response = [];

        // Obtém o id do item associado ao comentário
        $sql  = "SELECT i.id FROM tb_itens AS i ";
        $sql .= "INNER JOIN tb_comentarios AS c ON (i.id = c.idProduto) ";
        $sql .= "WHERE c.id = ?";

        $result = ResponseHandler::executeQuery(
            $this->conn,
            $sql,
            ['i', $commentId],
            $response,
            "Erro ao executar query"
        );

        if (!$result || $result->num_rows === 0) {
            ResponseHandler::jsonResponse(
                false,
                "Comentário não encontrado",
                $response
            );
            return;
        }

        $row = $result->fetch_assoc();
        $itemId = $row['id'];

        // deleta o comentário
        $deleteResult = ResponseHandler::executeQuery(
            $this->conn,
            "DELETE FROM tb_comentarios WHERE id = ?",
            ['i', $commentId],
            $response,
            "Erro ao excluir comentário"
        );

        // recalcula a nota do produto
        $this->recalculateRatingsFromComments($itemId);

        ResponseHandler::jsonResponse(
            true,
            "Sucesso ao remover comentário",
            $response
        );
    }


    // Recalcula a nota média do produto
    private function recalculateRatingsFromComments(int $itemId): void {
        $response = [];

        $sqlRecalculate  = "UPDATE tb_itens SET nota = ";
        $sqlRecalculate .= "(SELECT COALESCE(AVG(nota), 0) FROM tb_comentarios WHERE idProduto = ?) ";
        $sqlRecalculate .= "WHERE id = ?";

        $paramsRecalculate = ['ii', $itemId, $itemId]; 

        $resultRecalculate = ResponseHandler::executeQuery(
            $this->conn,
            $sqlRecalculate,
            $paramsRecalculate,
            $response,
            "Erro ao recalcular a nota"
        );
    }



    // nao vou usar essa coisa (?)
    // 1. mover comentário para usuário genérico deletedUser(id=0)
    public function reassignCommentToDeletedUser(int $commentId): void {
        $response = [];
        $sql  = "UPDATE " . $this->tb . " SET idUsuario = ?, ";
        $sql .= "ultima_atualizacao = CURRENT_TIMESTAMP WHERE id = ?";
        $params = ['ii', $this->deletedUserId, $commentId];

        ResponseHandler::executeQuery(
            $this->conn,
            $sql,
            $params,
            $response,
            'Erro ao reatribuir comentário para usuário deletado'
        );
    }


    // 2. mover todos comentários de determinado usuário para deletedUser(id=0)
    public function reassignAllCommentsFromUser(int $userId): void {
        $response = [];
        $sql  = "UPDATE " . $this->tb . " SET idUsuario = ?, ";
        $sql .= "ultima_atualizacao = CURRENT_TIMESTAMP WHERE idUsuario = ?";
        $params = ['ii', $this->deletedUserId, $userId];

        ResponseHandler::executeQuery(
            $this->conn,
            $sql,
            $params,
            $response,
            'Erro ao reatribuir comentários para usuário deletado'
        );
    }
}

?>
