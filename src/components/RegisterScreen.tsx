import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../styles/css/register-screen.css';
import type {User} from '../types/user';
import UserService from '../services/UserService';

const RegisterScreen = () => {
    const [formData, setFormData] = useState<User>(UserService.genericUser());
    const [confirmarSenha, setConfirmarSenha] = useState('');
    const [errorMessage, setErrorMessage] = useState('');

    const navigate = useNavigate();

    const handleCepChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        let value = e.target.value.replace(/\D/g, "");
        if (value.length > 5) value = value.slice(0, 5) + "-" + value.slice(5, 8);
        e.target.value = value;
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleConfirmarSenhaChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setConfirmarSenha(e.target.value);
    };

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();

        if (formData.senha !== confirmarSenha) {
            setErrorMessage('As senhas não coincidem.');
            return;
        }
        
        if(await UserService.registerUser(formData, setErrorMessage)){
            navigate('/Login');
        }
    };

    return (
        <div className="">
            <form onSubmit={handleRegister} className="form">
                <div className="register-header">
                    <h2 className="register-title">Crie sua conta</h2>
                </div>

                <div className="row">
                    <div className="form-group col-md-6">
                        <label htmlFor="nome">Nome</label>
                        <input
                            type="text"
                            className="form-control"
                            id="nome"
                            name="nome"
                            value={formData.nome}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="form-group col-md-6">
                        <label htmlFor="data_nascimento">Data de Nascimento</label>
                        <input
                            type="date"
                            className="form-control"
                            id="data_nascimento"
                            name="data_nascimento"
                            value={formData.data_nascimento}
                            onChange={handleChange}
                            required
                        />
                    </div>
                </div>

                <div className="form-group">
                    <label htmlFor="email">Email</label>
                    <input
                        type="email"
                        className="form-control"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div className="row">
                    <div className="form-group col-md-6">
                        <label htmlFor="senha">Senha</label>
                        <input
                            type="password"
                            className="form-control"
                            id="senha"
                            name="senha"
                            value={formData.senha}
                            onChange={handleChange}
                            required
                            minLength={6}
                        />
                    </div>
                    <div className="form-group col-md-6">
                        <label htmlFor="confirmarSenha">Confirmar Senha</label>
                        <input
                            type="password"
                            className="form-control"
                            id="confirmarSenha"
                            value={confirmarSenha}
                            onChange={handleConfirmarSenhaChange}
                            required
                            minLength={6}
                        />
                    </div>
                </div>

                <div className="row">
                    <div className="form-group col-md-4">
                        <label htmlFor="cep">CEP</label>
                        <input
                            type="text"
                            className="form-control"
                            id="cep"
                            name="cep"
                            value={formData.cep}
                            onChange={(e) => {
                                handleCepChange(e);
                                handleChange(e);
                            }}
                            required
                            minLength={9}
                            maxLength={9}
                        />
                    </div>
                    <div className="form-group col-md-4">
                        <label htmlFor="rua">Rua</label>
                        <input
                            type="text"
                            className="form-control"
                            id="rua"
                            name="rua"
                            value={formData.rua}
                            onChange={handleChange}
                            minLength={3}
                            maxLength={64}
                            required
                        />
                    </div>
                    <div className="form-group col-md-4">
                        <label htmlFor="numero">Número</label>
                        <input
                            type="text"
                            className="form-control"
                            id="numero"
                            name="numero"
                            value={formData.numero}
                            onChange={handleChange}
                            maxLength={5}
                            required
                        />
                    </div>
                </div>

                <div className="row">
                    <div className="form-group col-md-4">
                        <label htmlFor="bairro">Bairro</label>
                        <input
                            type="text"
                            className="form-control"
                            id="bairro"
                            name="bairro"
                            value={formData.bairro}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="form-group col-md-4">
                        <label htmlFor="cidade">Cidade</label>
                        <input
                            type="text"
                            className="form-control"
                            id="cidade"
                            name="cidade"
                            value={formData.cidade}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="form-group col-md-4">
                        <label htmlFor="estado">Estado</label>
                        <select
                            id="estado"
                            name="estado"
                            className="form-control"
                            value={formData.estado}
                            onChange={handleChange}
                            required
                        >
                            <option value="">Selecione</option>
                            <option value="SP">SP</option>
                            <option value="RJ">RJ</option>
                            <option value="MG">MG</option>
                        </select>
                    </div>
                </div>

                <button type="submit" className="register btn-submit ">Cadastrar</button>

                {errorMessage && <div className="error-message">{errorMessage}</div>}
            </form>
        </div>
    );
};

export default RegisterScreen;
