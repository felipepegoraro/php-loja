import { useUser } from '../../context/userContext';
import { useState } from 'react';
import CategorySelector from '../../components/CategorySelector';
import axios from 'axios';
import type { Item } from '../../types/item';

const RegisterProductPage = () => {
  const { user } = useUser();
  const [product, setProduct] = useState<Item>({} as Item);
  const [error, setError] = useState<string>('');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target;
    setProduct(prevState => ({
      ...prevState,
      [id]: id === 'preco' ? parseFloat(value) || 0 : value,
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target && e.target.files) {
      setProduct(prevState => ({
        ...prevState,
        foto: e.target.files?.item(0),
      }) as Item);
    }
  };

  const handleCategoriaChange = (categoriaId: string) => {
    setProduct(prevState => ({
      ...prevState,
      categoria: categoriaId
    }));
  };

  const handleSubcategoriaChange = (subcategoriaId: string) => {
    setProduct(prevState => ({
      ...prevState,
      subcategoria: subcategoriaId
    }));
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append('nome', product.nome);
    formData.append('descricao', product.descricao);
    formData.append('preco', String(product.preco));
    formData.append('foto', product.foto as Blob);
    formData.append('subcategoria', product.subcategoria);

    try {
      const response = await axios.post('http://localhost/php-loja-back/register-product.php', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      console.log(response.data);
    } catch (err) {
      setError('Erro ao cadastrar produto. Tente novamente.');
    }
  };

  return user?.admin ? (
    <main className="container">
      <h2>Cadastrar Produto</h2>

      <form onSubmit={handleFormSubmit}>
        <div className="form-group">
          <label htmlFor="nome">Nome do Produto</label>
          <input
            type="text"
            id="nome"
            className="form-control"
            placeholder="Nome do produto"
            value={product.nome}
            onChange={handleInputChange}
          />
        </div>

        <div className="form-group">
          <label htmlFor="preco">Preço</label>
          <input
            type="number"
            id="preco"
            className="form-control"
            placeholder="Preço"
            value={product.preco}
            onChange={handleInputChange}
          />
        </div>

        <div className="form-group">
          <label htmlFor="descricao">Descrição</label>
          <textarea
            id="descricao"
            className="form-control"
            placeholder="Descrição do produto"
            value={product.descricao}
            onChange={handleInputChange}
          />
        </div>

        <div className="form-group">
          <label htmlFor="foto">Foto</label>
          <input
            type="file"
            id="foto"
            className="form-control"
            accept="image/*"
            onChange={handleFileChange}
          />
        </div>

        <CategorySelector 
          onCategoriaChange={handleCategoriaChange} 
          onSubcategoriaChange={handleSubcategoriaChange} 
        />

        <div className="form-group mt-3">
          <button type="submit" className="btn btn-primary">Cadastrar Produto</button>
        </div>
      </form>

      {error && <p className="text-danger">{error}</p>}
    </main>
  ) : (
    <p>Você não tem permissão para acessar esta página.</p>
  );
};

export default RegisterProductPage;

