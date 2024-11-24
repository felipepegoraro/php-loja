// Estilos
import "../styles/css/productcard.css";

import Utils from '../types/Utils';
import type { Item } from '../types/item';

// import { useUser } from '../context/userContext';
import axios from 'axios';

interface ProductCardProps {
    produto: Item;
    onAddToCart: () => void;
}

export const addToCart = async (
    userId: number,
    item: Item,
    quantidade: number
): Promise<void> => {
    if (quantidade <= 0 || !item) return;

    const payload = {
        idUsuario: String(userId),
        idItem: item.id,
        quantidade: String(quantidade),
        preco: item.preco,
        status: "ativo",
    };

    try {
        const response = await axios.post("http://localhost/php-loja-back/cart-add.php", payload, {
            headers: { 'Content-Type': 'application/json' },
            withCredentials: true,
        });

        const { data } = response;
        console.log(data.success ? data.message : `Erro: ${data.message}`);
    } catch (error) {
        console.error("Erro ao adicionar ao carrinho:", error);
    }
};

const ProductCard: React.FC<ProductCardProps> = ({ produto, onAddToCart }) => {
    const { nome, categoria, subcategoria, descricao, preco, foto } = produto;

    return (
        <div className="col-md-4">
            <div className="pc card">
                <img
                    src={`data:image/png;base64,${foto}`}
                    alt={nome}
                    className="card-img-top"
                />
                <div className="card-body">
                    <h5 className="card-title">{nome}</h5>
                    { categoria && subcategoria 
                        ? <p className="card-text">{`${categoria} > ${subcategoria}`}</p>
                        : null
                    }
                    <p className="card-text">{descricao}</p>
                    <p className="card-text">Preço: {Utils.formatPrice(preco)}</p>
                </div>
                <button className="btn btn-primary" onClick={onAddToCart}>
                    Adicionar ao carrinho
                </button>
            </div>
        </div>
    );
};

export default ProductCard;
