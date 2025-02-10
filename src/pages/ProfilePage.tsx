import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { User, MapPin, CreditCard, LogOut, Plus, Trash2 } from 'lucide-react';
import * as Tabs from '@radix-ui/react-tabs';
import { useUserStore } from '@/store/user';
import type { UserAddress, PaymentMethod } from '@/store/user';

const ProfilePage = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { user, updateProfile, updateAddress, addPaymentMethod, removePaymentMethod, logout } = useUserStore();
  const [activeTab, setActiveTab] = useState('personal');

  if (!user) {
    navigate('/');
    return null;
  }

  const handleProfileUpdate = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    updateProfile({
      firstName: formData.get('firstName') as string,
      lastName: formData.get('lastName') as string,
      phone: formData.get('phone') as string,
    });
  };

  const handleAddressUpdate = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const address: UserAddress = {
      street: formData.get('street') as string,
      city: formData.get('city') as string,
      state: formData.get('state') as string,
      zipCode: formData.get('zipCode') as string,
      country: formData.get('country') as string,
    };
    updateAddress(address);
  };

  const handleAddPayment = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const payment: PaymentMethod = {
      cardNumber: formData.get('cardNumber') as string,
      cardHolder: formData.get('cardHolder') as string,
      expiryDate: formData.get('expiryDate') as string,
      cvv: formData.get('cvv') as string,
    };
    addPaymentMethod(payment);
    e.currentTarget.reset();
  };

  const handleExpiryDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\D/g, '');
    if (value.length >= 2) {
      value = value.slice(0, 2) + '/' + value.slice(2, 4);
    }
    e.target.value = value;
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">{t('profile.title')}</h1>
        <button
          onClick={handleLogout}
          className="flex items-center gap-2 text-gray-600 hover:text-red-600"
        >
          <LogOut className="w-5 h-5" />
          {t('profile.logout')}
        </button>
      </div>

      <Tabs.Root value={activeTab} onValueChange={setActiveTab}>
        <Tabs.List className="flex space-x-1 border-b mb-6">
          <Tabs.Trigger
            value="personal"
            className={`flex items-center gap-2 px-4 py-2 border-b-2 ${
              activeTab === 'personal'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent'
            }`}
          >
            <User className="w-5 h-5" />
            {t('profile.personal.title')}
          </Tabs.Trigger>

          <Tabs.Trigger
            value="address"
            className={`flex items-center gap-2 px-4 py-2 border-b-2 ${
              activeTab === 'address'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent'
            }`}
          >
            <MapPin className="w-5 h-5" />
            {t('profile.address.title')}
          </Tabs.Trigger>

          <Tabs.Trigger
            value="payment"
            className={`flex items-center gap-2 px-4 py-2 border-b-2 ${
              activeTab === 'payment'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent'
            }`}
          >
            <CreditCard className="w-5 h-5" />
            {t('profile.payment.title')}
          </Tabs.Trigger>
        </Tabs.List>

        <Tabs.Content value="personal">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <form onSubmit={handleProfileUpdate} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {t('profile.personal.firstName')}
                  </label>
                  <input
                    type="text"
                    name="firstName"
                    defaultValue={user.firstName}
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {t('profile.personal.lastName')}
                  </label>
                  <input
                    type="text"
                    name="lastName"
                    defaultValue={user.lastName}
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {t('profile.personal.email')}
                </label>
                <input
                  type="email"
                  value={user.email}
                  disabled
                  className="w-full px-3 py-2 border rounded-lg bg-gray-50"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {t('profile.personal.phone')}
                </label>
                <input
                  type="tel"
                  name="phone"
                  defaultValue={user.phone}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                {t('profile.save')}
              </button>
            </form>
          </div>
        </Tabs.Content>

        <Tabs.Content value="address">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <form onSubmit={handleAddressUpdate} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {t('profile.address.street')}
                </label>
                <input
                  type="text"
                  name="street"
                  defaultValue={user.address?.street}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {t('profile.address.city')}
                  </label>
                  <input
                    type="text"
                    name="city"
                    defaultValue={user.address?.city}
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {t('profile.address.state')}
                  </label>
                  <input
                    type="text"
                    name="state"
                    defaultValue={user.address?.state}
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {t('profile.address.zipCode')}
                  </label>
                  <input
                    type="text"
                    name="zipCode"
                    defaultValue={user.address?.zipCode}
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {t('profile.address.country')}
                  </label>
                  <input
                    type="text"
                    name="country"
                    defaultValue={user.address?.country}
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                {t('profile.save')}
              </button>
            </form>
          </div>
        </Tabs.Content>

        <Tabs.Content value="payment">
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-lg font-semibold mb-4">
                {t('profile.payment.savedCards')}
              </h3>
              {user.paymentMethods.length === 0 ? (
                <p className="text-gray-600">{t('profile.payment.noCards')}</p>
              ) : (
                <div className="space-y-4">
                  {user.paymentMethods.map((method) => (
                    <div
                      key={method.cardNumber}
                      className="flex items-center justify-between p-4 border rounded-lg"
                    >
                      <div className="flex items-center gap-4">
                        <CreditCard className="w-6 h-6 text-gray-400" />
                        <div>
                          <p className="font-medium">
                            **** **** **** {method.cardNumber.slice(-4)}
                          </p>
                          <p className="text-sm text-gray-600">
                            {method.cardHolder} • {method.expiryDate}
                          </p>
                        </div>
                      </div>
                      <button
                        onClick={() => removePaymentMethod(method.cardNumber)}
                        className="text-gray-400 hover:text-red-500"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-lg font-semibold mb-4">
                {t('profile.payment.addCard')}
              </h3>
              <form onSubmit={handleAddPayment} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {t('profile.payment.cardNumber')}
                  </label>
                  <input
                    type="text"
                    name="cardNumber"
                    placeholder="1234 5678 9012 3456"
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    maxLength={16}
                    pattern="\d{16}"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {t('profile.payment.cardHolder')}
                  </label>
                  <input
                    type="text"
                    name="cardHolder"
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      {t('profile.payment.expiryDate')}
                    </label>
                    <input
                      type="text"
                      name="expiryDate"
                      placeholder="MM/YY"
                      onChange={handleExpiryDateChange}
                      className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      maxLength={5}
                      pattern="\d{2}/\d{2}"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      {t('profile.payment.cvv')}
                    </label>
                    <input
                      type="password"
                      name="cvv"
                      placeholder="123"
                      className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      maxLength={3}
                      pattern="\d{3}"
                      required
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <Plus className="w-5 h-5 inline-block mr-2" />
                  {t('profile.payment.addCard')}
                </button>
              </form>
            </div>
          </div>
        </Tabs.Content>
      </Tabs.Root>
    </div>
  );
};

export default ProfilePage;