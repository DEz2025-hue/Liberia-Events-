import { CONCERT_CONFIG } from '../concert-config'

export interface ShareData {
  title: string
  text: string
  url: string
}

export function getShareData(url: string = window.location.href): ShareData {
  return {
    title: CONCERT_CONFIG.seoTitle,
    text: CONCERT_CONFIG.shareText,
    url
  }
}

export async function shareNatively(data: ShareData): Promise<boolean> {
  if (navigator.share) {
    try {
      await navigator.share(data)
      return true
    } catch (error) {
      console.log('Native sharing cancelled or failed:', error)
      return false
    }
  }
  return false
}

export function getWhatsAppShareUrl(text: string, url: string): string {
  return `https://wa.me/?text=${encodeURIComponent(`${text} ${url}`)}`
}

export function getFacebookShareUrl(url: string): string {
  return `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`
}

export function getMessengerShareUrl(url: string): string {
  return `https://www.facebook.com/dialog/send?link=${encodeURIComponent(url)}&app_id=YOUR_APP_ID`
}

export function copyToClipboard(text: string): Promise<boolean> {
  return navigator.clipboard.writeText(text).then(() => true).catch(() => false)
}