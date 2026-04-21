import type { ScrapedData } from "./scraper-utils"

export const exportToCSV = (dataArray: ScrapedData[], filenamePrefix: string) => {
  if (dataArray.length === 0) return

  const headers = [
    "Session ID",
    "Title",
    "Rating Score",
    "Review Count",
    "Address",
    "Phone",
    "Website",
    "Coordinates"
  ]
  const rows = dataArray.map((item) => [
    `"${item.sessionId || "Legacy Session"}"`,
    `"${item.title.replace(/"/g, '""')}"`,
    `"${item.ratingScore}"`,
    `"${item.reviewCount}"`,
    `"${item.address.replace(/"/g, '""')}"`,
    `"${item.phone}"`,
    `"${item.website}"`,
    `"${item.coordinates}"`
  ])

  const csvContent = [headers, ...rows].map((e) => e.join(",")).join("\n")
  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
  const url = URL.createObjectURL(blob)
  const link = document.createElement("a")
  link.setAttribute("href", url)
  link.setAttribute(
    "download",
    `google_maps_${filenamePrefix}_${new Date().toISOString().split("T")[0]}.csv`
  )
  link.style.visibility = "hidden"
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}
