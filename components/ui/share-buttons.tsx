'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { 
  Share2, 
  MessageCircle, 
  Facebook, 
  Send, 
  Copy, 
  Check,
  Calendar,
  Download
} from 'lucide-react'
import { 
  shareNatively, 
  getShareData, 
  getWhatsAppShareUrl, 
  getFacebookShareUrl, 
  getMessengerShareUrl,
  copyToClipboard 
} from '@/lib/utils/sharing'
import { generateCalendarLink, generateICSFile } from '@/lib/utils/date'

interface ShareButtonsProps {
  variant?: 'desktop' | 'mobile'
  className?: string
}

export function ShareButtons({ variant = 'desktop', className = '' }: ShareButtonsProps) {
  const [copied, setCopied] = useState(false)
  const [showAll, setShowAll] = useState(false)

  const handleNativeShare = async () => {
    const shareData = getShareData()
    const shared = await shareNatively(shareData)
    
    if (!shared) {
      setShowAll(true)
    }
  }

  const handleCopyLink = async () => {
    const success = await copyToClipboard(window.location.href)
    if (success) {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  const handleAddToCalendar = () => {
    const calendarUrl = generateCalendarLink()
    window.open(calendarUrl, '_blank')
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

  const shareData = getShareData()

  if (variant === 'mobile') {
    return (
      <div className={`space-y-4 ${className}`}>
        {/* Native Share Button */}
        <Button
          onClick={handleNativeShare}
          className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
          size="lg"
        >
          <Share2 className="w-5 h-5 mr-2" />
          Share with Friends
        </Button>

        {/* Calendar Buttons */}
        <div className="grid grid-cols-2 gap-2">
          <Button
            onClick={handleAddToCalendar}
            variant="outline"
            className="border-green-200 hover:bg-green-50"
          >
            <Calendar className="w-4 h-4 mr-2" />
            Add to Calendar
          </Button>
          
          <Button
            onClick={handleDownloadICS}
            variant="outline"
            className="border-blue-200 hover:bg-blue-50"
          >
            <Download className="w-4 h-4 mr-2" />
            Download .ics
          </Button>
        </div>

        {/* Show individual share options if native sharing failed */}
        {showAll && (
          <div className="grid grid-cols-2 gap-2 pt-2 border-t">
            <Button
              onClick={() => window.open(getWhatsAppShareUrl(shareData.text, shareData.url), '_blank')}
              className="bg-green-600 hover:bg-green-700 text-white"
            >
              <MessageCircle className="w-4 h-4 mr-2" />
              WhatsApp
            </Button>
            
            <Button
              onClick={() => window.open(getFacebookShareUrl(shareData.url), '_blank')}
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              <Facebook className="w-4 h-4 mr-2" />
              Facebook
            </Button>
            
            <Button
              onClick={() => window.open(getMessengerShareUrl(shareData.url), '_blank')}
              className="bg-blue-500 hover:bg-blue-600 text-white"
            >
              <Send className="w-4 h-4 mr-2" />
              Messenger
            </Button>
            
            <Button
              onClick={handleCopyLink}
              variant="outline"
              className="border-gray-300"
            >
              {copied ? (
                <>
                  <Check className="w-4 h-4 mr-2 text-green-600" />
                  Copied!
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4 mr-2" />
                  Copy Link
                </>
              )}
            </Button>
          </div>
        )}
      </div>
    )
  }

  // Desktop variant
  return (
    <div className={`flex flex-wrap gap-3 justify-center ${className}`}>
      <Button
        onClick={handleNativeShare}
        className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
      >
        <Share2 className="w-4 h-4 mr-2" />
        Share
      </Button>
      
      <Button
        onClick={() => window.open(getWhatsAppShareUrl(shareData.text, shareData.url), '_blank')}
        className="bg-green-600 hover:bg-green-700 text-white"
      >
        <MessageCircle className="w-4 h-4 mr-2" />
        WhatsApp
      </Button>
      
      <Button
        onClick={() => window.open(getFacebookShareUrl(shareData.url), '_blank')}
        className="bg-blue-600 hover:bg-blue-700 text-white"
      >
        <Facebook className="w-4 h-4 mr-2" />
        Facebook
      </Button>
      
      <Button
        onClick={handleAddToCalendar}
        variant="outline"
        className="border-green-200 hover:bg-green-50"
      >
        <Calendar className="w-4 h-4 mr-2" />
        Add to Calendar
      </Button>
      
      <Button
        onClick={handleCopyLink}
        variant="outline"
        className="border-gray-300"
      >
        {copied ? (
          <>
            <Check className="w-4 h-4 mr-2 text-green-600" />
            Copied!
          </>
        ) : (
          <>
            <Copy className="w-4 h-4 mr-2" />
            Copy Link
          </>
        )}
      </Button>
    </div>
  )
}