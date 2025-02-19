import axios from 'axios';
import { useEffect, useState } from 'react';
import type {Comentario} from '../types/reply';
import '../styles/css/commentcontainer.css'

interface Props {
    idProduto: number;
}

type CommentExtended = Comentario & {nome_usuario: string}

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
            <div className="comment-header-title">
                <h3>Comentários:</h3>
            </div>

            <div className="comment-all-comments">
                {comments.length > 0 ? (
                    <ul>
                      {comments.map((comment) => (
                        <div key={comment.id} className="comment-wrapper">
                          <li className="comment">
                            <p className="comment-title">{comment.titulo}</p>
                            <p className="comment-body">{comment.comentario}</p>
                            <p className="comment-footer">Por {comment.nome_usuario} ({new Date(comment.data_comentario).toLocaleString()})</p>
                          </li>
                          {comments.length > 1 ? <div className="comment-divisor"></div> : null}
                        </div>
                      ))}
                    </ul>
                ) : (
                    <p>Sem comentários para este item.</p>
                )}
            </div>
        </div>
    );
};

export default CommentContainer;
