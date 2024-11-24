import React, { useState, useEffect } from 'react';
import { Search, Grid, List, StretchVertical, ChevronDown, Star, X, LayoutGrid } from 'lucide-react';

const ViewTypes = {
  GRID: 'grid',
  LIST: 'list',
  CAROUSEL: 'carousel'
};

const CategorySelector = ({ categories, selectedCategories, onToggle }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="p-2 rounded bg-gray-100 dark:bg-gray-700 flex items-center gap-1"
      >
        <span className="text-sm">
          {selectedCategories.length === 0 
            ? 'Categorías' 
            : `${selectedCategories.length} seleccionadas`}
        </span>
        <ChevronDown size={16} />
      </button>
      
      {isOpen && (
        <div className="absolute right-0 mt-2 bg-white dark:bg-gray-800 rounded-lg shadow-lg border dark:border-gray-700 z-50 min-w-[200px]">
          <button
            onClick={() => {
              onToggle([]);
              setIsOpen(false);
            }}
            className="w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 text-sm"
          >
            TODO
          </button>
          {categories.map(category => (
            <button
              key={category.id}
              onClick={() => {
                onToggle([category.id]);
                setIsOpen(false);
              }}
              className="w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 text-sm"
            >
              {category.name}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

const ViewSelector = ({ viewType, setViewType }) => {
  const [isOpen, setIsOpen] = useState(false);

  const icons = {
    [ViewTypes.GRID]: <Grid size={20} />,
    [ViewTypes.LIST]: <List size={20} />,
    [ViewTypes.CAROUSEL]: <StretchVertical size={20} />
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="p-2 rounded bg-gray-100 dark:bg-gray-700 flex items-center gap-1"
      >
        <LayoutGrid size={20} />
        <ChevronDown size={16} />
      </button>
      
      {isOpen && (
        <div className="absolute right-0 mt-2 bg-white dark:bg-gray-800 rounded-lg shadow-lg border dark:border-gray-700 z-50">
          {Object.entries(ViewTypes).map(([key, value]) => (
            <button
              key={key}
              onClick={() => {
                setViewType(value);
                setIsOpen(false);
              }}
              className={`w-full flex items-center gap-2 px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 ${
                viewType === value ? 'bg-blue-50 dark:bg-blue-900' : ''
              }`}
            >
              {icons[value]}
              <span className="text-sm">{key.charAt(0) + key.slice(1).toLowerCase()}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

const ProductModal = ({ product, onClose }) => {
  if (!product) return null;
  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="relative aspect-video">
          <img
            src={product.image_url || "/api/placeholder/400/400"}
            alt={product.name}
            className="w-full h-full object-cover"
          />
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 bg-white rounded-full shadow-lg hover:bg-gray-100"
          >
            <X size={20} />
          </button>
        </div>
        <div className="p-6">
          <div className="flex justify-between items-start mb-4">
            <h2 className="text-2xl font-bold dark:text-white">{product.name}</h2>
            <p className="text-xl font-bold text-blue-600 dark:text-blue-400">
              ${product.price}
            </p>
          </div>
          <p className="text-gray-600 dark:text-gray-300 mb-6">
            {product.description}
          </p>
          <button
            onClick={() => {
              console.log('Adding to cart:', product);
              onClose();
            }}
            className="w-full py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
          >
            Agregar al carrito
          </button>
        </div>
      </div>
    </div>
  );
};

const CompanyProducts = ({ productsByCategory, categories }) => {
  const [viewType, setViewType] = useState(ViewTypes.GRID);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState({});
  const [selectedProduct, setSelectedProduct] = useState(null);

  useEffect(() => {
    const filtered = {};
    Object.entries(productsByCategory).forEach(([categoryId, products]) => {
      if (selectedCategories.length === 0 || selectedCategories.includes(parseInt(categoryId))) {
        filtered[categoryId] = products.filter(product =>
          product.name.toLowerCase().includes(searchTerm.toLowerCase())
        );
      }
    });
    setFilteredProducts(filtered);
  }, [searchTerm, productsByCategory, selectedCategories]);

  const renderSearchBar = () => (
    <div className="flex items-center gap-4 p-4">
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
        <input
          type="text"
          placeholder="Buscar aquí"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:border-gray-700 dark:text-white"
        />
      </div>
      <CategorySelector 
        categories={categories}
        selectedCategories={selectedCategories}
        onToggle={setSelectedCategories}
      />
      <ViewSelector viewType={viewType} setViewType={setViewType} />
    </div>
  );

  const renderSelectedCategories = () => {
    if (selectedCategories.length === 0) return null;
    
    return (
      <div className="px-4 pb-4">
        <div className="flex flex-wrap gap-2">
          {categories
            .filter(category => selectedCategories.includes(category.id))
            .map(category => (
              <div
                key={category.id}
                className="px-3 py-1 rounded-full text-sm bg-blue-500 text-white flex items-center gap-1"
              >
                {category.name}
                <X
                  size={14}
                  className="cursor-pointer"
                  onClick={() => setSelectedCategories(prev => prev.filter(id => id !== category.id))}
                />
              </div>
            ))}
        </div>
      </div>
    );
  };

  const renderProductCard = (product) => (
    <div 
      key={product.id} 
      className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden cursor-pointer transform transition-all duration-300 hover:scale-105"
      onClick={() => setSelectedProduct(product)}
    >
      <div className="relative aspect-square">
        <img
          src={product.image_url || "/api/placeholder/400/400"}
          alt={product.name}
          className="absolute top-0 left-0 w-full h-full object-cover"
        />
        {product.featured && (
          <div className="absolute top-2 right-2">
            <Star className="text-yellow-400 fill-yellow-400" size={24} />
          </div>
        )}
        <button 
          className="absolute bottom-2 right-2 p-2 bg-blue-500 rounded-full text-white hover:bg-blue-600 transition-colors shadow-lg"
          onClick={(e) => {
            e.stopPropagation();
            console.log('Add to cart:', product);
          }}
        >
          +
        </button>
      </div>
      <div className="p-3">
        <h3 className="font-medium text-sm dark:text-white truncate">{product.name}</h3>
        <p className="text-blue-600 dark:text-blue-400 font-bold text-sm mt-1">${product.price}</p>
      </div>
    </div>
  );

  const renderGridView = () => (
    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4 p-4">
      {Object.values(filteredProducts).flat().map(renderProductCard)}
    </div>
  );

  const renderListView = () => (
    <div className="space-y-4 p-4">
      {Object.values(filteredProducts).flat().map(product => (
        <div 
          key={product.id} 
          className="flex items-center gap-4 bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 cursor-pointer hover:scale-[1.02] transition-transform"
          onClick={() => setSelectedProduct(product)}
        >
          <div className="relative w-24 h-24 flex-shrink-0">
            <img
              src={product.image_url || "/api/placeholder/400/400"}
              alt={product.name}
              className="w-full h-full object-cover rounded"
            />
            {product.featured && (
              <div className="absolute top-1 right-1">
                <Star className="text-yellow-400 fill-yellow-400" size={16} />
              </div>
            )}
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold dark:text-white">{product.name}</h3>
            <p className="text-gray-600 dark:text-gray-300 text-sm line-clamp-2">{product.description}</p>
            <p className="text-blue-600 dark:text-blue-400 font-bold mt-2">${product.price}</p>
          </div>
          <button 
            className="p-2 bg-blue-500 rounded-full text-white hover:bg-blue-600 transition-colors"
            onClick={(e) => {
              e.stopPropagation();
              console.log('Add to cart:', product);
            }}
          >
            +
          </button>
        </div>
      ))}
    </div>
  );

  const renderCarouselView = () => (
    <div className="space-y-8 p-4">
      {Object.entries(filteredProducts).map(([categoryId, products]) => {
        if (products.length === 0) return null;
        
        const category = categories.find(cat => cat.id === parseInt(categoryId));
        return (
          <div key={categoryId} className="space-y-2">
            <h2 className="font-bold text-xl dark:text-white">{category?.name || 'Productos'}</h2>
            <div className="flex overflow-x-auto scrollbar-hide snap-x snap-mandatory gap-4 pb-4">
              {products.map(product => (
                <div key={product.id} className="w-64 flex-shrink-0 snap-start">
                  {renderProductCard(product)}
                </div>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );

  return (
    <div className="w-full max-w-7xl mx-auto dark:bg-gray-900">
      {renderSearchBar()}
      {renderSelectedCategories()}
      
      {viewType === ViewTypes.GRID && renderGridView()}
      {viewType === ViewTypes.LIST && renderListView()}
      {viewType === ViewTypes.CAROUSEL && renderCarouselView()}

      {selectedProduct && (
        <ProductModal
          product={selectedProduct}
          onClose={() => setSelectedProduct(null)}
        />
      )}
    </div>
  );
};

export default CompanyProducts;