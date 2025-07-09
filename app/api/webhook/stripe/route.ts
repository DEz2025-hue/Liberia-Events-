import { NextRequest, NextResponse } from 'next/server'
import { stripe } from '@/lib/stripe'
import { supabase } from '@/lib/supabase'
import { sendPurchaseConfirmation } from '@/lib/email'
import { headers } from 'next/headers'

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!

export async function POST(request: NextRequest) {
  try {
    const body = await request.text()
    const headersList = headers()
    const signature = headersList.get('stripe-signature')!

    let event
    try {
      event = stripe.webhooks.constructEvent(body, signature, webhookSecret)
    } catch (err) {
      console.error('Webhook signature verification failed:', err)
      return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
    }

    switch (event.type) {
      case 'checkout.session.completed':
        const session = event.data.object
        const { purchaseId, accessToken } = session.metadata!

        // Update purchase status to completed
        const { error: updateError } = await supabase
          .from('purchases')
          .update({ 
            payment_status: 'completed',
            stripe_payment_intent_id: session.payment_intent as string
          })
          .eq('id', purchaseId)

        if (updateError) {
          console.error('Failed to update purchase status:', updateError)
        } else {
          // Send confirmation email
          const streamUrl = `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/stream?token=${accessToken}`
          
          // Get purchase details for email
          const { data: purchaseData } = await supabase
            .from('purchases')
            .select('name, email')
            .eq('id', purchaseId)
            .single()

          if (purchaseData) {
            await sendPurchaseConfirmation({
              name: purchaseData.name,
              email: purchaseData.email,
              token: accessToken,
              streamUrl
            })
          }
        }

        // TODO: Send confirmation email with access token
        console.log(`Payment completed for token: ${accessToken}`)
        break

      case 'payment_intent.payment_failed':
        const paymentIntent = event.data.object
        const failedPurchaseId = paymentIntent.metadata?.purchaseId

        if (failedPurchaseId) {
          await supabase
            .from('purchases')
            .update({ payment_status: 'failed' })
            .eq('id', failedPurchaseId)
        }
        break

      default:
        console.log(`Unhandled event type: ${event.type}`)
    }

    return NextResponse.json({ received: true })
  } catch (error) {
    console.error('Webhook error:', error)
    return NextResponse.json(
      { error: 'Webhook handler failed' },
      { status: 500 }
    )
  }
}