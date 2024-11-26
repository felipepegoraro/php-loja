import "../styles/css/footer.css"

const Footer = () => {
    return (
            <>
                <footer className="footer text-white">
                    <div className="container">
                        <div className="row  text-md-left">
                            {/* Logo e sobre */}
                            <div className="col-md-4 mb-3 mb-md-0">
                                {/*<img src="/logo.png" alt="Logo do Projeto" className="footer-logo mb-2" />*/}
                                <p className="footer-description">
                                    Loja-php, uma loja feita para controlar seu négocio facilmente.
                                </p>
                            </div>

                            {/* Links úteis */}
                            <div className="col-md-4 mb-3 mb-md-0">
                                <h5 className="footer-heading">Links Úteis</h5>
                                <ul className="list-unstyled text-center">
                                    <li><a href="/" className="text-white">Home</a></li>
                                    <li><a href="/Funcionalidades" className="text-white">Catálogo</a></li>
                                    <li><a href="#about" className="text-white">Sobre nós</a></li>
                                </ul>
                            </div>

                            {/* Política de privacidade e termos */}
                            <div className="col-md-4">
                                <h5 className="footer-heading">Legal</h5>
                                <ul className="list-unstyled text-center">
                                    <li><a href="#privacy" className="text-white">Política de Privacidade</a></li>
                                    <li><a href="#terms" className="text-white">Termos de Uso</a></li>
                                </ul>
                            </div>
                        </div>

                        {/* Direitos reservados */}
                        <div className="row mt-3">
                            <div className="col text-center">
                                <p className="mb-0">© {new Date().getFullYear()} Loja-php. Todos os direitos reservados.</p>
                            </div>
                        </div>
                    </div>
                </footer>
            </>
    );
}

export default Footer;
