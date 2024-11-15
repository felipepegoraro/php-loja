<?php
function imageToBlob($imagePath) {
    return file_get_contents($imagePath);;
}

$conn = include 'connect-db.php';

$productData = [
    [ 
        'idSubCategoria' => 1,  // Subcategoria Celulares
        'nome' => 'Celular', 
        'descricao' => 'Celular de última geração', 
        'preco' => 1500.00, 
        'foto' => imageToBlob('../public/teste-iphone15.png') 
    ],
    [ 
        'idSubCategoria' => 2,
        'nome' => 'Fone de Ouvido', 
        'descricao' => 'Fone de ouvido com cancelamento de ruído',
        'preco' => 350.00, 
        'foto' => imageToBlob('../public/teste-headset-logitech.png') 
    ],

    [ 
        'idSubCategoria' => 44,
        'nome' => 'Arroz', 
        'descricao' => 'Arroz 5kg',
        'preco' => 20.00, 
        'foto' => imageToBlob('../public/teste-arroz-tio-joao.png') 
    ],
    [ 
        'idSubCategoria' => 44,
        'nome' => 'Feijão', 
        'descricao' => 'Feijão 1kg',
        'preco' => 5.00, 
        'foto' => imageToBlob('../public/teste-feijao-camil.png') 
    ]
];

$stmt = $conn->prepare("INSERT INTO tb_itens (idSubCategoria, nome, descricao, preco, foto) VALUES (?, ?, ?, ?, ?)");

foreach ($productData as $p){
    $stmt->bind_param("issds", $p['idSubCategoria'], $p['nome'], $p['descricao'], $p['preco'], $p['foto']);
    $stmt->execute();
}

$users = [
    ['João Silva', 'joao.silva@example.com', '1990-05-15', '11987654321', 'senha123', '12345-678', 'Rua A', '123', 'Centro', 'Apto 101', 'São Paulo', 'SP', 0],
    ['Julia Oliveira', 'julia.oliv@example.com', '1985-11-30', '11976543210', 'senha456', '98765-432', 'Rua B', '56', 'Jardim', 'Casa 1', 'Rio de Janeiro', 'RJ', 0],
    ['ADMIN', 'admin@developer.com', '2000-01-01', '00000000000', 'senha123', '', '', '', '', '', '', '', 1]
];

$stmt_user = $conn->prepare("INSERT INTO tb_usuario (nome, email, data_nascimento, telefone, senha, cep, rua, numero, bairro, complemento, cidade, estado, admin) 
VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)");

foreach ($users as $user) {
    $hashedPassword = password_hash($user[4], PASSWORD_BCRYPT);

    $stmt_user->bind_param("sssssssssssss", $user[0], $user[1], $user[2], 
        $user[3], $hashedPassword, $user[5], $user[6], $user[7], $user[8], 
        $user[9], $user[10], $user[11], $user[12]
    );
    
    if (!$stmt_user->execute()) {
        echo "Erro ao inserir usuário: " . $stmt_user->error;
    }
}

$stmt->close();
$stmt_user->close();
$conn->close();
?>
