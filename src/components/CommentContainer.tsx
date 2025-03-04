import Utils from '../types/Utils';
import type {CommentExtended} from '../types/reply';
import CommentService from '../services/CommentService';
import '../styles/css/commentcontainer.css'

interface CommentItemProps {
    comment: CommentExtended;
    userId: number | undefined;
}

const CommentStars = ({ nota }: { nota: number }) => {
    return (
        <div className="comment-stars">
            {[...Array(5)].map((_, index) => (
                <span key={index} className={`fa fa-star ${index < nota ? "checked" : ""}`}></span>
            ))}
        </div>
    );
};

const CommentItem = ({ comment, userId }: CommentItemProps) => {
    return (
        <div className="comment-wrapper">
            <li className="comment">
                <div className="comment-title-container">
                    <p className="comment-title">{comment.titulo}</p>

                    <div className="comment-title-leftside">
                        <CommentStars nota={comment.nota} />

                        {userId === comment.idUsuario ? (
                            <button 
                                className="btn btn-danger fa fa-trash"
                                onClick={async () => {
                                    if (await CommentService.deleteComment(comment.id))
                                        alert("Comentário apagado com sucesso!");
                                }}
                            ></button>
                        ) : (
                            <button className="btn btn-danger fa fa-trash" disabled></button>
                        )}

                        <button className="btn btn-primary fa fa-pencil" disabled></button>
                    </div>
                </div>

                <p className="comment-body">{comment.comentario}</p>
                <p className="comment-footer">
                    Por {comment.idUsuario === userId ? "Você " : comment.nome_usuario + " "} 
                    ({Utils.convertData(comment.data_comentario)})
                </p>
            </li>
        </div>
    );
};

interface CommentProps {
    index: number;
    comments: CommentExtended[];
    userId: number | undefined;
}

const CommentContainer = ({ index, comments, userId }: CommentProps) => {
    const FONT_URL = "https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css";
    if (userId === undefined) return <></>;

    return (
        <div className="comment-container">
            <link rel="stylesheet" href={FONT_URL} />

            <div className="comment-header-title">
                <h3>Comentários:</h3>
            </div>

            <div className="comment-all-comments">
                {comments.length > 0 ? (
                    <ul>
                        {comments.slice(0, index).map((comment) => (
                            <CommentItem key={comment.id} comment={comment} userId={userId} />
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
