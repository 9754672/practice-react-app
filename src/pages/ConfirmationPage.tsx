import React from 'react';
import { useLocation, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { CheckCircle, Package } from 'lucide-react';

const ConfirmationPage = () => {
  const { t } = useTranslation();
  const location = useLocation();
  const { orderData } = location.state || {};

  if (!orderData) {
    return (
      <div className="max-w-2xl mx-auto text-center py-12">
        <h1 className="text-3xl font-bold mb-4">{t('confirmation.invalid')}</h1>
        <p className="text-gray-600 mb-8">{t('confirmation.invalidMessage')}</p>
        <Link
          to="/"
          className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
        >
          {t('confirmation.backToHome')}
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto">
      <div className="text-center mb-12">
        <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
        <h1 className="text-3xl font-bold mb-4">{t('confirmation.success')}</h1>
        <p className="text-gray-600">{t('confirmation.successMessage')}</p>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <h2 className="text-xl font-bold mb-6">{t('confirmation.orderDetails')}</h2>

        <div className="space-y-6">
          <div className="grid grid-cols-2 gap-6">
            <div>
              <h3 className="font-semibold mb-2">{t('confirmation.contact')}</h3>
              <p>{orderData.contact.firstName} {orderData.contact.lastName}</p>
              <p>{orderData.contact.email}</p>
              <p>{orderData.contact.phone}</p>
            </div>

            <div>
              <h3 className="font-semibold mb-2">{t('confirmation.shipping')}</h3>
              <p>{orderData.address.street}</p>
              <p>{orderData.address.city}, {orderData.address.state} {orderData.address.zipCode}</p>
              <p>{orderData.address.country}</p>
              <p className="mt-2 text-blue-600">
                {t(`shipping.rates.${orderData.shippingMethod}`)}
              </p>
            </div>
          </div>

          <div className="border-t pt-6">
            <h3 className="font-semibold mb-4">{t('confirmation.items')}</h3>
            <div className="space-y-4">
              {orderData.items.map((item: any) => (
                <div key={item.id} className="flex items-center gap-4">
                  <Package className="w-8 h-8 text-gray-400" />
                  <div className="flex-1">
                    <p className="font-semibold">{item.name}</p>
                    <p className="text-gray-600">
                      {item.quantity} x ${item.price}
                    </p>
                  </div>
                  <p className="font-semibold">
                    ${(item.quantity * item.price).toFixed(2)}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div className="border-t pt-6 space-y-2">
            <div className="flex justify-between">
              <span className="text-gray-600">{t('cart.subtotal')}</span>
              <span className="font-semibold">
                ${(orderData.total - orderData.shipping).toFixed(2)}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">{t('cart.shipping')}</span>
              <span className="font-semibold">${orderData.shipping.toFixed(2)}</span>
            </div>
            <div className="border-t pt-2">
              <div className="flex justify-between text-lg font-bold">
                <span>{t('confirmation.total')}</span>
                <span>${orderData.total.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="text-center">
        <Link
          to="/"
          className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors inline-block"
        >
          {t('confirmation.backToHome')}
        </Link>
      </div>
    </div>
  );
};

export default ConfirmationPage;