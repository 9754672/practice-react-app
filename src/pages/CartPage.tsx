import React from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { Minus, Plus, Trash2, ShoppingBag } from 'lucide-react';
import { useCartStore } from '@/store/cart';
import { products } from '@/data/mockData';

const CartPage = () => {
  const { t } = useTranslation();
  const { items, removeItem, updateQuantity } = useCartStore();

  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const shipping = items.length > 0 ? 10 : 0;
  const total = subtotal + shipping;

  const handleQuantityChange = (item: typeof items[0], delta: number) => {
    const product = products.find(p => p.id === item.id);
    if (!product) return;

    const newQuantity = Math.max(1, Math.min(product.stock, item.quantity + delta));
    if (newQuantity !== item.quantity) {
      updateQuantity(item.id, newQuantity);
    }
  };

  if (items.length === 0) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center">
        <ShoppingBag className="w-16 h-16 text-gray-400 mb-4" />
        <h2 className="text-2xl font-bold mb-2">{t('cart.empty')}</h2>
        <p className="text-gray-600 mb-6">{t('cart.emptyMessage')}</p>
        <Link
          to="/products"
          className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
        >
          {t('cart.continueShopping')}
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold mb-8">{t('cart.title')}</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="divide-y">
              {items.map((item) => {
                const product = products.find(p => p.id === item.id);
                const isMaxQuantity = product ? item.quantity >= product.stock : false;
                
                return (
                  <div key={item.id} className="p-6">
                    <div className="flex gap-6">
                      <Link to={`/products/${item.id}`} className="shrink-0">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-24 h-24 object-cover rounded-lg"
                        />
                      </Link>
                      <div className="flex-1">
                        <div className="flex justify-between mb-2">
                          <Link
                            to={`/products/${item.id}`}
                            className="text-lg font-semibold hover:text-blue-600"
                          >
                            {item.name}
                          </Link>
                          <button
                            onClick={() => removeItem(item.id)}
                            className="text-gray-400 hover:text-red-500"
                          >
                            <Trash2 className="w-5 h-5" />
                          </button>
                        </div>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center border rounded-lg">
                            <button
                              onClick={() => handleQuantityChange(item, -1)}
                              className="p-2 hover:bg-gray-100"
                            >
                              <Minus className="w-4 h-4" />
                            </button>
                            <span className="px-4 font-semibold">{item.quantity}</span>
                            <button
                              onClick={() => handleQuantityChange(item, 1)}
                              disabled={isMaxQuantity}
                              className={`p-2 ${isMaxQuantity ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-100'}`}
                            >
                              <Plus className="w-4 h-4" />
                            </button>
                          </div>
                          <div className="text-lg font-bold">
                            ${(item.price * item.quantity).toFixed(2)}
                          </div>
                        </div>
                        {isMaxQuantity && (
                          <p className="text-red-500 text-sm mt-1">
                            {t('product.exceedsStock')}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow-md p-6 sticky top-4">
            <h2 className="text-xl font-bold mb-6">{t('cart.orderSummary')}</h2>
            
            <div className="space-y-4">
              <div className="flex justify-between">
                <span className="text-gray-600">{t('cart.subtotal')}</span>
                <span className="font-semibold">${subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">{t('cart.shipping')}</span>
                <span className="font-semibold">${shipping.toFixed(2)}</span>
              </div>
              <div className="border-t pt-4">
                <div className="flex justify-between">
                  <span className="font-bold">{t('cart.total')}</span>
                  <span className="font-bold">${total.toFixed(2)}</span>
                </div>
              </div>
            </div>

            <Link
              to="/checkout"
              className="mt-6 w-full bg-blue-600 text-white py-3 px-4 rounded-lg text-center font-semibold hover:bg-blue-700 transition-colors block"
            >
              {t('cart.proceedToCheckout')}
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartPage;