import { useEffect, useState } from 'react';
// import axios from 'axios';
import type { ItemCategoria, ItemSubcategoria } from '../types/item';

interface CategorySelectorProps {
    categorias: ItemCategoria[];
    subcategorias: ItemSubcategoria[];
    onCategoriaChange: (categoriaId: string) => void;
    onSubcategoriaChange: (subcategoriaId: string) => void;
}

const CategorySelector: React.FC<CategorySelectorProps> = ({
    categorias,
    subcategorias,
    onCategoriaChange,
    onSubcategoriaChange 
}) => {
  const [selectedCategoria, setSelectedCategoria] = useState<string>('');
  const [filteredSubcategorias, setFilteredSubcategorias] = useState<ItemSubcategoria[]>([]);

  useEffect(() => {
    if (selectedCategoria) {
      const filtered = subcategorias.filter(sub => sub.idCategoria.toString() === selectedCategoria);
      setFilteredSubcategorias(filtered);
    } else {
      setFilteredSubcategorias([]);
    }
  }, [selectedCategoria, subcategorias]);

  const handleCategoriaChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const categoriaId = e.target.value;
    setSelectedCategoria(categoriaId);
    onCategoriaChange(categoriaId);
  };

  const handleSubcategoriaChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onSubcategoriaChange(e.target.value);
  };

  return (
    <div>
      <div className="form-group">
        <label htmlFor="categoriaSelect">Categoria</label>
        <select
          id="categoriaSelect"
          className="form-control"
          value={selectedCategoria}
          onChange={handleCategoriaChange}
        >
          <option value="">Selecione uma Categoria</option>
          {Array.isArray(categorias) && categorias.map((categoria) => (
            <option key={categoria.id} value={categoria.id}>
              {categoria.nome}
            </option>
          ))}
        </select>
      </div>

      <div className="form-group mt-3">
        <label htmlFor="subcategoriaSelect">Subcategoria</label>
        <select
          id="subcategoriaSelect"
          className="form-control"
          onChange={handleSubcategoriaChange}
          disabled={!selectedCategoria}
        >
          <option value="">Selecione uma Subcategoria</option>
          {Array.isArray(subcategorias) && filteredSubcategorias.length > 0 ? (
            filteredSubcategorias.map((sub) => (
              <option key={sub.id} value={sub.id}>
                {sub.nome}
              </option>
            ))
          ) : (
            <option disabled>Selecione uma categoria para ver subcategorias</option>
          )}
        </select>
      </div>
    </div>
  );
};

export default CategorySelector;
