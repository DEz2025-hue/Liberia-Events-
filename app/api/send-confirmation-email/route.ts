import { NextRequest, NextResponse } from 'next/server'
import { sendPurchaseConfirmation } from '@/lib/email'

export async function POST(request: NextRequest) {
  try {
    const { name, email, token } = await request.json()

    if (!name || !email || !token) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    const streamUrl = `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/stream?token=${token}`

    const success = await sendPurchaseConfirmation({
      name,
      email,
      token,
      streamUrl
    })

    if (success) {
      return NextResponse.json({ success: true })
    } else {
      return NextResponse.json(
        { error: 'Failed to send email' },
        { status: 500 }
      )
    }
  } catch (error) {
    console.error('Email sending error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}