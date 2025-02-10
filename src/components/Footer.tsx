import React from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';

const Footer = () => {
  const { t } = useTranslation();

  return (
    <footer className="bg-white border-t">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="font-bold text-lg mb-4">{t('footer.store.title')}</h3>
            <p className="text-gray-600">{t('footer.store.description')}</p>
          </div>
          <div>
            <h3 className="font-bold text-lg mb-4">{t('footer.quickLinks.title')}</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/products" className="text-gray-600 hover:text-blue-600">
                  {t('footer.quickLinks.products')}
                </Link>
              </li>
              <li>
                <Link to="/about" className="text-gray-600 hover:text-blue-600">
                  {t('footer.quickLinks.about')}
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-gray-600 hover:text-blue-600">
                  {t('footer.quickLinks.contact')}
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="font-bold text-lg mb-4">{t('footer.customerService.title')}</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/faq" className="text-gray-600 hover:text-blue-600">
                  {t('footer.customerService.faq')}
                </Link>
              </li>
              <li>
                <Link to="/shipping" className="text-gray-600 hover:text-blue-600">
                  {t('footer.customerService.shipping')}
                </Link>
              </li>
              <li>
                <Link to="/returns" className="text-gray-600 hover:text-blue-600">
                  {t('footer.customerService.returns')}
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="font-bold text-lg mb-4">{t('footer.connect.title')}</h3>
            <ul className="space-y-2">
              <li>
                <a
                  href="https://facebook.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-600 hover:text-blue-600"
                >
                  {t('footer.connect.facebook')}
                </a>
              </li>
              <li>
                <a
                  href="https://instagram.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-600 hover:text-blue-600"
                >
                  {t('footer.connect.instagram')}
                </a>
              </li>
              <li>
                <a
                  href="https://twitter.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-600 hover:text-blue-600"
                >
                  {t('footer.connect.twitter')}
                </a>
              </li>
            </ul>
          </div>
        </div>
        <div className="border-t mt-8 pt-8 text-center text-gray-600">
          <p>{t('footer.copyright')}</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;