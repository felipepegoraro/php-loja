<?php
include_once 'Database.php';
include_once 'EmailService.php';
include_once 'ResponseHandler.php';
include_once 'CommentService.php';
include_once 'OrderService.php';
include_once 'CartService.php';

class UserService {
    private ?mysqli $conn = null;
    private array $response = [];
    private int $deletedUserId = 0;


    public function __construct(){
        $db = Database::getInstance();
        $this->conn = $db->getConnection();
    }

    
    private function generateToken(int $size = 32): string {
        return bin2hex(random_bytes($size));
    }

    
    private function isEmailRegistered(string $email): bool {
        $query = "SELECT COUNT(*) FROM tb_usuario WHERE email = ?";
        $result = ResponseHandler::executeQuery(
            $this->conn,
            $query,
            ['s', $email], 
            $this->response,
            'Erro ao verificar e-mail.'
        );

        return ($result->fetch_row()[0] ?? 0) > 0;
    }


    /**
     * Inserir usuário (coadjuvante do registerUser)
     * @param array $data : dado dos usuários
     * @param string $token : token de verificação
     */
    private function insertUser(array $data, string $token): void {
        $query = "INSERT INTO tb_usuario ("
               . "nome, email, data_nascimento, telefone, senha, cep, rua, numero, "
               . "bairro, complemento, cidade, estado, admin, verificado, token "
               . ") VALUES ( ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, false, ?)";

        ResponseHandler::executeQuery(
            $this->conn,
            $query,
            [
                'ssssssssssssss',
                $data['nome'],
                $data['email'],
                $data['dataNascimento'],
                $data['telefone'],
                password_hash($data['senha'], PASSWORD_DEFAULT),
                $data['cep'],
                $data['rua'],
                $data['numero'],
                $data['bairro'],
                $data['complemento'],
                $data['cidade'],
                $data['estado'],
                $data['admin'],
                $token
            ],
            $this->response,
            'Erro ao cadastrar o usuário.'
        );
    }


    /**
     * Registra novos usuários, envia email de confirmação
     * registerUser              => registra novos usuários
     * |   isEmailRegistered     => verifica se email já esta cadastrado
     * |   generateToken         => gera token aleatório
     * |   sendVerificationEmail => envia email de verificação
     * |   jsonResponse          => envia resposta de sucesso
     * @param array $data : dados recebidos via POST
     * @return void
     */
    public function registerUser(array $data): void {
        try {
            $email = $data['email'];
            
            if ($this->isEmailRegistered($email)){
                ResponseHandler::jsonResponse(
                    false,
                    'O e-mail já está cadastrado.',
                    $this->response
                );
            }

            $token = $this->generateToken(32);
            $this->insertUser($data, $token);

            if (!EmailService::sendVerificationEmail($email, $token)) {
                ResponseHandler::jsonResponse(
                    false,
                    'Erro ao enviar e-mail de confirmação.',
                    $this->response
                );
            }

            ResponseHandler::jsonResponse(
                true,
                'Cadastro iniciado! Verifique seu e-mail para ativar sua conta.',
                $this->response
            );
        } catch(Exception $e){
            ResponseHandler::jsonResponse(
                false,
                'Erro na comunicação com o banco de dados: ' . $e->getMessage(),
                $this->response
            );
        }
    }


    private function deleteUser(int $idUsuario): void {
        $sql = "DELETE FROM tb_usuario WHERE id = ?";

        $result = ResponseHandler::executeQuery(
            $this->conn,
            $sql,
            ['i', $idUsuario],
            $this->response,
            "Erro ao atualizar id do usuário"
        );
    }


    public function deleteUserFullScheme(int $idUsuario): void {
        $this->conn->begin_transaction();

        try {
            // atualizar comentários para indicar que o usuário foi removido
            $cms = new CommentService();
            $cms->reassignAllCommentsFromUser($idUsuario);

            // atualizar pedidos e itens dos pedidos [...]
            $os = new OrderService();
            $os->reassignAllOrdersFromUser($idUsuario);

            // remover itens do carrinho do usuário atual
            $ca = new CartService();
            $ca->removeItemsFromCart($idUsuario, false, true);

            // deleta usuário atual
            $this->deleteUser($idUsuario);

            $this->conn->commit();

            session_start();
            session_unset();
            session_destroy();

            ResponseHandler::jsonResponse(
                true,
                "Sucesso ao excluir usuário",
                $this->response
            );
        } catch(Exception $e){
            $this->conn->rollback();

            ResponseHandler::jsonResponse(
                false,
                "Erro ao excluir usuário: " . $e->getMessage(),
                $this->response
            );
        }
    }
    // public function getUsers(): void {}
}

?>
