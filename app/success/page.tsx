'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { CONCERT_CONFIG } from '@/lib/concert-config'
import { generateCalendarLink, generateICSFile } from '@/lib/utils/date'
import { 
  CheckCircle, 
  Calendar, 
  Download, 
  ExternalLink, 
  Mail, 
  Clock,
  Smartphone,
  Share2,
  Copy
} from 'lucide-react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { ShareButtons } from '@/components/ui/share-buttons'

export default function SuccessPage() {
  const [mounted, setMounted] = useState(false)
  const [copied, setCopied] = useState(false)
  const searchParams = useSearchParams()
  const token = searchParams.get('token')
  const sessionId = searchParams.get('session_id')

  useEffect(() => {
    setMounted(true)
  }, [])

  const streamUrl = `${window.location.origin}/stream?token=${token}`

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(streamUrl)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (error) {
      console.error('Failed to copy:', error)
    }
  }

  const handleDownloadICS = () => {
    const icsContent = generateICSFile()
    const blob = new Blob([icsContent], { type: 'text/calendar' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'the-money-team-concert.ics'
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  if (!mounted) {
    return <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50" />
  }

  if (!token) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 to-yellow-50 flex items-center justify-center">
        <Card className="max-w-md mx-auto">
          <CardContent className="p-8 text-center">
            <div className="text-red-500 mb-4">
              <ExternalLink className="w-16 h-16 mx-auto" />
            </div>
            <h1 className="text-2xl font-bold text-gray-800 mb-4">Invalid Access</h1>
            <p className="text-gray-600 mb-6">
              No valid token found. Please complete your purchase first.
            </p>
            <Link href="/checkout">
              <Button className="bg-gradient-to-r from-red-600 to-yellow-600 hover:from-red-700 hover:to-yellow-700">
                Buy Ticket
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-purple-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Success Header */}
        <div className="text-center mb-8">
          <div className="bg-green-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-12 h-12 text-green-600" />
          </div>
          
          <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
            🎉 Payment Successful!
          </h1>
          
          <p className="text-lg text-gray-600 mb-2">
            Your ticket for <strong>The Money Team Live in Concert</strong> has been confirmed
          </p>
          
          <div className="text-sm text-gray-500">
            Session ID: {sessionId}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Stream Access Card */}
          <Card className="bg-white/80 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Smartphone className="w-5 h-5 text-blue-600" />
                Your Stream Access
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Stream Link */}
              <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg p-4">
                <div className="text-center">
                  <div className="text-lg font-bold mb-2">🔗 Your Personal Stream Link</div>
                  <div className="bg-white/20 rounded p-2 text-sm font-mono break-all">
                    {streamUrl}
                  </div>
                </div>
              </div>

              {/* Copy Link Button */}
              <Button
                onClick={handleCopyLink}
                className="w-full"
                variant={copied ? "default" : "outline"}
              >
                {copied ? (
                  <>
                    <CheckCircle className="w-4 h-4 mr-2" />
                    Copied!
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4 mr-2" />
                    Copy Stream Link
                  </>
                )}
              </Button>

              {/* Access Instructions */}
              <div className="space-y-3 text-sm text-gray-600">
                <div className="flex items-start gap-3">
                  <div className="bg-blue-100 rounded-full p-1 mt-0.5">
                    <div className="w-2 h-2 bg-blue-600 rounded-full" />
                  </div>
                  <div>
                    <strong>Save this link!</strong> You'll need it to watch the concert on July 26th
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="bg-blue-100 rounded-full p-1 mt-0.5">
                    <div className="w-2 h-2 bg-blue-600 rounded-full" />
                  </div>
                  <div>
                    <strong>One-time use:</strong> This link works on one device only for security
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="bg-blue-100 rounded-full p-1 mt-0.5">
                    <div className="w-2 h-2 bg-blue-600 rounded-full" />
                  </div>
                  <div>
                    <strong>Mobile friendly:</strong> Works perfectly on phones, tablets, and computers
                  </div>
                </div>
              </div>

              {/* Direct Access Button */}
              <Link href={`/stream?token=${token}`}>
                <Button className="w-full bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700">
                  <ExternalLink className="w-4 h-4 mr-2" />
                  Go to Stream Page
                </Button>
              </Link>
            </CardContent>
          </Card>

          {/* Event Details & Calendar */}
          <Card className="bg-white/80 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="w-5 h-5 text-red-600" />
                Event Details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Concert Info */}
              <div className="bg-gradient-to-r from-red-600 to-yellow-600 text-white rounded-lg p-4">
                <div className="text-center">
                  <div className="text-xl font-bold mb-1">{CONCERT_CONFIG.name}</div>
                  <div className="text-lg opacity-90">{CONCERT_CONFIG.artist}</div>
                  <div className="text-sm opacity-80 mt-2">
                    July 26th, 2025 • 8:00 PM GMT • SKD Sports Complex
                  </div>
                </div>
              </div>

              {/* Add to Calendar Options */}
              <div className="space-y-3">
                <h3 className="font-semibold text-gray-800">Add to Your Calendar</h3>
                
                <div className="grid grid-cols-1 gap-2">
                  <a
                    href={generateCalendarLink()}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 p-3 border rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <Calendar className="w-5 h-5 text-blue-600" />
                    <span>Google Calendar</span>
                    <ExternalLink className="w-4 h-4 ml-auto text-gray-400" />
                  </a>
                  
                  <button
                    onClick={handleDownloadICS}
                    className="flex items-center gap-3 p-3 border rounded-lg hover:bg-gray-50 transition-colors text-left"
                  >
                    <Download className="w-5 h-5 text-green-600" />
                    <span>Download .ics file</span>
                    <div className="ml-auto text-xs text-gray-500">For Outlook, Apple Calendar</div>
                  </button>
                </div>
              </div>

              {/* Reminder Info */}
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <Clock className="w-5 h-5 text-yellow-600 mt-0.5" />
                  <div>
                    <div className="font-semibold text-yellow-800">Email Reminder</div>
                    <div className="text-sm text-yellow-700">
                      We'll send you a reminder 1 hour before the event starts with your stream link.
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Share Section */}
        <div className="mt-12 text-center">
          <h3 className="text-2xl font-bold text-gray-800 mb-4">
            Spread the Word! 🇱🇷
          </h3>
          <p className="text-gray-600 mb-6">
            Invite your friends and family to join this historic celebration of Liberian culture
          </p>
          <ShareButtons variant="desktop" className="justify-center" />
        </div>

        {/* Next Steps */}
        <div className="mt-12 bg-white/60 backdrop-blur-sm rounded-lg p-6">
          <h3 className="text-xl font-bold text-gray-800 mb-4 text-center">What's Next?</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
            <div>
              <div className="bg-blue-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3">
                <Mail className="w-6 h-6 text-blue-600" />
              </div>
              <h4 className="font-semibold text-gray-800 mb-2">Check Your Email</h4>
              <p className="text-sm text-gray-600">
                Confirmation email with your stream link is on its way
              </p>
            </div>
            
            <div>
              <div className="bg-green-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3">
                <Calendar className="w-6 h-6 text-green-600" />
              </div>
              <h4 className="font-semibold text-gray-800 mb-2">Save the Date</h4>
              <p className="text-sm text-gray-600">
                Add the event to your calendar so you don't miss it
              </p>
            </div>
            
            <div>
              <div className="bg-purple-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3">
                <Share2 className="w-6 h-6 text-purple-600" />
              </div>
              <h4 className="font-semibold text-gray-800 mb-2">Share with Friends</h4>
              <p className="text-sm text-gray-600">
                Let other Liberians know about this amazing event
              </p>
            </div>
          </div>
        </div>

        {/* Support */}
        <div className="mt-8 text-center text-sm text-gray-500">
          <p>
            Need help? Contact our support team or use the floating support button.
          </p>
        </div>
      </div>
    </div>
  )
}