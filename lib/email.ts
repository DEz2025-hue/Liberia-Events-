// Email functionality - Dummy implementation for now
// In production, integrate with services like SendGrid, Mailgun, or AWS SES

export interface EmailData {
  to: string
  subject: string
  html: string
  text?: string
}

export interface PurchaseConfirmationData {
  name: string
  email: string
  token: string
  streamUrl: string
}

export interface EventReminderData {
  name: string
  email: string
  token: string
  streamUrl: string
  timeUntilEvent: string
}

export async function sendPurchaseConfirmation(data: PurchaseConfirmationData): Promise<boolean> {
  const emailData: EmailData = {
    to: data.email,
    subject: '🎵 Your Ticket Confirmed - The Money Team Live in Concert',
    html: generatePurchaseConfirmationHTML(data),
    text: generatePurchaseConfirmationText(data)
  }

  // Dummy implementation - log to console
  console.log('📧 SENDING PURCHASE CONFIRMATION EMAIL:')
  console.log('To:', emailData.to)
  console.log('Subject:', emailData.subject)
  console.log('Stream URL:', data.streamUrl)
  console.log('Token:', data.token)
  
  // In production, replace with actual email service
  // Example with SendGrid:
  // const response = await sendGridClient.send(emailData)
  // return response.statusCode === 202
  
  return true // Simulate successful send
}

export async function sendEventReminder(data: EventReminderData): Promise<boolean> {
  const emailData: EmailData = {
    to: data.email,
    subject: '⏰ Concert Starting Soon - The Money Team Live',
    html: generateEventReminderHTML(data),
    text: generateEventReminderText(data)
  }

  // Dummy implementation - log to console
  console.log('📧 SENDING EVENT REMINDER EMAIL:')
  console.log('To:', emailData.to)
  console.log('Subject:', emailData.subject)
  console.log('Time until event:', data.timeUntilEvent)
  console.log('Stream URL:', data.streamUrl)
  
  return true // Simulate successful send
}

function generatePurchaseConfirmationHTML(data: PurchaseConfirmationData): string {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Your Concert Ticket Confirmed</title>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #dc2626, #eab308); color: white; padding: 30px; text-align: center; border-radius: 8px 8px 0 0; }
        .content { background: #f9fafb; padding: 30px; border-radius: 0 0 8px 8px; }
        .button { display: inline-block; background: linear-gradient(135deg, #dc2626, #eab308); color: white; padding: 15px 30px; text-decoration: none; border-radius: 6px; font-weight: bold; margin: 20px 0; }
        .token-box { background: #1f2937; color: #10b981; padding: 15px; border-radius: 6px; font-family: monospace; word-break: break-all; margin: 20px 0; }
        .footer { text-align: center; padding: 20px; color: #6b7280; font-size: 14px; }
        .flag { font-size: 24px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <div class="flag">🇱🇷</div>
          <h1>Payment Confirmed!</h1>
          <p>Your ticket for The Money Team Live in Concert is ready</p>
        </div>
        
        <div class="content">
          <h2>Hello ${data.name}!</h2>
          
          <p>Thank you for purchasing your ticket to <strong>The Money Team Live in Concert</strong> featuring <strong>Christoph The Change</strong>!</p>
          
          <div style="background: #fef3c7; border: 1px solid #f59e0b; padding: 15px; border-radius: 6px; margin: 20px 0;">
            <h3 style="margin: 0 0 10px 0; color: #92400e;">🎫 Event Details</h3>
            <p style="margin: 5px 0;"><strong>Date:</strong> July 26th, 2025</p>
            <p style="margin: 5px 0;"><strong>Time:</strong> 8:00 PM GMT (Liberian Time)</p>
            <p style="margin: 5px 0;"><strong>Venue:</strong> SKD Sports Complex, Liberia</p>
            <p style="margin: 5px 0;"><strong>Type:</strong> HD Live Stream</p>
          </div>
          
          <h3>🔗 Your Stream Access Link</h3>
          <p>Save this link to watch the concert:</p>
          <div class="token-box">${data.streamUrl}</div>
          
          <a href="${data.streamUrl}" class="button">Access Your Stream</a>
          
          <div style="background: #fef2f2; border: 1px solid #fca5a5; padding: 15px; border-radius: 6px; margin: 20px 0;">
            <h4 style="margin: 0 0 10px 0; color: #991b1b;">🔒 Important Security Information</h4>
            <ul style="margin: 0; padding-left: 20px;">
              <li>This link works on <strong>ONE DEVICE ONLY</strong> for security</li>
              <li>Do not share this link with others</li>
              <li>Save this email - you'll need it on concert day</li>
            </ul>
          </div>
          
          <h3>📅 Add to Your Calendar</h3>
          <p>Don't forget the date! We recommend adding this event to your calendar.</p>
          
          <h3>📱 What to Expect</h3>
          <ul>
            <li>HD quality live stream from SKD Sports Complex</li>
            <li>Mobile and desktop compatible</li>
            <li>We'll send you a reminder 1 hour before the event</li>
            <li>Stream starts 15 minutes before the concert</li>
          </ul>
          
          <p style="margin-top: 30px;"><strong>Liberia First, Liberia Last!</strong> 🇱🇷<br>
          We're doing this one for the Culture.</p>
        </div>
        
        <div class="footer">
          <p>Need help? Contact our support team</p>
          <p>The Money Team Live • Celebrating Liberian Culture Worldwide</p>
        </div>
      </div>
    </body>
    </html>
  `
}

function generatePurchaseConfirmationText(data: PurchaseConfirmationData): string {
  return `
🇱🇷 THE MONEY TEAM LIVE IN CONCERT - PAYMENT CONFIRMED

Hello ${data.name}!

Thank you for purchasing your ticket to The Money Team Live in Concert featuring Christoph The Change!

EVENT DETAILS:
- Date: July 26th, 2025
- Time: 8:00 PM GMT (Liberian Time)
- Venue: SKD Sports Complex, Liberia
- Type: HD Live Stream

YOUR STREAM ACCESS LINK:
${data.streamUrl}

IMPORTANT:
- This link works on ONE DEVICE ONLY for security
- Do not share this link with others
- Save this email - you'll need it on concert day
- We'll send you a reminder 1 hour before the event

Liberia First, Liberia Last! 🇱🇷
We're doing this one for the Culture.

Need help? Contact our support team.
  `
}

function generateEventReminderHTML(data: EventReminderData): string {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Concert Starting Soon!</title>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #dc2626, #eab308); color: white; padding: 30px; text-align: center; border-radius: 8px 8px 0 0; }
        .content { background: #f9fafb; padding: 30px; border-radius: 0 0 8px 8px; }
        .button { display: inline-block; background: linear-gradient(135deg, #dc2626, #eab308); color: white; padding: 15px 30px; text-decoration: none; border-radius: 6px; font-weight: bold; margin: 20px 0; }
        .urgent { background: #fef2f2; border: 2px solid #dc2626; padding: 20px; border-radius: 6px; margin: 20px 0; text-align: center; }
        .footer { text-align: center; padding: 20px; color: #6b7280; font-size: 14px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>🚨 Concert Starting Soon!</h1>
          <p>The Money Team Live in Concert</p>
        </div>
        
        <div class="content">
          <h2>Hello ${data.name}!</h2>
          
          <div class="urgent">
            <h3 style="margin: 0 0 10px 0; color: #dc2626;">⏰ ${data.timeUntilEvent}</h3>
            <p style="margin: 0; font-size: 18px;">The concert is about to begin!</p>
          </div>
          
          <p>Get ready for an amazing night with <strong>Christoph The Change</strong> live from SKD Sports Complex!</p>
          
          <h3>🔗 Your Stream Link (Ready Now)</h3>
          <a href="${data.streamUrl}" class="button" style="font-size: 18px;">JOIN THE STREAM NOW</a>
          
          <div style="background: #f0f9ff; border: 1px solid #0ea5e9; padding: 15px; border-radius: 6px; margin: 20px 0;">
            <h4 style="margin: 0 0 10px 0; color: #0c4a6e;">📱 Quick Tips</h4>
            <ul style="margin: 0; padding-left: 20px;">
              <li>Click the link above to access your stream</li>
              <li>Make sure you have a stable internet connection</li>
              <li>The stream works best on updated browsers</li>
              <li>Volume up and enjoy! 🎵</li>
            </ul>
          </div>
          
          <p style="margin-top: 30px; text-align: center; font-size: 18px;">
            <strong>🇱🇷 Liberia First, Liberia Last! 🇱🇷</strong><br>
            Let's celebrate our culture together!
          </p>
        </div>
        
        <div class="footer">
          <p>Having trouble? Contact support immediately</p>
          <p>The Money Team Live • Celebrating Liberian Culture Worldwide</p>
        </div>
      </div>
    </body>
    </html>
  `
}

function generateEventReminderText(data: EventReminderData): string {
  return `
🚨 CONCERT STARTING SOON! 🚨

Hello ${data.name}!

The Money Team Live in Concert featuring Christoph The Change is starting in ${data.timeUntilEvent}!

YOUR STREAM LINK (READY NOW):
${data.streamUrl}

QUICK TIPS:
- Click the link above to access your stream
- Make sure you have a stable internet connection
- The stream works best on updated browsers
- Volume up and enjoy! 🎵

🇱🇷 Liberia First, Liberia Last! 🇱🇷
Let's celebrate our culture together!

Having trouble? Contact support immediately.
  `
}

// Function to schedule reminder emails (dummy implementation)
export async function scheduleEventReminders(): Promise<void> {
  console.log('📅 SCHEDULING EVENT REMINDERS')
  console.log('In production, this would:')
  console.log('1. Query all completed purchases')
  console.log('2. Schedule emails 1 hour before event')
  console.log('3. Use a job queue or cron service')
  console.log('4. Send personalized reminders with stream links')
}