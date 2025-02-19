import axios from 'axios';
import { useEffect, useState } from 'react';
import type {CommentExtended} from '../types/reply';
import '../styles/css/commentcontainer.css'

interface Props {
    comments: CommentExtended[];
}

// corrigir data

const CommentContainer = (props: Props) => {
    const endpoint = process.env.REACT_APP_ENDPOINT;

    return (
        <div className="comment-container">
            <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css"/>

            <div className="comment-header-title">
                <h3>Comentários:</h3>
            </div>

            <div className="comment-all-comments">
                {props.comments.length > 0 ? (
                    <ul>
                      {props.comments.map((comment) => (
                        <div key={comment.id} className="comment-wrapper">
                          <li className="comment">
                            <div className="comment-title-container">
                                <p className="comment-title">{comment.titulo}</p>

                                <div className="comment-stars">
                                    {[...Array(5)].map((_, index) => (
                                        <span key={index} 
                                            className={`fa fa-star ${index < comment.nota ? "checked" : ""}`}>
                                        </span>
                                    ))}
                                </div>
                            </div>

                            <p className="comment-body">{comment.comentario}</p>
                            <p className="comment-footer">Por {comment.nome_usuario} ({new Date(comment.data_comentario).toLocaleString()})</p>

                          </li>
                          {props.comments.length > 1 ? <div className="comment-divisor"></div> : null}
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
