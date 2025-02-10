import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { ShoppingCart, User, Search, Heart } from "lucide-react";
import { Button } from "./ui/button";
import { useCartStore } from "@/store/cart";
import { useFavoritesStore } from "@/store/favorites";
import { useSearchStore } from "@/store/search";
import { useUserStore } from "@/store/user";
import AuthDialog from "./AuthDialog";

const Navbar = () => {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const cartItems = useCartStore((state) => state.items);
  const favoriteItems = useFavoritesStore((state) => state.items);
  const { query, setQuery, results } = useSearchStore();
  const { user, isAuthenticated } = useUserStore();
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);

  const toggleLanguage = () => {
    i18n.changeLanguage(i18n.language === "en" ? "uk" : "en");
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      navigate(`/products?search=${encodeURIComponent(query)}`);
      setIsSearchFocused(false);
    }
  };

  return (
    <nav className="bg-white shadow-md relative z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-8">
            <Link to="/" className="text-xl font-bold">
              Store
            </Link>
            <div className="hidden md:flex space-x-4">
              <Link to="/products" className="hover:text-blue-600">
                {t("nav.products")}
              </Link>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <div className="relative">
              <form onSubmit={handleSearch} className="relative">
                <input
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  onFocus={() => setIsSearchFocused(true)}
                  placeholder={t("common.search")}
                  className="pl-8 pr-4 py-2 rounded-lg border focus:outline-none focus:ring-2 w-64"
                />
                <Search className="absolute left-2 top-2.5 h-5 w-5 text-gray-400" />
              </form>

              {isSearchFocused && query && results.length > 0 && (
                <div className="absolute top-full left-0 right-0 bg-white mt-1 rounded-lg shadow-lg border p-2 max-h-96 overflow-y-auto">
                  {results.map((product) => (
                    <Link
                      key={product.id}
                      to={`/products/${product.id}`}
                      className="flex items-center gap-3 p-2 hover:bg-gray-50 rounded-lg"
                      onClick={() => setIsSearchFocused(false)}
                    >
                      <img
                        src={product.images[0]}
                        alt={product.name}
                        className="w-12 h-12 object-cover rounded"
                      />
                      <div>
                        <div className="font-medium">{product.name}</div>
                        <div className="text-sm text-gray-600">
                          ${product.price}
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </div>

            <Button
              variant="ghost"
              size="sm"
              onClick={toggleLanguage}
              className="p-2 w-10 h-10 flex items-center justify-center"
            >
              <img src={`/flags/${i18n.language}.svg`}
              alt={i18n.language}
              className="w-6 h-6"
              />
            </Button>

            <Link to="/favorites" className="relative">
              <Heart className="h-6 w-6" />
              {favoriteItems.length > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs">
                  {favoriteItems.length}
                </span>
              )}
            </Link>

            <Link to="/cart" className="relative">
              <ShoppingCart className="h-6 w-6" />
              {cartItems.length > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs">
                  {cartItems.length}
                </span>
              )}
            </Link>

            {isAuthenticated ? (
              <Link to="/profile">
                <Button variant="outline" size="sm">
                  <User className="h-5 w-5 mr-2" />
                  {user?.firstName || t("nav.profile")}
                </Button>
              </Link>
            ) : (
              <Button variant="outline" size="sm" onClick={() => setIsAuthOpen(true)}>
                <User className="h-5 w-5 mr-2" />
                {t("nav.signin")}
              </Button>
            )}
          </div>
        </div>
      </div>

      <AuthDialog isOpen={isAuthOpen} onClose={() => setIsAuthOpen(false)} />
    </nav>
  );
};

export default Navbar;