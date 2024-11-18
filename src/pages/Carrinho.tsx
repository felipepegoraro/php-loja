import axios from 'axios';
import {useState, useEffect} from 'react';
import { useUser } from '../context/userContext';

import type {Cart} from '../types/cart';

const Carrinho = () => {

    const [cart, setCart] = useState<Cart[]>([]);
    const {user} = useUser();

    const fetchCartItems = async () => {
        if (user){
            try {
                const res = await axios.get("http://localhost/php-loja-back/cart-get.php", {timeout: 1000});

                if (res.data.success && Array.isArray(res.data.values))
                    setCart(res.data.values.filter((i: Cart) => i.idUsuario == user.id))
            } catch(error){
                console.log("erro ao acessar carrinho", error);
            }
        }
    }

    useEffect(()=>{fetchCartItems()},[user]);

    return user ? (
        <main className="container">
            <h2>Carrinho</h2> 
            <p>TODO: usar ProductCart mas de outra forma e refatorar/reutilizar função getTotalCarrinho e fetchCartItems etc</p>
            <p>TODO: funcao de limpar carrinho usando cart-delete.php</p>
            <p>TODO: usar modal para mostrar tela de checkout</p>
            { <ul> {cart.map(i => <li key={i.id}>item: {i.id} | quantidade: {i.quantidade} </li>)} </ul> }

            <button className="btn btn-primary">fazer checkout</button>
            <button className="btn btn-danger">limpar carrinho</button>
            <p>total: calcular-total</p>
        </main>
    ) : null;
}

export default Carrinho;
