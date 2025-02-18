import { useEffect, useState } from "react";
import "../styles/css/home.css"
import type { Item, ItemCategoria } from '../types/item';
import type { Comentario } from '../types/reply';
import axios from "axios";
import ProductCard from '../components/ProductCard';
// import { useUser } from "../context/userContext";
import {Dispatch, SetStateAction} from 'react';
import SalesMetrics from '../types/SalesMetrics';
import useWindowDimensions from '../types/useWindowDimensions';

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

const showComentariosTemporariamenteSemConexaoComOBanco = (comments: Comentario[]) => {
    if (comments.length <= 0){
        return (
            <section className="testimonials py-4">
                <h2>nenhum comentário</h2>
            </section>
        )
    }

    return (
        <section className="testimonials py-4">
            <div className="container text-center">
                <h2 className="mb-4">O que nossos clientes dizem</h2>
                <p>{"*".repeat(comments.length)}</p>
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
        <div className="hero-section">
            <div className="container text-center">
                <h1>Bem-vindo à Loja PHP</h1>
                <p>Encontre os melhores produtos com os melhores preços.</p>
                <a href="/Catalogo" className="btn btn-primary btn-lg">
                    Ver Catálogo
                </a>
            </div>
        </div>
    );
}


const showCategoryList = (
    categories: ItemCategoria[],
    pos: { start: number, end: number },
    setPos: Dispatch<SetStateAction<{ start: number, end: number }>>,
    numof: number
) => {
    if (categories.length <= 0 || !Array.isArray(categories)){
        return <p>nenhuma categoria cadastrada</p>
    }

    const clen = categories.length; 

    const prevButton = () => (
        <button
            className="btn btn-primary mx-2"
            onClick={() => {
                setPos(pos.start > 0
                    ? { start: Math.max(pos.start - numof, 0), end: pos.start + pos.end}
                    : { start: clen - numof, end: clen }
                );
            }}
        >
            Prev
        </button>
    )

    const nextButton = () => (
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
    )

    return (
        <section className="product-categories">
            {prevButton()}
            <div>
                <h2 className="text-center">Categorias</h2>
                <div className="display-categories">
                    {categories.slice(pos.start, pos.start+numof).map((categoria: ItemCategoria, index: number) => (
                        <div className="text-center" key={index}>
                            <img
                                className=""
                                src={categoria.foto ? `data:image/png;base64,${categoria.foto}` : "https://via.placeholder.com/300x200"}
                                alt={categoria.nome}
                            />
                            <h5>{categoria.nome}</h5>
                        </div>
                    ))}
                </div>
            </div>
            {nextButton()}
        </section>
    );
};

const Home = () => {
    const [products, setProducts] = useState<Item[]>([]);
    const [topItems, setTopItems] = useState<Item[]>([]);

    const [loading, setLoading] = useState(true);
    const [categories, setCategories] = useState<ItemCategoria[]>([]);
    const [categoryListPosition, setCategoryListPosition] = useState({ start: 0, end: 5 });

    const [, setComments] = useState<Comentario[]>([]);

    const { width } = useWindowDimensions();
    const endpoint = process.env.REACT_APP_ENDPOINT;

    useEffect(() => {
        const fetchTopItems = async () => {
            const salesMetrics = new SalesMetrics();
            await salesMetrics.fetchTopItems("quantidade", 3);
            setTopItems(salesMetrics.getTopItems());
        };

        const fetchData = async () => {
            try {

                const [productsRes, categoriesRes, commentRes] = await Promise.all([
                    axios.get(`${endpoint}/get-products.php`,   { withCredentials: true }),
                    axios.get(`${endpoint}/get-categorias.php`, { withCredentials: true }),
                    axios.get(`${endpoint}/get-comments.php`,   { withCredentials: true })
                ]);

                const fetchedProducts = productsRes.data.value;
                const fetchedCategories = categoriesRes.data.value;
                const fetchedComments = commentRes.data;

                setComments(  (prev) => JSON.stringify(prev) !== JSON.stringify(fetchedComments)   ? fetchedComments   : prev);
                setProducts(  (prev) => JSON.stringify(prev) !== JSON.stringify(fetchedProducts)   ? fetchedProducts   : prev);
                setCategories((prev) => JSON.stringify(prev) !== JSON.stringify(fetchedCategories) ? fetchedCategories : prev);
            } catch (error) {
                console.error("Erro ao buscar dados:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
        fetchTopItems();
    }, [endpoint]);

    if (loading) return <img height="50px" src="gif-loading.gif" alt="loading gif" />;

    return (
        <main className="home-page-container">
            {showBanner()}
            {
                Array.isArray(topItems) && Array.isArray(products) 
                ? showMaisVendido(topItems.length >= 3 ? topItems : products.slice(0,3))
                : null
            }
            {width > 576 ? showCategoryList(categories, categoryListPosition, setCategoryListPosition, width >= 768 ? 5 : 3) : null}
            {/*showComentariosTemporariamenteSemConexaoComOBanco(comments)*/}
        </main>
    );
}

export default Home;
