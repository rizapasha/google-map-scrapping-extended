import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card"
import { Database, Star, Phone, Globe } from "lucide-react"
import type { ScrapedData } from "~/lib/utils/scraper-utils"

interface StatCardsProps {
  currentData: ScrapedData[]
}

export function StatCards({ currentData }: StatCardsProps) {
  const withPhone = currentData.filter((item) => !!item.phone).length
  const highlyRated = currentData.filter((item) => (parseFloat(item.ratingScore) || 0) > 4.5).length
  const withWebsite = currentData.filter((item) => !!item.website).length

  return (
    <div className="grid gap-4 md:grid-cols-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Places</CardTitle>
          <Database className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{currentData.length}</div>
          <p className="text-xs text-muted-foreground">in this session</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Highly Rated</CardTitle>
          <Star className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{highlyRated}</div>
          <p className="text-xs text-muted-foreground">{">"} 4.5 stars rating</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">With Phone</CardTitle>
          <Phone className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{withPhone}</div>
          <p className="text-xs text-muted-foreground">
            {currentData.length > 0
              ? `${Math.round((withPhone / currentData.length) * 100)}% of total`
              : "no data"}
          </p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">With Website</CardTitle>
          <Globe className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{withWebsite}</div>
          <p className="text-xs text-muted-foreground">
            {currentData.length > 0
              ? `${Math.round((withWebsite / currentData.length) * 100)}% of total`
              : "no data"}
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
