import LoginScreen from './LoginScreen';
import UserFetcher from './userFetcher';

const Main = () => {
    return (
        <main className="container">
            <LoginScreen/>
            <UserFetcher/>
        </main>
    );
}

export default Main;
