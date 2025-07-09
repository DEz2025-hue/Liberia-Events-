'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { CONCERT_CONFIG } from '@/lib/concert-config'
import { supabase } from '@/lib/supabase'
import { 
  Play, 
  Shield, 
  AlertTriangle, 
  Clock, 
  Users, 
  Volume2,
  Maximize,
  Settings,
  Wifi,
  WifiOff
} from 'lucide-react'
import { useSearchParams, useRouter } from 'next/navigation'
import Link from 'next/link'

interface TokenValidation {
  isValid: boolean
  isUsed: boolean
  purchaseInfo?: {
    name: string
    email: string
  }
}

interface StreamSettings {
  isLive: boolean
  streamUrl: string | null
}

export default function StreamPage() {
  const [mounted, setMounted] = useState(false)
  const [loading, setLoading] = useState(true)
  const [tokenValidation, setTokenValidation] = useState<TokenValidation | null>(null)
  const [streamSettings, setStreamSettings] = useState<StreamSettings | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [isFullscreen, setIsFullscreen] = useState(false)
  
  const searchParams = useSearchParams()
  const router = useRouter()
  const token = searchParams.get('token')

  useEffect(() => {
    setMounted(true)
    
    // Store token in localStorage for seamless revisits
    if (token) {
      localStorage.setItem('concertStreamToken', token)
    } else {
      // Check if token exists in localStorage
      const storedToken = localStorage.getItem('concertStreamToken')
      if (storedToken) {
        router.push(`/stream?token=${storedToken}`)
        return
      }
    }
    
    if (token) {
      validateTokenAndLoadStream()
    } else {
      setLoading(false)
      setError('No access token provided')
    }
  }, [token, router])

  const validateTokenAndLoadStream = async () => {
    try {
      setLoading(true)
      
      // Check if token exists and get purchase info
      const { data: purchase, error: purchaseError } = await supabase
        .from('purchases')
        .select('name, email, payment_status')
        .eq('token', token)
        .eq('payment_status', 'completed')
        .single()

      if (purchaseError || !purchase) {
        setTokenValidation({ isValid: false, isUsed: false })
        setError('Invalid or expired access token')
        setLoading(false)
        return
      }

      // Check token usage
      const { data: tokenUsage, error: usageError } = await supabase
        .from('token_usage')
        .select('used, first_accessed_at')
        .eq('token', token)
        .single()

      if (usageError) {
        setError('Error validating token usage')
        setLoading(false)
        return
      }

      if (tokenUsage.used) {
        setTokenValidation({ 
          isValid: true, 
          isUsed: true,
          purchaseInfo: { name: purchase.name, email: purchase.email }
        })
        setError('This access token has already been used on another device')
        setLoading(false)
        return
      }

      // Mark token as used and update usage info
      const userAgent = navigator.userAgent
      const ipAddress = 'client-side' // We'll get this server-side in a real implementation
      
      const { error: updateError } = await supabase
        .from('token_usage')
        .update({
          used: true,
          first_accessed_at: new Date().toISOString(),
          last_accessed_at: new Date().toISOString(),
          ip_address: ipAddress,
          user_agent: userAgent
        })
        .eq('token', token)

      if (updateError) {
        console.error('Error updating token usage:', updateError)
      }

      // Get stream settings
      const { data: streamData, error: streamError } = await supabase
        .from('stream_settings')
        .select('is_live, stream_url')
        .single()

      if (streamError) {
        console.error('Error fetching stream settings:', streamError)
        setStreamSettings({ isLive: false, streamUrl: null })
      } else {
        setStreamSettings({
          isLive: streamData.is_live,
          streamUrl: streamData.stream_url
        })
      }

      setTokenValidation({ 
        isValid: true, 
        isUsed: false,
        purchaseInfo: { name: purchase.name, email: purchase.email }
      })
      
    } catch (error) {
      console.error('Token validation error:', error)
      setError('An error occurred while validating your access')
    } finally {
      setLoading(false)
    }
  }

  const handlePlay = () => {
    setIsPlaying(true)
  }

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen()
      setIsFullscreen(true)
    } else {
      document.exitFullscreen()
      setIsFullscreen(false)
    }
  }

  if (!mounted) {
    return <div className="min-h-screen bg-black" />
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center text-white">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4" />
          <div className="text-lg">Validating your access...</div>
        </div>
      </div>
    )
  }

  if (!token || error || !tokenValidation?.isValid || tokenValidation?.isUsed) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 to-yellow-50 flex items-center justify-center">
        <Card className="max-w-md mx-auto">
          <CardContent className="p-8 text-center">
            <div className="text-red-500 mb-4">
              <AlertTriangle className="w-16 h-16 mx-auto" />
            </div>
            <h1 className="text-2xl font-bold text-gray-800 mb-4">Access Denied</h1>
            <p className="text-gray-600 mb-6">
              {error || 'Invalid access token. Please check your link or purchase a new ticket.'}
            </p>
            {tokenValidation?.isUsed && (
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
                <div className="text-sm text-yellow-800">
                  <strong>Security Notice:</strong> This token has already been used on another device. 
                  Each ticket allows access from one device only for security purposes.
                </div>
              </div>
            )}
            <Link href="/checkout">
              <Button className="bg-gradient-to-r from-red-600 to-yellow-600 hover:from-red-700 hover:to-yellow-700">
                Buy New Ticket
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    )
  }

  // Stream is valid, show the stream interface
  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <div className="bg-gradient-to-r from-red-600 to-yellow-600 p-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div>
            <h1 className="text-xl md:text-2xl font-bold">{CONCERT_CONFIG.name}</h1>
            <p className="text-sm opacity-90">{CONCERT_CONFIG.artist} • Live from SKD Sports Complex</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              {streamSettings?.isLive ? (
                <>
                  <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse" />
                  <span className="text-sm font-semibold">LIVE</span>
                </>
              ) : (
                <>
                  <Clock className="w-4 h-4" />
                  <span className="text-sm">Starting Soon</span>
                </>
              )}
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Users className="w-4 h-4" />
              <span>Welcome, {tokenValidation.purchaseInfo?.name}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Stream Area */}
      <div className="flex-1">
        {streamSettings?.isLive && streamSettings.streamUrl ? (
          <div className="relative">
            {/* Video Player */}
            <div className="aspect-video bg-black relative group">
              {!isPlaying ? (
                <div className="absolute inset-0 flex items-center justify-center bg-black/80">
                  <div className="text-center">
                    <Button
                      onClick={handlePlay}
                      size="lg"
                      className="bg-red-600 hover:bg-red-700 rounded-full w-20 h-20 mb-4"
                    >
                      <Play className="w-8 h-8 ml-1" />
                    </Button>
                    <div className="text-lg font-semibold mb-2">Tap to Play</div>
                    <div className="text-sm text-gray-300">HD Live Stream</div>
                  </div>
                </div>
              ) : (
                <div className="w-full h-full bg-gray-900 flex items-center justify-center">
                  {/* Placeholder for actual video stream */}
                  <div className="text-center">
                    <div className="text-6xl mb-4">🎵</div>
                    <div className="text-xl font-bold mb-2">Live Stream Active</div>
                    <div className="text-gray-300">
                      This is where the actual video stream would appear
                    </div>
                    <div className="text-sm text-gray-400 mt-2">
                      Stream URL: {streamSettings.streamUrl}
                    </div>
                  </div>
                </div>
              )}

              {/* Video Controls */}
              {isPlaying && (
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4 opacity-0 group-hover:opacity-100 transition-opacity">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <Button size="sm" variant="ghost" className="text-white hover:bg-white/20">
                        <Volume2 className="w-4 h-4" />
                      </Button>
                      <div className="text-sm">
                        <span className="text-red-500">●</span> LIVE
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button size="sm" variant="ghost" className="text-white hover:bg-white/20">
                        <Settings className="w-4 h-4" />
                      </Button>
                      <Button 
                        size="sm" 
                        variant="ghost" 
                        className="text-white hover:bg-white/20"
                        onClick={toggleFullscreen}
                      >
                        <Maximize className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="aspect-video bg-gray-900 flex items-center justify-center">
            <div className="text-center">
              <div className="text-6xl mb-6">🎤</div>
              <h2 className="text-2xl font-bold mb-4">Stream Starting Soon</h2>
              <p className="text-gray-300 mb-6 max-w-md">
                The live stream will begin shortly before the concert starts. 
                Keep this page open and we&apos;ll automatically connect you when we go live.
              </p>
              <div className="flex items-center justify-center gap-2 text-sm text-gray-400">
                <Clock className="w-4 h-4" />
                <span>July 26th, 2025 • 8:00 PM GMT</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Stream Info */}
      <div className="bg-gray-900 p-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div className="flex items-center gap-2">
              <Shield className="w-4 h-4 text-green-500" />
              <span>Secure Stream • One-Time Access</span>
            </div>
            <div className="flex items-center gap-2">
              <Wifi className="w-4 h-4 text-blue-500" />
              <span>HD Quality • Mobile Optimized</span>
            </div>
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4 text-purple-500" />
              <span>Exclusive Diaspora Event</span>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="bg-black p-4 text-center text-sm text-gray-400">
        <p>🇱🇷 Liberia First, Liberia Last • We&apos;re doing this one for the Culture</p>
      </div>
    </div>
  )
}