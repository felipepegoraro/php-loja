import axios from 'axios';
import { useState } from 'react';
import { Link, useNavigate } from "react-router-dom";

import Modal from './Modal';
import { useUser } from '../context/userContext';

import "../styles/css/login-screen.css"
import ResetPassword from './ResetPassword';

const LoginScreen = () => {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const { setUser } = useUser();
  const nav = useNavigate();

  const endpoint = process.env.REACT_APP_ENDPOINT;

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const loginData = {
      email,
      senha,
    };

    try {
      const response = await axios.post(`${endpoint}/login.php`, loginData, {
        headers: {
          'Content-Type': 'application/json',
        },
        withCredentials: true
      });

      const result = response.data;

      if (result.success) {
        setErrorMessage('');
        setUser({
          id: result.data.id,
          nome: result.data.nome,
          email: result.data.email,
          admin: result.data.admin,
          foto: result.data.foto,
          senha: loginData.senha
        });
        nav(result.data?.admin ? "/admin/Homepage" : "/Catalogo");
      } else {
        setErrorMessage(`erro: ${result.message}`);
      }
    } catch (error) {
      setErrorMessage('Erro na comunicação com o servidor.');
    }
  };

  const openForgotPasswordModal = () => setShowForgotPassword(true);
  const closeForgotPasswordModal = () => setShowForgotPassword(false);

  return (
    <div className="login-box">
      <h2>Faça login</h2>
      <form onSubmit={handleLogin}>
        <div className="input-group">
          <label>Email</label>
          <input
            type="text"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="input-field"
          />
        </div>
        <div className="input-group">
          <label>Senha</label>
          <input
            type="password"
            value={senha}
            onChange={(e) => setSenha(e.target.value)}
            required
            className="input-field"
          />
        </div>
        <button type="submit" className="btn-submit">Entrar</button>
      </form>
      {errorMessage && <p className="error-message">{errorMessage}</p>}

      <Link to="/Register" className="btn-register">
        Não tem uma conta? Cadastre-se
      </Link>

      <button onClick={openForgotPasswordModal} className="btn-register" style={{
          border: '0px',
          background: 'transparent'
      }}>
            Esqueci minha senha
      </button>

      <Modal
        show={showForgotPassword}
        onHide={closeForgotPasswordModal}
        title="Recuperar senha"
        body={
            <>
                <ResetPassword/>
                <div className="text-center mt-4">
                    <button className="btn btn-secondary" onClick={closeForgotPasswordModal}>Voltar ao login</button>
                </div>
            </>
        }/>
    </div>
  );
};

export default LoginScreen;

