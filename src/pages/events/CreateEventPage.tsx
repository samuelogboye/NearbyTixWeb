import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { apiClient } from '@services/api';
import { useUIStore } from '@stores/uiStore';
import { MainLayout } from '@components/layout/MainLayout';
import { LocationPicker } from '@components/maps/LocationPicker';
import { Button } from '@components/common/Button';
import { ROUTES } from '@constants/index';

// Validation schema
const createEventSchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters').max(200, 'Title too long'),
  description: z.string().min(10, 'Description must be at least 10 characters').optional(),
  start_time: z.string().refine((val) => {
    const date = new Date(val);
    return date > new Date();
  }, 'Start time must be in the future'),
  end_time: z.string(),
  total_tickets: z.number().min(1, 'Must have at least 1 ticket').max(100000, 'Too many tickets'),
  venue_name: z.string().min(2, 'Venue name is required'),
  address_line1: z.string().min(5, 'Address is required'),
  address_line2: z.string().optional(),
  city: z.string().min(2, 'City is required'),
  state: z.string().min(2, 'State is required'),
  country: z.string().min(2, 'Country is required'),
  postal_code: z.string().min(3, 'Postal code is required'),
  latitude: z.number().min(-90).max(90),
  longitude: z.number().min(-180).max(180),
}).refine((data) => {
  const start = new Date(data.start_time);
  const end = new Date(data.end_time);
  return end > start;
}, {
  message: 'End time must be after start time',
  path: ['end_time'],
});

type CreateEventFormData = z.infer<typeof createEventSchema>;

export const CreateEventPage = () => {
  const navigate = useNavigate();
  const addToast = useUIStore((state) => state.addToast);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [locationSelected, setLocationSelected] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<CreateEventFormData>({
    resolver: zodResolver(createEventSchema),
    defaultValues: {
      total_tickets: 100,
      country: 'US',
    },
  });

  const watchStartTime = watch('start_time');

  // Handle location selection from map
  const handleLocationSelect = (location: {
    latitude: number;
    longitude: number;
    address: string;
    city: string;
    state: string;
    country: string;
    postalCode: string;
  }) => {
    setValue('latitude', location.latitude);
    setValue('longitude', location.longitude);
    setValue('address_line1', location.address);
    setValue('city', location.city);
    setValue('state', location.state);
    setValue('country', location.country);
    setValue('postal_code', location.postalCode);
    setLocationSelected(true);
  };

  // Submit form
  const onSubmit = async (data: CreateEventFormData) => {
    setIsSubmitting(true);
    try {
      const eventData = {
        title: data.title,
        description: data.description || '',
        start_time: new Date(data.start_time).toISOString(),
        end_time: new Date(data.end_time).toISOString(),
        total_tickets: data.total_tickets,
        venue: {
          latitude: data.latitude,
          longitude: data.longitude,
          venue_name: data.venue_name,
          address_line1: data.address_line1,
          address_line2: data.address_line2,
          city: data.city,
          state: data.state,
          country: data.country,
          postal_code: data.postal_code,
        },
      };

      const event = await apiClient.createEvent(eventData);
      addToast('success', 'Event created successfully!');
      navigate(`/events/${event.id}`);
    } catch (error) {
      addToast('error', error instanceof Error ? error.message : 'Failed to create event');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Create Event</h1>
          <p className="mt-2 text-gray-600">
            Fill in the details below to create a new event
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
          {/* Basic Information */}
          <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
            <h2 className="mb-6 text-xl font-semibold text-gray-900">Basic Information</h2>
            <div className="space-y-4">
              {/* Event Title */}
              <div>
                <label htmlFor="title" className="block text-sm font-medium text-gray-700">
                  Event Title <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="title"
                  {...register('title')}
                  className="mt-1 block w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
                  placeholder="e.g., Summer Music Festival 2024"
                />
                {errors.title && (
                  <p className="mt-1 text-sm text-red-600">{errors.title.message}</p>
                )}
              </div>

              {/* Description */}
              <div>
                <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                  Description
                </label>
                <textarea
                  id="description"
                  {...register('description')}
                  rows={4}
                  className="mt-1 block w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
                  placeholder="Describe your event..."
                />
                {errors.description && (
                  <p className="mt-1 text-sm text-red-600">{errors.description.message}</p>
                )}
              </div>

              {/* Date and Time */}
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label htmlFor="start_time" className="block text-sm font-medium text-gray-700">
                    Start Date & Time <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="datetime-local"
                    id="start_time"
                    {...register('start_time')}
                    className="mt-1 block w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
                  />
                  {errors.start_time && (
                    <p className="mt-1 text-sm text-red-600">{errors.start_time.message}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="end_time" className="block text-sm font-medium text-gray-700">
                    End Date & Time <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="datetime-local"
                    id="end_time"
                    {...register('end_time')}
                    min={watchStartTime}
                    className="mt-1 block w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
                  />
                  {errors.end_time && (
                    <p className="mt-1 text-sm text-red-600">{errors.end_time.message}</p>
                  )}
                </div>
              </div>

              {/* Total Tickets */}
              <div>
                <label htmlFor="total_tickets" className="block text-sm font-medium text-gray-700">
                  Total Tickets <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  id="total_tickets"
                  {...register('total_tickets', { valueAsNumber: true })}
                  min={1}
                  className="mt-1 block w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
                  placeholder="100"
                />
                {errors.total_tickets && (
                  <p className="mt-1 text-sm text-red-600">{errors.total_tickets.message}</p>
                )}
              </div>
            </div>
          </div>

          {/* Location & Venue */}
          <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
            <h2 className="mb-6 text-xl font-semibold text-gray-900">
              Location & Venue <span className="text-red-500">*</span>
            </h2>

            {/* Venue Name */}
            <div className="mb-6">
              <label htmlFor="venue_name" className="block text-sm font-medium text-gray-700">
                Venue Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="venue_name"
                {...register('venue_name')}
                className="mt-1 block w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
                placeholder="e.g., Golden Gate Park"
              />
              {errors.venue_name && (
                <p className="mt-1 text-sm text-red-600">{errors.venue_name.message}</p>
              )}
            </div>

            {/* Map Picker */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Select Location on Map <span className="text-red-500">*</span>
              </label>
              <LocationPicker onLocationSelect={handleLocationSelect} />
              {!locationSelected && (
                <p className="mt-2 text-sm text-red-600">
                  Please select a location on the map
                </p>
              )}
            </div>

            {/* Address Fields */}
            {locationSelected && (
              <div className="space-y-4">
                <div>
                  <label htmlFor="address_line1" className="block text-sm font-medium text-gray-700">
                    Address Line 1 <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="address_line1"
                    {...register('address_line1')}
                    className="mt-1 block w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
                    placeholder="Street address"
                  />
                  {errors.address_line1 && (
                    <p className="mt-1 text-sm text-red-600">{errors.address_line1.message}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="address_line2" className="block text-sm font-medium text-gray-700">
                    Address Line 2
                  </label>
                  <input
                    type="text"
                    id="address_line2"
                    {...register('address_line2')}
                    className="mt-1 block w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
                    placeholder="Apartment, suite, unit, etc. (optional)"
                  />
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label htmlFor="city" className="block text-sm font-medium text-gray-700">
                      City <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      id="city"
                      {...register('city')}
                      className="mt-1 block w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
                    />
                    {errors.city && (
                      <p className="mt-1 text-sm text-red-600">{errors.city.message}</p>
                    )}
                  </div>

                  <div>
                    <label htmlFor="state" className="block text-sm font-medium text-gray-700">
                      State <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      id="state"
                      {...register('state')}
                      className="mt-1 block w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
                    />
                    {errors.state && (
                      <p className="mt-1 text-sm text-red-600">{errors.state.message}</p>
                    )}
                  </div>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label htmlFor="country" className="block text-sm font-medium text-gray-700">
                      Country <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      id="country"
                      {...register('country')}
                      className="mt-1 block w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
                    />
                    {errors.country && (
                      <p className="mt-1 text-sm text-red-600">{errors.country.message}</p>
                    )}
                  </div>

                  <div>
                    <label htmlFor="postal_code" className="block text-sm font-medium text-gray-700">
                      Postal Code <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      id="postal_code"
                      {...register('postal_code')}
                      className="mt-1 block w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
                    />
                    {errors.postal_code && (
                      <p className="mt-1 text-sm text-red-600">{errors.postal_code.message}</p>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Submit Buttons */}
          <div className="flex justify-end gap-4">
            <Button
              type="button"
              variant="secondary"
              onClick={() => navigate(ROUTES.EVENTS)}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting || !locationSelected}>
              {isSubmitting ? (
                <>
                  <svg
                    className="mr-2 h-5 w-5 animate-spin"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    />
                  </svg>
                  Creating Event...
                </>
              ) : (
                'Create Event'
              )}
            </Button>
          </div>
        </form>
      </div>
    </MainLayout>
  );
};
