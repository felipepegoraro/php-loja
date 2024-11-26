import { useState, useEffect } from 'react';
import { useUser } from '../context/userContext';
import CartProductCard from '../components/CartProductCard';
import Utils from '../types/Utils';
import CartService from '../services/CartService';
import Modal from '../components/Modal'
import "../styles/css/carrinho.css"

import type { Cartfull } from '../types/cart';

const Carrinho = () => {
    const [cart, setCart] = useState<Cartfull[]>([]);
    const { user, isLoggedIn } = useUser();
    const [loading, setLoading] = useState(true);
    const [total, setTotal] = useState(0);
    const [showModal, setShowModal] = useState(false);
    console.log("Carrinho:", cart);

    const fetchCartItems = async () => {
        if (!isLoggedIn || !user) {
            console.error("Usuário inválido.");
            return;
        }

        setLoading(true);
        const items = await CartService.fetchCartItems();
        setCart(items);
        setLoading(false);
    };

    const removeFromCart = async (itemId: number) => {
        if (!user?.id) {
            console.error("Usuário inválido.");
            return;
        }

        const result = await CartService.removeFromCart(user.id, itemId);
        if (result) {
            console.log(`Item ${itemId} removido com sucesso.`);
            await fetchCartItems();
        }
    };

    const clearCart = async () => {
        if (isLoggedIn) {
            const result = await CartService.clearCart();
            if (result) {
                console.log(result.message);
                setCart([]);
            } else {
                console.log("Erro ao limpar carrinho.");
            }
        }
    };

    const checkout = async () => {
        if (!isLoggedIn || !user) {
            console.log("Erro: usuário inválido.");
            return;
        }

        const result = await CartService.checkout(user.id);
        if (result) {
            console.log(result.message);
            setCart([]);
        }
    };

    const restoreCartItems = async () => {
        if (!user?.id) {
            console.error("Usuário inválido.");
            return;
        }

        const result = await CartService.restoreCartItem(user.id);
        if (result) {
            console.log(result.message);
            await fetchCartItems();
        }
    };

    const updateQuantity = async (idItem: number, quantidade: number) => {
        try {
            const result = await CartService.cartUpdateQuantityItem(idItem, quantidade);
            if (result) {

                setCart(prevCart =>
                    prevCart.map(item =>
                        item.idItem === idItem ? { ...item, quantidade } : item
                    )
                );

            } else {
                console.log('Erro ao salvar a quantidade');
            }
        } catch (error) {
            console.error('Erro ao salvar quantidade no backend:', error);
        }
    };

    const calculateTotal = () => {
        const total = cart.reduce((acc, item) => acc + item.precoItem * item.quantidade, 0);
        setTotal(total);
    };

    const handleCheckoutClick = () => {
        setShowModal(true); // Exibe o modal
    };

    const handleCloseModal = () => {
        setShowModal(false); // Fecha o modal
    };


    useEffect(() => {
        fetchCartItems();
    }, [user]);
    useEffect(() => {
        calculateTotal();
    }, [cart]);

    return user ? (
        <main className="cart-container">
            <div className="content">
                <h2 className="cart-title">Meu Carrinho</h2>

                <div className="cart-content">
                    {loading ? (
                        <p className="loading-text">Carregando carrinho...</p>
                    ) : (
                        <>
                            <div className="container">
                                {cart.map((i: Cartfull) => (
                                    <CartProductCard
                                        key={i.idItem}
                                        cartItem={i}
                                        onRemove={() => removeFromCart(i.idItem)}
                                        updateQuantity={updateQuantity}
                                    />
                                ))}
                            </div>
                            <div className="cart-summary">
                                <p>
                                    <strong>Total:</strong> {Utils.formatPrice(total)}
                                </p>
                                <div className="cart-actions">
                                    <button
                                        className="btn btn-danger"
                                        onClick={clearCart}
                                        disabled={loading || cart.length === 0}
                                    >
                                        Limpar Carrinho
                                    </button>
                                    <button
                                        className="botaocheckout btn btn-primary"
                                        onClick={handleCheckoutClick}
                                        disabled={loading || cart.length === 0}
                                    >
                                        Fazer Checkout
                                    </button>
                                    <button className="btn btn-secondary" onClick={restoreCartItems}>
                                        Restaurar Itens
                                    </button>
                                    <Modal
                                        show={showModal}
                                        onHide={handleCloseModal}
                                        title="Resumo da Compra"
                                        body={
                                            <>
                                                <div className="order-summary">
                                                    {cart.map((item, index) => (
                                                        <div key={index} className="order-item">
                                                            <span className="order-item-name">{item.nomeItem}</span>
                                                            <span className="order-item-price">{Utils.formatPrice(item.precoItem)}</span>
                                                            <span className="order-item-quantity">Qtd: {item.quantidade}</span>
                                                            <span className="item-total">
                                                                {Utils.formatPrice(item.precoItem * item.quantidade)}
                                                            </span>
                                                        </div>
                                                    ))}
                                                    <div className="order-total">
                                                        <strong>Total: {Utils.formatPrice(total)}</strong>
                                                    </div>
                                                </div>

                                                <button
                                                    className="btn btn-primary"
                                                    onClick={() => {
                                                        checkout();
                                                        handleCloseModal();
                                                    }}
                                                >
                                                    Confirmar
                                                </button>
                                                <button
                                                    className="btn btn-secondary"
                                                    onClick={handleCloseModal}
                                                >
                                                    Cancelar
                                                </button>
                                            </>
                                        }
                                    />

                                </div>
                            </div>
                        </>
                    )}
                </div>

            </div>

        </main >
    ) : null;
};

export default Carrinho;
