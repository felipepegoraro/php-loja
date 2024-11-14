import Home from "./pages/Home"
import Login from "./pages/Login"
import Catalogo from "./pages/Catalogo"
import { Route, Routes } from "react-router-dom";


const AppRoutes = () => {
    return (
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/Login" element={<Login />} />
                <Route path="/Catalogo" element={<Catalogo />} />
            </Routes>

    )
}

export default AppRoutes
