import { CONCERT_CONFIG } from '../concert-config'

export function formatConcertDate(userTimezone?: string): {
  liberianTime: string
  userLocalTime: string
  isToday: boolean
  isPast: boolean
  timeUntil: string
} {
  const concertDate = new Date(CONCERT_CONFIG.date)
  const now = new Date()
  
  // Liberian time (GMT)
  const liberianTime = concertDate.toLocaleString('en-US', {
    timeZone: 'GMT',
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    timeZoneName: 'short'
  })
  
  // User's local time
  const userLocalTime = concertDate.toLocaleString('en-US', {
    timeZone: userTimezone || Intl.DateTimeFormat().resolvedOptions().timeZone,
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    timeZoneName: 'short'
  })
  
  const isToday = concertDate.toDateString() === now.toDateString()
  const isPast = concertDate < now
  
  // Calculate time until concert
  const timeDiff = concertDate.getTime() - now.getTime()
  const days = Math.floor(timeDiff / (1000 * 60 * 60 * 24))
  const hours = Math.floor((timeDiff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
  const minutes = Math.floor((timeDiff % (1000 * 60 * 60)) / (1000 * 60))
  
  let timeUntil = ''
  if (isPast) {
    timeUntil = 'Event has ended'
  } else if (days > 0) {
    timeUntil = `${days} days, ${hours} hours`
  } else if (hours > 0) {
    timeUntil = `${hours} hours, ${minutes} minutes`
  } else if (minutes > 0) {
    timeUntil = `${minutes} minutes`
  } else {
    timeUntil = 'Starting now!'
  }
  
  return {
    liberianTime,
    userLocalTime,
    isToday,
    isPast,
    timeUntil
  }
}

export function generateCalendarLink(): string {
  const event = CONCERT_CONFIG.calendarEvent
  const startDate = new Date(event.startDate).toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z'
  const endDate = new Date(event.endDate).toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z'
  
  const googleCalendarUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(event.title)}&dates=${startDate}/${endDate}&details=${encodeURIComponent(event.description)}&location=${encodeURIComponent(event.location)}`
  
  return googleCalendarUrl
}

export function generateICSFile(): string {
  const event = CONCERT_CONFIG.calendarEvent
  const startDate = new Date(event.startDate).toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z'
  const endDate = new Date(event.endDate).toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z'
  
  const icsContent = `BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//The Money Team//Concert Event//EN
BEGIN:VEVENT
UID:${Date.now()}@themoneyteam.com
DTSTAMP:${new Date().toISOString().replace(/[-:]/g, '').split('.')[0]}Z
DTSTART:${startDate}
DTEND:${endDate}
SUMMARY:${event.title}
DESCRIPTION:${event.description}
LOCATION:${event.location}
END:VEVENT
END:VCALENDAR`
  
  return icsContent
}