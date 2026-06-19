// components/PaymentForm.tsx
import { useState, FormEvent } from 'react';
import { useStripe, useElements, CardElement } from '@stripe/react-stripe-js';
import { StripeCardElement } from '@stripe/stripe-js';

const Payment: React.FC = () => {
  const [clientSecret, setClientSecret] = useState<string>('');
  const stripe = useStripe();
  const elements = useElements();

  // Handle form submission
  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();

    if (!stripe || !elements) {
      return; // Stripe.js has not loaded yet.
    }

    const cardElement = elements.getElement(CardElement) as StripeCardElement;

    // Add your payment intent logic here...
  };

  return (
    <form onSubmit={handleSubmit}>
      <CardElement />
      <button type="submit" disabled={!stripe}>Pay</button>
    </form>
  );
};

export default Payment;