import React, { useState, useEffect, useCallback } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ChevronRight, Star, Minus, Plus, ShoppingCart, Heart, Send, ChevronLeft } from 'lucide-react';
import { products } from '../data/mockData';
import { useCartStore } from '@/store/cart';
import { useFavoritesStore } from '@/store/favorites';
import { useReviewsStore } from '@/store/reviews';
import { useUserStore } from '@/store/user';

const ProductPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const addItem = useCartStore((state) => state.addItem);
  const { addItem: addToFavorites, removeItem: removeFromFavorites, hasItem: isFavorite } = useFavoritesStore();
  const { addReview, getReviews } = useReviewsStore();
  const reviews = getReviews(id!);
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);
  const [isZoomed, setIsZoomed] = useState(false);
  const [zoomPosition, setZoomPosition] = useState({ x: 0, y: 0 });
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState('');
  const [reviewName, setReviewName] = useState('');
  const { user } = useUserStore();

  const product = products.find((p) => p.id === id);

  if (!product) {
    return <div>Product not found</div>;
  }

  const averageRating = reviews.length > 0
    ? reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length
    : 0;

  const handleAddToCart = () => {
    if (quantity > product.stock) {
      alert(t('product.exceedsStock'));
      return;
    }
    addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      quantity,
      image: product.images[0],
    });
  };

  const handleBuyNow = () => {
    if (quantity > product.stock) {
      alert(t('product.exceedsStock'));
      return;
    }
    navigate('/checkout', {
      state: {
        buyNowItem: {
          id: product.id,
          name: product.name,
          price: product.price,
          quantity,
          image: product.images[0],
        }
      }
    });
  };

  const toggleFavorite = () => {
    if (isFavorite(product.id)) {
      removeFromFavorites(product.id);
    } else {
      addToFavorites(product.id);
    }
  };

  const handleQuantityChange = (delta: number) => {
    const newQuantity = Math.max(1, Math.min(product.stock, quantity + delta));
    setQuantity(newQuantity);
  };

  const handleSubmitReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewName.trim()) {
      alert(t('product.nameRequired'));
      return;
    }

    addReview(product.id, {
      userName: reviewName,
      rating: reviewRating,
      comment: reviewComment,
      date: new Date().toISOString().split('T')[0],
    });

    setReviewComment('');
    setReviewName('');
    setReviewRating(5);
  };

  const handleImageNavigation = useCallback((direction: 'prev' | 'next') => {
    setSelectedImage((prev) => {
      if (direction === 'prev') {
        return prev > 0 ? prev - 1 : product.images.length - 1;
      } else {
        return prev < product.images.length - 1 ? prev + 1 : 0;
      }
    });
  }, [product.images.length]);

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (e.key === 'ArrowLeft') {
      handleImageNavigation('prev');
    } else if (e.key === 'ArrowRight') {
      handleImageNavigation('next');
    } else if (e.key === 'Escape' && isZoomed) {
      setIsZoomed(false);
    }
  }, [handleImageNavigation, isZoomed]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [handleKeyDown]);

  useEffect(() => {
    if (user && user.firstName && user.lastName) {
      setReviewName(`${user.firstName} ${user.lastName}`);
    }
  }, [user]);

  const handleImageClick = () => {
    setIsZoomed(!isZoomed);
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isZoomed) return;

    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;

    setZoomPosition({ x, y });
  };

  return (
    <div className="space-y-8">
      {/* Breadcrumbs */}
      <div className="flex items-center gap-2 text-sm text-gray-600">
        <Link to="/" className="hover:text-blue-600">
          {t('nav.home')}
        </Link>
        <ChevronRight className="w-4 h-4" />
        <Link to="/products" className="hover:text-blue-600">
          {t('nav.products')}
        </Link>
        <ChevronRight className="w-4 h-4" />
        <span>{product.name}</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-4">
          <div className="relative">
            <div
              className={`aspect-square rounded-lg overflow-hidden cursor-zoom-in relative ${
                isZoomed ? 'fixed inset-0 z-50 bg-black/90 cursor-zoom-out' : ''
              }`}
              onClick={handleImageClick}
              onMouseMove={handleMouseMove}
            >
              <img
                src={product.images[selectedImage]}
                alt={product.name}
                className={`w-full h-full ${
                  isZoomed 
                    ? 'object-none scale-150'
                    : 'object-cover'
                }`}
                style={
                  isZoomed
                    ? {
                        objectPosition: `${zoomPosition.x}% ${zoomPosition.y}%`,
                        transition: 'none'
                      }
                    : undefined
                }
              />
            </div>
            
            <button
              onClick={() => handleImageNavigation('prev')}
              className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/80 p-2 rounded-full shadow-md hover:bg-white"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
            <button
              onClick={() => handleImageNavigation('next')}
              className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/80 p-2 rounded-full shadow-md hover:bg-white"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          </div>

          <div className="flex gap-4 overflow-x-auto pb-2">
            {product.images.map((image, index) => (
              <button
                key={index}
                className={`relative aspect-square w-20 flex-shrink-0 rounded-lg overflow-hidden ${
                  selectedImage === index ? 'ring-2 ring-blue-600' : ''
                }`}
                onClick={() => setSelectedImage(index)}
              >
                <img 
                  src={image} 
                  alt={`${product.name} ${index + 1}`} 
                  className="w-full h-full object-cover"
                />
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-bold">{product.name}</h1>
            <button
              onClick={toggleFavorite}
              className="p-2 rounded-full hover:bg-gray-100"
            >
              <Heart
                className={`w-6 h-6 ${
                  isFavorite(product.id)
                    ? 'text-red-500 fill-current'
                    : 'text-gray-400'
                }`}
              />
            </button>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="flex items-center">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star
                  key={i}
                  className={`w-5 h-5 ${
                    i < Math.floor(averageRating)
                      ? 'text-yellow-400 fill-current'
                      : 'text-gray-300'
                  }`}
                />
              ))}
            </div>
            {averageRating > 0 ? (
              <>
                <span className="text-lg font-semibold">{averageRating.toFixed(1)}</span>
                <span className="text-gray-600">({reviews.length} {t('product.reviews')})</span>
              </>
            ) : (
              <span className="text-gray-600">{t('product.noReviews')}</span>
            )}
          </div>

          <p className="text-gray-600">{product.description}</p>

          <div className="text-3xl font-bold">${product.price}</div>

          <div className="flex items-center gap-4">
            <div className="flex items-center border rounded-lg">
              <button
                onClick={() => handleQuantityChange(-1)}
                className="p-2 hover:bg-gray-100"
              >
                <Minus className="w-5 h-5" />
              </button>
              <span className="px-4 font-semibold">{quantity}</span>
              <button
                onClick={() => handleQuantityChange(1)}
                className="p-2 hover:bg-gray-100"
              >
                <Plus className="w-5 h-5" />
              </button>
            </div>
            <span className="text-gray-600">
              {product.stock} {t('product.inStock')}
            </span>
          </div>

          <div className="flex gap-4">
            <button
              onClick={handleAddToCart}
              className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <ShoppingCart className="w-5 h-5" />
              {t('product.addToCart')}
            </button>
            <button
              onClick={handleBuyNow}
              className="flex-1 px-6 py-3 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors"
            >
              {t('product.buyNow')}
            </button>
          </div>
        </div>
      </div>

      <div className="mt-12">
        <h2 className="text-2xl font-bold mb-6">{t('product.reviews')}</h2>

        <div className="bg-white p-6 rounded-lg shadow-md mb-8">
          <h3 className="text-lg font-semibold mb-4">{t('product.writeReview')}</h3>
          <form onSubmit={handleSubmitReview} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {t('product.reviewerName')}
              </label>
              <input
                type="text"
                value={reviewName}
                onChange={(e) => setReviewName(e.target.value)}
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder={t('product.enterName')}
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {t('product.rating')}
              </label>
              <div className="flex gap-2">
                {Array.from({ length: 5 }).map((_, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => setReviewRating(i + 1)}
                    className="focus:outline-none"
                  >
                    <Star
                      className={`w-6 h-6 ${
                        i < reviewRating ? 'text-yellow-400 fill-current' : 'text-gray-300'
                      }`}
                    />
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {t('product.comment')}
              </label>
              <textarea
                value={reviewComment}
                onChange={(e) => setReviewComment(e.target.value)}
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                rows={4}
                placeholder={t('product.enterComment')}
                required
              />
            </div>
            <button
              type="submit"
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Send className="w-4 h-4" />
              {t('product.submitReview')}
            </button>
          </form>
        </div>

        {reviews.length > 0 ? (
          <div className="space-y-6">
            {reviews.map((review) => (
              <div key={review.id} className="bg-white p-6 rounded-lg shadow-md">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="font-semibold">{review.userName}</h3>
                    <div className="flex items-center mt-1">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star
                          key={i}
                          className={`w-4 h-4 ${
                            i < review.rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                  <span className="text-gray-600">{review.date}</span>
                </div>
                <p className="text-gray-600">{review.comment}</p>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-600">{t('product.noReviews')}</p>
        )}
      </div>
    </div>
  );
};

export default ProductPage;