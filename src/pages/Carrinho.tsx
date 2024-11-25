import { useState, useEffect } from 'react';
import { useUser } from '../context/userContext';
import CartProductCard from '../components/CartProductCard';
import CartService from '../services/CartService';

import type { Cartfull } from '../types/cart';

const Carrinho = () => {
    const [cart, setCart] = useState<Cartfull[]>([]);
    const { user, isLoggedIn } = useUser();
    const [loading, setLoading] = useState(true);

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
    useEffect(() => {
        fetchCartItems();
    }, [user]);

    return user ? (
        <main className="container">
            <h2>Carrinho</h2>
            {loading ? (
                <p>Carregando carrinho...</p>
            ) : (
                <div>
                    {cart.map((i: Cartfull) => (
                        <CartProductCard
                            key={i.idItem}
                            cartItem={i}
                            onRemove={() => removeFromCart(i.idItem)}
                            updateQuantity={updateQuantity}
                            
                        />
                    ))}
                </div>
            )}

            <button className="btn btn-primary" onClick={checkout} disabled={loading || cart.length === 0}>
                Fazer Checkout
            </button>

            <button className="btn btn-danger" onClick={clearCart} disabled={loading || cart.length === 0}>
                Limpar carrinho
            </button>

            <button className="btn btn-secondary" onClick={restoreCartItems}>
                Restaurar últimos itens apagados
            </button>

            <p>Total: calcular-total</p>
        </main>
    ) : null;
};

export default Carrinho;
