import axios from 'axios';
import { useState } from 'react';
import { useUser } from '../context/userContext';

interface CommentFormProps {
    idProduto: number;
}

const CommentForm = (props: CommentFormProps) => {
    const {user} = useUser();

    const [formData, setFormData] = useState({
        nota: '',
        titulo: '',
        comentario: ''
    });

    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setSuccess(null);

        const {nota, titulo, comentario } = formData;
        if (!nota || !titulo || !comentario) {
            setError('Todos os campos são obrigatórios.');
            return;
        }

        try {
            const response = await axios.post('https://php-loja.com/php-loja-back/add-comments.php', {
                idUsuario: user!.id,
                idProduto: props.idProduto,
                nota: parseFloat(nota),
                titulo,
                comentario
            });
            
            // console.log("==> ", response.data);

            if (response.data.success) {
                setSuccess('Comentário enviado com sucesso!');
                setFormData({ nota: '', titulo: '', comentario: '' });
            } else {
                setError(response.data.message || 'Erro ao enviar comentário.');
            }
        } catch (err) {
            setError('Erro ao conectar com o servidor.');
        }
    };

    return (
        <div>
            <h2>Enviar Comentário</h2>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            {success && <p style={{ color: 'green' }}>{success}</p>}
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Nota:</label>
                    <input
                        type="number"
                        step="0.1"
                        name="nota"
                        value={formData.nota}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div>
                    <label>Título:</label>
                    <input
                        type="text"
                        name="titulo"
                        value={formData.titulo}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div>
                    <label>Comentário:</label>
                    <textarea
                        name="comentario"
                        value={formData.comentario}
                        onChange={handleChange}
                        required
                    />
                </div>
                <button type="submit">Enviar</button>
            </form>
        </div>
    );
};

export default CommentForm;
