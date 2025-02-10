// Estilos
import "../styles/css/productcard.css";

import { useNavigate } from "react-router-dom";
import Utils from '../types/Utils';
import type { Item } from '../types/item';

interface ProductCardProps {
    produto: Item;
    onAddToCart: () => void;
}

const ProductCard: React.FC<ProductCardProps> = ({ produto, onAddToCart }) => {
    const { nome, categoria, subcategoria, descricao, preco, foto } = produto;
    const navigate = useNavigate();

    return (
        <div className="col-md-4" >
            <div className="pc card">
                <div onClick={() => navigate(`/item/${produto.id}`)}
                    style={{ cursor: "pointer" }}>
                    <img
                        src={`data:image/png;base64,${foto}`}
                        alt={nome}
                        className="card-img-top"
                    />
                    <div className="card-body">
                        <h5 className="card-title">{nome}</h5>
                        {categoria && subcategoria
                            ? <p className="item-category">{`${categoria} > ${subcategoria}`}</p>
                            : null
                        }
                        <p className="card-text">{descricao}</p>
                        <p className="item-price">Preço: {Utils.formatPrice(preco)}</p>
                    </div>
                </div>
                <button className="botao btn btn-primary" onClick={onAddToCart}>
                    Adicionar ao carrinho
                </button>
            </div>
        </div>
    );
};

export default ProductCard;
