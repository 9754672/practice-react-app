import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface UserAddress {
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
}

export interface PaymentMethod {
  cardNumber: string;
  cardHolder: string;
  expiryDate: string;
  cvv: string;
}

export interface UserProfile {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone: string;
  address?: UserAddress;
  paymentMethods: PaymentMethod[];
}

interface UserStore {
  user: UserProfile | null;
  isAuthenticated: boolean;
  setUser: (user: UserProfile) => void;
  updateProfile: (data: Partial<UserProfile>) => void;
  updateAddress: (address: UserAddress) => void;
  addPaymentMethod: (payment: PaymentMethod) => void;
  removePaymentMethod: (cardNumber: string) => void;
  logout: () => void;
}

export const useUserStore = create<UserStore>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      setUser: (user) => set({ user, isAuthenticated: true }),
      updateProfile: (data) =>
        set((state) => ({
          user: state.user ? { ...state.user, ...data } : null,
        })),
      updateAddress: (address) =>
        set((state) => ({
          user: state.user ? { ...state.user, address } : null,
        })),
      addPaymentMethod: (payment) =>
        set((state) => ({
          user: state.user
            ? {
                ...state.user,
                paymentMethods: [...state.user.paymentMethods, payment],
              }
            : null,
        })),
      removePaymentMethod: (cardNumber) =>
        set((state) => ({
          user: state.user
            ? {
                ...state.user,
                paymentMethods: state.user.paymentMethods.filter(
                  (p) => p.cardNumber !== cardNumber
                ),
              }
            : null,
        })),
      logout: () => set({ user: null, isAuthenticated: false }),
    }),
    {
      name: 'user-storage',
    }
  )
);