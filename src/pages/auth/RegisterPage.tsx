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

            <Input
              id="password"
              label="Password"
              type="password"
              autoComplete="new-password"
              required
              helperText="Must be at least 8 characters"
              error={errors.password?.message}
              {...register('password')}
            />

            <Input
              id="confirmPassword"
              label="Confirm password"
              type="password"
              autoComplete="new-password"
              required
              error={errors.confirmPassword?.message}
              {...register('confirmPassword')}
            />

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
