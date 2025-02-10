SET FOREIGN_KEY_CHECKS = 0;
DROP TABLE IF EXISTS tb_pedido;
DROP TABLE IF EXISTS tb_itens_pedido;
DROP TABLE IF EXISTS tb_itens;
DROP TABLE IF EXISTS tb_subcategoria;
DROP TABLE IF EXISTS tb_categoria;
DROP TABLE IF EXISTS tb_usuario;
DROP TABLE IF EXISTS tb_carrinho;
DROP TABLE IF EXISTS tb_comentarios;
SET FOREIGN_KEY_CHECKS = 1;

CREATE TABLE IF NOT EXISTS tb_usuario (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(64) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    data_nascimento DATE,
    telefone VARCHAR(15),
    senha VARCHAR(255) NOT NULL,
    cep VARCHAR(9),
    rua VARCHAR(64),
    numero VARCHAR(6),
    bairro VARCHAR(50),
    complemento VARCHAR(50),
    cidade VARCHAR(50),
    estado CHAR(2),
    admin BOOLEAN NOT NULL,
    foto MEDIUMBLOB DEFAULT NULL,
    token VARCHAR(65) DEFAULT NULL,
    verificado BOOLEAN DEFAULT FALSE
);

CREATE TABLE IF NOT EXISTS tb_categoria (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(64) NOT NULL,
    foto MEDIUMBLOB
);

CREATE TABLE IF NOT EXISTS tb_subcategoria (
    id INT AUTO_INCREMENT PRIMARY KEY,
    idCategoria INT,
    nome VARCHAR(64) NOT NULL,
    FOREIGN KEY (idCategoria) REFERENCES tb_categoria(id)
);

CREATE TABLE IF NOT EXISTS tb_itens (
    id INT AUTO_INCREMENT PRIMARY KEY,
    idSubCategoria INT,
    nome VARCHAR(128) NOT NULL,
    descricao TEXT,
    foto MEDIUMBLOB,
    preco DECIMAL(10, 2) NOT NULL,
    FOREIGN KEY (idSubCategoria) REFERENCES tb_subcategoria(id)
);

CREATE TABLE IF NOT EXISTS tb_pedido (
    id INT AUTO_INCREMENT PRIMARY KEY,
    idUsuario INT,
    data DATE NOT NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'pendente', -- status do pedido (pendente, pago, enviado, etc.)
    total DECIMAL(10, 2),
    FOREIGN KEY (idUsuario) REFERENCES tb_usuario(id)
);

CREATE TABLE IF NOT EXISTS tb_itens_pedido (
    id INT AUTO_INCREMENT PRIMARY KEY,
    idUsuario INT,
    idItem INT,
    quantidade INT NOT NULL,
    preco DECIMAL(10,2) NOT NULL,
    finalizado TINYINT(1) NOT NULL DEFAULT 0,
    idPedido INT,
    FOREIGN KEY (idPedido) REFERENCES tb_pedido(id),
    FOREIGN KEY (idUsuario) REFERENCES tb_usuario(id),
    FOREIGN KEY (idItem) REFERENCES tb_itens(id)
);

CREATE TABLE IF NOT EXISTS tb_carrinho (
    id INT AUTO_INCREMENT PRIMARY KEY,
    idUsuario INT,
    idItem INT,
    quantidade INT NOT NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'ativo', -- 'ativo', 'removido'
    FOREIGN KEY (idUsuario) REFERENCES tb_usuario(id),
    FOREIGN KEY (idItem) REFERENCES tb_itens(id)
);

CREATE TABLE IF NOT EXISTS tb_comentarios (
    id INT AUTO_INCREMENT PRIMARY KEY,
    idUsuario INT NOT NULL,
    idProduto INT NOT NULL,
    nota FLOAT(2,1) NOT NULL CHECK (nota BETWEEN 0 AND 5),
    titulo VARCHAR(64) NOT NULL,
    comentario TEXT NOT NULL,
    data_comentario DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    ultima_atualizacao DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (idUsuario) REFERENCES tb_usuario(id),
    FOREIGN KEY (idProduto) REFERENCES tb_itens(id)
);

-- INSERT INTO tb_comentarios (idUsuario, idProduto, nota, titulo, comentario)
-- VALUES 
-- (1, 1, 4.2, "comentario 1", "lorem ipsum"),
-- (1, 1, 3.8, "comentario 2", "dolor sit amet"),
-- (1, 2, 5.0, "comentario 3", "consectetur adipiscing elit");
