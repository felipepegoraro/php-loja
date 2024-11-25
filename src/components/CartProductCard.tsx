import React, { useEffect, useState } from 'react';
import { Cartfull } from "../types/cart"; 
import "../styles/css/cartproductcard.css"; 
import CartService from '../services/CartService';
import Utils from '../types/Utils';

export const CartProductCard = ({ cartItem, onRemove , updateQuantity }: { 
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
        setNewQuantity(updatedQuantity);  // Atualiza o estado
        updateQuantity(idItem, updatedQuantity);  // Envia para o backend
    };
    
    const handleDecreaseQuantity = () => {
        if (newQuantity > 1) {
            const updatedQuantity = newQuantity - 1;
            setNewQuantity(updatedQuantity);  // Atualiza o estado
            updateQuantity(idItem, updatedQuantity) // Envia para o backend
        }
    };



    return (
        <div className="card mb-3 cart-item-card">
            <div className="row g-0">
                {/* Coluna da imagem */}
                <div className="col-md-4 d-flex justify-content-center align-items-center cart-item-image-container">
                    {fotoItem ? (
                        <img src={`data:image/png;base64,${fotoItem}`} alt={nomeItem} className="img-fluid cart-item-image" />
                    ) : (
                        <div className="no-image">
                            <span>Sem imagem</span>
                        </div>
                    )}
                </div>

                {/* Coluna de detalhes */}
                <div className="col-md-8">
                    <div className="card-body">
                        <div>
                            <h5 className="card-title">{nomeItem}</h5>
                            <p className="card-text">{descricaoItem}</p>
                            
                            {/* Metadados do produto */}
                            <div className="cm cart-item-meta">
                                <p><strong>Categoria:</strong> {categoriaItem}</p>
                                <p><strong>Subcategoria:</strong> {subcategoriaItem}</p>
                            </div>

                            {/* Quantidade e preço */}
                            <div className="cart-item-quantity">
                                <p><strong>Quantidade:</strong> {quantidade}</p>
                            </div>
                            <div className="cart-item-price">
                                <p><strong>Preço:</strong> {Utils.formatPrice(precoItem * quantidade)}</p>
                            </div>
                        </div>
                        <div>
                            <button 
                                onClick={() => onRemove(idItem)} 
                                className="btn btn-danger"
                            >
                                Remover
                            </button>

                            <div className="quantity-controls">
                                <button 
                                    onClick={handleDecreaseQuantity} 
                                    className="btn btn-secondary"
                                    style={{ width: "30px" }}
                                >
                                    -
                                </button>
                                <span style={{ margin: "0 10px" }}>{newQuantity}</span>
                                <button 
                                    onClick={handleIncreaseQuantity} 
                                    className="btn btn-secondary"
                                    style={{ width: "30px" }}
                                >
                                    +
                                </button>
                          
                            </div>


                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CartProductCard;

