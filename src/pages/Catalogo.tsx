import { useState, useCallback, useEffect } from 'react'
import axios from 'axios';
import "../styles/css/catalogo.css";
import type { Item, ItemCategoria } from '../types/item';
import type { Cart } from '../types/cart';

import ProductCard from '../components/ProductCard';
import { useUser } from '../context/userContext';
import ToastNotification, { ToastProps } from '../components/ToastNofitication';
import CartService from '../services/CartService';

const Catalogo = () => {
    const [products, setProducts] = useState<Item[]>([]);
    const [loading, setLoading] = useState(true);
    const [categories, setCategories] = useState<ItemCategoria[]>([]);
    const [ordem, setOrdem] = useState<string | null>(null);
    const [idcategoria, setIdcategoria] = useState<number | null>(null);
    const [searchTerm, setSearchTerm] = useState<string>('');
    const [, setCart] = useState<Cart[]>([]);
    const [toasts, setToasts] = useState<ToastProps[]>([]);

    const endpoint = process.env.REACT_APP_ENDPOINT;

    const { user } = useUser();

      const fetchCartItems = useCallback(async () => {
        if (user) {
            const fetchedCart = await CartService.fetchCartItems();
            if (fetchedCart) {
                setCart(fetchedCart.filter((i: Cart) => String(i.idUsuario) === String(user.id)));
            } else {
                console.log("Não fez fetch carrinho!");
                setCart([]);
            }
        }
    }, [user]);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const res = await axios.get(`${endpoint}/get-products.php`, {
                    params: { ordem, categoriaId: idcategoria, searchTerm },
                    withCredentials: true
                });
                setProducts(res.data);
                setLoading(false);
            } catch (error) {
                console.log("Erro ao buscar produtos:", error);
            }
        };

        const fetchCategories = async () => {
            try {
                const res = await axios.get(`${endpoint}/get-categorias.php`);
                if (res.data.success){
                    console.log("OK")
                    setCategories(res.data.value);
                } else {
                    console.log("erro ao escolher categorias");
                }
            } catch (error) {
                console.log("Erro ao buscar categorias:", error);
            }
        };

        fetchCategories();
        fetchProducts();
        fetchCartItems();
    }, [user, idcategoria, ordem, searchTerm, fetchCartItems, endpoint]); 



    // const getTotalCarrinho = () => {
    //     return cart && cart.length > 0 ? cart.reduce((total, item) => total + item.quantidade, 0) : 0;
    // };

    const renderLoading = () => (
        <img height="50px" src="gif-loading.gif" alt="loading gif" />
    );

    const renderFilters = () => (
        <div className="filters-search-bar">
            <div className="search-input">
                <input
                    type="text"
                    placeholder="Pesquisar produtos..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>
            <div className="filters">
                <select
                    id="categoria"
                    onChange={(e) => setIdcategoria(Number(e.target.value))}
                    value={idcategoria ?? ''}
                >
                    <option value="">Filtre por uma Categoria</option>
                    {categories.map((categoria, i) => (
                        <option key={i} value={categoria.id}>{categoria.nome}</option>
                    ))}
                </select>
                <select
                    id="ordem"
                    onChange={(e) => setOrdem(e.target.value)}
                    value={ordem ?? ''}
                >
                    <option value="">Ordenar por</option>
                    <option value="ASC">Menor Preço</option>
                    <option value="DESC">Maior Preço</option>
                </select>
            </div>
        </div>
    );

    const renderProductCards = () => {
        const center = "d-flex align-items-center justify-content-center";

        if (loading) {
            return (
                <div className={`container ${center}`}>
                    {renderLoading()}
                </div>
            );
        }

        if (!Array.isArray(products) || products.length === 0) {
            return (
                <div className={`container ${center}`}>
                    <p className="text-center">Nenhum produto encontrado!</p>
                </div>
            );
        }

        return (
            <div className={`container`}>
                <div className={`row ${center}`} style={{ position: "relative" }}>
                    {Array.isArray(products) && products.length > 0 ? (
                        products.map((produto, i) => (
                            <ProductCard
                                key={i}
                                produto={produto}
                                onAddToCart={async () => {
                                    if (user) {
                                        await CartService.addToCart(user.id, produto, 1);
                                        const newToast = {
                                            id: Date.now(),
                                            title: `Produto [${produto.id}] adicionado`,
                                            description: "Produto inserido no carrinho",
                                            color: "green",
                                            png: "✅",
                                        };
                                        setToasts((prevToasts) => [...prevToasts, newToast]);
                                        await fetchCartItems();
                                    }
                                }}
                            />
                        ))
                    ) : (
                        <p className="text-center">Nenhum produto encontrado!</p>
                    )}
                </div>
            </div>
        );
    };

    // const renderProductCards = () => {
    //     const center = "d-flex align-items-center justify-content-center";
    //     return (
    //     <div className={`container ${loading ? center : ""}`}>
    //         {loading 
    //         ? renderLoading()
    //         : <div className={`row ${center}`} style={{ position: "relative" }}>
    //             {Array.isArray(products) 
    //             ? products.map((produto, i) => (
    //                 <ProductCard
    //                     key={i}
    //                     produto={produto}
    //                     onAddToCart={async () => {
    //                         if (user) {
    //                             await CartService.addToCart(user.id, produto, 1);
    //                             const newToast = {
    //                                 id: Date.now(),
    //                                 title: `Produto [${produto.id}] adicionado`,
    //                                 description: "Produto inserido no carrinho",
    //                                 color: "green",
    //                                 png: "✅"
    //                             };
    //                             setToasts(prevToasts => [...prevToasts, newToast]);
    //                             await fetchCartItems();
    //                         }
    //                     }}
    //                 />
    //             ))
    //             : <p>Nenhum produto encontrado!</p>
    //             }
    //         </div>
    //         }
    //     </div>
    // )}

    return (
        <main className="catalogo-container">
            <h1>Catálogo de Produtos</h1>
            {renderFilters()}
            {renderProductCards()}
            {toasts.map(toast => (
                <ToastNotification
                    key={toast.id}
                    id={toast.id}
                    title={toast.title}
                    description={toast.description}
                    color={toast.color}
                    png={toast.png}
                />
            ))}
        </main>
    );
};

export default Catalogo;

