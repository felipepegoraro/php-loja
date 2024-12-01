<?php
class ResponseHandler {
    /**
     * Retorna uma resposta JSON e encerra o script.
     *
     * @param bool $success Indica se a operação foi bem-sucedida.
     * @param string $message Mensagem para incluir na resposta.
     * @param array $response Dados adicionais para depuração.
     * @return never
     */
    public static function jsonResponse(bool $success, string $message, array $response): never {
        echo json_encode(
            ["success" => $success, "message" => $message, "debug" => $response],
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
        // Prepara a query
        if ($stmt = $conn->prepare($query)) {
            // Vincula os parâmetros
            $types = array_shift($params);
            $stmt->bind_param($types, ...$params);
            
            // Executa a query
            if ($stmt->execute()) {
                // Se for uma SELECT, retorna o resultado
                if (stripos($query, "SELECT") === 0) {
                    return $stmt->get_result();
                }
                // Caso contrário, apenas retorna NULL
                return null;
            } else {
                // Se houve erro na execução, adiciona o erro ao response
                $response['error'] = $stmt->error;
                self::jsonResponse(false, $errorMsg, $response);
            }
        } else {
            // Se houve erro ao preparar a query, adiciona o erro ao response
            $response['error'] = $conn->error;
            self::jsonResponse(false, $errorMsg, $response);
        }
    }
}

