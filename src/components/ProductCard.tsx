import type {Item} from '../types/item';

const ProductCard = (produto: Item) => {
    console.log("produto: (" + produto.id + "): " + produto.nome);
    return (
        <div className="col-md-4">
            <div className="card">
                <img
                    src={`data:image/png;base64,${produto.foto}`}
                    alt={produto.nome}
                    className="card-img-top"
                />
                <div className="card-body">
                    <h5 className="card-title">{produto.nome}</h5>
                    <p className="card-text">{produto.idSubCategoria}</p>
                    <p className="card-text">{produto.descricao}</p>
                    <p className="card-text">Preço: R$ {produto.preco}</p>
                </div>

                <button className="btn btn-primary" onClick={() => {
                    console.log("testando ne porra")
                }}>
                    comprar
                </button>
                
                <button className="btn btn-secondary" onClick={() => {
                    console.log("testando ne porra")
                }}>
                    adicionar ao carrinho
                </button>

            </div>
        </div>
    );
};

export default ProductCard;
