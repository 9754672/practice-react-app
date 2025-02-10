import React from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { Heart, ShoppingCart, HeartOff, Star } from 'lucide-react';
import { products } from '@/data/mockData';
import { useFavoritesStore } from '@/store/favorites';
import { useCartStore } from '@/store/cart';
import { useReviewsStore } from '@/store/reviews';

const FavoritesPage = () => {
  const { t } = useTranslation();
  const { items: favoriteIds, removeItem: removeFavorite } = useFavoritesStore();
  const { items: cartItems, addItem } = useCartStore();

  const favoriteProducts = products.filter((product) =>
    favoriteIds.includes(product.id)
  );

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

  const getProductRating = (product: typeof products[0]) => {
    const reviews = useReviewsStore.getState().getReviews(product.id);
    
    if (!reviews || reviews.length === 0) {
      return 0;
    }
    
    return reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length;
  };

  if (favoriteProducts.length === 0) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center">
        <HeartOff className="w-16 h-16 text-gray-400 mb-4" />
        <h2 className="text-2xl font-bold mb-2">{t('favorites.empty')}</h2>
        <p className="text-gray-600 mb-6">{t('favorites.emptyMessage')}</p>
        <Link
          to="/products"
          className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
        >
          {t('favorites.continueShopping')}
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">{t('favorites.title')}</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {favoriteProducts.map((product) => {
          const rating = getProductRating(product);
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
                  onClick={() => removeFavorite(product.id)}
                  className="absolute top-2 right-2 p-2 rounded-full bg-white shadow-md hover:bg-gray-100"
                >
                  <Heart className="w-5 h-5 text-red-500 fill-current" />
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
    </div>
  );
};

export default FavoritesPage;