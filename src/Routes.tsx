import Home from "./pages/Home"
import Login from "./pages/Login"
import { Route, Routes } from "react-router-dom";


const AppRoutes = () => {
    return (
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/Login" element={<Login />} />
            </Routes>

    )
}

export default AppRoutes