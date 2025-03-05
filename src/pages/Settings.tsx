import axios from 'axios';
import { useUser } from '../context/userContext';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';

const Settings = () => {
    const endpoint = process.env.REACT_APP_ENDPOINT;
    const { user, setUser } = useUser();
    const navigate = useNavigate();
    const [userLoaded, setUserLoaded] = useState(false);

    useEffect(() => {
        if (user) setUserLoaded(true);
    }, [user]);

    if (!userLoaded) return <></>;

    const handleDeleteAccount = async () => {
        const confirmation = window.confirm("Tem certeza de que deseja deletar sua conta?");
        if (!confirmation) return;

        try {
            const res = await axios.post(`${endpoint}/user-delete.php`, {
                idUsuario: user!.id
            }, { 
                headers: { 'Content-Type': 'application/json' },
                withCredentials: true
            });

            console.log(res);

            if (res.data.success) {
                setUser(null);
                alert('Sua conta foi deletada com sucesso!');
                navigate('/Login');
            } else {
                alert('Houve um erro ao deletar a conta.');
            }
            
        } catch (e) {
            console.log(e);
            alert('Ocorreu um erro ao tentar deletar a conta.');
        }
    }

    return (
        <main className="container">
            <button 
                className="btn btn-danger" 
                onClick={handleDeleteAccount}
            >
                Deletar sua conta
            </button>
        </main>
    );
}

export default Settings;

