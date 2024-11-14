import Home from "./pages/Home"
import Login from "./pages/Login"
import Register from "./pages/Register";
import { Route, Routes } from "react-router-dom";


const AppRoutes = () => {
    return (
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/Login" element={<Login />} />
                <Route path="/Register" element={<Register/>}/>
            </Routes>

    )
}

export default AppRoutes