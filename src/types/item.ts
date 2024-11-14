export type ItemCategoria = {
    id: number,
    nome: string
}

export type Item = {
    id: number;
    idSubCategoria: number;
    nome: string;
    descricao: string;
    foto: Buffer | null;
    preco: number;
};
