<?php
include_once 'Database.php';
include_once 'ResponseHandler.php';

class CommentService {
    private mysqli $conn;
    private string $tb;

    public function __construct() {
        $db = Database::getInstance();
        $this->conn = $db->getConnection();
        $this->tb = "tb_comentarios";
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
        $sql = "SELECT c.id, c.idUsuario, c.idProduto, c.nota, c.titulo, c.comentario, c.data_comentario, c.ultima_atualizacao, u.nome AS nome_usuario 
            FROM " . $this->tb . " AS c INNER JOIN tb_usuario AS u 
            ON c.idUsuario = u.id 
            WHERE c.idProduto = ?";
        $response = [];
        $params = ["i", $itemId];
        $result = ResponseHandler::executeQuery($this->conn, $sql, $params, $response, 'Erro ao executar query');
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

        ResponseHandler::jsonResponse(true, "Comentários encontrados", $response, $comments);
    }
}

?>
