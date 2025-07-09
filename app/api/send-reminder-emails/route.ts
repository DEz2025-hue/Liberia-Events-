import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import { sendEventReminder } from '@/lib/email'
import { CONCERT_CONFIG } from '@/lib/concert-config'

export async function POST(request: NextRequest) {
  try {
    // Get all completed purchases
    const { data: purchases, error } = await supabase
      .from('purchases')
      .select('name, email, token')
      .eq('payment_status', 'completed')

    if (error) {
      console.error('Error fetching purchases:', error)
      return NextResponse.json(
        { error: 'Failed to fetch purchases' },
        { status: 500 }
      )
    }

    if (!purchases || purchases.length === 0) {
      return NextResponse.json({ message: 'No purchases found' })
    }

    // Calculate time until event
    const now = new Date()
    const eventDate = new Date(CONCERT_CONFIG.date)
    const timeDiff = eventDate.getTime() - now.getTime()
    const hours = Math.floor(timeDiff / (1000 * 60 * 60))
    const minutes = Math.floor((timeDiff % (1000 * 60 * 60)) / (1000 * 60))
    
    let timeUntilEvent = ''
    if (hours > 0) {
      timeUntilEvent = `${hours} hour${hours > 1 ? 's' : ''} and ${minutes} minute${minutes > 1 ? 's' : ''}`
    } else if (minutes > 0) {
      timeUntilEvent = `${minutes} minute${minutes > 1 ? 's' : ''}`
    } else {
      timeUntilEvent = 'Starting now!'
    }

    // Send reminder emails
    const emailPromises = purchases.map(async (purchase) => {
      const streamUrl = `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/stream?token=${purchase.token}`
      
      return sendEventReminder({
        name: purchase.name,
        email: purchase.email,
        token: purchase.token,
        streamUrl,
        timeUntilEvent
      })
    })

    const results = await Promise.allSettled(emailPromises)
    const successful = results.filter(result => result.status === 'fulfilled').length
    const failed = results.filter(result => result.status === 'rejected').length

    return NextResponse.json({
      message: `Reminder emails processed`,
      successful,
      failed,
      total: purchases.length
    })

  } catch (error) {
    console.error('Reminder email error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}