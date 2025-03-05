import axios from 'axios';
import {Item} from '../types/item';

class CartService {
    static endpoint: string = process.env.REACT_APP_ENDPOINT as string;

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
            const response = await axios.post(`${this.endpoint}/cart-add.php`, payload, {
                headers: { 'Content-Type': 'application/json' },
                withCredentials: true,
            });

            console.log(response.data.message);
        } catch (error) {
            console.error("Erro ao adicionar ao carrinho:", error);
        }
    };

    static async removeFromCart(userId: number, itemId: number) {
        const req = {
            idUsuario: userId,
            idItem: itemId,
            quantidade: 0
        };

        try {
            const res = await axios.post(`${this.endpoint}/cart-remove.php`, req, {
                withCredentials: true,
                headers: { "Content-Type": "application/json", },
            });

            return res.data.success;
        } catch (error) {
            console.error("Erro na requisição para remover item do carrinho:", error);
            return null;
        }
    }

    static async clearCart() {
        try {
            const res = await axios.get(`${this.endpoint}/cart-clear.php`, {
                withCredentials: true,
            });

            return res;
        } catch (error) {
            console.log("Erro ao limpar carrinho:", error);
            return null;
        }
    }

    static async checkout(userId: number) {
        const obj = { idUsuario: userId };

        try {
            const res = await axios.post(`${this.endpoint}/checkout.php`, obj, {
                withCredentials: true,
                headers: { "Content-Type": "application/json" },
            });

            console.log(res.data.message);
            return res.data.success ? res.data : null;
        } catch (error) {
            console.log("Erro ao fazer checkout:", error);
            return null;
        }
    }

    static async fetchCartItems() {
        try {
            const res = await axios.get(`${this.endpoint}/cart-get.php`, {
                withCredentials: true,
            });

            return res.data.success ? res.data.value : [];
        } catch (error) {
            console.log("Erro ao acessar carrinho:", error);
            return [];
        }
    }

    static async restoreCartItem(userId: number) {
        try {
            const response = await axios.post(`${this.endpoint}/cart-restore.php`, {
                idUsuario: userId 
            }, {
                withCredentials: true,
            });

            return response.data.success ? response.data : null;
        } catch (error) {
            console.error("Erro ao restaurar itens do carrinho:", error);
            return null;
        }
    }

    static async cartUpdateQuantityItem(idItem: number, quantidade: number) {
        try {
            const response = await axios.post(`${this.endpoint}/cart-update-quantity.php`, 
                new URLSearchParams({
                    idItem: String(idItem), 
                    quantidade: String(quantidade)
                }), {
                    headers: { 'Content-Type': 'application/x-www-form-urlencoded' }, 
                    withCredentials: true,
                }
            );
    
            console.log(response.data.message);
            return response.data.success ? response.data : null;
        } catch (error) {
            console.error("Erro ao atualizar a quantidade do item:", error);
            return null;
        }
    }

}

export default CartService;
