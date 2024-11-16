import "../styles/css/register.css";
import RegisterScreen from "../components/RegisterScreen";

const Register = () => {
    return (
        <main className="container d-flex justify-content-center align-items-center register-container">
            <div className="register-header">
                <h1 className="register-title">Cadastro</h1>
            </div>
            <RegisterScreen />
        </main>
    );
}

export default Register;
