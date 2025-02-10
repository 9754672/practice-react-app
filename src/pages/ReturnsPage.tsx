import React from 'react';
import { useTranslation } from 'react-i18next';
import { RotateCcw, Clock, CheckCircle, AlertCircle } from 'lucide-react';

const ReturnsPage = () => {
  const { t } = useTranslation();

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">{t('returns.title')}</h1>
      
      <div className="space-y-8">
        <section>
          <h2 className="text-2xl font-semibold mb-4">{t('returns.policy.title')}</h2>
          <p className="text-gray-600 mb-6">{t('returns.policy.content')}</p>
          
          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <Clock className="w-8 h-8 text-blue-600 mb-4" />
              <h3 className="font-semibold mb-2">{t('returns.policy.timeframe.title')}</h3>
              <p className="text-gray-600">{t('returns.policy.timeframe.content')}</p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-md">
              <CheckCircle className="w-8 h-8 text-blue-600 mb-4" />
              <h3 className="font-semibold mb-2">{t('returns.policy.condition.title')}</h3>
              <p className="text-gray-600">{t('returns.policy.condition.content')}</p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-md">
              <RotateCcw className="w-8 h-8 text-blue-600 mb-4" />
              <h3 className="font-semibold mb-2">{t('returns.policy.process.title')}</h3>
              <p className="text-gray-600">{t('returns.policy.process.content')}</p>
            </div>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">{t('returns.steps.title')}</h2>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <ol className="list-decimal pl-4 space-y-4">
              <li className="text-gray-600">{t('returns.steps.step1')}</li>
              <li className="text-gray-600">{t('returns.steps.step2')}</li>
              <li className="text-gray-600">{t('returns.steps.step3')}</li>
              <li className="text-gray-600">{t('returns.steps.step4')}</li>
            </ol>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">{t('returns.exceptions.title')}</h2>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex items-start gap-3 mb-4">
              <AlertCircle className="w-5 h-5 text-red-500 mt-1" />
              <p className="text-gray-600">{t('returns.exceptions.content')}</p>
            </div>
            <ul className="list-disc pl-4 space-y-2 text-gray-600">
              <li>{t('returns.exceptions.item1')}</li>
              <li>{t('returns.exceptions.item2')}</li>
              <li>{t('returns.exceptions.item3')}</li>
            </ul>
          </div>
        </section>
      </div>
    </div>
  );
};

export default ReturnsPage;