import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useTicketsStore } from '@stores/ticketsStore';
import { useUIStore } from '@stores/uiStore';
import { TicketStatusBadge } from '@components/tickets/TicketStatusBadge';
import { CountdownTimer } from '@components/tickets/CountdownTimer';
import { LoadingSkeleton } from '@components/common/LoadingSkeleton';
import { Button } from '@components/common/Button';
import { formatDateTime, formatCurrency } from '@utils/format';
import { Card } from '@components/common/Card';

export const TicketPaymentPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { currentTicket, isLoading, error, fetchTicket, payTicket, clearCurrentTicket } = useTicketsStore();
  const addToast = useUIStore((state) => state.addToast);

  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'paypal' | 'bank'>('card');

  // Fetch ticket on mount
  useEffect(() => {
    if (id) {
      fetchTicket(id);
    }

    return () => {
      clearCurrentTicket();
    };
  }, [id, fetchTicket, clearCurrentTicket]);

  // Handle ticket expiration
  const handleExpire = () => {
    addToast('error', 'Your ticket reservation has expired');
    // Redirect to my tickets
    navigate('/my-tickets');
  };

  // Show error toast
  useEffect(() => {
    if (error) {
      addToast('error', error);
    }
  }, [error, addToast]);

  // Handle payment submission
  const handlePayment = async () => {
    if (!id) return;

    setIsProcessing(true);
    try {
      await payTicket(id);

      addToast('success', 'Payment successful! Your ticket is confirmed.');

      // Redirect to ticket detail page
      navigate(`/tickets/${id}`);
    } catch (err) {
      addToast('error', err instanceof Error ? err.message : 'Payment failed. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="space-y-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <LoadingSkeleton key={i} height="60px" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!currentTicket) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="container mx-auto px-4 max-w-4xl">
          <Card variant="bordered" className="text-center py-12">
            <div className="mb-4">
              <svg
                className="mx-auto h-16 w-16 text-gray-400"
                fill="none"
                strokeWidth="2"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M16.5 6v.75m0 3v.75m0 3v.75m0 3V18m-9-5.25h5.25M7.5 15h3M3.375 5.25c-.621 0-1.125.504-1.125 1.125v3.026a2.999 2.999 0 010 5.198v3.026c0 .621.504 1.125 1.125 1.125h17.25c.621 0 1.125-.504 1.125-1.125v-3.026a2.999 2.999 0 010-5.198V6.375c0-.621-.504-1.125-1.125-1.125H3.375z"
                />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Ticket Not Found</h2>
            <p className="text-gray-600 mb-6">
              We couldn't find the ticket you're looking for.
            </p>
            <Link
              to="/my-tickets"
              className="inline-block px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors font-medium"
            >
              View My Tickets
            </Link>
          </Card>
        </div>
      </div>
    );
  }

  const ticket = currentTicket;

  // Defensive check for event data
  if (!ticket.event) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="container mx-auto px-4 max-w-4xl">
          <Card variant="bordered" className="text-center py-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Event Information Unavailable</h2>
            <p className="text-gray-600 mb-6">
              Unable to load event details for this ticket.
            </p>
            <Link
              to="/my-tickets"
              className="inline-block px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors font-medium"
            >
              Back to My Tickets
            </Link>
          </Card>
        </div>
      </div>
    );
  }

  // Redirect if ticket is not reserved
  if (ticket.status !== 'reserved') {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="container mx-auto px-4 max-w-4xl">
          <Card variant="bordered" className="text-center py-12">
            <div className="mb-4">
              <svg
                className="mx-auto h-16 w-16 text-gray-400"
                fill="none"
                strokeWidth="2"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z"
                />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Payment Not Available</h2>
            <p className="text-gray-600 mb-6">
              {ticket.status === 'paid'
                ? 'This ticket has already been paid for.'
                : 'This ticket reservation has expired.'}
            </p>
            <Link
              to={`/tickets/${ticket.id}`}
              className="inline-block px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors font-medium"
            >
              View Ticket Details
            </Link>
          </Card>
        </div>
      </div>
    );
  }

  // Mock ticket price (since backend doesn't provide it)
  const ticketPrice = 25.00;
  const serviceFee = 2.50;
  const totalAmount = ticketPrice + serviceFee;

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Header */}
        <div className="mb-6">
          <Link
            to={`/tickets/${ticket.id}`}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4"
          >
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            <span>Back to Ticket Details</span>
          </Link>
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Complete Payment</h1>
              <p className="text-gray-600 mt-1">{ticket.event.title}</p>
            </div>
            <TicketStatusBadge status={ticket.status} size="md" />
          </div>
        </div>

        {/* Countdown Timer Warning */}
        {ticket.expires_at && (
          <Card variant="bordered" className="mb-6 bg-yellow-50 border-yellow-300">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold text-gray-900 mb-1">
                  ⏰ Complete Payment Before Time Expires
                </h3>
                <p className="text-sm text-gray-600">
                  Your reservation will be cancelled if payment is not completed in time
                </p>
              </div>
              <CountdownTimer
                expiresAt={ticket.expires_at}
                onExpire={handleExpire}
                size="lg"
              />
            </div>
          </Card>
        )}

        {/* Main Content Grid */}
        <div className="grid gap-6 lg:grid-cols-3">
          {/* Left Column - Payment Form */}
          <div className="lg:col-span-2">
            <Card variant="bordered">
              <h2 className="text-xl font-bold text-gray-900 mb-6">Payment Method</h2>

              {/* Payment Method Selection */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Select Payment Method
                </label>
                <div className="grid grid-cols-3 gap-3">
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('card')}
                    className={`p-4 border-2 rounded-lg transition-colors ${
                      paymentMethod === 'card'
                        ? 'border-primary-600 bg-primary-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <svg
                      className="h-6 w-6 mx-auto mb-2"
                      fill="none"
                      strokeWidth="2"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h3m-3.75 3h15a2.25 2.25 0 002.25-2.25V6.75A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25v10.5A2.25 2.25 0 004.5 19.5z"
                      />
                    </svg>
                    <p className="text-sm font-medium">Card</p>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPaymentMethod('paypal')}
                    className={`p-4 border-2 rounded-lg transition-colors ${
                      paymentMethod === 'paypal'
                        ? 'border-primary-600 bg-primary-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <svg
                      className="h-6 w-6 mx-auto mb-2"
                      fill="none"
                      strokeWidth="2"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M2.25 18.75a60.07 60.07 0 0115.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 013 6h-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H20.25M2.25 6v9m18-10.5v.75c0 .414.336.75.75.75h.75m-1.5-1.5h.375c.621 0 1.125.504 1.125 1.125v9.75c0 .621-.504 1.125-1.125 1.125h-.375m1.5-1.5H21a.75.75 0 00-.75.75v.75m0 0H3.75m0 0h-.375a1.125 1.125 0 01-1.125-1.125V15m1.5 1.5v-.75A.75.75 0 003 15h-.75M15 10.5a3 3 0 11-6 0 3 3 0 016 0zm3 0h.008v.008H18V10.5zm-12 0h.008v.008H6V10.5z"
                      />
                    </svg>
                    <p className="text-sm font-medium">PayPal</p>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPaymentMethod('bank')}
                    className={`p-4 border-2 rounded-lg transition-colors ${
                      paymentMethod === 'bank'
                        ? 'border-primary-600 bg-primary-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <svg
                      className="h-6 w-6 mx-auto mb-2"
                      fill="none"
                      strokeWidth="2"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M12 21v-8.25M15.75 21v-8.25M8.25 21v-8.25M3 9l9-6 9 6m-1.5 12V10.332A48.36 48.36 0 0012 9.75c-2.551 0-5.056.2-7.5.582V21M3 21h18M12 6.75h.008v.008H12V6.75z"
                      />
                    </svg>
                    <p className="text-sm font-medium">Bank</p>
                  </button>
                </div>
              </div>

              {/* Card Payment Form */}
              {paymentMethod === 'card' && (
                <form className="space-y-4">
                  <div>
                    <label htmlFor="cardNumber" className="block text-sm font-medium text-gray-700 mb-1">
                      Card Number
                    </label>
                    <input
                      type="text"
                      id="cardNumber"
                      placeholder="1234 5678 9012 3456"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="expiry" className="block text-sm font-medium text-gray-700 mb-1">
                        Expiry Date
                      </label>
                      <input
                        type="text"
                        id="expiry"
                        placeholder="MM/YY"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      />
                    </div>

                    <div>
                      <label htmlFor="cvv" className="block text-sm font-medium text-gray-700 mb-1">
                        CVV
                      </label>
                      <input
                        type="text"
                        id="cvv"
                        placeholder="123"
                        maxLength={3}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="cardName" className="block text-sm font-medium text-gray-700 mb-1">
                      Cardholder Name
                    </label>
                    <input
                      type="text"
                      id="cardName"
                      placeholder="John Doe"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    />
                  </div>
                </form>
              )}

              {/* PayPal Message */}
              {paymentMethod === 'paypal' && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-center">
                  <svg
                    className="h-12 w-12 text-blue-600 mx-auto mb-3"
                    fill="none"
                    strokeWidth="2"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M2.25 18.75a60.07 60.07 0 0115.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 013 6h-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H20.25M2.25 6v9m18-10.5v.75c0 .414.336.75.75.75h.75m-1.5-1.5h.375c.621 0 1.125.504 1.125 1.125v9.75c0 .621-.504 1.125-1.125 1.125h-.375m1.5-1.5H21a.75.75 0 00-.75.75v.75m0 0H3.75m0 0h-.375a1.125 1.125 0 01-1.125-1.125V15m1.5 1.5v-.75A.75.75 0 003 15h-.75M15 10.5a3 3 0 11-6 0 3 3 0 016 0zm3 0h.008v.008H18V10.5zm-12 0h.008v.008H6V10.5z"
                    />
                  </svg>
                  <p className="text-gray-700 font-medium">
                    You will be redirected to PayPal to complete your payment
                  </p>
                </div>
              )}

              {/* Bank Transfer Message */}
              {paymentMethod === 'bank' && (
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 text-center">
                  <svg
                    className="h-12 w-12 text-gray-600 mx-auto mb-3"
                    fill="none"
                    strokeWidth="2"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M12 21v-8.25M15.75 21v-8.25M8.25 21v-8.25M3 9l9-6 9 6m-1.5 12V10.332A48.36 48.36 0 0012 9.75c-2.551 0-5.056.2-7.5.582V21M3 21h18M12 6.75h.008v.008H12V6.75z"
                    />
                  </svg>
                  <p className="text-gray-700 font-medium">
                    Bank transfer details will be sent to your email
                  </p>
                </div>
              )}

              {/* Security Notice */}
              <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg">
                <div className="flex items-start gap-3">
                  <svg
                    className="h-5 w-5 text-green-600 mt-0.5"
                    fill="none"
                    strokeWidth="2"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z"
                    />
                  </svg>
                  <div>
                    <p className="text-sm font-medium text-green-900">Secure Payment</p>
                    <p className="text-xs text-green-700 mt-1">
                      Your payment information is encrypted and secure. We never store your card details.
                    </p>
                  </div>
                </div>
              </div>
            </Card>
          </div>

          {/* Right Column - Order Summary */}
          <div className="lg:col-span-1">
            <Card variant="bordered" className="sticky top-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Order Summary</h2>

              {/* Event Details */}
              <div className="mb-4 pb-4 border-b border-gray-200">
                <h3 className="font-semibold text-gray-900 mb-2">{ticket.event.title}</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex items-start gap-2">
                    <svg
                      className="h-4 w-4 text-gray-400 mt-0.5"
                      fill="none"
                      strokeWidth="2"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5"
                      />
                    </svg>
                    <span className="text-gray-600">{formatDateTime(ticket.event.start_time)}</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <svg
                      className="h-4 w-4 text-gray-400 mt-0.5"
                      fill="none"
                      strokeWidth="2"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z"
                      />
                    </svg>
                    <span className="text-gray-600">{ticket.event.venue_name}</span>
                  </div>
                </div>
              </div>

              {/* Price Breakdown */}
              <div className="space-y-3 mb-4">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Ticket Price</span>
                  <span className="font-medium text-gray-900">{formatCurrency(ticketPrice)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Service Fee</span>
                  <span className="font-medium text-gray-900">{formatCurrency(serviceFee)}</span>
                </div>
                <div className="pt-3 border-t border-gray-200">
                  <div className="flex justify-between">
                    <span className="font-semibold text-gray-900">Total</span>
                    <span className="font-bold text-xl text-gray-900">{formatCurrency(totalAmount)}</span>
                  </div>
                </div>
              </div>

              {/* Payment Button */}
              <Button
                variant="primary"
                size="lg"
                onClick={handlePayment}
                disabled={isProcessing}
                isLoading={isProcessing}
                className="w-full"
              >
                {isProcessing ? 'Processing...' : `Pay ${formatCurrency(totalAmount)}`}
              </Button>

              <button
                onClick={() => navigate(`/tickets/${ticket.id}`)}
                disabled={isProcessing}
                className="mt-3 w-full px-4 py-2 bg-gray-200 text-gray-900 rounded-lg hover:bg-gray-300 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Cancel
              </button>

              {/* Terms */}
              <p className="mt-4 text-xs text-gray-500 text-center">
                By completing this purchase you agree to our{' '}
                <Link to="/terms" className="text-primary-600 hover:text-primary-700 underline">
                  Terms of Service
                </Link>
                {' '}and{' '}
                <Link to="/privacy" className="text-primary-600 hover:text-primary-700 underline">
                  Privacy Policy
                </Link>
              </p>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};
