import Home from "./pages/Home"
import Login from "./pages/Login"
import Catalogo from "./pages/Catalogo";
import Register from "./pages/Register";
import Carrinho from "./pages/Carrinho";
import About from "./pages/About";
import Suporte from "./pages/Suporte";
import Account from './pages/Account'; 
import Settings from './pages/Settings';
import DetalhesItem from "./pages/DetalhesItem";

import NotFound from "./pages/NotFound";

import AdminHomePage from "./pages/admin/AdminHomePage";
import RegisterProductPage from "./pages/admin/registerProductPage";
import OrderHistory from "./pages/admin/orderHistory";

import { Route, Routes } from "react-router-dom";


const AppRoutes = () => {
    return (
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/Login" element={<Login />} />
                <Route path="/Catalogo" element={<Catalogo />} />
                <Route path="/Register" element={<Register/>}/>
                <Route path="/Carrinho" element={<Carrinho/>}/>

                <Route path="/item/:itemId" element={<DetalhesItem />} />

                <Route path="/About" element={<About/>}/>
                <Route path="/Suporte" element={<Suporte/>}/>

                <Route path="/Settings" element={<Settings/>}/>
                <Route path="/Account" element={<Account/>}/>
                
                <Route path="/admin/Homepage" element={<AdminHomePage/>}/>
                <Route path="/admin/RegisterProduct" element={<RegisterProductPage/>}/>
                <Route path="/admin/OrderHistory" element={<OrderHistory/>}/>

                <Route path="*" element={<NotFound />} />
            </Routes>

    )
}

export default AppRoutes
