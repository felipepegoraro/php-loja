import { useState } from 'react';
import { useUser } from '../context/userContext';
import '../styles/scss/commentform.scss'
import CommentService from '../services/CommentService';

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

    const [message, setMessage] = useState<{success:boolean, msg: string}>({
        success: false,
        msg: ''
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setMessage({success: false, msg: ''});

        const {nota, titulo, comentario } = formData;

        if (!nota || !titulo || !comentario) {
            setMessage({success: false, msg: 'Todos os campos são obrigatórios.'});
            return;
        }

        if (isNaN(parseFloat(nota))){
            setMessage({success: false, msg: 'Nota inválida'});
            return;
        }

        CommentService.addComments(
            user!.id,
            props.idProduto,
            parseFloat(nota),
            titulo,
            comentario,
            setMessage
        );
    };

    return (
        <div className="form-comments">
            <h2>Enviar Comentário</h2>

            {
                message.success 
                ? <p style={{ color: 'green' }}>{message.msg}</p>
                : <p style={{ color: 'red' }}>{message.msg}</p>
            }

            <form onSubmit={handleSubmit} className="comment-form">
                <div className="commmmmmmmmentario">
                    <div>
                        <label>Nota:</label>
                        <input
                            className={'input-field'}
                            type="text"
                            name="nota"
                            value={formData.nota}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div>
                        <label>Título:</label>
                        <input
                            className={'input-field'}
                            type="text"
                            name="titulo"
                            value={formData.titulo}
                            onChange={handleChange}
                            required
                        />
                    </div>
                </div>
                <div>
                    <label>Comentário:</label>
                    <textarea
                        className={'textarea-field'}
                        name="comentario"
                        value={formData.comentario}
                        onChange={handleChange}
                        required
                    />
                </div>
                    <button style={{width: '100px'}} className="btn-submit" type="submit">Enviar</button>
            </form>
        </div>
    );
};

export default CommentForm;

