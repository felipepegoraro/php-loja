<?php

// EXECUTAR APENAS UMA VEZ
// -> SE NECESSÁRIO, APAGAR AS TABELAS DE TESTE
// -> CRIAR NOVAMENTE AS TABELAS
// -> ACESSAR: http://localhost/php-loja-back/initial-products-test.php

$debug = ["steps" => [], "success" => []];
$conn = include 'connect-db.php';

function insertCategories($conn, &$debug){
    $categorias = [
        ['Eletrônicos', 'eletronicos.png'],
        ['Eletrodomésticos', 'eletrodomesticos.png'],
        ['Informática', 'informatica.png'],
        ['Móveis e Decoração', 'moveis-e-decoracao.png'],
        ['Moda e Vestuário', 'moda-e-vestuario.png'],
        ['Esporte e Lazer', 'esporte-e-lazer.png'],
        ['Beleza e Saúde', 'beleza-e-saude.png'],
        ['Brinquedos e Bebês', 'brinquedos-e-bebes.png'],
        ['Papelaria e Escritório', 'papelaria-e-escritorio.png'],
        ['Livros, Filmes e Música', 'livros-musica.png'],
        ['Casa e Jardim', 'casa-e-jardim.png'],
        ['Automotivo', 'automotivo.png'],
        ['Pet Shop', 'pet-shop.png'],
        ['Supermercado', 'mercado.png']
    ];

    $stmt_categoria = $conn->prepare("INSERT INTO tb_categoria (nome, foto) VALUES (?, ?)");
    if ($stmt_categoria === false) {
        $debug['steps'][] = "Erro ao preparar statement de categorias: " . $conn->error;
        return;
    }
    $debug['steps'][] = "Statement de categorias preparado com sucesso.";

    $flag = 0;
    foreach ($categorias as $categoria) {
        $nomeCategoria = $categoria[0];
        $fotoPath = 'php-loja.com/private/icons_category/' . $categoria[1];

        // NECESSÁRIO INSTALAR PHP-CURL
	$ch = curl_init($fotoPath);
	curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
	curl_setopt($ch, CURLOPT_FOLLOWLOCATION, true);
	$foto = curl_exec($ch);
	$httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
	$error = curl_error($ch);
	curl_close($ch);

	if ($foto === false || $httpCode != 200) {
	    $debug['steps'][] = "Erro ao baixar a foto para a categoria $categoria[1] (Código HTTP: $httpCode, erro $error)";
	    return;
	}

        $stmt_categoria->bind_param("ss", $nomeCategoria, $foto);
        if ($stmt_categoria->execute()) {
            $flag = 1;
        } else {
            $debug['steps'][] = "Erro ao inserir categoria '$nomeCategoria': " . $stmt_categoria->error;
        }
    }

    if ($flag === 1){
        $debug['success'][] = "Categorias inseridas com sucesso.";
    }

    $stmt_categoria->close();
    $debug['steps'][] = "Statement de categorias fechado.";
}

function insertSubcategories($conn, &$debug){
    $subcategorias = [
        [1, 'Celulares'],               [1, 'Fones de Ouvido'],           [1, 'Computadores'],          [1, 'Tablets'],
        [1, 'Televisores'],             [1, 'Câmeras'],                   [1, 'Outros'],
        [2, 'Geladeiras'],              [2, 'Fogões'],                    [2, 'Micro-ondas'],           [2, 'Máquinas de Lavar'],
        [3, 'Notebooks'],               [3, 'Desktops'],                  [3, 'Impressoras'],           [3, 'Periféricos'],
        [4, 'Sofás'],                   [4, 'Mesas'],                     [4, 'Camas'],                 [4, 'Decoração'],
        [5, 'Masculino'],               [5, 'Feminino'],                  [5, 'Infantil'],              [5, 'Calçados'],
        [6, 'Bicicletas'],              [6, 'Equipamentos de Ginástica'], [6, 'Moda Fitness'],
        [7, 'Cosméticos'],              [7, 'Vitaminas e Suplementos'],
        [8, 'Brinquedos Educativos'],   [8, 'Bonecas e Ação'],            [8, 'Jogos e Puzzles'],
        [9, 'Material Escolar'],        [9, 'Material de Escritório'],
        [10, 'Livros'],                 [10, 'Filmes'],                   [10, 'Música'],
        [11, 'Utensílios de Cozinha'],  [11, 'Organização'],              [11, 'Jardinagem'],
        [12, 'Acessórios para Carros'], [12, 'Ferramentas Automotivas'],
        [13, 'Ração'],                  [13, 'Acessórios para Pets'],
        [14, 'Alimentos'],              [14, 'Bebidas'],                  [14, 'Produtos de Limpeza']
    ];

    $stmt_subcategoria = $conn->prepare("INSERT INTO tb_subcategoria (idCategoria, nome) VALUES (?, ?)");
    if ($stmt_subcategoria === false) {
        $debug['steps'][] = "Erro ao preparar statement de subcategorias: " . $conn->error;
        return;
    }

    $debug['steps'][] = "Statement de subcategorias preparado com sucesso.";

    $flag = 0;

    foreach ($subcategorias as $subcategoria) {
        $idCategoria = $subcategoria[0];
        $nomeSubcategoria = $subcategoria[1];

        $stmt_subcategoria->bind_param("is", $idCategoria, $nomeSubcategoria);
        if ($stmt_subcategoria->execute()) {
            $flag = 1;
        } else {
            $debug['steps'][] = "Erro ao inserir subcategoria '$nomeSubcategoria': " . $stmt_subcategoria->error;
        }
    }


    if ($flag === 1){
        $debug['success'][] = "Sub-Categorias inseridas com sucesso.";
    }

    $stmt_subcategoria->close();
    $debug['steps'][] = "Statement de subcategorias fechado.";
}

function insertAdmin($conn, &$debug){
    $user = [
        'ADMIN',
        'admin@developer.com',
        '2000-01-01',
        '00000000000',
        'senha123',
        '', '', '', '', '', '', '',
        1,
        true,
        null
    ];

    $stmt_user = $conn->prepare("
        INSERT INTO tb_usuario (
            nome, email, data_nascimento, telefone, senha, cep, rua, numero, bairro, complemento, cidade, estado, admin, verificado, token)
        VALUES
            (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)"
    );

    if ($stmt_user === false) {
        $debug['steps'][] = "Erro ao preparar statement de usuário: " . $conn->error;
        return;
    }
    $debug['steps'][] = "Statement de usuário preparado com sucesso.";

    $hashedPassword = password_hash($user[4], PASSWORD_BCRYPT);

    $stmt_user->bind_param("sssssssssssssis",
        $user[0], $user[1], $user[2], $user[3],
        $hashedPassword, $user[5], $user[6], $user[7],
        $user[8], $user[9], $user[10], $user[11],
        $user[12], $user[13], $user[14]
    );

    if ($stmt_user->execute()) {
        $debug['success'][] = "Usuário admin inserido com sucesso.";
    } else {
        $debug['steps'][] = "Erro ao inserir usuário admin: " . $stmt_user->error;
    }

    $stmt_user->close();
    $debug['steps'][] = "Statement de usuário fechado.";
}


insertCategories($conn, $debug);
insertSubcategories($conn, $debug);
insertAdmin($conn, $debug);

$conn->close();

echo json_encode($debug);
?>
