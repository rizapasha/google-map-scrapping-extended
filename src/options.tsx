import "./style.css"
import { useState, useEffect } from "react"
import { 
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "~/components/ui/accordion"
import { ScrollArea } from "~/components/ui/scroll-area"
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "~/components/ui/table"
import { Button } from "~/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "~/components/ui/card"
import { Trash2, Download, RefreshCw } from "lucide-react"

interface ScrapedData {
  sessionId: string
  title: string
  ratingScore: string
  reviewCount: string
  address: string
  phone: string
  website: string
  coordinates: string
}

function OptionsIndex() {
  const [data, setData] = useState<ScrapedData[]>([])

  useEffect(() => {
    loadData()
  }, [])

  const loadData = () => {
    chrome.storage.local.get(["scrapedData"], (res) => {
      setData((res.scrapedData as ScrapedData[]) || [])
    })
  }

  const clearDatabase = () => {
    if (confirm("Apakah Anda yakin ingin menghapus semua data?")) {
      chrome.storage.local.set({ scrapedData: [] }, () => {
        setData([])
      })
    }
  }

  const exportCSV = () => {
    if (data.length === 0) return

    const headers = ["Session ID", "Title", "Rating Score", "Review Count", "Address", "Phone", "Website", "Coordinates"]
    const rows = data.map(item => [
      `"${item.sessionId || "Legacy Session"}"`,
      `"${item.title.replace(/"/g, '""')}"`,
      `"${item.ratingScore}"`,
      `"${item.reviewCount}"`,
      `"${item.address.replace(/"/g, '""')}"`,
      `"${item.phone}"`,
      `"${item.website}"`,
      `"${item.coordinates}"`
    ])

    const csvContent = [headers, ...rows].map(e => e.join(",")).join("\n")
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
    const url = URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.setAttribute("href", url)
    link.setAttribute("download", `google_maps_export_${new Date().toISOString().split('T')[0]}.csv`)
    link.style.visibility = "hidden"
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  // Grouping logic
  const groupedData = data.reduce((acc, item) => {
    const key = item.sessionId || "Legacy Session"
    if (!acc[key]) acc[key] = []
    acc[key].push(item)
    return acc
  }, {} as Record<string, ScrapedData[]>)

  const sessionIds = Object.keys(groupedData).sort((a, b) => b.localeCompare(a))

  return (
    <div className="p-8 min-h-screen bg-slate-50 dark:bg-slate-950 font-sans">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <h1 className="text-3xl font-bold tracking-tight">Scraped Results Dashboard</h1>
            <p className="text-muted-foreground">Manage and export your extracted Google Maps data.</p>
          </div>
          <div className="flex gap-3">
            <Button variant="outline" onClick={loadData} className="gap-2">
              <RefreshCw className="w-4 h-4" />
              Refresh
            </Button>
            <Button variant="outline" onClick={exportCSV} disabled={data.length === 0} className="gap-2">
              <Download className="w-4 h-4" />
              Export CSV
            </Button>
            <Button variant="destructive" onClick={clearDatabase} disabled={data.length === 0} className="gap-2">
              <Trash2 className="w-4 h-4" />
              Clear All
            </Button>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Dataset Overview</CardTitle>
            <CardDescription>
              Showing {data.length} total entries across {sessionIds.length} sessions.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {sessionIds.length > 0 ? (
              <Accordion type="multiple" className="w-full space-y-4">
                {sessionIds.map((sessionId) => (
                  <AccordionItem value={sessionId} key={sessionId} className="border rounded-md px-4 overflow-hidden">
                    <div className="flex items-center justify-between py-4 w-full">
                      <AccordionTrigger className="hover:no-underline py-0 border-none justify-start gap-4">
                        <div className="flex flex-col items-start gap-1">
                          <span className="font-semibold text-base">{sessionId}</span>
                          <span className="text-sm font-normal text-muted-foreground">
                            {groupedData[sessionId].length} entries
                          </span>
                        </div>
                      </AccordionTrigger>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation()
                          if (confirm(`Hapus sesi "${sessionId}"?`)) {
                            const newData = data.filter(d => (d.sessionId || "Legacy Session") !== sessionId)
                            chrome.storage.local.set({ scrapedData: newData }, loadData)
                          }
                        }}
                      >
                        <Trash2 className="w-4 h-4 mr-2" />
                        Hapus Sesi
                      </Button>
                    </div>
                    <AccordionContent>
                      <ScrollArea className="h-[400px] w-full rounded-md border mt-2">
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead className="w-[250px]">Business Name</TableHead>
                              <TableHead>Rating</TableHead>
                              <TableHead className="w-[300px]">Address</TableHead>
                              <TableHead>Phone</TableHead>
                              <TableHead>Website</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {groupedData[sessionId].map((item, index) => (
                              <TableRow key={index}>
                                <TableCell className="font-medium">{item.title}</TableCell>
                                <TableCell>
                                  <span className="flex items-center gap-1">
                                    {item.ratingScore} <span className="text-xs text-muted-foreground">({item.reviewCount})</span>
                                  </span>
                                </TableCell>
                                <TableCell className="text-sm">{item.address}</TableCell>
                                <TableCell className="text-sm">{item.phone || "-"}</TableCell>
                                <TableCell className="text-sm truncate max-w-[150px]">
                                  {item.website ? (
                                    <a href={item.website.startsWith('http') ? item.website : `https://${item.website}`} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                                      Visit
                                    </a>
                                  ) : "-"}
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </ScrollArea>
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            ) : (
              <div className="h-32 flex items-center justify-center text-muted-foreground border rounded-md">
                No data available. Start a scraping session from the side panel.
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default OptionsIndex
