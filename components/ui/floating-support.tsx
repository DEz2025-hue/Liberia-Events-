'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { MessageCircle, X, Mail, Phone } from 'lucide-react'

export function FloatingSupport() {
  const [isOpen, setIsOpen] = useState(false)

  const handleWhatsAppSupport = () => {
    const message = "Hi! I need help with The Money Team Live Concert ticket purchase."
    const whatsappUrl = `https://wa.me/1234567890?text=${encodeURIComponent(message)}`
    window.open(whatsappUrl, '_blank')
  }

  const handleEmailSupport = () => {
    const subject = "Support Request - The Money Team Live Concert"
    const body = "Hi,\n\nI need assistance with:\n\n"
    const emailUrl = `mailto:support@themoneyteam.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`
    window.location.href = emailUrl
  }

  return (
    <>
      {/* Support Card */}
      {isOpen && (
        <div className="fixed bottom-20 right-4 z-50 w-80 max-w-[calc(100vw-2rem)]">
          <Card className="bg-white shadow-2xl border-0">
            <CardHeader className="bg-gradient-to-r from-red-600 to-yellow-600 text-white rounded-t-lg">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">Need Help? 🇱🇷</CardTitle>
                <Button
                  onClick={() => setIsOpen(false)}
                  variant="ghost"
                  size="sm"
                  className="text-white hover:bg-white/20 h-8 w-8 p-0"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="p-4 space-y-3">
              <p className="text-sm text-gray-600">
                Having trouble with your ticket purchase or stream access? We're here to help!
              </p>
              
              <div className="space-y-2">
                <Button
                  onClick={handleWhatsAppSupport}
                  className="w-full bg-green-600 hover:bg-green-700 text-white"
                >
                  <MessageCircle className="w-4 h-4 mr-2" />
                  WhatsApp Support
                </Button>
                
                <Button
                  onClick={handleEmailSupport}
                  variant="outline"
                  className="w-full border-gray-300"
                >
                  <Mail className="w-4 h-4 mr-2" />
                  Email Support
                </Button>
              </div>
              
              <div className="text-xs text-gray-500 text-center pt-2 border-t">
                <div className="flex items-center justify-center gap-1 mb-1">
                  <Phone className="w-3 h-3" />
                  <span>Response time: Usually within 1 hour</span>
                </div>
                <div>Available 24/7 for concert support</div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Floating Button */}
      <Button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-4 right-4 z-50 h-14 w-14 rounded-full bg-gradient-to-r from-red-600 to-yellow-600 hover:from-red-700 hover:to-yellow-700 shadow-2xl border-0 p-0"
      >
        {isOpen ? (
          <X className="w-6 h-6 text-white" />
        ) : (
          <MessageCircle className="w-6 h-6 text-white" />
        )}
      </Button>
    </>
  )
}