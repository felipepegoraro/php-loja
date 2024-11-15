import type {Item} from '../types/item';
import ProductCard from '../components/ProductCard';
import {useState, useEffect} from 'react';
import axios from 'axios';

const Catalogo = () => {
    const [products, setProducts] = useState<Item[]>([]);
    const [loading, setLoading] = useState(true);

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

    return (
        <main className="container">
            <h1>Catálogo de Produtos</h1>
            <div className="row">
                {Array.isArray(products) && products.map((produto: Item, i:number) => (
                    <ProductCard key={i} {...produto} />
                ))}
            </div>
        </main>
    );
};

export default Catalogo;
