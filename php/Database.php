<?php 
// singleton database

class Database {
    private static ?Database $instance = null;
    private mysqli $conn;

    private function __construct(){
        include_once 'load-env.php';
        include_once 'config-cors.php';

        $servername = getenv('DB_HOST');
        $username = getenv('DB_USER');
        $password = getenv('DB_PASS');
        $dbname = getenv('DB_NAME');

        $this->conn = new mysqli($servername, $username, $password, $dbname);

        if ($this->conn->connect_error) {
            die(json_encode(["error" => "Falha na conexão: " . $this->conn->connect_error]));
        }
    }

    public static function getInstance(): Database {
        if (self::$instance === null) {
            self::$instance = new Database();
        }
        return self::$instance;
    }

    public function getConnection(): mysqli {
        return $this->conn;
    }

    // quando necessario (antes de erros por exemplo)
    public function closeConnection(): void {
        if (isset($this->conn)) {
            $this->conn->close();
            self::$instance = null;
            echo "Conexão manualmente fechada.\n";
        }
    }
}
?>
