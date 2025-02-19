export type Comentario = {
    id: number;
    idUsuario: number;
    idProduto: number;
    nota: number;
    titulo: string;
    comentario: string;
    data_comentario: string;
    ultima_atualizacao: string;
};


export type CommentExtended = Comentario & {nome_usuario: string}
