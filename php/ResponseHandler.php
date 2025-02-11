<?php
class ResponseHandler {
    /**
     * Retorna uma resposta JSON e encerra o script.
     *
     * @param bool $success Indica se a operação foi bem-sucedida.
     * @param string $message Mensagem para incluir na resposta.
     * @param array $response Dados adicionais para depuração.
     * @param mixed $value Valor opcional para envio de dados.
     * @return never
     */
    public static function jsonResponse(bool $success, string $message, array &$response, $value = null): never {
        ob_clean(); // limpar buffer
        header('Content-Type: application/json; charset=utf-8');
        echo json_encode(
            [
                "success" => $success,
                "message" => $message,
                "value" => $value,
                "debug" => $response
            ],
            JSON_UNESCAPED_UNICODE
        );
        exit;
    }

    /**
     * Executa uma query preparada no banco de dados.
     *
     * @param mysqli $conn Objeto de conexão do banco de dados.
     * @param string $query Query SQL preparada.
     * @param array $params Parâmetros a serem vinculados na query.
     * @param array $response Dados de depuração.
     * @param string $errorMsg Mensagem de erro personalizada.
     * @return mysqli_result|null Resultado da query ou null em caso de erro.
     */
    public static function executeQuery(mysqli $conn, string $query, array $params, array &$response, string $errorMsg): ?mysqli_result {
        if ($stmt = $conn->prepare($query)) {
            if (!empty($params)) {
                $types = array_shift($params);
                $stmt->bind_param($types, ...$params);
            }
            
            if ($stmt->execute()) {
                $response['steps'][] = "query executada com sucesso"; 
                if (stripos($query, "SELECT") === 0) {
                    return $stmt->get_result();
                }
                return null;
            } else {
                $response['error'] = $stmt->error;
                self::jsonResponse(false, $errorMsg, $response);
            }
        } else {
            $response['error'] = $conn->error;
            self::jsonResponse(false, $errorMsg, $response);
        }
    }
}

