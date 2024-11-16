import React, { useState } from 'react';
import { useNavigate } from "react-router-dom";
import axios from 'axios';

import '../styles/css/register-screen.css'


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

    const [confirmarSenha, setConfirmarSenha] = useState<string>('');
    const [errorMessage, setErrorMessage] = useState<string>('');
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
            const response = await axios.post('http://localhost/php-loja-back/register.php', formData, {
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            const result = response.data;
            if (result.success) {
                setErrorMessage('');
                navigate("/Login");
                alert('Cadastro bem-sucedido!');
            } else {
                setErrorMessage(result.error);
            }
        } catch (error) {
            setErrorMessage('Erro na comunicação com o servidor: ' + error);
        }
    };

    return (

        <form onSubmit={handleRegister} className="form bg-light p-4 rounded shadow w-75">
            {/* Informações do Perfil */}
            <h3 className="form-section-title">Informações do Perfil</h3>
            <div className="row">
                <div className="form-group col-md-5">
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
                <div className="form-group col-md-3 " style={{ minWidth: '200px' }}>
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

            {/* Email e Senha */}
            <h3 className="form-section-title">Email e Senha</h3>
            <div className="row">
                <div className="form-group col-md-8">
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
            </div>

            <div className="row">
                <div className="form-group col-md-4" style={{ minWidth: '200px' }}>
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
                <div className="form-group col-md-4" style={{ minWidth: '200px' }}>
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

            {/* Endereço */}
            <h3 className="form-section-title">Endereço</h3>
            <div className="row">
                <div className="form-group col-md-2" style={{ maxWidth: '120px', minWidth: '120px' }}>
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
                <div className="form-group col-md-5" style={{ maxWidth: '370px', minWidth: '200px' }}>
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
                <div className="form-group col-md-2" style={{ maxWidth: '120px', minWidth: '120px' }}>
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
                <div className="form-group col-md-4" style={{ maxWidth: '245px' }}>
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
                <div className="form-group col-md-4" style={{ maxWidth: '245px' }}>
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
                <div className="form-group col-md-2" style={{ maxWidth: '120px', minWidth: '120px' }}>
                    <label htmlFor="estado">Estado</label>
                    <select
                        style={{ fontSize: '14px' }}
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
                <button
                    type="submit"
                    className="btn btn-primary mt-5"
                >
                    Cadastrar
                </button>
            </div>

            {errorMessage && <p style={{ color: 'red', marginTop: '10px' }}>{errorMessage}</p>}
        </form>

    );
};

export default RegisterScreen;
