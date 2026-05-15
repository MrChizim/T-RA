import Stripe from 'stripe';

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();

  const { uid, email, currency = 'gbp', amount = 500 } = req.body;
  if (!uid) return res.status(400).json({ error: 'Missing uid' });

  // Validate currency is one we support
  const ALLOWED = { gbp: 500, usd: 700, eur: 700 };
  const safeCurrency = ALLOWED[currency] !== undefined ? currency : 'gbp';
  const safeAmount   = ALLOWED[currency] !== undefined ? amount   : 500;

  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    mode: 'payment',
    customer_email: email || undefined,
    line_items: [{
      price_data: {
        currency: safeCurrency,
        unit_amount: safeAmount,
        product_data: {
          name: 'TÓRA Full Profile',
          description: 'One-time access — complete personalised style brief',
        },
      },
      quantity: 1,
    }],
    metadata: { uid },
    success_url: `${req.headers.origin}/results.html?payment=success`,
    cancel_url: `${req.headers.origin}/results.html`,
  });

  res.status(200).json({ url: session.url });
}
