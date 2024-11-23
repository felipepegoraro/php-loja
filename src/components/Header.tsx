import "../styles/css/header.css";
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from "react";
import { useUser } from '../context/userContext';

import axios from 'axios';

const LoginButton = () => {
  const { user, setUser } = useUser();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const navigate = useNavigate();

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  useEffect(() => {
    setIsDropdownOpen(false)
  }, [user])

  const handleLogOff = async () => {
    try {
      setUser(null);
      localStorage.removeItem('user'); 
      await axios.get('http://localhost/php-loja-back/logout.php', { withCredentials: true });
      navigate('/Login');
    } catch (error) {
      console.error("Erro ao fazer logout:", error);
    }
  };

  if (user) {
    return (
      <div className="profile-container ms-4">
         <a href="/Carrinho" className="cart-btn ms-3">
            <img
              src="/assets/carrinho-de-compras.png" // Imagem do ícone do carrinho
              alt="Carrinho"
              className="cart-icon"
            />
          </a>
        <span className="profile-name" onClick={toggleDropdown}>{user?.nome}</span>
        <div className={`dropdown-menu ${isDropdownOpen ? 'open' : ''}`}>
          <ul>
            <li>Minha Conta</li>
            <li>Configurações</li>
            <li onClick={handleLogOff}>Sair</li>
          </ul>
        </div>
        <div className="profile-button" onClick={toggleDropdown}>
          <img
            src={'https://via.placeholder.com/50'}
            alt="User"
            className="profile-image"
          />
        </div>
      </div>
    );
  }

  return (
    <>
      <a href="/Login" className="cta-button ms-4 d-none d-lg-block">
        Login
      </a>
      <a href="/Login" className="cta-button d-lg-none d-block w-100 mt-2">Login</a>
    </>
  );
};

const Header = () => {

  return (
    <header>
      <nav className="navbar navbar-expand-lg navbar-dark navbar-dark fixed-top">
        <div className="container">
          <a className="navbar-brand" href="/">Loja-PHP</a>
          <div className="collapse navbar-collapse" id="navbarNav">
            <ul className="navbar-nav ms-auto mb-2 mb-lg-0">
              <li className="nav-item">
                <a className="nav-link" href="/Catalogo">Catálogo</a>
              </li>
              <li className="nav-item">
                <a className="nav-link" href="/">Sobre nós</a>
              </li>
              <li className="nav-item">
                <a className="nav-link" href="/">Suporte</a>
              </li>
            </ul>
            <div className="navbar-btn-container"> {/* Envolvendo o LoginButton */}
              <LoginButton />
            </div>
          </div>

          <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav"
            aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
            <span className="navbar-toggler-icon"></span>
          </button>
        </div>
      </nav>
    </header>
  );
}

export default Header;
