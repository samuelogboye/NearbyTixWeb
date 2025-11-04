import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { useAuthStore } from '@stores/authStore';
import { useUIStore } from '@stores/uiStore';
import { registerSchema, type RegisterFormData } from '@utils/validation';
import { Button } from '@components/common/Button';
import { Input } from '@components/common/Input';
import { Card } from '@components/common/Card';
import { MainLayout } from '@components/layout/MainLayout';
import { ROUTES } from '@constants/index';

export const RegisterPage = () => {
  const navigate = useNavigate();
  const register_user = useAuthStore((state) => state.register);
  const isLoading = useAuthStore((state) => state.isLoading);
  const addToast = useUIStore((state) => state.addToast);
  const [captureLocation, setCaptureLocation] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
  });

  const getCurrentLocation = (): Promise<{ latitude: number; longitude: number }> => {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error('Geolocation is not supported'));
        return;
      }

      navigator.geolocation.getCurrentPosition(
        (position) => {
          resolve({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          });
        },
        (error) => {
          reject(error);
        },
        { enableHighAccuracy: true, timeout: 10000 }
      );
    });
  };

  const onSubmit = async (data: RegisterFormData) => {
    try {
      let location;

      if (captureLocation) {
        try {
          location = await getCurrentLocation();
          addToast('success', 'Location captured successfully');
        } catch (error) {
          addToast('warning', 'Could not capture location, continuing without it');
        }
      }

      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { confirmPassword, ...registerData } = data;

      await register_user({
        ...registerData,
        ...(location && { latitude: location.latitude, longitude: location.longitude }),
      });

      addToast('success', 'Account created successfully!');
      navigate(ROUTES.HOME, { replace: true });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Registration failed';
      addToast('error', message);
    }
  };

  return (
    <MainLayout hideFooter>
      <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4 py-12 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-primary-600">NearbyTix</h1>
          <h2 className="mt-6 text-3xl font-bold tracking-tight text-gray-900">
            Create your account
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Already have an account?{' '}
            <Link to={ROUTES.LOGIN} className="font-medium text-primary-600 hover:text-primary-500">
              Sign in
            </Link>
          </p>
        </div>

        <Card variant="elevated" className="mt-8">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <Input
              id="name"
              label="Full name"
              type="text"
              autoComplete="name"
              required
              error={errors.name?.message}
              {...register('name')}
            />

            <Input
              id="email"
              label="Email address"
              type="email"
              autoComplete="email"
              required
              error={errors.email?.message}
              {...register('email')}
            />

            <div className="relative">
              <Input
                id="password"
                label="Password"
                type={showPassword ? 'text' : 'password'}
                autoComplete="new-password"
                required
                helperText="Must be at least 8 characters"
                error={errors.password?.message}
                {...register('password')}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-[34px] text-gray-500 hover:text-gray-700 focus:outline-none"
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? (
                  <svg
                    className="h-5 w-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"
                    />
                  </svg>
                ) : (
                  <svg
                    className="h-5 w-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                    />
                  </svg>
                )}
              </button>
            </div>

            <div className="relative">
              <Input
                id="confirmPassword"
                label="Confirm password"
                type={showConfirmPassword ? 'text' : 'password'}
                autoComplete="new-password"
                required
                error={errors.confirmPassword?.message}
                {...register('confirmPassword')}
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-[34px] text-gray-500 hover:text-gray-700 focus:outline-none"
                aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}
              >
                {showConfirmPassword ? (
                  <svg
                    className="h-5 w-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"
                    />
                  </svg>
                ) : (
                  <svg
                    className="h-5 w-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                    />
                  </svg>
                )}
              </button>
            </div>

            <div className="flex items-start">
              <div className="flex h-5 items-center">
                <input
                  id="capture-location"
                  name="capture-location"
                  type="checkbox"
                  checked={captureLocation}
                  onChange={(e) => setCaptureLocation(e.target.checked)}
                  className="h-4 w-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                />
              </div>
              <div className="ml-3 text-sm">
                <label htmlFor="capture-location" className="font-medium text-gray-700">
                  Share my location
                </label>
                <p className="text-gray-500">
                  Get personalized event recommendations based on your location (optional)
                </p>
              </div>
            </div>

            <Button type="submit" fullWidth isLoading={isLoading}>
              Create account
            </Button>
          </form>
        </Card>

        <p className="mt-4 text-center text-xs text-gray-500">
          By creating an account, you agree to our Terms of Service and Privacy Policy
        </p>
      </div>
      </div>
    </MainLayout>
  );
};
