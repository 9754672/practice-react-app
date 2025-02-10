import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Product } from '@/types';

interface FavoritesStore {
  items: string[];
  addItem: (id: string) => void;
  removeItem: (id: string) => void;
  hasItem: (id: string) => boolean;
}

export const useFavoritesStore = create<FavoritesStore>()(
  persist(
    (set, get) => ({
      items: [],
      addItem: (id) =>
        set((state) => ({
          items: [...state.items, id],
        })),
      removeItem: (id) =>
        set((state) => ({
          items: state.items.filter((itemId) => itemId !== id),
        })),
      hasItem: (id) => get().items.includes(id),
    }),
    {
      name: 'favorites-storage',
    }
  )
);