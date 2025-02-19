import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import "../styles/css/detalhesitem.css";
import type { Item } from "../types/item";
import type { Cart } from '../types/cart';
import { useUser } from '../context/userContext';
import CartService from '../services/CartService';
import ToastNotification, { ToastProps } from '../components/ToastNofitication';
import Utils from "../types/Utils";
import {CommentExtended} from '../types/reply';

import CommentContainer from '../components/CommentContainer';
import CommentForm from '../components/CommentForm';

const DetalhesItem = () => {
    const { itemId } = useParams<{ itemId: string }>(); // Captura o ID do item da URL
    const navigate = useNavigate();
    const [item, setItem] = useState<Item | null>(null);
    const [, setCart] = useState<Cart[]>([]);
    const [loading, setLoading] = useState(true);
    const [toasts, setToasts] = useState<ToastProps[]>([]);
    const [comments, setComments] = useState<CommentExtended[]>([]);

    const endpoint = process.env.REACT_APP_ENDPOINT;
    const { user } = useUser();

    const fetchCartItems = async () => {
        if (user) {
            const fetchedCart = await CartService.fetchCartItems();
            setCart(fetchedCart.filter((i: Cart) => String(i.idUsuario) === String(user.id)));
        }
    };

    useEffect(() => {
        const fetchComments = async () => {
            try {
                const response = await axios.get(`${endpoint}/get-comments.php?itemId=${itemId}`);
                console.log(response);
                if (response.data.success) {
                    setComments(response.data.value);
                } else {
                        console.log('Erro ao buscar comentários.');
                }
            } catch (err) {
                console.log('Erro ao buscar comentários.');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        if (itemId) fetchComments();
    }, [itemId, endpoint]);

    useEffect(() => {
        const fetchItemDetails = async () => {
            try {
                const res = await axios.get(`${endpoint}/get-item.php`, {
                    params: { id: itemId },
                });
                setItem(res.data);
            } catch (error) {
                console.error("Erro ao buscar detalhes do item:", error);
            } finally {
                setLoading(false);
            }
        };

        if (itemId) fetchItemDetails();
    }, [itemId, endpoint]);

    if (loading) {
        return <p>Carregando detalhes do item...</p>;
    }

    if (!item) {
        return <p>Item não encontrado.</p>;
    }

    return (
        <div className="dt container">
            <div className="detalhes-item-container">
                <button onClick={() => navigate(-1)} className="btn btn-secondary voltar">
                    Voltar
                </button>
                <div className="detalhes-item-layout">
                    <div className="item-image-container">
                        <img
                            src={`data:image/png;base64,${item.foto}`}
                            alt={item.nome}
                            className="item-image"
                        />
                    </div>

                    <div className="item-info-container">
                        <h1 className="item-name">{item.nome}</h1>
                        <p className="item-price">{Utils.formatPrice(item.preco)}</p>

                        <div className="item-description">
                            <h3>Descrição:</h3>
                            <p>{item.descricao}</p>
                        </div>

                        <div className="item-rating">
                            <h3>Avaliações:</h3>
                            {[...Array(5)].map((_, index) => (
                                <span key={index} 
                                    className={`fa fa-star ${index < item.nota ? "checked" : ""}`}>
                                </span>
                            ))}
                            <p>Baseado em {comments.length} avaliações de clientes.</p>
                        </div>

                        <div className="item-buttons">
                            <button
                                className="btn btn-primary adicionar-carrinho"
                                onClick={async () => {
                                    if (user) {
                                        await CartService.addToCart(user.id, item, 1);
                                        const newToast = {
                                            id: Date.now(),
                                            title: `Produto adicionado`,
                                            description: "Produto inserido no carrinho",
                                            color: "green",
                                            png: "✅"
                                        };
                                        setToasts(prevToasts => [...prevToasts, newToast]);
                                        await fetchCartItems();
                                        // aqui deve recarregar os comentarios!
                                    }
                                }}
                            >
                                Adicionar ao Carrinho
                            </button>
                        </div>
                    </div>
                </div>

                <CommentForm idProduto={item.id}/>
                <CommentContainer comments={comments}/>

                {toasts.map(toast => (
                    <ToastNotification
                        key={toast.id}
                        id={toast.id}
                        title={toast.title}
                        description={toast.description}
                        color={toast.color}
                        png={toast.png}
                    />
                ))}
            </div>


        </div>

    );
};

export default DetalhesItem;
