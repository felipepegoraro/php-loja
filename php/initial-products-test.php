<?php

// DELETAR ESSE ARQUIVO DEPOIS
// É APENAS DE TESTE

function imageToBlob($imagePath) {
    return file_get_contents($imagePath);;
}

$conn = include 'connect-db.php';

$productData = [
    [ 'idSubCategoria' => 1, 'nome' => 'Celular', 'descricao' => 'Celular de última geração', 
        'preco' => 1500.00, 'foto' => imageToBlob('../public/teste-iphone15.png') ],
    [ 'idSubCategoria' => 1, 'nome' => 'Fone de Ouvido', 'descricao' => 'Fone de ouvido com cancelamento de ruído',
        'preco' => 350.00, 'foto' => imageToBlob('../public/teste-headset-logitech.png') ],

    [ 'idSubCategoria' => 2, 'nome' => 'Arroz', 'descricao' => 'Arroz 5kg',
        'preco' => 20.00, 'foto' => imageToBlob('../public/teste-arroz-tio-joao.png') ],
    [ 'idSubCategoria' => 2, 'nome' => 'Feijão', 'descricao' => 'Feijão 1kg',
        'preco' => 5.00, 'foto' => imageToBlob('../public/teste-feijao-camil.png') ]
];

$stmt = $conn->prepare("INSERT INTO tb_itens (idSubCategoria, nome, descricao, preco, foto) VALUES (?, ?, ?, ?, ?)");

foreach ($productData as $p){
    $stmt->bind_param("issds", $p['idSubCategoria'], $p['nome'], $p['descricao'], $p['preco'], $p['foto']);
    $stmt->execute();
}

$stmt->close();
$conn->close();
?>
