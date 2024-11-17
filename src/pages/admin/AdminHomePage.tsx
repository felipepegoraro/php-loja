import {useUser} from '../../context/userContext';

const AdminHomePage = () => {
    const {user} = useUser();

    if (!user || !user.admin){
        return (
            <main className="container">
                <h1>ACESSO INVÁLIDO</h1>
            </main>
        );
    }

    return (
        <main className="container">
            <a href="/admin/registerProduct">cadastrar produto</a>
        </main>
    )
}

export default AdminHomePage;
