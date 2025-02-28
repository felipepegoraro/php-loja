import React, { useState } from 'react';
import axios from 'axios';
import { useUser, SimplUser } from '../context/userContext';
import '../styles/css/accountform.css';

interface FormDataState {
    id: number;
    nome: string;
    senha: string;
    foto?: File | null;
}

const AccountForm: React.FC = () => {
    const { user, setUser } = useUser();

    const [formData, setFormData] = useState<FormDataState>({
        id: user?.id ?? 0,
        nome: user?.nome || '',
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
        console.log('Arquivo selecionado:', file);
        setFormData({ ...formData, foto: file });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const formDataToSend = new FormData();
        formDataToSend.append('id', String(formData.id));
        if (formData.nome) formDataToSend.append('nome', formData.nome);
        if (formData.senha) formDataToSend.append('senha', formData.senha);
        if (formData.foto) formDataToSend.append('foto', formData.foto);

        try {
            // atualiza o user no banco
            const response = await axios.post(
                `${endpoint}/user-update.php`,
                formDataToSend,
                {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                        'Accept': 'application/json'
                    },
                    withCredentials: true
                }
            );

            if (response.data.success){
                console.log(response.data);

                // atualiza o user local (falta atualizar imagem! pegar do banco)
                const updatedUser = {
                    ...user,
                    nome: (formData.nome.length > 0) ? formData.nome : user?.nome 
                } as SimplUser;

                setUser(updatedUser);
                localStorage.setItem('user', JSON.stringify(updatedUser));
                
                // limpa inputs
                setFormData({
                    id: user?.id ?? 0,
                    nome: '',
                    senha: '',
                    foto: null
                });
            } else {
                console.log("erro: ", response);
            }
        } catch (error) {
            console.error(error);
        }   
    }

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

