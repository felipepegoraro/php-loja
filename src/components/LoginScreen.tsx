import { useState } from 'react';
import axios from 'axios';

const LoginScreen = () => {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const loginData = {
      email,
      senha,
    };

    try {
      const response = await axios.post('http://localhost/login.php', loginData, {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const result = response.data; // {success: true, error: string}
      if (result.success) {
        setErrorMessage('');
        // TODO: SAIR DESSA PAGINA!
        alert('Login bem-sucedido!');
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
    </div>
  );
};

export default LoginScreen;

