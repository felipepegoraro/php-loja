<?php 
$conn = include "connect-db.php";
$query = "SELECT * from tb_subcategoria";

$result = $conn->query($query);

if (!$result) {
    die('Erro na consulta: ' . $conn->error);
}

$sub = [];

if ($result->num_rows > 0){
    while ($row = $result->fetch_assoc()){
        $sub[] = [
            "id" => $row['id'],
            "nome" => $row['nome'],
            "idCategoria" => $row['idCategoria']
        ];
    }
} else {
    echo json_encode(["error" => "Nenhuma categoria encontrada"]);
    $conn->close();
    exit();
}

echo json_encode($sub, JSON_UNESCAPED_UNICODE);
$conn->close();
?>
