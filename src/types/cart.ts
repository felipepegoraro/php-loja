export type Cart = {
    id: number;
    idUsuario: number;
    idItem: number;
    quantidade: number;
    preco: number;
    status: 'ativo' | 'removido';
}
