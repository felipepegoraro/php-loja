<?php 
$conn = include "connect-db.php";
$query = " SELECT * from tb_carrinho";
$res = $conn->query($query);

if (!$res){
    $conn->close();
    die("error");
}

$cart = [];


if ($res->num_rows <= 0){
    echo json_encode(["success" => false, "message" => "nenhuma entrada na tabela carrinho"]);
    $conn->close();
    exit();
}

while ($row = $res->fetch_assoc()){
    $cart[] = [
        'id' => $row['id'],
        'idUsuario' => $row['idUsuario'],
        'idItem' => $row['idItem'],
        'quantidade' => $row['quantidade'],
        'preco' => $row['preco'],
        'status' => $row['status']
    ];
}

echo json_encode(["success" => true, "values" => $cart], JSON_UNESCAPED_UNICODE);
$conn->close();
?>
