export type SimplUser = {
    id: number;
    nome: string;
    email: string;
    senha: string;
    admin: 0 | 1;
    foto?: File | null;
};

type ExtendedUser = {
    data_nascimento: string;
    telefone: string;
    cpf: string;
    cep: string;
    rua: string;
    numero: string;
    bairro: string;
    complemento: string;
    cidade: string;
    estado: string;
};

export type User = SimplUser & Partial<ExtendedUser>;
