import type {Item} from '../types/item';
import ProductCard, {addToCart} from '../components/ProductCard';
import {useState, useEffect} from 'react';
import axios from 'axios';
import Modal from '../components/Modal';
import { useUser } from '../context/userContext';

const Catalogo = () => {
    const [products, setProducts] = useState<Item[]>([]);
    const [loading, setLoading] = useState(true);
    const [showmodal, setShowmodal] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState<Item | null>(null);
    const [quantidade, setQuantidade] = useState(1);

    const {user} = useUser();

    useEffect(()=>{
        const fetchProducts = async () => {
            try {
                const res = await axios.get("http://localhost/php-loja-back/get-products.php", {
                    timeout: 10000
                });

                setProducts(res.data);
                setLoading(false);
            }
            catch(error) {
                console.log("erro ao buscar produtos: ", error);
                setLoading(false);
            }
        }
        fetchProducts();
    },[]);

    // TODO: centralizar o gif
    // esta muito rapido nao da pra ver
    // se quiser testar comente as linhas de setLoading(false)
    if (loading) return <img height="50px" src="gif-loading.gif" alt="loading gif"/>;

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
                            <p>Detalhes do produto: {selectedProduct.descricao}</p>
                            <label>Quantidade:</label>
                            <input 
                                type="number" 
                                value={quantidade} 
                                onChange={(e) => setQuantidade(Number(e.target.value))}
                                min="1"
                            />
                            <button 
                                onClick={async () => {
                                    if (selectedProduct) {
                                        await addToCart(user.id, selectedProduct, quantidade);
                                        setShowmodal(false);
                                    }
                                }}
                            >
                                Adicionar ao Carrinho
                            </button>
                        </>
                    }
                />
            )}
        </main>
    ) : null;
};

export default Catalogo;
