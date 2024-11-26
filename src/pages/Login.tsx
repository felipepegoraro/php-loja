import LoginScreen from '../components/LoginScreen';
import UserFetcher from '../components/userFetcher';
import "../styles/css/login.css"

const Login = () => {
    return (
        <main className="login-container">
            <LoginScreen/>
            <UserFetcher/>
        </main>
    );
}

export default Login;

