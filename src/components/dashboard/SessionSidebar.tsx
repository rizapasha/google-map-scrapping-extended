import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarSeparator
} from "~/components/ui/sidebar"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "~/components/ui/select"
import { Switch } from "~/components/ui/switch"
import { Label } from "~/components/ui/label"
import { Input } from "~/components/ui/input"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "~/components/ui/tooltip"
import { Database, RefreshCw, Download, Trash2, Info } from "lucide-react"

interface SessionSidebarProps {
  sessionIds: string[]
  selectedSession: string
  onSessionChange: (val: string) => void
  sortBy: string
  onSortChange: (val: string) => void
  minRating: number
  onRatingChange: (val: string) => void
  showTopTierOnly: boolean
  onTopTierChange: (val: boolean) => void
  hideNoWebsite: boolean
  onWebsiteFilterChange: (val: boolean) => void
  hideNoPhone: boolean
  onPhoneFilterChange: (val: boolean) => void
  minReviews: string
  onMinReviewsChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  maxReviews: string
  onMaxReviewsChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  onRefresh: () => void
  onExportSession: () => void
  onExportAll: () => void
  onDeleteSession: () => void
  onClearAll: () => void
  dataLength: number
  sortedDataLength: number
}

export function SessionSidebar({
  sessionIds,
  selectedSession,
  onSessionChange,
  sortBy,
  onSortChange,
  minRating,
  onRatingChange,
  showTopTierOnly,
  onTopTierChange,
  hideNoWebsite,
  onWebsiteFilterChange,
  hideNoPhone,
  onPhoneFilterChange,
  minReviews,
  onMinReviewsChange,
  maxReviews,
  onMaxReviewsChange,
  onRefresh,
  onExportSession,
  onExportAll,
  onDeleteSession,
  onClearAll,
  dataLength,
  sortedDataLength
}: SessionSidebarProps) {
  return (
    <Sidebar>
      <SidebarHeader className="p-4">
        <div className="flex items-center gap-2 px-2">
          <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <Database className="size-4" />
          </div>
          <div className="grid flex-1 text-left text-sm leading-tight">
            <span className="truncate font-semibold">Maps Scraper</span>
            <span className="truncate text-xs">Dashboard</span>
          </div>
        </div>
      </SidebarHeader>

      <SidebarContent>
        {/* Session Selection */}
        <SidebarGroup>
          <SidebarGroupLabel>Session</SidebarGroupLabel>
          <SidebarGroupContent>
            <div className="px-2">
              <Select value={selectedSession} onValueChange={onSessionChange}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select session" />
                </SelectTrigger>
                <SelectContent>
                  {sessionIds.map((id) => (
                    <SelectItem key={id} value={id}>
                      {id.length > 28 ? id.substring(0, 28) + "..." : id}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Filters */}
        <SidebarGroup>
          <SidebarGroupLabel>Filters</SidebarGroupLabel>
          <SidebarGroupContent className="px-2 space-y-4 pt-2">
            <div className="space-y-2">
              <Label className="text-xs">Sort By</Label>
              <Select value={sortBy} onValueChange={onSortChange}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Default" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="default">Default</SelectItem>
                  <SelectItem value="rating-desc">Highest Rating</SelectItem>
                  <SelectItem value="rating-asc">Lowest Rating</SelectItem>
                  <SelectItem value="reviews-desc">Most Reviews</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label className="text-xs">Min Rating</Label>
              <Select value={minRating.toString()} onValueChange={onRatingChange}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="All" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="0">All Ratings</SelectItem>
                  <SelectItem value="3">3.0+ Stars</SelectItem>
                  <SelectItem value="4">4.0+ Stars</SelectItem>
                  <SelectItem value="4.5">4.5+ Stars</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-3 pt-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <Label
                    htmlFor="top-tier-leads"
                    className="text-xs cursor-pointer font-bold text-primary"
                  >
                    Top Tier Leads (&gt;80 Score)
                  </Label>
                  <TooltipProvider delayDuration={200}>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Info className="w-3.5 h-3.5 text-muted-foreground cursor-help" />
                      </TooltipTrigger>
                      <TooltipContent className="w-64 p-3 bg-white dark:bg-slate-900 border shadow-lg text-sm text-slate-700 dark:text-slate-300">
                        <p className="font-bold mb-1 text-primary">Lead Score Calculation:</p>
                        <ul className="space-y-1 list-disc pl-4 text-xs">
                          <li>
                            <strong>+30 pts</strong>: Has Website
                          </li>
                          <li>
                            <strong>+30 pts</strong>: Has Phone Number
                          </li>
                          <li>
                            <strong>+20 pts</strong>: Rating is 4.0 or higher
                          </li>
                          <li>
                            <strong>+20 pts</strong>: Between 10 and 1,000 reviews
                          </li>
                        </ul>
                        <p className="mt-2 text-xs opacity-80">
                          A perfect score of 100 indicates a highly active, verifiable business.
                        </p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
                <Switch
                  id="top-tier-leads"
                  checked={showTopTierOnly}
                  onCheckedChange={onTopTierChange}
                />
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor="hide-no-website" className="text-xs cursor-pointer">
                  Hide No Website
                </Label>
                <Switch
                  id="hide-no-website"
                  checked={hideNoWebsite}
                  onCheckedChange={onWebsiteFilterChange}
                />
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor="hide-no-phone" className="text-xs cursor-pointer">
                  Hide No Phone
                </Label>
                <Switch
                  id="hide-no-phone"
                  checked={hideNoPhone}
                  onCheckedChange={onPhoneFilterChange}
                />
              </div>
            </div>

            <div className="space-y-2 pt-2">
              <Label className="text-xs font-bold uppercase text-muted-foreground/70">
                Reviews Range
              </Label>
              <div className="flex items-center gap-2">
                <Input
                  type="number"
                  placeholder="Min"
                  className="h-8 text-xs"
                  value={minReviews}
                  onChange={onMinReviewsChange}
                  min={0}
                />
                <span className="text-xs text-muted-foreground">-</span>
                <Input
                  type="number"
                  placeholder="Max"
                  className="h-8 text-xs"
                  value={maxReviews}
                  onChange={onMaxReviewsChange}
                  min={0}
                />
              </div>
            </div>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton onClick={onRefresh}>
              <RefreshCw />
              <span>Refresh</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton onClick={onExportSession} disabled={sortedDataLength === 0}>
              <Download />
              <span>Export Session</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton onClick={onExportAll} disabled={dataLength === 0}>
              <Download />
              <span>Export All (Raw)</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarSeparator className="my-2" />
          <SidebarMenuItem>
            <SidebarMenuButton
              onClick={onDeleteSession}
              disabled={!selectedSession}
              className="text-destructive hover:bg-destructive/10 hover:text-destructive"
            >
              <Trash2 />
              <span>Delete Session</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton
              onClick={onClearAll}
              disabled={dataLength === 0}
              className="text-destructive hover:bg-destructive/10 hover:text-destructive"
            >
              <Trash2 />
              <span>Clear All</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  )
}
