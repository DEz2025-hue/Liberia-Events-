'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { supabase } from '@/lib/supabase'
import { 
  Shield, 
  Users, 
  DollarSign, 
  Eye, 
  EyeOff, 
  RefreshCw, 
  Trash2,
  ToggleLeft,
  ToggleRight,
  Mail,
  Download,
  AlertTriangle
} from 'lucide-react'

interface Purchase {
  id: string
  name: string
  email: string
  token: string
  payment_status: 'pending' | 'completed' | 'failed'
  created_at: string
}

interface TokenUsage {
  id: string
  token: string
  used: boolean
  first_accessed_at: string | null
  last_accessed_at: string | null
  ip_address: string | null
  user_agent: string | null
}

interface StreamSettings {
  id: string
  is_live: boolean
  stream_url: string | null
}

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  
  // Data states
  const [purchases, setPurchases] = useState<Purchase[]>([])
  const [tokenUsages, setTokenUsages] = useState<TokenUsage[]>([])
  const [streamSettings, setStreamSettings] = useState<StreamSettings | null>(null)
  const [stats, setStats] = useState({
    totalSales: 0,
    ticketCount: 0,
    usedTokens: 0,
    pendingPayments: 0
  })

  const ADMIN_PASSWORD = process.env.NEXT_PUBLIC_ADMIN_PASSWORD || 'Liberia@26'

  useEffect(() => {
    // Check if already authenticated
    const authStatus = localStorage.getItem('adminAuthenticated')
    if (authStatus === 'true') {
      setIsAuthenticated(true)
      loadDashboardData()
    }
  }, [])

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    if (password === ADMIN_PASSWORD) {
      setIsAuthenticated(true)
      localStorage.setItem('adminAuthenticated', 'true')
      setError('')
      loadDashboardData()
    } else {
      setError('Invalid password')
    }
  }

  const handleLogout = () => {
    setIsAuthenticated(false)
    localStorage.removeItem('adminAuthenticated')
    setPassword('')
  }

  const loadDashboardData = async () => {
    setLoading(true)
    try {
      // Load purchases
      const { data: purchasesData, error: purchasesError } = await supabase
        .from('purchases')
        .select('*')
        .order('created_at', { ascending: false })

      if (purchasesError) throw purchasesError
      setPurchases(purchasesData || [])

      // Load token usage
      const { data: tokenData, error: tokenError } = await supabase
        .from('token_usage')
        .select('*')
        .order('created_at', { ascending: false })

      if (tokenError) throw tokenError
      setTokenUsages(tokenData || [])

      // Load stream settings
      const { data: streamData, error: streamError } = await supabase
        .from('stream_settings')
        .select('*')
        .single()

      if (streamError) throw streamError
      setStreamSettings(streamData)

      // Calculate stats
      const completedPurchases = purchasesData?.filter(p => p.payment_status === 'completed') || []
      const usedTokensCount = tokenData?.filter(t => t.used).length || 0
      const pendingCount = purchasesData?.filter(p => p.payment_status === 'pending').length || 0

      setStats({
        totalSales: completedPurchases.length * 10, // $10 per ticket
        ticketCount: completedPurchases.length,
        usedTokens: usedTokensCount,
        pendingPayments: pendingCount
      })

    } catch (error) {
      console.error('Error loading dashboard data:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleResendToken = async (email: string, token: string) => {
    // Dummy email function - in production, this would send an actual email
    alert(`Email sent to ${email} with stream link: ${window.location.origin}/stream?token=${token}`)
  }

  const handleRevokeToken = async (tokenId: string) => {
    try {
      const { error } = await supabase
        .from('token_usage')
        .update({ used: false, first_accessed_at: null, last_accessed_at: null })
        .eq('id', tokenId)

      if (error) throw error
      
      alert('Token revoked successfully')
      loadDashboardData()
    } catch (error) {
      console.error('Error revoking token:', error)
      alert('Error revoking token')
    }
  }

  const handleToggleStream = async () => {
    if (!streamSettings) return

    try {
      const { error } = await supabase
        .from('stream_settings')
        .update({ is_live: !streamSettings.is_live })
        .eq('id', streamSettings.id)

      if (error) throw error
      
      setStreamSettings({ ...streamSettings, is_live: !streamSettings.is_live })
    } catch (error) {
      console.error('Error toggling stream:', error)
      alert('Error updating stream status')
    }
  }

  const handleUpdateStreamUrl = async (newUrl: string) => {
    if (!streamSettings) return

    try {
      const { error } = await supabase
        .from('stream_settings')
        .update({ stream_url: newUrl })
        .eq('id', streamSettings.id)

      if (error) throw error
      
      setStreamSettings({ ...streamSettings, stream_url: newUrl })
      alert('Stream URL updated successfully')
    } catch (error) {
      console.error('Error updating stream URL:', error)
      alert('Error updating stream URL')
    }
  }

  const exportData = () => {
    const data = {
      purchases,
      tokenUsages,
      stats,
      exportedAt: new Date().toISOString()
    }
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `concert-data-${new Date().toISOString().split('T')[0]}.json`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="bg-red-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <Shield className="w-8 h-8 text-red-600" />
            </div>
            <CardTitle className="text-2xl">Admin Access</CardTitle>
            <p className="text-gray-600">Enter password to access the dashboard</p>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter admin password"
                  className={error ? "border-red-500" : ""}
                />
                {error && (
                  <p className="text-sm text-red-600 mt-1">{error}</p>
                )}
              </div>
              <Button type="submit" className="w-full">
                <Shield className="w-4 h-4 mr-2" />
                Access Dashboard
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-800">Concert Admin Dashboard</h1>
              <p className="text-gray-600">The Money Team Live in Concert</p>
            </div>
            <div className="flex items-center gap-4">
              <Button onClick={loadDashboardData} variant="outline" size="sm">
                <RefreshCw className="w-4 h-4 mr-2" />
                Refresh
              </Button>
              <Button onClick={exportData} variant="outline" size="sm">
                <Download className="w-4 h-4 mr-2" />
                Export Data
              </Button>
              <Button onClick={handleLogout} variant="destructive" size="sm">
                Logout
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Total Sales</p>
                  <p className="text-2xl font-bold text-green-600">${stats.totalSales}</p>
                </div>
                <DollarSign className="w-8 h-8 text-green-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Tickets Sold</p>
                  <p className="text-2xl font-bold text-blue-600">{stats.ticketCount}</p>
                </div>
                <Users className="w-8 h-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Used Tokens</p>
                  <p className="text-2xl font-bold text-purple-600">{stats.usedTokens}</p>
                </div>
                <Eye className="w-8 h-8 text-purple-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Pending Payments</p>
                  <p className="text-2xl font-bold text-orange-600">{stats.pendingPayments}</p>
                </div>
                <AlertTriangle className="w-8 h-8 text-orange-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Stream Controls */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Stream Controls</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold">Stream Status</h3>
                <p className="text-sm text-gray-600">
                  {streamSettings?.is_live ? 'Stream is currently LIVE' : 'Stream is offline'}
                </p>
              </div>
              <Button
                onClick={handleToggleStream}
                variant={streamSettings?.is_live ? "destructive" : "default"}
                className="flex items-center gap-2"
              >
                {streamSettings?.is_live ? (
                  <>
                    <ToggleRight className="w-4 h-4" />
                    Stop Stream
                  </>
                ) : (
                  <>
                    <ToggleLeft className="w-4 h-4" />
                    Start Stream
                  </>
                )}
              </Button>
            </div>

            <div>
              <Label htmlFor="streamUrl">Stream URL</Label>
              <div className="flex gap-2">
                <Input
                  id="streamUrl"
                  value={streamSettings?.stream_url || ''}
                  onChange={(e) => setStreamSettings(prev => prev ? {...prev, stream_url: e.target.value} : null)}
                  placeholder="Enter stream URL (YouTube, Vimeo, etc.)"
                />
                <Button 
                  onClick={() => handleUpdateStreamUrl(streamSettings?.stream_url || '')}
                  variant="outline"
                >
                  Update
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Purchases Table */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Purchases</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {purchases.map((purchase) => (
                  <div key={purchase.id} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <div>
                        <h4 className="font-semibold">{purchase.name}</h4>
                        <p className="text-sm text-gray-600">{purchase.email}</p>
                      </div>
                      <Badge 
                        variant={
                          purchase.payment_status === 'completed' ? 'default' :
                          purchase.payment_status === 'pending' ? 'secondary' : 'destructive'
                        }
                      >
                        {purchase.payment_status}
                      </Badge>
                    </div>
                    <div className="text-xs text-gray-500 mb-3">
                      Token: {purchase.token}
                    </div>
                    <div className="text-xs text-gray-500 mb-3">
                      Purchased: {new Date(purchase.created_at).toLocaleString()}
                    </div>
                    {purchase.payment_status === 'completed' && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleResendToken(purchase.email, purchase.token)}
                      >
                        <Mail className="w-3 h-3 mr-1" />
                        Resend Token
                      </Button>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Token Usage Table */}
          <Card>
            <CardHeader>
              <CardTitle>Token Usage</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {tokenUsages.map((usage) => (
                  <div key={usage.id} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <div className="text-xs font-mono text-gray-600">
                        {usage.token.substring(0, 8)}...
                      </div>
                      <Badge variant={usage.used ? 'destructive' : 'default'}>
                        {usage.used ? 'Used' : 'Available'}
                      </Badge>
                    </div>
                    {usage.used && (
                      <div className="text-xs text-gray-500 space-y-1">
                        <div>First accessed: {usage.first_accessed_at ? new Date(usage.first_accessed_at).toLocaleString() : 'Never'}</div>
                        <div>Last accessed: {usage.last_accessed_at ? new Date(usage.last_accessed_at).toLocaleString() : 'Never'}</div>
                        <div>IP: {usage.ip_address || 'Unknown'}</div>
                      </div>
                    )}
                    {usage.used && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleRevokeToken(usage.id)}
                        className="mt-2"
                      >
                        <RefreshCw className="w-3 h-3 mr-1" />
                        Reset Token
                      </Button>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}