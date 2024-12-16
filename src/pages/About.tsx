import axios from 'axios';

const About = () => {
    return (
        <main className="container">  
            <h1>Sobre</h1>

            <h4>Autores</h4>
            <ul>
                <li><a href="https://github.com/felipepegoraro">Felipe S. Pegoraro</a></li>
                <li><a href="https://github.com/thiagosiena">Thiago Siena</a></li>
            </ul>

            <h4>Descrição</h4>
            <p>Um projeto realizado em dupla para a prova final de desenvolvimento web.</p>
        </main>
    );
};

export default About;
