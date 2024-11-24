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
        const fetchData = async () => {
            try {
                const [productsRes, categoriesRes] = await Promise.all([
                    axios.get("http://localhost/php-loja-back/get-products.php", { timeout: 1000 }),
                    axios.get("http://localhost/php-loja-back/get-categorias.php", { timeout: 1000 })
                ]);

                const fetchedProducts = productsRes.data;
                const fetchedCategories = categoriesRes.data;

                // tentando minimizar o num de renderizações...
                setProducts((prev) => JSON.stringify(prev) !== JSON.stringify(fetchedProducts) ? fetchedProducts : prev);
                setCategories((prev) => JSON.stringify(prev) !== JSON.stringify(fetchedCategories) ? fetchedCategories : prev);
            } catch (error) {
                console.error("Erro ao buscar dados:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    console.log("categorias:", categories);
    console.log("produtos:", products);

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
                <div className="container fp">
                    <h2 className="text-center">Produtos em Destaque</h2>
                    <div className="container">  <div className="row">

                        {Array.isArray(products) ?
                            products.slice(0, 3).map((produto: Item, i: number) => (
                                <ProductCard key={i} produto={produto} onAddToCart={() => {
                                    if (!user){
                                        console.log("deve estar logado para adicionar ao carrinho")
                                        return;
                                    }

                                    console.log("simulando add ao carrinho");
                                }} />
                            ))
                            :
                            <p>nenhum produto encontrado!</p>
                        }

                    </div></div>
                </div>
            </section>

            <section className="product-categories">
                <div className="container pg">
                    <h2 className="text-center">Categorias</h2>
                    <div className="row ">
                        {categories.slice(0, 5).map((categoria: ItemCategoria, index: number) => (
                            <div className="col category-card" key={index}>
                                <img
                                    src={categoria.foto ? `data:image/png;base64,${categoria.foto}` : "https://via.placeholder.com/300x200"}
                                    alt={categoria.nome} />
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
                        <p>- João Silva</p>
                        <footer>"Produtos incríveis e entrega super rápida. Recomendo muito!"</footer>
                    </blockquote>
                    <blockquote>
                        <p>- Maria Oliveira</p>
                        <footer>"Ótima experiência de compra, preços justos e excelente atendimento."</footer>
                    </blockquote>
                </div>
            </section>

        </main>
    );
}

export default Home;
