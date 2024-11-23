<?php
// Inicia a sessão
session_start();

// Verifica se o usuário está logado
if (isset($_SESSION['user'])) {
    // Inclui o arquivo de conexão com o banco
    $conn = include 'connect-db.php';

    // Recupera o ID do usuário logado
    $idUsuario = $_SESSION['user']['id'];

    // Consulta SQL para obter o carrinho com os detalhes do item
    $sql = "
        SELECT 
            c.id AS cart_id,
            c.idUsuario,
            c.idItem,
            c.quantidade,
            c.status AS cart_status,
            i.nome AS nomeItem,
            i.descricao AS descricaoItem,
            i.preco AS precoItem,
            s.nome AS categoriaItem,
            sc.nome AS subcategoriaItem,
            i.foto AS fotoItem
        FROM tb_carrinho c
        JOIN tb_itens i ON c.idItem = i.id
        JOIN tb_subcategoria sc ON i.idSubCategoria = sc.id
        JOIN tb_categoria s ON sc.idCategoria = s.id
        WHERE c.idUsuario = ? AND c.status = 'ativo'
    ";

    // Prepara a consulta
    if ($stmt = $conn->prepare($sql)) {
        // Vincula o parâmetro
        $stmt->bind_param("i", $idUsuario);

        // Executa a consulta
        $stmt->execute();


        $result = $stmt->get_result();

        if ($result->num_rows > 0) {
            $cartItems = [];

            while ($row = $result->fetch_assoc()) {
                $cartItems[] = [
                    "id" => $row['cart_id'],
                    "idUsuario" => $row['idUsuario'],
                    "idItem" => $row['idItem'],
                    "quantidade" => $row['quantidade'],
                    "status" => $row['cart_status'],
                    "nomeItem" => $row['nomeItem'],
                    "descricaoItem" => $row['descricaoItem'],
                    "precoItem" => $row['precoItem'],
                    "categoriaItem" => $row['categoriaItem'],
                    "subcategoriaItem" => $row['subcategoriaItem'],
                    "fotoItem" => $row['fotoItem'] ? base64_encode($row['fotoItem']) : null // Converte foto para base64
                ];
            }

            echo json_encode([
                "loggedIn" => true,
                "user" => $_SESSION['user'],
                "cart" => $cartItems
            ]);
        } else {
       
            echo json_encode([
                "loggedIn" => true,
                "user" => $_SESSION['user'],
                "cart" => []
            ]);
        }

        $stmt->close();
    } else {
    
        echo json_encode([
            "loggedIn" => true,
            "error" => "Erro na consulta ao banco de dados"
        ]);
    }
} else {
    // Caso o usuário não esteja logado
    echo json_encode(["loggedIn" => false]);
}

// Fecha a conexão com o banco
$conn->close();
?>
