## TODO List

de hoje:
[X] arrumar filtro catálogo de produtos (Catalogo)
[X] arrumar responsividade tela cadastro (Register)
[~] melhorar a tela de Minha Conta (Account)
[~] criar os Services
[X] clicar em listar +comentarios
[X] corrigir fuso horário comentários
[X] responsividade carrinho
[ ] remover e editar informações do produto (admin) 
[~] editar (user) ou deletar comentários (user/admin)
[x] arrumar página + php de editar usuário 
[ ] tela de /admin mais bonita


Fluxograma: Apagar conta + comentários + etc
1. manter os comentários, mas desvincular o usuário (`tb_comentarios`)
2. manter os pedidos, mas indicar que o usuário foi removido (`tb_pedido`)
3. remover a referência ao usuário, mas manter os registros de compra (`tb_itens_pedido`)
4. remover itens do carrinho (`tb_carrinho`)
5. deletar os dados do usuário (`tb_usuario`)
