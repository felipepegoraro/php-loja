import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../styles/css/register-screen.css';

const RegisterScreen = () => {
    const [formData, setFormData] = useState({
        nome: '',
        email: '',
        dataNascimento: '',
        telefone: '',
        senha: '',
        cep: '',
        rua: '',
        numero: '',
        bairro: '',
        complemento: '',
        cidade: '',
        estado: '',
        admin: 0
    });

    const endpoint = process.env.REACT_APP_ENDPOINT;

    const [confirmarSenha, setConfirmarSenha] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const navigate = useNavigate();

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

        try {
            const response = await axios.post(`${endpoint}/register.php`, formData, {
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            const result = response.data;
            if (result.success) {
                setErrorMessage('');
                navigate('/Login');
                alert('Cadastro bem-sucedido!');
            } else {
                setErrorMessage(result.error);
            }
        } catch (error) {
            setErrorMessage('Erro na comunicação com o servidor: ' + error);
        }
    };

    return (
        <div className="container">
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
                        <label htmlFor="dataNascimento">Data de Nascimento</label>
                        <input
                            type="date"
                            className="form-control"
                            id="dataNascimento"
                            name="dataNascimento"
                            value={formData.dataNascimento}
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
                            onChange={handleChange}
                            required
                            minLength={8}
                            maxLength={8}
                            pattern="\d{5}-?\d{3}"
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
