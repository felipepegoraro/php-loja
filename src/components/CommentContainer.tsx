import axios from 'axios';
import { useEffect, useState } from 'react';
import type {Comentario} from '../types/reply';

interface Props {
    idProduto: number;
}

type CommentExtended = Comentario & {nome_usuario: string}

// modificar para ficar igual é no home
// estrelas no lugar da nota
// nome no lugar do id
// corrigir data
const CommentContainer = (props: Props) => {
    const [comments, setComments] = useState<CommentExtended[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const endpoint = process.env.REACT_APP_ENDPOINT;

    useEffect(() => {
        const fetchComments = async () => {
            try {
                const response = await axios.get(`${endpoint}/get-comments.php?itemId=${props.idProduto}`);
                console.log(response);
                if (response.data.success) {
                    setComments(response.data.value);
                } else {
                    setError(response.data.message || 'Erro ao buscar comentários.');
                }
            } catch (err) {
                setError('Erro ao buscar comentários.');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        if (props.idProduto) fetchComments();
    }, [props.idProduto, endpoint]);

    if (loading) return <p>Carregando comentários...</p>;
    if (error) return <p>{error}</p>;

    return (
        <div className="comment-container">
            <h3>Comentários:</h3>
            {comments.length > 0 ? (
                <ul>
                    {comments.map((comment: CommentExtended) => (
                        <li key={comment.id} className="comment">
                            <strong>{comment.titulo}</strong>
                            <p>{comment.comentario}</p>
                            <small> Por {comment.nome_usuario} ({new Date(comment.data_comentario).toLocaleString()})
                            </small>
                        </li>
                    ))}
                </ul>
            ) : (
                <p>Sem comentários para este item.</p>
            )}
        </div>
    );
};

export default CommentContainer;
