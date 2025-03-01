import { useEffect, useState } from 'react';
import type { User } from '../types/user';
import "../styles/css/user-fetcher.css";

import UserService from '../services/UserService';

const UserFetcher = () => {
    const [users, setUsers] = useState<User[]>([]);
    const [error, setError] = useState<string>('');

    useEffect(() => {
        const params = { accessCode: ''}; /*codigo_secreto_administrador*/

        UserService.getUsers(params, setUsers, setError)
            .catch(err => console.error(err));;
    }, [])

    return (
        <div className="userFetcher-container">
            <h1>Dados dos Usuários</h1>

            {error.length > 0 && <p>{error}</p>}

            <ul>
                {users.map(user => (
                    <li key={user.id}>
                        {user.nome} - {user.email}
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default UserFetcher;
