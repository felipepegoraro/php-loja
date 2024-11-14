import LoginScreen from '../components/LoginScreen';
import UserFetcher from '../components/userFetcher';

const Login = () => {
    return (
        <main className="container">
            <LoginScreen/>
            <UserFetcher/>
        </main>
    );
}

export default Login;
