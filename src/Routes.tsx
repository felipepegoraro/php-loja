import Home from "./pages/Home"
import Login from "./pages/Login"
import Catalogo from "./pages/Catalogo";
import Register from "./pages/Register";
import Carrinho from "./pages/Carrinho";
import About from "./pages/About";
// import Suporte from "./pages/Suporte";
import Account from './pages/Account'; 
import Settings from './pages/Settings';
import DetalhesItem from "./pages/DetalhesItem";
import AtivarEmail from "./pages/AtivarEmail";

import NotFound from "./pages/NotFound";

import AdminHomePage from "./pages/admin/AdminHomePage";
import RegisterProductPage from "./pages/admin/registerProductPage";
import OrderHistory from "./pages/admin/orderHistory";

import { Route, Routes } from "react-router-dom";

const allRoutes: Array<{ path: string, element: React.ReactNode }> = [
    { path: "/",                       element: <Home /> },
    { path: "/Login",                  element: <Login /> },
    { path: "/Catalogo",               element: <Catalogo /> },
    { path: "/Register",               element: <Register /> },
    { path: "/Carrinho",               element: <Carrinho /> },
    { path: "/item/:itemId",           element: <DetalhesItem /> },
    { path: "/About",                  element: <About /> },
    { path: "/Settings",               element: <Settings /> },
    { path: "/Account",                element: <Account /> },
    { path: "/AtivarEmail",            element: <AtivarEmail /> },
    { path: "/admin/Homepage",         element: <AdminHomePage /> },
    { path: "/admin/RegisterProduct",  element: <RegisterProductPage /> },
    { path: "/admin/OrderHistory",     element: <OrderHistory /> },
    { path: "*",                       element: <NotFound /> },
];

const AppRoutes = () => {
    return (
        <Routes>
            {allRoutes.map((route, index) => (
                <Route key={index} path={route.path} element={route.element} />
            ))}
        </Routes>
    );
};

export default AppRoutes
