import { NextRequest, NextResponse } from 'next/server'
import { stripe } from '@/lib/stripe'
import { supabase } from '@/lib/supabase'
import { v4 as uuidv4 } from 'uuid'
import { CONCERT_CONFIG } from '@/lib/concert-config'

export async function POST(request: NextRequest) {
  try {
    // Check if Stripe is configured
    if (!stripe) {
      return NextResponse.json(
        { error: 'Payment processing is not configured' },
        { status: 500 }
      )
    }

    const { name, email } = await request.json()

    if (!name || !email) {
      return NextResponse.json(
        { error: 'Name and email are required' },
        { status: 400 }
      )
    }

    // Generate unique access token
    const accessToken = uuidv4()

    // Create purchase record
    const { data: purchase, error: purchaseError } = await supabase
      .from('purchases')
      .insert({
        name,
        email,
        token: accessToken,
        payment_status: 'pending'
      })
      .select()
      .single()

    if (purchaseError) {
      console.error('Purchase creation error:', purchaseError)
      return NextResponse.json(
        { error: 'Failed to create purchase record' },
        { status: 500 }
      )
    }

    // Create token usage record
    const { error: tokenError } = await supabase
      .from('token_usage')
      .insert({
        token: accessToken,
        used: false
      })

    if (tokenError) {
      console.error('Token creation error:', tokenError)
      return NextResponse.json(
        { error: 'Failed to create access token' },
        { status: 500 }
      )
    }

    // Create Stripe checkout session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: `${CONCERT_CONFIG.name} - Live Stream Ticket`,
              description: `${CONCERT_CONFIG.artist} • ${CONCERT_CONFIG.venue} • July 26th, 2025`,
              images: [`${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/og-image.jpg`],
            },
            unit_amount: Math.round(CONCERT_CONFIG.price * 100), // Convert to cents
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/success?session_id={CHECKOUT_SESSION_ID}&token=${accessToken}`,
      cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/checkout`,
      customer_email: email,
      metadata: {
        purchaseId: purchase.id,
        accessToken: accessToken,
        customerName: name,
      },
      payment_intent_data: {
        metadata: {
          purchaseId: purchase.id,
          accessToken: accessToken,
        },
      },
    })

    // Update purchase with Stripe session ID
    await supabase
      .from('purchases')
      .update({ stripe_payment_intent_id: session.id })
      .eq('id', purchase.id)

    return NextResponse.json({ url: session.url })
  } catch (error) {
    console.error('Checkout session creation error:', error)
    return NextResponse.json(
      { error: 'Failed to create checkout session' },
      { status: 500 }
    )
  }
}