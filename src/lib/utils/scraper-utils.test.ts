import { describe, it, expect } from "vitest"
import {
  calculateLeadScore,
  generateRowId,
  formatWhatsAppLink,
  formatMapsLink,
  ScrapedData
} from "./scraper-utils"

const mockData: ScrapedData = {
  sessionId: "test-session",
  title: "Test Coffee",
  ratingScore: "4.5",
  reviewCount: "150",
  address: "Jl. Sudirman No. 1",
  phone: "0812-3456-7890",
  website: "https://testcoffee.com",
  coordinates: "-6.2088,106.8456"
}

describe("scraper-utils", () => {
  describe("calculateLeadScore", () => {
    it("should score 100 for a perfect lead", () => {
      const score = calculateLeadScore(mockData)
      expect(score).toBe(100) // 30 (web) + 30 (phone) + 20 (rating) + 20 (reviews)
    })

    it("should penalize missing website and phone", () => {
      const badLead = { ...mockData, website: "", phone: "" }
      const score = calculateLeadScore(badLead)
      expect(score).toBe(40) // 20 (rating) + 20 (reviews)
    })

    it("should penalize enterprise leads (too many reviews)", () => {
      const enterpriseLead = { ...mockData, reviewCount: "5,000" }
      const score = calculateLeadScore(enterpriseLead)
      expect(score).toBe(80) // loses the 20 review points
    })
  })

  describe("generateRowId", () => {
    it("should generate a valid URI component string", () => {
      const id = generateRowId(mockData)
      expect(id).toContain("Test%20Coffee")
    })
  })

  describe("formatWhatsAppLink", () => {
    it("should format Indonesian 08 numbers to 62", () => {
      expect(formatWhatsAppLink("0812-3456-7890")).toBe("https://wa.me/6281234567890")
    })

    it("should keep international numbers intact", () => {
      expect(formatWhatsAppLink("+62 812-3456-7890")).toBe("https://wa.me/6281234567890")
      expect(formatWhatsAppLink("+1 555-0123")).toBe("https://wa.me/15550123")
    })
  })

  describe("formatMapsLink", () => {
    it("should use coordinates if available", () => {
      expect(formatMapsLink(mockData)).toBe("https://www.google.com/maps/place/-6.2088,106.8456")
    })

    it("should fallback to a search query if coordinates are missing", () => {
      const noCoords = { ...mockData, coordinates: "" }
      expect(formatMapsLink(noCoords)).toContain("query=Test%20Coffee%20Jl.%20Sudirman%20No.%201")
    })
  })
})
