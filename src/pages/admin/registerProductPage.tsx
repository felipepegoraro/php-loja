import {useEffect, useState} from 'react';
import { useUser } from '../../context/userContext';
import CategorySelector from '../../components/CategorySelector';
import axios from 'axios';
import type { Item, ItemCategoria, ItemSubcategoria } from '../../types/item';

const RegisterProductPage = () => {
    const { user } = useUser();
    const [categories, setCategories] = useState<ItemCategoria[]>([]);
    const [subcategories, setSubcategories] = useState<ItemSubcategoria[]>([]);
    const [error, setError] = useState<string>('');

    const [product, setProduct] = useState<Item>({
        id: 0,
        idSubCategoria: 0,
        nome: '',
        descricao: '',
        foto: null,
        preco: 0,
        categoria: '',
        subcategoria: '',
    });

    useEffect(()=>{
        const fetchCategories = async () => {
            try {
                const {data} = await axios.get("http://localhost/php-loja-back/get-categorias.php");    
                setCategories(data);
            } catch(e){
                console.log("erro ao buscar categorias: ", e);
            }
        };
        
        const fetchSubcategories = async () => {
            try {
                const { data } = await axios.get('http://localhost/php-loja-back/get-subcategorias.php');
                setSubcategories(data);
            } catch (err) {
                console.error("erro ao buscar subcategorias", err);
            }
        };

        fetchCategories();
        fetchSubcategories();
    },[]);

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
        const selectedCategorie = categories.find(cat => String(cat.id) === categoriaId);
        if (selectedCategorie){
            setProduct(prevState => ({
                ...prevState,
                categoria: selectedCategorie?.nome
            }));
        }
    };

    const handleSubcategoriaChange = (subcategoriaId: string) => {
        const selectedSubcategorie = subcategories.find(subcat => String(subcat.id) === subcategoriaId);
        if (selectedSubcategorie){
            setProduct(prevState => ({
                ...prevState,
                idSubCategoria: selectedSubcategorie?.id,
                subcategoria: selectedSubcategorie?.nome
            }));
        }
    };

    const handleFormSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const formData = new FormData();

        formData.append('nome', product.nome);
        formData.append('descricao', product.descricao);
        formData.append('preco', String(product.preco));
        formData.append('categoria', product.categoria);
        formData.append('idSubCategoria', String(product.idSubCategoria));
        formData.append('subcategoria', product.subcategoria);

        if (product.foto) formData.append('foto', product.foto as Blob);

        console.log(formData);

        try {
            const response = await axios.post('http://localhost/php-loja-back/register-product.php', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
            withCredentials: true
          });

          console.log(response);
        } catch (err) {
            setError('Erro ao cadastrar produto. Tente novamente.');
        }
    };


    if (!user || !user!.admin){
        return (
            <main className="container">
                <h1>ACESSO INVÁLIDO</h1>
            </main>
        );
    }


    return (
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
  );
};

export default RegisterProductPage;

