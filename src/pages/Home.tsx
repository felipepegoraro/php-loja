import { useEffect, useState } from "react";
import "../styles/css/home.css"
import type { Item, ItemCategoria } from '../types/item';
import axios from "axios";
import ProductCard from '../components/ProductCard';
// import { useUser } from "../context/userContext";
import {Dispatch, SetStateAction} from 'react';
import SalesMetrics from '../types/SalesMetrics';

// TODO =====================
// TODO
// TODO
// TODO
// TODO  SEPARAR EM ARQUIVOS
// TODO  TROCAR ESSES NOMES
// TODO
// TODO
// TODO =====================

// mostra os 3 mais vendidos ou 3 quaisquer caso nao existam produtos vendido
const showMaisVendido = (topItems: Item[]) => {
    return (
        <section className="featured-products">
            <div className="container fp">
                <h2 className="text-center">Produtos em Destaque</h2>
                <div className="container">  
                    <div className="row">
                        {topItems.length > 0 ?
                            topItems.map((topItem, i) => {
                                return (
                                    <ProductCard key={i} produto={topItem} onAddToCart={() => {
                                        console.log("simulando add ao carrinho");
                                    }} />
                                );
                            })
                            :
                            <p>Nenhum item encontrado!</p>
                        }
                    </div>
                </div>
            </div>
        </section>
    );
}

const showComentariosTemporariamenteSemConexaoComOBanco = () => {
    return (
        <section className="testimonials py-4">
            <div className="container text-center">
                <h2 className="mb-4">O que nossos clientes dizem</h2>
                <blockquote className="blockquote mb-4">
                    <p className="text-start">- João Silva</p>
                    <footer className="blockquote-footer">"Produtos incríveis e entrega super rápida. Recomendo muito!"</footer>
                </blockquote>
                <blockquote className="blockquote mb-4">
                    <p className="text-start">- Maria Oliveira</p>
                    <footer className="blockquote-footer">"Ótima experiência de compra, preços justos e excelente atendimento."</footer>
                </blockquote>
            </div>
        </section>
    );
};

const showBanner = () => {
    return (
        <header className="hero-section">
            <div className="container text-center">
                <h1>Bem-vindo à Loja PHP</h1>
                <p>Encontre os melhores produtos com os melhores preços.</p>
                <a href="/Catalogo" className="btn btn-primary btn-lg">
                    Ver Catálogo
                </a>
            </div>
        </header>
    );
}

const showCategoryList = (
    categories: ItemCategoria[],
    pos: { start: number, end: number },
    setPos: Dispatch<SetStateAction<{ start: number, end: number }>>,
    numof: number = 5
) => {
    if (categories.length <= 0){
        return <p>nenhuma categoria cadastrada</p>
    }

    const clen = categories.length;

    return (
        <section className="product-categories d-flex flex-row align-items-center">
            <button
                className="btn btn-primary mx-2"
                onClick={() => {
                    setPos(pos.start > 0
                        ? { start: Math.max(pos.start - numof, 0), end: pos.end - numof }
                        : { start: clen - numof, end: clen }
                    );
                }}
            >
                Prev
            </button>

            <div className="container pg">
                <h2 className="text-center">Categorias</h2>
                 <div className="d-flex flex-row justify-content-center">
                    {categories.slice(pos.start, pos.end).map((categoria: ItemCategoria, index: number) => (
                        <div className="col category-card text-center" key={index}>
                            <img
                                className="img-fluid mb-3"
                                src={categoria.foto ? `data:image/png;base64,${categoria.foto}` : "https://via.placeholder.com/300x200"}
                                alt={categoria.nome}
                            />
                            <h5>{categoria.nome}</h5>
                        </div>
                    ))}
                </div>
            </div>

            <button
                className="btn btn-primary mx-2"
                onClick={() => {
                    setPos(pos.end < clen
                        ? { start: pos.start + numof, end: pos.end + numof }
                        : { start: 0, end: numof }
                    );
                }}
            >
                Next
            </button>
        </section>
    );
};

const Home = () => {
    const [products, setProducts] = useState<Item[]>([]);
    const [topItems, setTopItems] = useState<Item[]>([]);

    const [loading, setLoading] = useState(true);
    const [categories, setCategories] = useState<ItemCategoria[]>([]);
    const [categoryListPosition, setCategoryListPosition] = useState({ start: 0, end: 5 });

    useEffect(() => {
        const fetchTopItems = async () => {
            const salesMetrics = new SalesMetrics();
            await salesMetrics.fetchTopItems("quantidade", 3);
            setTopItems(salesMetrics.getTopItems());
        };

        const fetchData = async () => {
            try {
                const [productsRes, categoriesRes] = await Promise.all([
                    axios.get("http://localhost/php-loja-back/get-products.php", { timeout: 1000 }),
                    axios.get("http://localhost/php-loja-back/get-categorias.php", { timeout: 1000 })
                ]);

                const fetchedProducts = productsRes.data;
                const fetchedCategories = categoriesRes.data;

                setProducts((prev) => JSON.stringify(prev) !== JSON.stringify(fetchedProducts) ? fetchedProducts : prev);
                setCategories((prev) => JSON.stringify(prev) !== JSON.stringify(fetchedCategories) ? fetchedCategories : prev);
            } catch (error) {
                console.error("Erro ao buscar dados:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
        fetchTopItems();
    }, []);

    if (loading) return <img height="50px" src="gif-loading.gif" alt="loading gif" />;

    return (
        <main className="home-page-container">
            {showBanner()}
            {showMaisVendido(topItems.length >= 3 ? topItems : products.slice(0,3) )}
            {showCategoryList(categories, categoryListPosition, setCategoryListPosition)}
            {showComentariosTemporariamenteSemConexaoComOBanco()}
        </main>
    );
}

export default Home;
