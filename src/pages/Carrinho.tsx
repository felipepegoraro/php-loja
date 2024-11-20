import axios from 'axios';
import { useState, useEffect } from 'react';
import { useUser } from '../context/userContext';
import type {User} from '../types/user';

import type { Cart } from '../types/cart';

const Carrinho = () => {
    const [cart, setCart] = useState<Cart[]>([]);
    const { user, isLoggedIn } = useUser();
    const [loading, setLoading] = useState(true);

    // Precisa urgente refatorar eu sei.
    // criar uma classe carrinho etc 

    const removeFromCart = async (userid: number, itemId: number) => {
        if (!user || !user.id) {
            console.error("Usuário inválido.");
            return;
        }

        const req = {
            idUsuario: userid,
            idItem: itemId,
        };

        console.log(req);

        try { 
            const response = await axios.post("http://localhost/php-loja-back/cart-remove.php", 
                req,
                {
                    withCredentials: true,
                    timeout: 1000,
                    headers: {
                        "Content-Type": "application/json",
                    },
                }
            );

            if (response.data.success) {
                console.log(`Item ${itemId} removido do carrinho com sucesso.`);
            } else {
                console.error("Erro ao remover item do carrinho:", response.data.message);
            }
        } catch (error) {
            console.error("Erro na requisição para remover item do carrinho:", error);
        }
    };

    const clearCart = async () => {
        if (isLoggedIn) {
            try {
                const res = await axios.get("http://localhost/php-loja-back/cart-clear.php", {
                    timeout: 1000,
                    withCredentials: true
                });

                if (res.data.success) {
                    console.log(res.data.message);
                    setCart([]);
                } else {
                    console.log("erro: ", res.data.message);
                }
            }
            catch (error) {
                console.log("erro ao limpar carrinho: ", error);
            }
        }
    };

    const fetchCartItems = async () => {
        if (!user || !user.id) {
            console.error("Usuário inválido.");
            return;
        }

        try {
            const res = await axios.get("http://localhost/php-loja-back/cart-get.php", {
                timeout: 1000,
                withCredentials: true
            });

            if (res.data.success && Array.isArray(res.data.values)) {
                setCart(res.data.values.filter((i: Cart) => String(i.idUsuario) === String(user.id) && i.status === 'ativo'));
            }
        } catch (error) {
            console.log("erro ao acessar carrinho", error);
        }
        setLoading(false);
    }


    const cartRestoreItem = async (userId: number): Promise<void> => {
        try {
            const response = await axios.post("http://localhost/php-loja-back/cart-restore.php", { idUsuario: userId }, {
                timeout: 1000,
                withCredentials: true
            });

            if (response.data.success) {
                console.log(response.data.message);
            } else {
                console.log("Erro: ", response.data.message);
            }
        } catch (error) {
            console.error("Erro ao restaurar itens do carrinho: ", error);
        }
    };

    useEffect(() => {
        fetchCartItems();
    }, [user]);

    return user ? (
        <main className="container">
            <h2>Carrinho</h2>
            <p>TODO: usar ProductCart mas de outra forma e refatorar/reutilizar função getTotalCarrinho e fetchCartItems etc</p>
            <p>TODO: funcao de limpar carrinho usando cart-delete.php</p>
            <p>TODO: usar modal para mostrar tela de checkout</p>

            {loading ? (
                <p>Carregando carrinho...</p>
            ) : cart.length > 0 ? (
                <ul>
                    {cart.map((i: Cart) => 
                        <li key={i.idItem}>
                            <p>item: {i.idItem} | quantidade: {i.quantidade}</p>
                            <button onClick={async () =>  {
                                await removeFromCart(user.id, i.idItem);
                                await fetchCartItems();
                            }}>remover do carrinho item</button>
                        </li>
                    )}
                </ul>
            ) : (
                <p>Seu carrinho está vazio.</p>
            )}

            <button className="btn btn-primary">fazer checkout</button>
            <button 
                className="btn btn-danger" 
                onClick={async () => await clearCart()}
                disabled={loading || cart.length === 0}
            >
                limpar carrinho
            </button>

            <button className="btn btn-secondary" onClick={ async () => {
                await cartRestoreItem(user.id);
                await fetchCartItems();
            }}>
                restaurar últimos itens apagados
            </button>

            <p>total: calcular-total</p>
        </main>
    ) : null;
};

export default Carrinho;

