'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Clock } from 'lucide-react'

interface CountdownTimerProps {
  targetDate: string
  className?: string
}

export function CountdownTimer({ targetDate, className = '' }: CountdownTimerProps) {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
    isExpired: false
  })

  useEffect(() => {
    const calculateTimeLeft = () => {
      const target = new Date(targetDate).getTime()
      const now = new Date().getTime()
      const difference = target - now

      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
          minutes: Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60)),
          seconds: Math.floor((difference % (1000 * 60)) / 1000),
          isExpired: false
        })
      } else {
        setTimeLeft({
          days: 0,
          hours: 0,
          minutes: 0,
          seconds: 0,
          isExpired: true
        })
      }
    }

    calculateTimeLeft()
    const timer = setInterval(calculateTimeLeft, 1000)

    return () => clearInterval(timer)
  }, [targetDate])

  if (timeLeft.isExpired) {
    return (
      <div className={`text-center ${className}`}>
        <Card className="bg-gradient-to-r from-red-600 to-yellow-600 text-white border-0">
          <CardContent className="p-6">
            <div className="flex items-center justify-center gap-2 mb-2">
              <Clock className="w-6 h-6" />
              <h3 className="text-2xl font-bold">Event is Live!</h3>
            </div>
            <p className="text-lg opacity-90">The concert has started</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className={`text-center ${className}`}>
      <div className="mb-4">
        <h3 className="text-2xl font-bold text-gray-800 mb-2">Concert Starts In:</h3>
      </div>
      
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-2xl mx-auto">
        <Card className="bg-white/80 backdrop-blur-sm border-red-200">
          <CardContent className="p-4 text-center">
            <div className="text-3xl md:text-4xl font-bold text-red-600 mb-1">
              {timeLeft.days.toString().padStart(2, '0')}
            </div>
            <div className="text-sm text-gray-600 uppercase tracking-wide">Days</div>
          </CardContent>
        </Card>
        
        <Card className="bg-white/80 backdrop-blur-sm border-yellow-200">
          <CardContent className="p-4 text-center">
            <div className="text-3xl md:text-4xl font-bold text-yellow-600 mb-1">
              {timeLeft.hours.toString().padStart(2, '0')}
            </div>
            <div className="text-sm text-gray-600 uppercase tracking-wide">Hours</div>
          </CardContent>
        </Card>
        
        <Card className="bg-white/80 backdrop-blur-sm border-green-200">
          <CardContent className="p-4 text-center">
            <div className="text-3xl md:text-4xl font-bold text-green-600 mb-1">
              {timeLeft.minutes.toString().padStart(2, '0')}
            </div>
            <div className="text-sm text-gray-600 uppercase tracking-wide">Minutes</div>
          </CardContent>
        </Card>
        
        <Card className="bg-white/80 backdrop-blur-sm border-blue-200">
          <CardContent className="p-4 text-center">
            <div className="text-3xl md:text-4xl font-bold text-blue-600 mb-1">
              {timeLeft.seconds.toString().padStart(2, '0')}
            </div>
            <div className="text-sm text-gray-600 uppercase tracking-wide">Seconds</div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}