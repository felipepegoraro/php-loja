import AppRoutes from "./Routes"
import Header from './components/Header'
import Footer from './components/Footer'
import { BrowserRouter } from "react-router-dom";
import './styles/css/php-loja.css'


const App = () => {
    return (
        <div className="php-loja">
            <BrowserRouter>
                <Header />
                <AppRoutes/>
                <Footer />
            </BrowserRouter>
        </div>
    );
}

export default App;
