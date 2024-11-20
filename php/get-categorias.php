<?php 
$conn = include "connect-db.php";
$query = "SELECT * from tb_categoria";

$result = $conn->query($query);

if (!$result) {
    die('Erro na consulta: ' . $conn->error);
}

$categorias = [];

if ($result->num_rows > 0){
    while ($row = $result->fetch_assoc()){
        $categorias[] = [
            "id" => $row['id'],
            "nome" => $row['nome'],
            "foto" => base64_encode($row['foto'])
        ];
    }
} else {
    echo json_encode(["error" => "Nenhuma categoria encontrada"]);
    $conn->close();
    exit();
}

echo json_encode($categorias, JSON_UNESCAPED_UNICODE);
$conn->close();
?>
