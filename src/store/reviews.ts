import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Review } from '@/types';
import { products } from '@/data/mockData';

interface ReviewsStore {
  reviews: Record<string, Review[]>;
  addReview: (productId: string, review: Omit<Review, 'id' | 'userId'>) => void;
  getReviews: (productId: string) => Review[];
}

export const useReviewsStore = create<ReviewsStore>()(
  persist(
    (set, get) => ({
      reviews: products.reduce((acc, product) => {
        acc[product.id] = product.reviews;
        return acc;
      }, {} as Record<string, Review[]>),
      
      addReview: (productId, review) => {
        const newReview: Review = {
          id: `r${Date.now()}`,
          userId: `u${Date.now()}`,
          ...review,
        };
        
        set((state) => ({
          reviews: {
            ...state.reviews,
            [productId]: [...(state.reviews[productId] || []), newReview],
          },
        }));
      },
      
      getReviews: (productId) => {
        return get().reviews[productId] || [];
      },
    }),
    {
      name: 'reviews-storage',
    }
  )
);