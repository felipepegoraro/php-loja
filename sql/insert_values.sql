-- ============= INSERÇÃO DE DADOS ============= 
INSERT INTO tb_categoria (nome) VALUES 
    ('Eletrônicos'),
    ('Eletrodomésticos'),
    ('Informática'),
    ('Móveis e Decoração'),
    ('Moda e Vestuário'),
    ('Esporte e Lazer'),
    ('Beleza e Saúde'),
    ('Brinquedos e Bebês'),
    ('Papelaria e Escritório'),
    ('Livros, Filmes e Música'),
    ('Casa e Jardim'),
    ('Automotivo'),
    ('Pet Shop'),
    ('Supermercado');

INSERT INTO tb_subcategoria (idCategoria, nome) VALUES
    -- Subcategorias de Eletrônicos
    (1, 'Celulares'),
    (1, 'Computadores'),
    (1, 'Tablets'),
    (1, 'Televisores'),
    (1, 'Câmeras'),

    -- Subcategorias de Eletrodomésticos
    (2, 'Geladeiras'),
    (2, 'Fogões'),
    (2, 'Micro-ondas'),
    (2, 'Máquinas de Lavar'),

    -- Subcategorias de Informática
    (3, 'Notebooks'),
    (3, 'Desktops'),
    (3, 'Impressoras'),
    (3, 'Periféricos'),

    -- Subcategorias de Móveis e Decoração
    (4, 'Sofás'),
    (4, 'Mesas'),
    (4, 'Camas'),
    (4, 'Decoração'),

    -- Subcategorias de Moda e Vestuário
    (5, 'Masculino'),
    (5, 'Feminino'),
    (5, 'Infantil'),
    (5, 'Calçados'),

    -- Subcategorias de Esporte e Lazer
    (6, 'Bicicletas'),
    (6, 'Equipamentos de Ginástica'),
    (6, 'Moda Fitness'),

    -- Subcategorias de Beleza e Saúde
    (7, 'Cosméticos'),
    (7, 'Vitaminas e Suplementos'),

    -- Subcategorias de Brinquedos e Bebês
    (8, 'Brinquedos Educativos'),
    (8, 'Bonecas e Ação'),
    (8, 'Jogos e Puzzles'),

    -- Subcategorias de Papelaria e Escritório
    (9, 'Material Escolar'),
    (9, 'Material de Escritório'),

    -- Subcategorias de Livros, Filmes e Música
    (10, 'Livros'),
    (10, 'Filmes'),
    (10, 'Música'),

    -- Subcategorias de Casa e Jardim
    (11, 'Utensílios de Cozinha'),
    (11, 'Organização'),
    (11, 'Jardinagem'),

    -- Subcategorias de Automotivo
    (12, 'Acessórios para Carros'),
    (12, 'Ferramentas Automotivas'),

    -- Subcategorias de Pet Shop
    (13, 'Ração'),
    (13, 'Acessórios para Pets'),

    -- Subcategorias de Supermercado
    (14, 'Alimentos'),
    (14, 'Bebidas'),
    (14, 'Produtos de Limpeza');
