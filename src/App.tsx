import AppRoutes from "./Routes"
import Header from './components/Header'
import Footer from './components/Footer'
import { BrowserRouter } from "react-router-dom";
import { UserProvider } from './context/userContext';
import './styles/css/php-loja.css'


const App = () => {
    return (
        <div className="php-loja">
            <BrowserRouter>
                <UserProvider>
                    <Header />
                    <AppRoutes/>
                    <Footer />
                </UserProvider>
            </BrowserRouter>
        </div>
    );
}

export default App;
