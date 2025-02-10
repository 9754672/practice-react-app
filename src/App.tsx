import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { useUserStore } from './store/user';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import AuthDialog from './components/AuthDialog';
import HomePage from './pages/HomePage';
import ProductsPage from './pages/ProductsPage';
import ProductPage from './pages/ProductPage';
import CartPage from './pages/CartPage';
import FavoritesPage from './pages/FavoritesPage';
import CheckoutPage from './pages/CheckoutPage';
import ConfirmationPage from './pages/ConfirmationPage';
import ProfilePage from './pages/ProfilePage';
import AboutPage from './pages/AboutPage';
import ContactPage from './pages/ContactPage';
import FAQPage from './pages/FAQPage';
import ShippingPage from './pages/ShippingPage';
import ReturnsPage from './pages/ReturnsPage';
import './i18n/config';

const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  }, [pathname]);

  return null;
};

const PrivateRoute = ({ children }: { children: React.ReactNode }) => {
  const isAuthenticated = useUserStore((state) => state.isAuthenticated);
  
  if (!isAuthenticated) {
    return <Navigate to="/" />;
  }
  
  return <>{children}</>;
};

function App() {
  return (
    <Router>
      <ScrollToTop />
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="container mx-auto px-4 py-8 flex-grow">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/auth" element={<AuthDialog />} />
            <Route path="/products" element={<ProductsPage />} />
            <Route path="/products/:id" element={<ProductPage />} />
            <Route path="/cart" element={<CartPage />} />
            <Route path="/favorites" element={<FavoritesPage />} />
            <Route path="/checkout" element={<CheckoutPage />} />
            <Route path="/checkout/confirmation" element={<ConfirmationPage />} />
            <Route
              path="/profile"
              element={
                <PrivateRoute>
                  <ProfilePage />
                </PrivateRoute>
              }
            />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/faq" element={<FAQPage />} />
            <Route path="/shipping" element={<ShippingPage />} />
            <Route path="/returns" element={<ReturnsPage />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;