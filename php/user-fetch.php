<?php
// curl http://localhost/user-fetch.php?tabela=tb_usuario

$conn = include 'connect-db.php';

$tabela = isset($_GET['tabela']) ? $_GET['tabela'] : null;

if ($tabela && preg_match('/^[a-zA-Z0-9_]+$/', $tabela)) {
    $tabela = $conn->real_escape_string($tabela);

    if ($tabela === 'tb_usuario') {
        $sql = "SELECT id, nome, email FROM `$tabela`";
    } else {
        echo json_encode(["error" => "Acesso negado a esta tabela"]);
        $conn->close();
        exit;
    }

    $result = $conn->query($sql);

    if ($result->num_rows > 0) {
        $dados = [];
        while ($row = $result->fetch_assoc()) {
            $dados[] = $row;
        }
        echo json_encode($dados);
    } else {
        echo json_encode(["error" => "Nenhum dado encontrado"]);
    }
} else {
    echo json_encode(["error" => "Nome de tabela inválido ou ausente"]);
}

$conn->close();
?>
