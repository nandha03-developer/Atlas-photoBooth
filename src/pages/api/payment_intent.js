// pages/api/create-payment-intent.js
import Stripe from 'stripe';

const stripe = new Stripe('REDACTED_STRIPE_KEY');

export default async (req, res) => {
  alert(req)
  alert(res)
  if (req.method === 'POST') {
    const { amount } = req.body;  // The amount should be passed from the frontend

    try {
      // Create a PaymentIntent with the specified amount
      const paymentIntent = await stripe.paymentIntents.create({
        amount, // Amount in cents (e.g., $10.00 = 1000 cents)
        currency: 'usd',
      });

      // Return the client secret
      res.status(200).json({ clientSecret: paymentIntent.client_secret });
    } catch (error) {
      res.status(400).json({ error: { message: error.message } });
    }
  } else {
    res.setHeader('Allow', 'POST');
    res.status(405).end('Method Not Allowed');
  }
};

