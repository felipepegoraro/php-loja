import Home from "./pages/Home"
import Login from "./pages/Login"
import Catalogo from "./pages/Catalogo"
import Register from "./pages/Register";

import AdminHomePage from "./pages/admin/AdminHomePage";
import RegisterProductPage from "./pages/admin/registerProductPage";

import { Route, Routes } from "react-router-dom";


const AppRoutes = () => {
    return (
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/Login" element={<Login />} />
                <Route path="/Catalogo" element={<Catalogo />} />
                <Route path="/Register" element={<Register/>}/>
                
                <Route path="/admin/Homepage" element={<AdminHomePage/>}/>
                <Route path="/admin/RegisterProduct" element={<RegisterProductPage/>}/>
            </Routes>

    )
}

export default AppRoutes
