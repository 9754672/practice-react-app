import React from 'react';
import { useTranslation } from 'react-i18next';
import { Truck, Clock, Globe, Shield } from 'lucide-react';

const ShippingPage = () => {
  const { t } = useTranslation();

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">{t('shipping.title')}</h1>
      
      <div className="grid md:grid-cols-2 gap-8 mb-12">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center gap-4 mb-4">
            <Truck className="w-8 h-8 text-blue-600" />
            <h2 className="text-xl font-semibold">{t('shipping.delivery.title')}</h2>
          </div>
          <p className="text-gray-600">{t('shipping.delivery.content')}</p>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center gap-4 mb-4">
            <Clock className="w-8 h-8 text-blue-600" />
            <h2 className="text-xl font-semibold">{t('shipping.timing.title')}</h2>
          </div>
          <p className="text-gray-600">{t('shipping.timing.content')}</p>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center gap-4 mb-4">
            <Globe className="w-8 h-8 text-blue-600" />
            <h2 className="text-xl font-semibold">{t('shipping.international.title')}</h2>
          </div>
          <p className="text-gray-600">{t('shipping.international.content')}</p>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center gap-4 mb-4">
            <Shield className="w-8 h-8 text-blue-600" />
            <h2 className="text-xl font-semibold">{t('shipping.insurance.title')}</h2>
          </div>
          <p className="text-gray-600">{t('shipping.insurance.content')}</p>
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold mb-4">{t('shipping.rates.title')}</h2>
        <table className="w-full">
          <thead>
            <tr className="border-b">
              <th className="text-left py-2">{t('shipping.rates.method')}</th>
              <th className="text-left py-2">{t('shipping.rates.time')}</th>
              <th className="text-left py-2">{t('shipping.rates.cost')}</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            <tr>
              <td className="py-2">{t('shipping.rates.standard')}</td>
              <td className="py-2">5-7 {t('shipping.rates.days')}</td>
              <td className="py-2">$10</td>
            </tr>
            <tr>
              <td className="py-2">{t('shipping.rates.express')}</td>
              <td className="py-2">2-3 {t('shipping.rates.days')}</td>
              <td className="py-2">$25</td>
            </tr>
            <tr>
              <td className="py-2">{t('shipping.rates.overnight')}</td>
              <td className="py-2">1 {t('shipping.rates.day')}</td>
              <td className="py-2">$50</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ShippingPage;