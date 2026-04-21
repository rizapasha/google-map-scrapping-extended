export interface ScrapedData {
  sessionId: string
  title: string
  ratingScore: string
  reviewCount: string
  address: string
  phone: string
  website: string
  coordinates: string
}

export type LeadStatus = "NEW" | "CONTACTED" | "FOLLOW_UP" | "NOT_INTERESTED" | "CLOSED"

export interface CrmData {
  status: LeadStatus
  notes: string
  lastUpdated: number
}

export function calculateLeadScore(item: ScrapedData): number {
  let score = 0
  if (item.website) score += 30
  if (item.phone) score += 30

  const rating = parseFloat(item.ratingScore) || 0
  if (rating >= 4.0) score += 20

  const reviews = parseInt(item.reviewCount.replace(/,/g, "")) || 0
  if (reviews >= 10 && reviews <= 1000) score += 20

  return score
}

export function generateRowId(item: ScrapedData): string {
  return encodeURIComponent(`${item.title}-${item.address}-${item.coordinates}`)
}

export function formatWhatsAppLink(phone: string): string {
  if (!phone) return ""
  // Remove all non-numeric characters
  let cleanNumber = phone.replace(/\D/g, "")
  // If Indonesian number starts with 0, replace with 62
  if (cleanNumber.startsWith("0")) {
    cleanNumber = "62" + cleanNumber.slice(1)
  }
  return `https://wa.me/${cleanNumber}`
}

export function formatMapsLink(item: ScrapedData): string {
  if (item.coordinates) {
    return `https://www.google.com/maps/place/${item.coordinates}`
  }
  const query = encodeURIComponent(`${item.title} ${item.address}`)
  return `https://www.google.com/maps/search/?api=1&query=${query}`
}
