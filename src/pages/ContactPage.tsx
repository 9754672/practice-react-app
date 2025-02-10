import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Mail, Phone, MapPin } from 'lucide-react';

interface ContactForm {
  name: string;
  email: string;
  message: string;
}

const ContactPage = () => {
  const { t } = useTranslation();
  const [formData, setFormData] = useState<ContactForm>({
    name: '',
    email: '',
    message: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Contact Form Submission:', formData);
    setFormData({ name: '', email: '', message: '' });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">{t('contact.title')}</h1>
      
      <div className="grid md:grid-cols-2 gap-8">
        <div>
          <h2 className="text-xl font-semibold mb-4">{t('contact.getInTouch')}</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {t('contact.name')}
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {t('contact.email')}
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {t('contact.message')}
              </label>
              <textarea
                name="message"
                value={formData.message}
                onChange={handleChange}
                rows={4}
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>
            
            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              {t('contact.send')}
            </button>
          </form>
        </div>
        
        <div>
          <h2 className="text-xl font-semibold mb-4">{t('contact.info')}</h2>
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <Mail className="w-5 h-5 text-blue-600 mt-1" />
              <div>
                <h3 className="font-medium">{t('contact.email')}</h3>
                <p className="text-gray-600">support@store.com</p>
              </div>
            </div>
            
            <div className="flex items-start gap-3">
              <Phone className="w-5 h-5 text-blue-600 mt-1" />
              <div>
                <h3 className="font-medium">{t('contact.phone')}</h3>
                <p className="text-gray-600">+38 (012) 345 67 89</p>
              </div>
            </div>
            
            <div className="flex items-start gap-3">
              <MapPin className="w-5 h-5 text-blue-600 mt-1" />
              <div>
                <h3 className="font-medium">{t('contact.address')}</h3>
                <p className="text-gray-600">
                  вул. Шевченка, 1<br />
                  Кропивницький, 25000<br />
                  Україна
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactPage;