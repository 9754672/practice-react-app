import React from 'react';
import { useTranslation } from 'react-i18next';

const AboutPage = () => {
  const { t } = useTranslation();

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">{t('about.title')}</h1>
      
      <div className="prose prose-lg">
        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">{t('about.ourStory.title')}</h2>
          <p className="text-gray-600 mb-4">{t('about.ourStory.content')}</p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">{t('about.mission.title')}</h2>
          <p className="text-gray-600 mb-4">{t('about.mission.content')}</p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">{t('about.values.title')}</h2>
          <ul className="list-disc pl-6 space-y-2 text-gray-600">
            <li>{t('about.values.quality')}</li>
            <li>{t('about.values.integrity')}</li>
            <li>{t('about.values.innovation')}</li>
            <li>{t('about.values.sustainability')}</li>
          </ul>
        </section>
      </div>
    </div>
  );
};

export default AboutPage;