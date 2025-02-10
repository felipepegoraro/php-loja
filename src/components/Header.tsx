import "../styles/css/header.css";
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from "react";
import { useUser } from '../context/userContext';

import axios from 'axios';

const LoginButton = () => {
    const { user, setUser } = useUser();
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const navigate = useNavigate();

    const endpoint = process.env.REACT_APP_ENDPOINT;

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
            await axios.get(`${endpoint}/logout.php`, { withCredentials: true });
            navigate('/Login');
        } catch (error) {
            console.error("Erro ao fazer logout:", error);
        }
    };

  if (user) {
  console.log(user.foto)
    return (
      <div className="profile-container ms-3">
         <a href="/Carrinho" className="cart-btn" title="Ir ao carrinho">
            <img
              src="/assets/carrinho-de-compras.png"
              alt="Carrinho"
              className="cart-icon"
            />
          </a>
        <span className="profile-name ms-4" onClick={toggleDropdown}>{user?.nome}</span>
        <div className={`dropdown-menu ${isDropdownOpen ? 'open' : ''}`}>
          <ul>
            <li onClick={() => navigate('/Account')}>Minha Conta</li>
            <li onClick={() => navigate('/Settings')}>Configurações</li>
            <li onClick={handleLogOff}>Sair</li>
          </ul>
        </div>
        <div className="profile-button" onClick={toggleDropdown}>
          <img
            src={`data:image/png;base64,${user.foto}` ?? 'https://via.placeholder.com/50'}
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
  const { user } = useUser();
  if (user && user.admin){}

  return (
    <header>
      <nav className="navbar navbar-expand-lg navbar-dark navbar-dark fixed-top">
        <div className="container">
          <a className="navbar-brand" href="/">Loja-PHP</a>
          <div className="collapse navbar-collapse" id="navbarNav">
            <ul className="navbar-nav ms-auto mb-2 mb-lg-0">
              { user && user.admin ?( 
                <li className="nav-item">
                  <a className="nav-link" href="/admin/Homepage">Admin</a> {/*trocar de nome*/}
                </li> ) : null
              }
               
              <li className="nav-item">
                <a className="nav-link" href="/Catalogo">Catálogo</a>
              </li>
              <li className="nav-item">
                <a className="nav-link" href="/About">Sobre nós</a>
              </li>
              <li className="nav-item">
                <a className="nav-link" href="/Suporte">Suporte</a>
              </li>
            </ul>
            <div className="navbar-btn-container">
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
