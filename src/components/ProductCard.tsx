import type {Item} from '../types/item';
import {useUser} from '../context/userContext';
import axios from 'axios';

export const addToCart = async (
    userId: number,
    item: Item,
    quantidade: number
) => {
    if (quantidade <= 0 || !item) return;

    const obj = {
        'idUsuario': String(userId),
        'idItem': item.id,
        'quantidade': String(quantidade),
        'preco': item.preco,
        'status': "ativo"
    }

    try {
        const res = await axios.post("http://localhost/php-loja-back/cart-add.php", obj, { 
                headers: { 'Content-Type': 'application/json' },
                withCredentials: true
            }
        );

        console.log(res.data);
        if (res.data.success) console.log(res.data.message);
        else console.log("erro: ", res.data.message);

    } catch(e) {
        console.log("erro ao adicionar no carrinho: ", e);
    };
};

interface ProductCardProps {
    produto: Item;
    addCartFunction: () => void;
};

const ProductCard = (props: ProductCardProps) => {
    const {produto, addCartFunction} = props;
    const {user} = useUser();

    return user && (
        <div className="col-md-4">
            <div className="card">
                <img
                    style={{
                        width: "100%",
                        height: "250px",
                        objectFit: "contain",
                        background: "#eff"
                    }}
                    src={`data:image/png;base64,${produto.foto}`}
                    alt={produto.nome}
                    className="card-img-top"
                />
                <div className="card-body">
                    <h5 className="card-title">{produto.nome}</h5>
                    <p className="card-text">{produto.categoria + " > " + produto.subcategoria}</p>
                    <p className="card-text">{produto.descricao}</p>
                    <p className="card-text">Preço: R$ {produto.preco}</p>
                </div>

                <button className="btn btn-primary" onClick={() => {
                    console.log("testando ne porra")
                }}>
                    comprar
                </button>
                
                <button className="btn btn-secondary" onClick={async () => addCartFunction()}>
                    adicionar ao carrinho
                </button>
            </div>
        </div>
    );
};

export default ProductCard;
