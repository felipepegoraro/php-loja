import axios from 'axios';
import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const AtivarEmail = () => {
    const location = useLocation();

    useEffect(() => {
        const queryParams = new URLSearchParams(location.search);
        const token = queryParams.get('token');

        if (!token) {
            console.error('Token não fornecido na URL');
            return;
        }

        const endpoint = process.env.REACT_APP_ENDPOINT;

        axios.get(`${endpoint}/confirmar-email.php?token=${token}`)
            .then(response => {
                console.log(response.data);
            })
            .catch(error => {
                console.error('Erro ao ativar a conta:', error);
            });
    }, [location]);

    return (
        <div>
            <p>Ativando conta...</p>
        </div>
    );
}

export default AtivarEmail;
