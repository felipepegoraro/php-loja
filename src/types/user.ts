type RequiredUserFields = {
    id: number;
    nome: string;
    email: string;
    senha: string;
    admin: boolean;
};

type ExtendedUserFields = {
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

export type User = RequiredUserFields & Partial<ExtendedUserFields>;
