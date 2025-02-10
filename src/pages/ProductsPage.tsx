import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Link, useSearchParams, useLocation } from 'react-router-dom';
import { ChevronRight, Star, ShoppingCart, Heart, ArrowUpDown } from 'lucide-react';
import { categories, products } from '../data/mockData';
import { useCartStore } from '@/store/cart';
import { useSearchStore } from '@/store/search';
import { useFavoritesStore } from '@/store/favorites';
import { useReviewsStore } from '@/store/reviews';

type SortOption = 'price-asc' | 'price-desc' | 'rating-asc' | 'rating-desc';

const ProductsPage = () => {
  const { t } = useTranslation();
  const location = useLocation();
  const { items: cartItems, addItem } = useCartStore();
  const { addItem: addToFavorites, removeItem: removeFromFavorites, hasItem: isFavorite } = useFavoritesStore();
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedSubcategory, setSelectedSubcategory] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<SortOption>('price-asc');
  const [searchParams] = useSearchParams();
  const { query, setQuery } = useSearchStore();

  useEffect(() => {
    const searchQuery = searchParams.get('search');
    if (searchQuery) {
      setQuery(searchQuery);
    }

    const categoryFromState = (location.state as any)?.selectedCategory;
    if (categoryFromState) {
      setSelectedCategory(categoryFromState);
    }
  }, [searchParams, setQuery, location.state]);

  const getBreadcrumbs = () => {
    const breadcrumbs = [
      { name: t('nav.home'), path: '/' },
      { name: t('nav.products'), path: '/products' },
    ];

    if (selectedCategory) {
      breadcrumbs.push({
        name: t(`products.categoryNames.${selectedCategory.toLowerCase().replace(/[& ]/g, '')}`),
        path: `/products?category=${selectedCategory}`,
      });
    }

    if (selectedSubcategory) {
      breadcrumbs.push({
        name: t(`products.categoryNames.${selectedSubcategory.toLowerCase().replace(/[& ]/g, '')}`),
        path: `/products?category=${selectedCategory}&subcategory=${selectedSubcategory}`,
      });
    }

    return breadcrumbs;
  };

  const handleCategoryClick = (category: string | null, subcategory: string | null = null) => {
    setSelectedCategory(category);
    setSelectedSubcategory(subcategory);
  };

  const getProductRating = (productId: string) => {
    const reviews = useReviewsStore.getState().getReviews(productId);
    if (!reviews || reviews.length === 0) {
      return 0;
    }
    return reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length;
  };

  const filteredProducts = products.filter((product) => {
    const matchesSearch = !query || 
      product.name.toLowerCase().includes(query.toLowerCase()) ||
      product.description.toLowerCase().includes(query.toLowerCase()) ||
      product.category.toLowerCase().includes(query.toLowerCase());

    const matchesCategory = !selectedCategory || product.category === selectedCategory;
    const matchesSubcategory = !selectedSubcategory || product.subcategory === selectedSubcategory;

    return matchesSearch && matchesCategory && matchesSubcategory;
  });

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    switch (sortBy) {
      case 'price-asc':
        return a.price - b.price;
      case 'price-desc':
        return b.price - a.price;
      case 'rating-asc':
        return getProductRating(a.id) - getProductRating(b.id);
      case 'rating-desc':
        return getProductRating(b.id) - getProductRating(a.id);
      default:
        return 0;
    }
  });

  const handleAddToCart = (product: typeof products[0]) => {
    const cartItem = cartItems.find(item => item.id === product.id);
    if (cartItem && cartItem.quantity >= product.stock) {
      alert(t('product.exceedsStock'));
      return;
    }
    
    addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      quantity: 1,
      image: product.images[0],
    });
  };

  const toggleFavorite = (productId: string) => {
    if (isFavorite(productId)) {
      removeFromFavorites(productId);
    } else {
      addToFavorites(productId);
    }
  };

  const breadcrumbs = getBreadcrumbs();

  return (
    <div className="flex gap-8">
      <div className="w-64 flex-shrink-0">
        <h2 className="text-xl font-bold mb-4">{t('products.categories')}</h2>
        <div className="space-y-4">
          {categories.map((category) => (
            <div key={category.id}>
              <button
                onClick={() => handleCategoryClick(category.name)}
                className={`w-full text-left font-semibold p-2 rounded hover:bg-gray-100 ${
                  selectedCategory === category.name ? 'bg-gray-100' : ''
                }`}
              >
                {t(`products.categoryNames.${category.name.toLowerCase().replace(/[& ]/g, '')}`)}
              </button>
              {selectedCategory === category.name && (
                <div className="ml-4 mt-2 space-y-2">
                  {category.subcategories.map((sub) => (
                    <button
                      key={sub.id}
                      onClick={() => handleCategoryClick(category.name, sub.name)}
                      className={`w-full text-left p-2 rounded text-sm hover:bg-gray-100 ${
                        selectedSubcategory === sub.name ? 'bg-gray-100' : ''
                      }`}
                    >
                      {t(`products.categoryNames.${sub.name.toLowerCase().replace(/[& ]/g, '')}`)}
                    </button>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="flex-1">
        <div className="flex items-center gap-2 text-sm text-gray-600 mb-6">
          {breadcrumbs.map((crumb, index) => (
            <React.Fragment key={crumb.path}>
              {index > 0 && <ChevronRight className="w-4 h-4" />}
              <Link
                to={crumb.path}
                onClick={(e) => {
                  if (index === 2) {
                    e.preventDefault();
                    handleCategoryClick(selectedCategory, null);
                  } else if (index === 1) {
                    e.preventDefault();
                    handleCategoryClick(null, null);
                  }
                }}
                className="hover:text-blue-600 transition-colors"
              >
                {crumb.name}
              </Link>
            </React.Fragment>
          ))}
        </div>

        <div className="mb-6 flex items-center gap-4">
          <div className="flex items-center gap-2">
            <ArrowUpDown className="w-5 h-5 text-gray-500" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as SortOption)}
              className="border rounded-lg px-3 py-2 bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="price-asc">{t('products.sort.priceAsc')}</option>
              <option value="price-desc">{t('products.sort.priceDesc')}</option>
              <option value="rating-asc">{t('products.sort.ratingAsc')}</option>
              <option value="rating-desc">{t('products.sort.ratingDesc')}</option>
            </select>
          </div>
          <span className="text-sm text-gray-500">
            {sortedProducts.length} {t('products.itemsFound')}
          </span>
        </div>

        {sortedProducts.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-600">{t('products.noResults')}</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {sortedProducts.map((product) => {
              const rating = getProductRating(product.id);
              const cartItem = cartItems.find(item => item.id === product.id);
              const isOutOfStock = cartItem && cartItem.quantity >= product.stock;
              
              return (
                <div key={product.id} className="bg-white rounded-lg shadow-md overflow-hidden group">
                  <div className="relative">
                    <Link to={`/products/${product.id}`}>
                      <div className="aspect-square overflow-hidden">
                        <img
                          src={product.images[0]}
                          alt={product.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      </div>
                    </Link>
                    <button
                      onClick={() => toggleFavorite(product.id)}
                      className="absolute top-2 right-2 p-2 rounded-full bg-white shadow-md hover:bg-gray-100"
                    >
                      <Heart
                        className={`w-5 h-5 ${
                          isFavorite(product.id)
                            ? 'text-red-500 fill-current'
                            : 'text-gray-400'
                        }`}
                      />
                    </button>
                  </div>
                  <div className="p-4 flex flex-col h-[160px]">
                    <Link to={`/products/${product.id}`} className="flex-grow">
                      <h3 className="font-semibold text-lg mb-1 hover:text-blue-600 transition-colors line-clamp-2">
                        {product.name}
                      </h3>
                    </Link>
                    <div className="mt-auto">
                      <div className="flex items-center mb-2">
                        <Star className="w-4 h-4 text-yellow-400 fill-current" />
                        <span className="ml-1 text-sm text-gray-600">{rating.toFixed(1)}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <p className="text-lg font-bold">${product.price}</p>
                        <button
                          onClick={() => handleAddToCart(product)}
                          disabled={isOutOfStock}
                          className={`p-2 rounded-full text-white transition-colors ${
                            isOutOfStock 
                              ? 'bg-gray-400 cursor-not-allowed' 
                              : 'bg-blue-600 hover:bg-blue-700'
                          }`}
                        >
                          <ShoppingCart className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductsPage;