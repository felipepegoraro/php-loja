import axios from 'axios';
import CartProductCard from '../components/CartProductCard'
import { useState, useEffect } from 'react';
import { useUser } from '../context/userContext';



import type { Cart, Cartfull } from '../types/cart';

const Carrinho = () => {
    const [cart, setCart] = useState<Cartfull[]>([]);
    const { user, isLoggedIn } = useUser();
    const [loading, setLoading] = useState(true);

    console.log("carrinho: ", cart);

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
            } catch (error) {
                console.log("erro ao limpar carrinho: ", error);
            }
        }
    };

    const checkout = async () => {
        if (isLoggedIn && user) {
            const obj = { idUsuario: user.id };
            try {
                const res = await axios.post("http://localhost/php-loja-back/checkout.php",
                    obj,
                    {
                        withCredentials: true,
                        timeout: 1000,
                        headers: {
                            "Content-Type": "application/json"
                        }
                    }
                );

                if (res.data.success) {
                    console.log(res.data.message);
                    setCart([]);
                } else {
                    console.log(res.data.message);
                }
            } catch (error) {
                console.log("erro ao fazer checkout: ", error);
            }
        }
    };

    const fetchCartItems = async () => {
        if (!isLoggedIn || !user) {
            console.error("Usuário inválido.");
            return;
        }

        try {
            const res = await axios.get("http://localhost/php-loja-back/cart-get.php", {
                timeout: 1000,
                withCredentials: true
            });
            
            console.log("Valores recebidos:", res.data);
            if (res.data && Array.isArray(res.data.cart)) {
                setCart(res.data.cart); // Atualiza o estado cart com os itens recebidos
            } else {
                console.error("Formato de dados inesperado no carrinho.");
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
            ) : (
                <div>
                    {cart.map((i: Cartfull) => (
                        <CartProductCard
                            key={i.idItem}
                            cartItem={i} // Passando o item do carrinho para o CartProductCard
                        />
                    ))}
                </div>
            )}
            <button className="btn btn-primary"
                onClick={async () => await checkout()}
                disabled={loading || cart.length === 0}>
                Fazer Checkout
            </button>

            <button className="btn btn-danger"
                onClick={async () => await clearCart()}
                disabled={loading || cart.length === 0}>
                Limpar carrinho
            </button>

            <button className="btn btn-secondary"
                onClick={async () => {
                    await cartRestoreItem(user.id);
                    await fetchCartItems();
                }}>
                Restaurar últimos itens apagados
            </button>

            <p>total: calcular-total</p>
        </main>
    ) : null;
};

export default Carrinho;

