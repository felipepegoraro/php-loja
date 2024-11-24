import axios from 'axios';
import {Item} from '../types/item';

class CartService {
    static async addToCart(
        userId: number,
        item: Item,
        quantidade: number
    ){
        if (quantidade <= 0 || !item) return;

        const payload = {
            idUsuario: String(userId),
            idItem: item.id,
            quantidade: String(quantidade),
            preco: item.preco,
            status: "ativo",
        };

        try {
            const response = await axios.post("http://localhost/php-loja-back/cart-add.php", payload, {
                headers: { 'Content-Type': 'application/json' },
                withCredentials: true,
            });

            const { data } = response;
            console.log(data.success ? data.message : `Erro: ${data.message}`);
        } catch (error) {
            console.error("Erro ao adicionar ao carrinho:", error);
        }
    };

    static async removeFromCart(userId: number, itemId: number) {
        const req = {
            idUsuario: userId,
            idItem: itemId,
        };

        try {
            const response = await axios.post("http://localhost/php-loja-back/cart-remove.php", req, {
                withCredentials: true,
                timeout: 1000,
                headers: {
                    "Content-Type": "application/json",
                },
            });

            return response.data.success ? response.data : null;
        } catch (error) {
            console.error("Erro na requisição para remover item do carrinho:", error);
            return null;
        }
    }

    static async clearCart() {
        try {
            const res = await axios.get("http://localhost/php-loja-back/cart-clear.php", {
                timeout: 1000,
                withCredentials: true,
            });

            return res.data.success ? res.data : null;
        } catch (error) {
            console.log("Erro ao limpar carrinho:", error);
            return null;
        }
    }

    static async checkout(userId: number) {
        const obj = { idUsuario: userId };

        try {
            const res = await axios.post("http://localhost/php-loja-back/checkout.php", obj, {
                withCredentials: true,
                timeout: 1000,
                headers: {
                    "Content-Type": "application/json",
                },
            });

            return res.data.success ? res.data : null;
        } catch (error) {
            console.log("Erro ao fazer checkout:", error);
            return null;
        }
    }

    static async fetchCartItems() {
        try {
            const res = await axios.get("http://localhost/php-loja-back/cart-get.php", {
                timeout: 1000,
                withCredentials: true,
            });

            return res.data.success ? res.data.cart : [];
        } catch (error) {
            console.log("Erro ao acessar carrinho:", error);
            return [];
        }
    }

    static async restoreCartItem(userId: number) {
        try {
            const response = await axios.post("http://localhost/php-loja-back/cart-restore.php", { idUsuario: userId }, {
                timeout: 1000,
                withCredentials: true,
            });

            return response.data.success ? response.data : null;
        } catch (error) {
            console.error("Erro ao restaurar itens do carrinho:", error);
            return null;
        }
    }
}

export default CartService;
