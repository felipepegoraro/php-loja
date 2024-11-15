export type ItemSubcategoria = {
    id: number,
    nome: string
    idCategoria: number;
}

export type ItemCategoria = {
    id: number,
    nome: string
}

export type Item = {
    id: number;
    idSubCategoria: number;
    nome: string;
    descricao: string;
    foto: File | Buffer | null;
    preco: number;
    categoria: string;
    subcategoria: string;
};
