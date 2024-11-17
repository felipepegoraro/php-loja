import { useEffect, useState } from 'react';
import axios from 'axios';
import type {User} from '../types/user'
import "../styles/css/user-fetcher.css"

const UserFetcher = () => {
    const [users, setUsers] = useState<User[]>([]);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        axios.get(`http://localhost/php-loja-back/user-fetch.php?tabela=tb_usuario`)
            .then(response => {
                if (response.data.error) {
                    setError(response.data.error);
                } else {
                    setUsers(response.data);
                }
            })
            .catch(err => {
                setError('Erro ao buscar os dados.');
                console.error(err);
            });
    }, []);

    return (
        <div className="userFetcher-container">
            <h1>Dados dos Usuários</h1>

            {error && <p>{error}</p>}

            <ul>
                {users.map(user => (
                    <li key={user.id}>{user.email}</li>
                ))}
            </ul>
        </div>
    );
}

export default UserFetcher;
