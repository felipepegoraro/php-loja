import React, { useState } from 'react';
import axios from 'axios';
import { useUser } from '../context/userContext';

interface FormDataState {
    id: number;
    nome: string;
    email: string;
    senha: string;
    foto?: File | null;
}

const AccountForm: React.FC = () => {
    const { user } = useUser();

    const [formData, setFormData] = useState<FormDataState>({
        id: user?.id ?? 0,
        nome: user?.nome || '',
        email: '',
        senha: '',
        foto: null,
    });

    const endpoint = process.env.REACT_APP_ENDPOINT;

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0] || null;
        setFormData({ ...formData, foto: file });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const formDataToSend = new FormData();
        formDataToSend.append('id', String(formData.id));
        if (formData.nome) formDataToSend.append('nome', formData.nome);
        if (formData.email) formDataToSend.append('email', formData.email);
        if (formData.senha) formDataToSend.append('senha', formData.senha);
        if (formData.foto) formDataToSend.append('foto', formData.foto);

        try {
            const response = await axios.post(
                `${endpoint}/user-update.php`,
                formDataToSend,
                {
                    headers: { 'Content-Type': 'multipart/form-data' },
                }
            );
            console.log(response.data);
        } catch (error) {
            console.error(error);
        }
    };

    if (!user) {
        return <p>Usuário não autenticado</p>;
    }

    return (
        <form onSubmit={handleSubmit}>
            <input
                type="text"
                name="nome"
                value={formData.nome}
                onChange={handleChange}
                placeholder="Nome"
            />
            <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Email"
            />
            <input
                type="password"
                name="senha"
                value={formData.senha}
                onChange={handleChange}
                placeholder="Senha"
            />
            <input
                type="file"
                name="foto"
                onChange={handleFileChange}
                placeholder="Foto"
            />
            <button type="submit">Atualizar</button>
        </form>
    );
};

export default AccountForm;

