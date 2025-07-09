'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { CONCERT_CONFIG } from '@/lib/concert-config'
import { 
  Play, 
  Calendar, 
  MapPin, 
  Clock, 
  Users, 
  Globe,
  ArrowRight,
  Star,
  Music,
  Flag,
  Shield
} from 'lucide-react'
import Link from 'next/link'

export default function HomePage() {
  const [isHovered, setIsHovered] = useState(false)

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  const formatTime = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      timeZoneName: 'short'
    })
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-white">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 bg-gradient-to-br from-red-600/10 to-white/20" />
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            {/* Liberian Flag */}
            <div className="flex justify-center mb-6">
              <div className="flex space-x-1">
                <div className="w-4 h-8 bg-red-600"></div>
                <div className="w-4 h-8 bg-white"></div>
                <div className="w-4 h-8 bg-red-600"></div>
                <div className="w-4 h-8 bg-white"></div>
                <div className="w-4 h-8 bg-red-600"></div>
                <div className="w-4 h-8 bg-white"></div>
                <div className="w-4 h-8 bg-red-600"></div>
                <div className="w-4 h-8 bg-white"></div>
                <div className="w-4 h-8 bg-red-600"></div>
                <div className="w-4 h-8 bg-white"></div>
                <div className="w-4 h-8 bg-red-600"></div>
                <div className="w-4 h-8 bg-white"></div>
                <div className="w-4 h-8 bg-red-600"></div>
              </div>
            </div>

            {/* Main Title */}
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
              <span className="bg-gradient-to-r from-red-600 to-red-800 bg-clip-text text-transparent">
                {CONCERT_CONFIG.name}
              </span>
            </h1>
            
            <h2 className="text-2xl md:text-3xl font-semibold text-gray-700 mb-4">
              Featuring <span className="text-red-600">{CONCERT_CONFIG.artist}</span>
            </h2>

            {/* Event Details */}
            <div className="flex flex-wrap justify-center gap-6 mb-8 text-gray-600">
              <div className="flex items-center gap-2">
                <Calendar className="w-5 h-5 text-red-600" />
                <span>{formatDate(CONCERT_CONFIG.date)}</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-5 h-5 text-red-600" />
                <span>{formatTime(CONCERT_CONFIG.date)}</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="w-5 h-5 text-red-600" />
                <span>{CONCERT_CONFIG.venue}, {CONCERT_CONFIG.location}</span>
              </div>
            </div>

            {/* Description */}
            <p className="text-xl text-gray-700 mb-8 max-w-3xl mx-auto">
              {CONCERT_CONFIG.description}
            </p>

            {/* CTA Button */}
            <div className="mb-12">
              <Link href="/checkout">
                <Button 
                  size="lg" 
                  className="bg-gradient-to-r from-red-600 to-red-800 hover:from-red-700 hover:to-red-900 text-white px-8 py-4 text-lg font-semibold"
                  onMouseEnter={() => setIsHovered(true)}
                  onMouseLeave={() => setIsHovered(false)}
                >
                  <Play className="w-5 h-5 mr-2" />
                  Secure Your Ticket - ${CONCERT_CONFIG.price}
                  <ArrowRight className={`w-5 h-5 ml-2 transition-transform ${isHovered ? 'translate-x-1' : ''}`} />
                </Button>
              </Link>
            </div>

            {/* Live Stream Badge */}
            <div className="inline-flex items-center gap-2 bg-red-100 text-red-800 px-4 py-2 rounded-full">
              <Globe className="w-4 h-4" />
              <span className="font-medium">Live Stream Available Worldwide</span>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
            <CardHeader>
              <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center mb-4">
                <Music className="w-6 h-6 text-red-600" />
              </div>
              <CardTitle>HD Live Stream</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">
                Crystal clear HD quality stream from SKD Sports Complex, bringing the concert experience directly to your device.
              </p>
            </CardContent>
          </Card>

          <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
            <CardHeader>
              <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center mb-4">
                <Users className="w-6 h-6 text-red-600" />
              </div>
              <CardTitle>Global Access</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">
                Join thousands of Liberians worldwide for this exclusive diaspora streaming event. Connect with your community.
              </p>
            </CardContent>
          </Card>

          <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
            <CardHeader>
              <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center mb-4">
                <Shield className="w-6 h-6 text-red-600" />
              </div>
              <CardTitle>Secure Access</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">
                One-time access tokens ensure your stream is secure and private. Mobile and desktop compatible.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* About Section */}
      <div className="bg-white/50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              About the Event
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Experience the vibrant culture of Liberia through music. This exclusive live stream brings together the diaspora 
              community for a night of celebration, connection, and cultural pride.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div>
              <h3 className="text-2xl font-semibold text-gray-900 mb-4">
                Liberia First, Liberia Last
              </h3>
              <p className="text-gray-600 mb-6">
                We&apos;re doing this one for the Culture. Join us as we celebrate Liberian music, culture, and community 
                through this groundbreaking digital concert experience.
              </p>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <Star className="w-5 h-5 text-red-500" />
                  <span>Exclusive diaspora streaming event</span>
                </div>
                <div className="flex items-center gap-3">
                  <Star className="w-5 h-5 text-red-500" />
                  <span>HD quality from SKD Sports Complex</span>
                </div>
                <div className="flex items-center gap-3">
                  <Star className="w-5 h-5 text-red-500" />
                  <span>Secure one-time access tokens</span>
                </div>
                <div className="flex items-center gap-3">
                  <Star className="w-5 h-5 text-red-500" />
                  <span>Mobile and desktop compatible</span>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-red-600 to-red-800 rounded-lg p-8 text-white text-center">
              <div className="text-4xl mb-4">🎵</div>
              <h3 className="text-2xl font-bold mb-4">Christoph The Change</h3>
              <p className="text-lg opacity-90 mb-6">
                Leading the charge in Liberian music and culture, bringing authentic sounds to the global stage.
              </p>
              <div className="flex justify-center">
                <Flag className="w-8 h-8" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-gradient-to-r from-red-600 to-red-800 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Don&apos;t Miss This Historic Event
          </h2>
          <p className="text-xl mb-8 opacity-90">
            Join the global Liberian community for this exclusive live streaming concert experience.
          </p>
          <Link href="/checkout">
            <Button 
              size="lg" 
              variant="secondary"
              className="bg-white text-red-600 hover:bg-gray-100 px-8 py-4 text-lg font-semibold"
            >
              <Play className="w-5 h-5 mr-2" />
              Get Your Ticket Now - ${CONCERT_CONFIG.price}
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}