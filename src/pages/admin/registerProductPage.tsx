import {useEffect, useState} from 'react';
import { useUser } from '../../context/userContext';
import CategorySelector from '../../components/CategorySelector';
import axios from 'axios';
import type { Item, ItemCategoria, ItemSubcategoria } from '../../types/item';
import Utils from '../../types/Utils';

const RegisterProductPage = () => {
    const { user } = useUser();
    const [categories, setCategories] = useState<ItemCategoria[]>([]);
    const [subcategories, setSubcategories] = useState<ItemSubcategoria[]>([]);
    const [error, setError] = useState<string>('');
    const [loading, setLoading] = useState<boolean>(true);

    const [product, setProduct] = useState<Item>({
        id: 0,
        idSubCategoria: 0,
        nome: '',
        descricao: '',
        foto: null,
        preco: 0,
        nota: 0.0,
        categoria: '',
        subcategoria: '',
    });

    let endpoint = process.env.REACT_APP_ENDPOINT;

      useEffect(() => {
          setLoading(true);
          const fetchCategories = async () => {
              try {
                  const res = await axios.get(`${endpoint}/get-categorias.php`, {
                      withCredentials: true
                  });
                  if (res.data.success) {
                      setCategories(res.data.value as ItemCategoria[]);
                  } else {
                      console.log(`Erro ao carregar categorias:  ${res.data.error}`);
                  }
              } catch (e) {
                  console.log(`Erro ao buscar categorias: ${e}`);
              }
          };

          const fetchSubcategories = async () => {
              try {
                  const res = await axios.get(`${endpoint}/get-subcategorias.php`, {
                      withCredentials: true
                  });
                  console.log(`Resposta Subcategorias: ${res.data}`);
                  if (res.data.success) {
                      setSubcategories(res.data.value);
                  } else {
                      console.log(`Erro ao carregar subcategorias: ${res.data.error}`);
                  }
              } catch (err) {
                  console.log(`Erro ao buscar subcategorias: ${err}`);
              }
          };

          const fetchData = async () => {
              try {
                  await Promise.all([fetchCategories(), fetchSubcategories()]);
              } finally {
                  setLoading(false);
              }
          };

          fetchData();
      }, [user, endpoint]);


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

        try {
            await axios.post(`${endpoint}/register-product.php`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
            withCredentials: true
          });

        } catch (err) {
            setError('Erro ao cadastrar produto. Tente novamente.');
        }

        setProduct({
            id: 0,
            idSubCategoria: 0,
            nome: '',
            descricao: '',
            foto: null,
            preco: 0,
            nota: 0.0,
            categoria: '',
            subcategoria: '',
        })

        const fileInput = document.getElementById('foto') as HTMLInputElement;
        if (fileInput) fileInput.value = '';
    };

    if (!user || !user!.admin){
        return (
            <main className="container">
                <h1>ACESSO INVÁLIDO</h1>
            </main>
        );
    }

    if (loading){
        return (
            <div>loading...</div>
        )
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

        {(categories.length > 0 && subcategories.length > 0) ?  
            <CategorySelector 
                categorias={categories}
                subcategorias={subcategories}
                onCategoriaChange={handleCategoriaChange} 
                onSubcategoriaChange={handleSubcategoriaChange} 
            /> : null
        }

        <div className="form-group mt-3">
          <button type="submit" className="btn btn-primary">Cadastrar Produto</button>
        </div>
      </form>

      {error && <p className="text-danger">{error}</p>}
    </main>
  );
};

export default RegisterProductPage;

