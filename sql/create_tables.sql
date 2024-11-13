-- abrir o mysql
-- executar: source SEU_DIRETORIO/create_tables.sql



USE php_loja;

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
    estado CHAR(2)
);

CREATE TABLE IF NOT EXISTS tb_categoria (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(255) NOT NULL
);

CREATE TABLE IF NOT EXISTS tb_itens (
    id INT AUTO_INCREMENT PRIMARY KEY,
    idCategoria INT,
    nome VARCHAR(255) NOT NULL,
    descricao TEXT,
    foto BLOB,
    preco DECIMAL(10, 2) NOT NULL,
    FOREIGN KEY (idCategoria) REFERENCES tb_categoria(id)
);

CREATE TABLE IF NOT EXISTS tb_itens_pedido (
    id INT AUTO_INCREMENT PRIMARY KEY,
    idUsuario INT,
    idItem INT,
    quantidade INT NOT NULL,
    preco DECIMAL(10, 2) NOT NULL,
    finalizado BOOLEAN NOT NULL DEFAULT FALSE,
    FOREIGN KEY (idUsuario) REFERENCES tb_usuario(id),
    FOREIGN KEY (idItem) REFERENCES tb_itens(id)
);

-- ============= INSERÇÃO DE DADOS ============= 
INSERT INTO tb_usuario (nome, email, data_nascimento, telefone, senha, cep, rua, numero, bairro, complemento, cidade, estado)
VALUES 
('João Silva', 'joao.silva@example.com', '1990-05-15', '11987654321', 'senha123', '12345-678', 'Rua A', '123', 'Centro', 'Apto 101', 'São Paulo', 'SP'),
('Julia Oliveira', 'maria.oliveira@example.com', '1985-11-30', '11976543210', 'senha456', '98765-432', 'Rua B', '456', 'Jardim', 'Casa 202', 'Rio de Janeiro', 'RJ');
