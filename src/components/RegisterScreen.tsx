import React, { useState } from 'react';
import { useNavigate } from "react-router-dom";
import axios from 'axios';

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

    const [errorMessage, setErrorMessage] = useState<string>('');
    const navigate = useNavigate();

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();
        
        try {
            const response = await axios.post('http://localhost/php-loja-back/register.php', formData, {
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            console.log(response);
        
            const result = response.data; // {success: true, error: string}
            if (result.success) {
                setErrorMessage('');          
                navigate("/Login")
                alert('Cadastro bem-sucedido!');
            } else {
                console.log("texto" +  result.error)
                setErrorMessage(result.error);
            }
        } catch (error) {
            setErrorMessage('Erro na comunicação com o servidor: ' + error);
        }
    };

    return (
        <div>
            <form onSubmit={handleRegister}>
                {/* Campos do formulário */}
                <div className="form-group">
                    <label htmlFor="nome">Nome</label>
                    <input
                        type="text"
                        className="form-control"
                        id="nome"
                        name="nome"
                        value={formData?.nome}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="email">Email</label>
                    <input
                        type="email"
                        className="form-control"
                        id="email"
                        name="email"
                        value={formData?.email}
                        onChange={handleChange}
                        required
                    />
                </div>
                
                <div className="form-group">
                    <label htmlFor="dataNascimento">Data de Nascimento</label>
                    <input
                        type="date"
                        className="form-control"
                        id="dataNascimento"
                        name="dataNascimento"
                        value={formData?.dataNascimento}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="telefone">Telefone</label>
                    <input
                        type="tel"
                        className="form-control"
                        id="telefone"
                        name="telefone"
                        value={formData?.telefone}
                        onChange={handleChange}
                        required
                        minLength={10}
                        maxLength={11}
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="senha">Senha</label>
                    <input
                        type="password"
                        className="form-control"
                        id="senha"
                        name="senha"
                        value={formData?.senha}
                        onChange={handleChange}
                        required
                        minLength={6}
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="cep">CEP</label>
                    <input
                        type="text"
                        className="form-control"
                        id="cep"
                        name="cep"
                        value={formData?.cep}
                        onChange={handleChange}
                        required
                        minLength={8}
                        maxLength={8}
                        pattern="\d{5}-?\d{3}"
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="rua">Rua</label>
                    <input
                        type="text"
                        className="form-control"
                        id="rua"
                        name="rua"
                        value={formData?.rua}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="numero">Número</label>
                    <input
                        type="text"
                        className="form-control"
                        id="numero"
                        name="numero"
                        value={formData?.numero}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="bairro">Bairro</label>
                    <input
                        type="text"
                        className="form-control"
                        id="bairro"
                        name="bairro"
                        value={formData?.bairro}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="complemento">Complemento</label>
                    <input
                        type="text"
                        className="form-control"
                        id="complemento"
                        name="complemento"
                        value={formData?.complemento}
                        onChange={handleChange}
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="cidade">Cidade</label>
                    <input
                        type="text"
                        className="form-control"
                        id="cidade"
                        name="cidade"
                        value={formData?.cidade}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="estado">Estado</label>
                    <select
                        id="estado"
                        name="estado"
                        className="form-control"
                        value={formData?.estado}
                        onChange={handleChange}
                        required
                    >
                        <option value="">Selecione</option>
                        <option value="SP">SP</option>
                        <option value="RJ">RJ</option>
                        <option value="MG">MG</option>
                    </select>
                </div>
                <button type="submit" className="btn btn-primary btn-block mt-4">
                    Cadastrar
                </button>
            </form>
            {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
        </div>
    );
};

export default RegisterScreen;

