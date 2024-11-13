import "../styles/css/header.css"

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
                                    <a className="nav-link" href="/">Catálogo</a>
                                </li>
                                <li className="nav-item">
                                    <a className="nav-link" href="/">Sobre nós</a>
                                </li>
                                <li className="nav-item">
                                    <a className="nav-link" href="/">Suporte</a>
                                </li>
                            </ul>
                            <a href="/Login" className="cta-button ms-5 d-none d-lg-block">Login</a>
                            <a href="/Login" className="cta-button d-lg-none d-block w-100 mt-2">Login</a>
                        </div>
                    </div>
                </nav>
            </header>
        </>
    );
}

export default Header;
