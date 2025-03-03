import React, { useState } from 'react';
import UserService from '../services/UserService';
import { useUser } from '../context/userContext';
import {SimplUser} from '../types/user';
import '../styles/css/accountform.css';

type FormDataState = Omit<SimplUser, 'id' | 'admin'> & { senha: string };

const AccountForm: React.FC = () => {
    const { user, setUser } = useUser();

    const [formData, setFormData] = useState<FormDataState>({
        email: user?.email ?? '',
        nome: user?.nome || '',
        senha: '',
        foto: null,
    });

    const inputClean = () => {
        setFormData({
            email: user?.email ?? '',
            nome: '',
            senha: '',
            foto: null
        });
    }

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
        formDataToSend.append('email', String(formData.email));
        if (formData.nome) formDataToSend.append('nome', formData.nome);
        if (formData.senha) formDataToSend.append('senha', formData.senha);
        if (formData.foto) formDataToSend.append('foto', formData.foto);

        const updatedUser = await UserService.updateUser(formDataToSend);

        if (updatedUser != null){
            setUser(updatedUser);
            localStorage.setItem('user', JSON.stringify(updatedUser));
        }
            
        inputClean();
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

