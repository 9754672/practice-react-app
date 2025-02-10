import React from 'react';
import { useTranslation } from 'react-i18next';
import { Link, useNavigate } from 'react-router-dom';
import { Star, ShoppingCart, Heart } from 'lucide-react';
import { products } from '../data/mockData';
import { useCartStore } from '@/store/cart';
import { useSearchStore } from '@/store/search';
import { useFavoritesStore } from '@/store/favorites';
import { useReviewsStore } from '@/store/reviews';

type SortOption = 'price-asc' | 'price-desc' | 'rating-asc' | 'rating-desc';

const HomePage = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { items: cartItems, addItem } = useCartStore();
  const { addItem: addToFavorites, removeItem: removeFromFavorites, hasItem: isFavorite } = useFavoritesStore();

  const bestSellers = products.slice(0, 4);
  const recentPurchases = products.slice(2, 6);

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

  const getProductRating = (product: typeof products[0]) => {
    const reviews = useReviewsStore.getState().getReviews(product.id);
    
    if (!reviews || reviews.length === 0) {
      return 0;
    }
    
    return reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length;
  };

  const categories = [
    {
      id: '1',
      name: t('products.categoryNames.electronics'),
      image: 'https://images.unsplash.com/photo-1498049794561-7780e7231661?w=800',
      description: `${t('products.categoryNames.smartphones')}, ${t('products.categoryNames.laptops')}, ${t('products.categoryNames.accessories')}`,
      color: 'from-blue-600 to-blue-700',
      category: 'Electronics'
    },
    {
      id: '2',
      name: t('products.categoryNames.clothing'),
      image: 'https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?w=800',
      description: `${t('products.categoryNames.men')}, ${t('products.categoryNames.women')}, ${t('products.categoryNames.kids')}`,
      color: 'from-blue-600 to-blue-700',
      category: 'Clothing'
    },
    {
      id: '3',
      name: t('products.categoryNames.homeAndGarden'),
      image: 'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?w=800',
      description: `${t('products.categoryNames.furniture')}, ${t('products.categoryNames.decor')}, ${t('products.categoryNames.kitchen')}`,
      color: 'from-blue-600 to-blue-700',
      category: 'Home & Garden'
    },
  ];

  const handleCategoryClick = (category: string) => {
    navigate(`/products`, { state: { selectedCategory: category } });
  };

  const ProductCard = ({ product }: { product: typeof products[0] }) => {
    const rating = getProductRating(product);
    const cartItem = cartItems.find(item => item.id === product.id);
    const isOutOfStock = cartItem && cartItem.quantity >= product.stock;
    
    return (
      <div className="bg-white rounded-lg shadow-md overflow-hidden group">
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
  };

  return (
    <div className="space-y-12">
      {/* Categories Grid */}
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {categories.map((category) => (
          <button
            key={category.id}
            onClick={() => handleCategoryClick(category.category)}
            className="relative overflow-hidden rounded-2xl shadow-lg group cursor-pointer"
          >
            <div className="aspect-[4/3] overflow-hidden">
              <div className={`absolute inset-0 bg-gradient-to-r ${category.color} opacity-90 z-10`} />
              <img
                src={category.image}
                alt={category.name}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
              />
              <div className="absolute inset-0 p-6 flex flex-col justify-between z-20">
                <h2 className="text-2xl font-bold text-white">{category.name}</h2>
                <p className="text-white/90">{category.description}</p>
              </div>
            </div>
          </button>
        ))}
      </section>

      <section className="py-12">
        <h2 className="text-3xl font-bold mb-8">{t('home.bestSellers')}</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {bestSellers.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      <section className="py-12">
        <h2 className="text-3xl font-bold mb-8">{t('home.recentlyPurchased')}</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {recentPurchases.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>
    </div>
  );
};

export default HomePage;