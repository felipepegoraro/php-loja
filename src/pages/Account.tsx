import AccountForm from '../components/AccountForm';
import UserProfileDisplay from '../components/UserProfileDisplay';
import '../styles/css/account.css';

const Account = () => {
    return (
        <main className="container account-container">
            <h1>Minha Conta</h1>

            <div className="account-session">
                <UserProfileDisplay/>
                <AccountForm/>
            </div>

            {/*
            <div className="account-session">
                <div>lorem ipsum 1</div>
            </div>
            */}
        </main>
    );
}

export default Account;
