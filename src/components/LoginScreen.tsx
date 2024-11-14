import { useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from "react-router-dom";
import { useUser } from '../context/userContext';


const LoginScreen = () => {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const {setUser}  = useUser();
  const nav = useNavigate();

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const loginData = {
      email,
      senha,
    };

    try {
      const response = await axios.post('http://localhost/php-loja-back/login.php', loginData, {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const result = response.data; // {success: true, user: User, error: string}

      if (result.success) {
        setErrorMessage('');

        console.log(result.user);
        
        setUser({
          nome: result.user.nome,
          email: result.user.email,
          admin: result.user.admin,
        });

        nav(result.user?.admin ? "/AdminHomePage" : "/Catalogo");
      } else {
        setErrorMessage(result.error || 'Erro ao fazer login');
      }
    } catch (error) {
      setErrorMessage('Erro na comunicação com o servidor.');
    }
  };

  return (
    <div>
      <h2>Faça login</h2>
      <form onSubmit={handleLogin}>
        <div>
          <label>Email</label>
          <input
            type="text"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Senha</label>
          <input
            type="password"
            value={senha}
            onChange={(e) => setSenha(e.target.value)}
            required
          />
        </div>
        <button type="submit">Entrar</button>
      </form>
      {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
      
      <Link to="/Register" className="btn-register">
        Não tem uma conta? Cadastre-se
      </Link>
    </div>
  );
};

export default LoginScreen;

