import React from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import * as Dialog from '@radix-ui/react-dialog';
import { X } from 'lucide-react';
import { Button } from './ui/button';
import { useUserStore } from '@/store/user';

const signInSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

const signUpSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

const resetPasswordSchema = z.object({
  email: z.string().email('Invalid email address'),
  newPassword: z.string().min(6, 'Password must be at least 6 characters'),
  confirmNewPassword: z.string(),
}).refine((data) => data.newPassword === data.confirmNewPassword, {
  message: "Passwords don't match",
  path: ["confirmNewPassword"],
});

type SignInFormData = z.infer<typeof signInSchema>;
type SignUpFormData = z.infer<typeof signUpSchema>;
type ResetPasswordFormData = z.infer<typeof resetPasswordSchema>;

type AuthMode = 'signin' | 'signup' | 'forgot-password';

interface AuthDialogProps {
  isOpen: boolean;
  onClose: () => void;
  initialMode?: AuthMode;
}

export function AuthDialog({ isOpen, onClose, initialMode = 'signin' }: AuthDialogProps) {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [mode, setMode] = React.useState<AuthMode>(initialMode);
  const setUser = useUserStore((state) => state.setUser);

  const signInForm = useForm<SignInFormData>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const signUpForm = useForm<SignUpFormData>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
  });

  const resetPasswordForm = useForm<ResetPasswordFormData>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      email: '',
      newPassword: '',
      confirmNewPassword: '',
    },
  });

  const onSignIn = async (data: SignInFormData) => {
    try {
      // In a real app, you would make an API call here
      setUser({
        id: 'user-' + Date.now(),
        email: data.email,
        firstName: '',
        lastName: '',
        phone: '',
        paymentMethods: [],
      });
      onClose();
      navigate('/profile');
    } catch (error) {
      console.error('Sign in error:', error);
    }
  };

  const onSignUp = async (data: SignUpFormData) => {
    try {
      const [firstName, ...lastNameParts] = data.name.split(' ');
      const lastName = lastNameParts.join(' ');
      
      setUser({
        id: 'user-' + Date.now(),
        email: data.email,
        firstName,
        lastName,
        phone: '',
        paymentMethods: [],
      });
      onClose();
      navigate('/profile');
    } catch (error) {
      console.error('Sign up error:', error);
    }
  };

  const onResetPassword = async (data: ResetPasswordFormData) => {
    try {
      console.log('Reset password:', data);
      setMode('signin');
    } catch (error) {
      console.error('Reset password error:', error);
    }
  };

  const toggleMode = (newMode: AuthMode) => {
    setMode(newMode);
    signInForm.reset();
    signUpForm.reset();
    resetPasswordForm.reset();
  };

  return (
    <Dialog.Root open={isOpen} onOpenChange={onClose}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50" />
        <Dialog.Content className="fixed left-[50%] top-[50%] translate-x-[-50%] translate-y-[-50%] bg-white rounded-lg shadow-lg p-6 w-full max-w-md z-50">
          <Dialog.Title className="text-2xl font-bold mb-6">
            {mode === 'signin' 
              ? t('auth.signIn') 
              : mode === 'signup' 
                ? t('auth.signUp')
                : t('auth.forgotPassword')}
          </Dialog.Title>
          
          <Dialog.Close className="absolute right-4 top-4 text-gray-400 hover:text-gray-600">
            <X className="w-5 h-5" />
          </Dialog.Close>

          {mode === 'signin' && (
            <form onSubmit={signInForm.handleSubmit(onSignIn)} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {t('auth.email')}
                </label>
                <input
                  type="email"
                  {...signInForm.register('email')}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
                {signInForm.formState.errors.email && (
                  <p className="text-red-500 text-sm mt-1">
                    {signInForm.formState.errors.email.message}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {t('auth.password')}
                </label>
                <input
                  type="password"
                  {...signInForm.register('password')}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
                {signInForm.formState.errors.password && (
                  <p className="text-red-500 text-sm mt-1">
                    {signInForm.formState.errors.password.message}
                  </p>
                )}
              </div>

              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={() => toggleMode('forgot-password')}
                  className="text-sm text-blue-600 hover:text-blue-700"
                >
                  {t('auth.forgotPassword')}
                </button>
              </div>

              <Button type="submit" className="w-full bg-blue-600 text-white shadow hover:bg-blue-700 h-9 px-4 py-2" disabled={signInForm.formState.isSubmitting}>
                {signInForm.formState.isSubmitting ? t('common.loading') : t('auth.signIn')}
              </Button>
            </form>
          )}

          {mode === 'signup' && (
            <form onSubmit={signUpForm.handleSubmit(onSignUp)} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {t('auth.name')}
                </label>
                <input
                  type="text"
                  {...signUpForm.register('name')}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
                {signUpForm.formState.errors.name && (
                  <p className="text-red-500 text-sm mt-1">
                    {signUpForm.formState.errors.name.message}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {t('auth.email')}
                </label>
                <input
                  type="email"
                  {...signUpForm.register('email')}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
                {signUpForm.formState.errors.email && (
                  <p className="text-red-500 text-sm mt-1">
                    {signUpForm.formState.errors.email.message}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {t('auth.password')}
                </label>
                <input
                  type="password"
                  {...signUpForm.register('password')}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
                {signUpForm.formState.errors.password && (
                  <p className="text-red-500 text-sm mt-1">
                    {signUpForm.formState.errors.password.message}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {t('auth.confirmPassword')}
                </label>
                <input
                  type="password"
                  {...signUpForm.register('confirmPassword')}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
                {signUpForm.formState.errors.confirmPassword && (
                  <p className="text-red-500 text-sm mt-1">
                    {signUpForm.formState.errors.confirmPassword.message}
                  </p>
                )}
              </div>

              <Button type="submit" className="w-full bg-blue-600 text-white shadow hover:bg-blue-700 h-9 px-4 py-2" disabled={signUpForm.formState.isSubmitting}>
                {signUpForm.formState.isSubmitting ? t('common.loading') : t('auth.signUp')}
              </Button>
            </form>
          )}

          {mode === 'forgot-password' && (
            <form onSubmit={resetPasswordForm.handleSubmit(onResetPassword)} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {t('auth.email')}
                </label>
                <input
                  type="email"
                  {...resetPasswordForm.register('email')}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring -blue-500 focus:border-blue-500"
                />
                {resetPasswordForm.formState.errors.email && (
                  <p className="text-red-500 text-sm mt-1">
                    {resetPasswordForm.formState.errors.email.message}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {t('auth.password')}
                </label>
                <input
                  type="password"
                  {...resetPasswordForm.register('newPassword')}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
                {resetPasswordForm.formState.errors.newPassword && (
                  <p className="text-red-500 text-sm mt-1">
                    {resetPasswordForm.formState.errors.newPassword.message}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {t('auth.confirmPassword')}
                </label>
                <input
                  type="password"
                  {...resetPasswordForm.register('confirmNewPassword')}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
                {resetPasswordForm.formState.errors.confirmNewPassword && (
                  <p className="text-red-500 text-sm mt-1">
                    {resetPasswordForm.formState.errors.confirmNewPassword.message}
                  </p>
                )}
              </div>

              <Button type="submit" className="w-full bg-blue-600 text-white shadow hover:bg-blue-700 h-9 px-4 py-2">
                {t('auth.resetPassword')}
              </Button>
            </form>
          )}

          <div className="mt-4 text-center">
            {mode === 'forgot-password' ? (
              <button
                type="button"
                onClick={() => toggleMode('signin')}
                className="text-blue-600 hover:text-blue-700 text-sm"
              >
                {t('auth.backToSignIn')}
              </button>
            ) : (
              <button
                type="button"
                onClick={() => toggleMode(mode === 'signin' ? 'signup' : 'signin')}
                className="text-blue-600 hover:text-blue-700 text-sm"
              >
                {mode === 'signin' ? t('auth.noAccount') : t('auth.haveAccount')}
              </button>
            )}
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}

export default AuthDialog;