# Projeto PHP-LOJA
ideias // todolist

- PENSAR odne colocar um tipo dde session-handler para nao repetir isso:

```php
function checkUserSession(&$response) {
    if (!isset($_SESSION['user']) || !$_SESSION['user']) {
        $response["errors"][] = "[1] Sessão de usuário inválida.";
        ResponseHandler::jsonResponse(false, 'Usuário inválido', $response);
    }
    return $_SESSION['user']['id'];
}
```

- [X] definir um NOME
- [X] login/logout 

- oq terá no header???
    -[X] coloquei sobre,suporte,catálogo e login.
    -[X] nome / logo a decidir
    -[x] adicionar carrinho de compra 
    -[ ] pensar em mais coisas

- [x] definir a paleta de cores pro site.

- [x] design; modificar formulario de /admin/register products
- [x] design; modificar catalogo // itens de tamanhos fixo e menores
- [x] fazer carrinho de compras

- tela de editar 
    - [ ] nome/senha
    - [ ] foto

- [X] regex nos formularios

- NO CATALOGO:
    - [X] filtro por categoria e por subcategoria
    - [X] filtro por preco
    - [X] TALVEZ: indicar os mais comprados

- [X] CRIAR TELA RESUMO DO PEDIDO // mostrando itens/preco/add +ou-/remover/selecionar
- ??? ESQUEMA DE PAGAMENTO ???

NAO CONSEGUI COLOCAR UM DIRETORIO cart/ dentro do php para separar add.php,update.php etc
entao fiz cart-add.php etc porque nao tava indo de JEITO NENHUM

## Requisitos Funcionais

OK:
- RF001: Login/Logout
- RF002: Cadastro de Usuário
- RF003: Visualização do Cardápio
- RF004: Detalhes do Item
- RF005: Resumo do Pedido

FALTANDO:
- nada.
