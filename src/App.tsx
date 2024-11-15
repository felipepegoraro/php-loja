import AppRoutes from "./Routes"
import Header from './components/Header'
import Footer from './components/Footer'
import { BrowserRouter } from "react-router-dom";
import { UserProvider } from './context/userContext';
import './styles/css/php-loja.css'


const App = () => {
    return (
        <div className="php-loja">
            <UserProvider>
                <BrowserRouter>
                    <Header />
                    <AppRoutes/>
                    <Footer />
                </BrowserRouter>
            </UserProvider>
        </div>
    );
}

export default App;
