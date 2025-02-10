import axios from 'axios';
import { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

const AtivarEmail = () => {
    const [status, setStatus] = useState({ ativado: false, msg: "Verificando token..." });
    const location = useLocation();

    useEffect(() => {
        const queryParams = new URLSearchParams(location.search);
        const token = queryParams.get('token');

        if (!token) {
            setStatus({ ativado: false, msg: "Token não fornecido na URL." });
            return;
        }

        const endpoint = process.env.REACT_APP_ENDPOINT;

        axios.get(`${endpoint}/confirmar-email.php?token=${token}`)
            .then(response => {
                setStatus({ 
                    ativado: response.data.success,
                    msg: response.data.message 
                });
            })
            .catch(error => {
                setStatus({ ativado: false, msg: "Erro ao conectar ao servidor." });
                console.error("Erro ao ativar a conta:", error);
            });
    }, [location]);

    return (
        <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-gray-100">
            <div className="text-center">
                <h2 className="text-xl font-semibold mb-4">{status.ativado ? "Sucesso!" : "Ops!"}</h2>
                <p className="text-gray-700 mb-4">{status.msg}</p>
                {status.ativado ? (
                    <Link to="/login" className="text-blue-500 px-4 py-2 rounded-md hover:bg-blue-600 transition">
                        Ir para Login
                    </Link>
                ) : (
                    <Link to="/" className="text-blue-500 hover:underline">
                        Voltar para Home
                    </Link>
                )}
            </div>
        </div>
    );
};

export default AtivarEmail;

