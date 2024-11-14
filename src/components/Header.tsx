import "../styles/css/header.css"
import {useNavigate} from 'react-router-dom';
import { useUser } from '../context/userContext';

const LoginButton = () => {
  const { user, isLoggedIn, setUser } = useUser();
  const navigate = useNavigate();

  const handleLogOff = () => {
    setUser(null);
    navigate('/Login');
  };

  if (isLoggedIn) {
    return (
      <>
        <button className="cta-button mt-2 ms-5 d-none d-lg-block">
          {`Profile: ${user?.nome}`}
        </button>
        <button
          className="cta-button mt-2 ms-5 d-none d-lg-block"
          onClick={handleLogOff}
        >
          Sair
        </button>
      </>
    );
  }

  return (
    <a href="/Login" className="cta-button mt-2 ms-5 d-none d-lg-block">
      Login
    </a>
  );
};


const Header = () => {

    return (
        <>
            <header>
                <nav className="navbar navbar-expand-lg navbar-dark navbar-dark fixed-top">
                    <div className="container">
                        <a className="navbar-brand" href="/">Loja-PHP</a>
                        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav"
                            aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
                            <span className="navbar-toggler-icon"></span>
                        </button>
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
                        </div>
                        <LoginButton/>
                    </div>
                </nav>
            </header>
        </>
    );
}

export default Header;
