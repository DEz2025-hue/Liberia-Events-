'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { CONCERT_CONFIG } from '@/lib/concert-config'
import { 
  CreditCard, 
  Shield, 
  Clock, 
  CheckCircle, 
  ArrowLeft,
  Smartphone,
  Globe
} from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

export default function CheckoutPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: ''
  })
  const [isLoading, setIsLoading] = useState(false)
  const [errors, setErrors] = useState<{[key: string]: string}>({})
  const router = useRouter()

  const validateForm = () => {
    const newErrors: {[key: string]: string} = {}
    
    if (!formData.name.trim()) {
      newErrors.name = 'Full name is required'
    }
    
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required'
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address'
    }
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) return
    
    setIsLoading(true)
    
    try {
      // Create checkout session
      const response = await fetch('/api/create-checkout-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })
      
      const { url, error } = await response.json()
      
      if (error) {
        throw new Error(error)
      }
      
      // Redirect to Stripe Checkout
      window.location.href = url
    } catch (error) {
      console.error('Checkout error:', error)
      setErrors({ submit: 'Something went wrong. Please try again.' })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-yellow-50 to-green-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center text-red-600 hover:text-red-700 mb-4">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Concert Details
          </Link>
          
          <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-2">
            Secure Your Ticket
          </h1>
          <p className="text-lg text-gray-600">
            Join thousands of Liberians worldwide for this exclusive live concert
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Order Summary */}
          <Card className="bg-white/80 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CreditCard className="w-5 h-5 text-red-600" />
                Order Summary
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Concert Details */}
              <div className="bg-gradient-to-r from-red-600 to-yellow-600 text-white rounded-lg p-4">
                <div className="text-center">
                  <div className="text-2xl font-bold mb-1">{CONCERT_CONFIG.name}</div>
                  <div className="text-lg opacity-90">{CONCERT_CONFIG.artist}</div>
                  <div className="text-sm opacity-80 mt-2">
                    July 26th, 2025 • 8:00 PM GMT • SKD Sports Complex
                  </div>
                </div>
              </div>
              
              {/* Pricing */}
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Live Stream Ticket</span>
                  <span>${CONCERT_CONFIG.price.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Processing Fee</span>
                  <span>$0.00</span>
                </div>
                <hr />
                <div className="flex justify-between text-lg font-bold">
                  <span>Total</span>
                  <span>${CONCERT_CONFIG.price.toFixed(2)} USD</span>
                </div>
              </div>
              
              {/* Features */}
              <div className="space-y-3 pt-4 border-t">
                <div className="flex items-center gap-3 text-sm text-gray-600">
                  <CheckCircle className="w-4 h-4 text-green-600" />
                  <span>HD Live Stream Access</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-gray-600">
                  <CheckCircle className="w-4 h-4 text-green-600" />
                  <span>Mobile & Desktop Compatible</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-gray-600">
                  <CheckCircle className="w-4 h-4 text-green-600" />
                  <span>Secure One-Time Access Token</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-gray-600">
                  <CheckCircle className="w-4 h-4 text-green-600" />
                  <span>Email Confirmation & Reminders</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Checkout Form */}
          <Card className="bg-white/80 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="w-5 h-5 text-green-600" />
                Secure Checkout
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Customer Information */}
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="name">Full Name *</Label>
                    <Input
                      id="name"
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                      placeholder="Enter your full name"
                      className={errors.name ? "border-red-500" : ""}
                    />
                    {errors.name && (
                      <p className="text-sm text-red-600 mt-1">{errors.name}</p>
                    )}
                  </div>
                  
                  <div>
                    <Label htmlFor="email">Email Address *</Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({...formData, email: e.target.value})}
                      placeholder="Enter your email address"
                      className={errors.email ? "border-red-500" : ""}
                    />
                    {errors.email && (
                      <p className="text-sm text-red-600 mt-1">{errors.email}</p>
                    )}
                    <p className="text-xs text-gray-500 mt-1">
                      Your stream access link will be sent to this email
                    </p>
                  </div>
                </div>

                {/* Payment Methods */}
                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="font-semibold text-gray-800 mb-3">Payment Methods</h3>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div className="flex items-center gap-2">
                      <CreditCard className="w-4 h-4 text-blue-600" />
                      <span>Credit/Debit Cards</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Smartphone className="w-4 h-4 text-gray-600" />
                      <span>Apple Pay</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Globe className="w-4 h-4 text-green-600" />
                      <span>Google Pay</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Shield className="w-4 h-4 text-purple-600" />
                      <span>Secure Checkout</span>
                    </div>
                  </div>
                </div>

                {/* Submit Button */}
                <Button
                  type="submit"
                  disabled={isLoading}
                  className="w-full text-lg py-6 bg-gradient-to-r from-red-600 to-yellow-600 hover:from-red-700 hover:to-yellow-700"
                >
                  {isLoading ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2" />
                      Processing...
                    </>
                  ) : (
                    <>
                      <CreditCard className="w-5 h-5 mr-2" />
                      Proceed to Payment - ${CONCERT_CONFIG.price}
                    </>
                  )}
                </Button>

                {errors.submit && (
                  <p className="text-sm text-red-600 text-center">{errors.submit}</p>
                )}

                {/* Security Notice */}
                <div className="text-center text-xs text-gray-500 space-y-1">
                  <div className="flex items-center justify-center gap-1">
                    <Shield className="w-3 h-3" />
                    <span>Secured by Stripe • SSL Encrypted</span>
                  </div>
                  <div>Your payment information is never stored on our servers</div>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>

        {/* Trust Indicators */}
        <div className="mt-12 text-center">
          <div className="flex items-center justify-center gap-8 text-sm text-gray-500">
            <div className="flex items-center gap-2">
              <Shield className="w-4 h-4" />
              <span>256-bit SSL</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4" />
              <span>Instant Access</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4" />
              <span>Money Back Guarantee</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}