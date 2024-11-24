import React, { useState } from 'react';
import { Cartfull } from "../types/cart"; 
import "../styles/css/cartproductcard.css"; 

import Utils from '../types/Utils';

export const CartProductCard = ({ cartItem, onRemove }: { 
    cartItem: Cartfull,
    onRemove: (id: number) => void 
}) => {
    const { 
        nomeItem, descricaoItem, precoItem, categoriaItem,
        subcategoriaItem, fotoItem, quantidade, idItem
    } = cartItem;

    const [newQuantity, setNewQuantity] = useState(quantidade);

    const handleQuantityChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setNewQuantity(Number(event.target.value));
    };

    const handleSaveQuantity = () => {
        console.log(`Salvar quantidade: ${newQuantity}`);
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

                            <div>
                                <p>Trocar quantidade</p>
                                <input 
                                    type="number" 
                                    min="1" 
                                    value={newQuantity} 
                                    onChange={handleQuantityChange} 
                                    style={{ width: "100px" }} 
                                />
                                <button 
                                    onClick={handleSaveQuantity} 
                                    className="btn btn-primary"
                                >
                                    Salvar
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

