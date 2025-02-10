import { create } from 'zustand';
import { products } from '../data/mockData';
import { Product } from '../types';

interface SearchStore {
  query: string;
  setQuery: (query: string) => void;
  results: Product[];
}

export const useSearchStore = create<SearchStore>((set) => ({
  query: '',
  results: [],
  setQuery: (query) => {
    const searchResults = query
      ? products.filter(
          (product) =>
            product.name.toLowerCase().includes(query.toLowerCase()) ||
            product.description.toLowerCase().includes(query.toLowerCase()) ||
            product.category.toLowerCase().includes(query.toLowerCase())
        )
      : [];
    set({ query, results: searchResults });
  },
}));