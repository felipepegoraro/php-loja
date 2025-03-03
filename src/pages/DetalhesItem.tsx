import axios from "axios";
import "../styles/css/detalhesitem.css";

import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

import { useUser } from '../context/userContext';
import CartService from '../services/CartService';

import Utils from "../types/Utils";
import type { Item } from "../types/item";
import type { Cart } from '../types/cart';
import {CommentExtended} from '../types/reply';

import CommentContainer from '../components/CommentContainer';
import CommentForm from '../components/CommentForm';
import ToastNotification, { ToastProps } from '../components/ToastNofitication';

const MIN_NUM_COMMENTS = 3;

const DetalhesItem = () => {
    const [item, setItem] = useState<Item | null>(null);
    const [, setCart] = useState<Cart[]>([]);
    const [loading, setLoading] = useState(true);
    const [toasts, setToasts] = useState<ToastProps[]>([]);
    const [comments, setComments] = useState<[number, CommentExtended[]]>([MIN_NUM_COMMENTS,[]]);

    const { user } = useUser();
    const navigate = useNavigate();
    const { itemId } = useParams<{ itemId: string }>();
    const endpoint = process.env.REACT_APP_ENDPOINT;

    const fetchCartItems = async () => {
        if (user) {
            const fetchedCart = await CartService.fetchCartItems();
            setCart(fetchedCart.filter((i: Cart) => String(i.idUsuario) === String(user.id)));
        }
    };

    useEffect(() => {
        const fetchComments = async () => {
            try {
                const response = await axios.get(`${endpoint}/comments-get.php?itemId=${itemId}`);
                if (response.data.success) setComments([comments[0], response.data.value]);
            } catch (err) {
                console.log(`Erro ao buscar comentários: ${err}`);
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
                console.log(`Erro ao buscar detalhes do item: ${error}`);
            } finally {
                setLoading(false);
            }
        };

        if (itemId) fetchItemDetails();
    }, [itemId, endpoint]);

    if (loading) return <p>Carregando detalhes do item...</p>;
    if (!item) return <p>Item não encontrado.</p>;

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
                            <p>Baseado em {comments[1].length} avaliações de clientes.</p>
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
                                    }
                                }}
                            >
                                Adicionar ao Carrinho
                            </button>
                        </div>
                    </div>
                </div>

                <CommentForm idProduto={item.id}/>
                <CommentContainer comments={comments[1]} index={comments[0]}/>

                {comments[1].length > MIN_NUM_COMMENTS ? (<div className="list-comment-buttons">
                    <button 
                        className="btn btn-primary"
                        onClick={() => setComments(([index, comments]) => [index + MIN_NUM_COMMENTS, comments])}>
                        Ver mais comentários
                    </button>

                    <button 
                        className="btn btn-secondary"
                        onClick={() => setComments(([, comments]) => [MIN_NUM_COMMENTS, comments])}>
                        Minimizar comentários
                    </button>
                </div>) : null }

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
