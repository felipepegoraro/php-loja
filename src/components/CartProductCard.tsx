import React from 'react';
import { Cartfull } from "../types/cart"; 
import "../styles/css/cartproductcard.css";  // Estilos adicionais

const formatPrice = (price: number): string => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(price);
};

export const CartProductCard: React.FC<{ cartItem: Cartfull }> = ({ cartItem }) => {
  const { nomeItem, descricaoItem, precoItem, categoriaItem, subcategoriaItem, fotoItem, quantidade } = cartItem;

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
              <p><strong>Preço:</strong> {formatPrice(precoItem * quantidade)}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartProductCard;
