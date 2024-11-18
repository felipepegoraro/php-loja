import { useEffect, useState } from "react";
import "../styles/css/home.css"
import type { Item, ItemCategoria } from '../types/item';
import axios from "axios";
import ProductCard from '../components/ProductCard';
import { useUser } from "../context/userContext";

const Home = () => {
    const [products, setProducts] = useState<Item[]>([]);
    const [loading, setLoading] = useState(true);
    const [categories, setCategories] = useState<ItemCategoria[]>([]);
    const { user } = useUser();

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const res = await axios.get("http://localhost/php-loja-back/get-products.php", { timeout: 1000 });
                const allproducts = res.data;
                // const destaques = allProducts.filter(product => product.quantidadeVendida > 100); // implementar depois filtro de destaques

                setProducts(allproducts);
                setLoading(false);

            }
            catch (error) {
                console.log("erro ao buscar produtos: ", error);
                setLoading(false);
            }
        }

        const fetchCategories = async () => {
            try {
                const res = await axios.get("http://localhost/php-loja-back/get-categorias.php", { timeout: 1000 });
                setCategories(res.data);
                setLoading(false);

            }
            catch (error) {
                console.log("erro ao buscar produtos: ", error);
                setLoading(false);
            }
        }
        fetchProducts();
        fetchCategories();
    }, [user]);


    if (loading) return <img height="50px" src="gif-loading.gif" alt="loading gif" />;
    return (

        <main className="home-page-container">

            <header className="hero-section">
                <div className="container text-center">
                    <h1>Bem-vindo à Loja PHP</h1>
                    <p>Encontre os melhores produtos com os melhores preços.</p>
                    <a href="/Catalogo" className="btn btn-primary btn-lg">
                        Ver Catálogo
                    </a>
                </div>
            </header>
            <section className="featured-products">
                <div className="container">
                    <h2 className="text-center">Produtos em Destaque</h2>
                    <div className="row">

                        {Array.isArray(products) && products.slice(0, 3).map((produto: Item, i: number) => (
                            <ProductCard key={i} produto={produto} addCartFunction={() => {

                            }} />
                        ))}

                    </div>
                </div>
            </section>

            <section className="product-categories">
                <div className="container">
                    <h2 className="text-center">Categorias</h2>
                    <div className="row ">
                        {categories.slice(0,6).map((categoria: ItemCategoria, index: number) => (
                            <div className="col category-card" key={index}>
                                <img src="https://via.placeholder.com/300x200" alt={categoria.nome} /> {/*  src={`category-${index + 1}.jpg`} */}
                                <h5>{categoria.nome}</h5>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            <section className="testimonials">
                <div className="container text-center">
                    <h2>O que nossos clientes dizem</h2>
                    <blockquote>
                        <p>"Produtos incríveis e entrega super rápida. Recomendo muito!"</p>
                        <footer>- João Silva</footer>
                    </blockquote>
                    <blockquote>
                        <p>"Ótima experiência de compra, preços justos e excelente atendimento."</p>
                        <footer>- Maria Oliveira</footer>
                    </blockquote>
                </div>
            </section>


        </main>
    );
}

export default Home;
