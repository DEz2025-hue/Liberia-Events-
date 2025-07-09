import Stripe from 'stripe'

// Only create Stripe instance if API key is available
export const stripe = process.env.STRIPE_SECRET_KEY 
  ? new Stripe(process.env.STRIPE_SECRET_KEY, {
      apiVersion: '2025-06-30.basil',
    })
  : null

export const TICKET_PRICE = 10.00 // $10 USD