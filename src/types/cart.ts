export type Cart = {
    id: number;
    idUsuario: number;
    idItem: number;
    quantidade: number;
    status: 'ativo' | 'removido';
}

export type CartItem = {
    nomeItem: string;       
    descricaoItem: string;  
    precoItem: number;      
    categoriaItem: string;  
    subcategoriaItem: string;
    fotoItem: File | Buffer | null;
};


export type Cartfull = Cart & CartItem