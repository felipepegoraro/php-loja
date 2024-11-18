import {useState, useEffect} from 'react';
import {useNavigate} from 'react-router-dom';
import axios from 'axios';

import type {Item} from '../types/item';
import type {Cart} from '../types/cart';

import Modal from '../components/Modal';
import ProductCard, {addToCart} from '../components/ProductCard';

import { useUser } from '../context/userContext';

const Catalogo = () => {
    const [products, setProducts] = useState<Item[]>([]);
    const [loading, setLoading] = useState(true);
    const [showmodal, setShowmodal] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState<Item | null>(null);
    const [quantidade, setQuantidade] = useState(1);
    const [cart, setCart] = useState<Cart[]>([]);

    const {user} = useUser();
    const navigate = useNavigate();

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

    useEffect(()=> {
        const fetchProducts = async () => {
            try {
                const res = await axios.get("http://localhost/php-loja-back/get-products.php", {timeout: 1000});

                setProducts(res.data);
                setLoading(false);
            }
            catch(error) {
                console.log("erro ao buscar produtos: ", error);
                setLoading(false);
            }
        }

        fetchProducts();
        fetchCartItems();
    },[user])

    const getTotalCarrinho = () => {
        return cart.length > 0 
            ? cart.reduce((total, item) => total + (item.preco * item.quantidade), 0)
            : 0
    }

    // TODO: centralizar o gif
    // esta muito rapido nao da pra ver
    // se quiser testar comente as linhas de setLoading(false)
    if (loading) return <img height="50px" src="gif-loading.gif" alt="loading gif"/>;

    // TODO: design aqui
    return user ? (
        <main className="catalogo-container container" >
            <h1>Catálogo de Produtos</h1>
            <div className="row" style={{position: "relative"}}>
                {Array.isArray(products) && products.map((produto: Item, i:number) => (
                    <ProductCard key={i} produto={produto} addCartFunction={()=> {
                        setSelectedProduct(produto)
                        setShowmodal(!showmodal);
                    }}/>
                ))}
            </div>

             {selectedProduct && showmodal && (
                <Modal
                    show={showmodal}
                    onHide={() => {
                        setShowmodal(false);
                        setQuantidade(1);
                    }}
                    title={`Comprar ${selectedProduct.nome}`}
                    body={
                        <>
                            <p>{selectedProduct.descricao}</p>
                            <label>Quantidade:</label>
                            <input 
                                type="number" 
                                value={quantidade} 
                                onChange={(e) => setQuantidade(Number(e.target.value))}
                                min="1"
                            />
                            <button 
                                className="btn btn-success"
                                onClick={async () => {
                                    if (selectedProduct) {
                                        await addToCart(user.id, selectedProduct, quantidade);
                                        setShowmodal(false);
                                        setQuantidade(1);
                                        await fetchCartItems();
                                    }
                                }}
                            >
                                Adicionar ao Carrinho
                            </button>

                            <div className="teste">
                                <p>Sub-total (preço x quantidade): R$ {selectedProduct.preco * quantidade}</p>
                                <p>Total do carrinho: R$ {getTotalCarrinho()}</p>
                                <p>Valor final (total + sub-total): R$ 
                                    {getTotalCarrinho() + selectedProduct.preco * quantidade }
                                </p>
                                <button className="btn btn-primary" onClick={()=>navigate("/Carrinho")}>ver carrinho</button>
                            </div>
                        </>
                    }
                />
            )}
        </main>
    ) :
    <p>
        mostrar os itens mas remover os botoes aqui ja que o usuario 
        nao esta logado nao pode finalizar nem add coisa no carrinho
    </p>
};

export default Catalogo;
