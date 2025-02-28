import { useState } from 'react';
import { Cartfull } from "../types/cart";
import "../styles/css/cartproductcard.css";
import Utils from '../types/Utils';

export const CartProductCard = ({ cartItem, onRemove, updateQuantity }: {
    cartItem: Cartfull,
    onRemove: (id: number) => void
    updateQuantity: (idItem: number, quantidade: number) => void
}) => {
    const {
        nomeItem, descricaoItem, precoItem, categoriaItem,
        subcategoriaItem, fotoItem, quantidade, idItem
    } = cartItem;

    const [newQuantity, setNewQuantity] = useState(quantidade);

    const handleIncreaseQuantity = () => {
        const updatedQuantity = newQuantity + 1;
        setNewQuantity(updatedQuantity);
        updateQuantity(idItem, updatedQuantity);
    };

    const handleDecreaseQuantity = () => {
        if (newQuantity > 1) {
            const updatedQuantity = newQuantity - 1;
            setNewQuantity(updatedQuantity);
            updateQuantity(idItem, updatedQuantity)
        }
    };


    return (
        <div className="produto-carrinho-card">
            <div className="produto-image">
                {fotoItem ? (
                    <img
                        src={`data:image/png;base64,${fotoItem}`}
                        alt={nomeItem}
                    />
                ) : (
                    <span>Sem imagem</span>
                )}
            </div>


            <div className="produto-metadados">
                <h5>{nomeItem}</h5>
                <p>{descricaoItem}</p>
                <p> {categoriaItem} &gt; {subcategoriaItem} </p>
                <p> <strong>Preço Unitário:</strong> {Utils.formatPrice(precoItem)} </p>
                <p> <strong>Quantidade:</strong> {quantidade} </p>
                <p> <strong>SubTotal:</strong> {Utils.formatPrice(precoItem * quantidade)} </p>
            </div>

            <div className="produto-botoes">
                <div className="produto-inc-dec-botoes">
                    <button
                        className="btn btn-danger"
                        onClick={handleDecreaseQuantity}
                        style={{ width: "40px", margin: "0 5px" }}
                    >
                        -
                    </button>
                    <span>{newQuantity}</span>
                    <button
                        className="btn btn-success"
                        onClick={handleIncreaseQuantity}
                        style={{ width: "40px", margin: "0 5px" }}
                    >
                        +
                    </button>
                </div>

                <button className="btn btn-primary" onClick={() => onRemove(idItem)}>
                    Remover
                </button>
            </div>
        </div>
    );
}

export default CartProductCard;
