SET FOREIGN_KEY_CHECKS = 0;
DROP TABLE IF EXISTS tb_pedido;
DROP TABLE IF EXISTS tb_itens_pedido;
DROP TABLE IF EXISTS tb_itens;
DROP TABLE IF EXISTS tb_subcategoria;
DROP TABLE IF EXISTS tb_categoria;
DROP TABLE IF EXISTS tb_usuario;
DROP TABLE IF EXISTS tb_carrinho;
SET FOREIGN_KEY_CHECKS = 1;

CREATE TABLE IF NOT EXISTS tb_usuario (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    data_nascimento DATE,
    telefone VARCHAR(20),
    senha VARCHAR(255) NOT NULL,
    cep VARCHAR(10),
    rua VARCHAR(255),
    numero VARCHAR(10),
    bairro VARCHAR(100),
    complemento VARCHAR(100),
    cidade VARCHAR(100),
    estado CHAR(2),
    admin BOOLEAN NOT NULL
);

CREATE TABLE IF NOT EXISTS tb_categoria (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(255) NOT NULL,
    foto MEDIUMBLOB
);

CREATE TABLE IF NOT EXISTS tb_subcategoria (
    id INT AUTO_INCREMENT PRIMARY KEY,
    idCategoria INT,
    nome VARCHAR(255) NOT NULL,
    FOREIGN KEY (idCategoria) REFERENCES tb_categoria(id)
);

CREATE TABLE IF NOT EXISTS tb_itens (
    id INT AUTO_INCREMENT PRIMARY KEY,
    idSubCategoria INT,
    nome VARCHAR(255) NOT NULL,
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
    preco DECIMAL(10, 2) NOT NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'ativo', -- 'ativo', 'removido'
    FOREIGN KEY (idUsuario) REFERENCES tb_usuario(id),
    FOREIGN KEY (idItem) REFERENCES tb_itens(id)
);
