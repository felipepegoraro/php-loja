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
            <ul>
                <li><a href="/admin/registerProduct">cadastrar produto</a></li>
                <li><a href="/admin/orderHistory">historico de compras</a></li>
            </ul>
        </main>
    )
}

export default AdminHomePage;
