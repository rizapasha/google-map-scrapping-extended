import React, { useState, useEffect } from "react"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetFooter
} from "~/components/ui/sheet"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "~/components/ui/select"
import { Textarea } from "~/components/ui/textarea"
import { Button } from "~/components/ui/button"
import { Label } from "~/components/ui/label"
import { Separator } from "~/components/ui/separator"
import {
  type ScrapedData,
  type CrmData,
  type LeadStatus,
  formatMapsLink,
  formatWhatsAppLink
} from "~/lib/utils/scraper-utils"
import { MapPin, MessageCircle, Globe, Phone, ExternalLink } from "lucide-react"

interface CrmDrawerProps {
  selectedLead: ScrapedData | null
  crmRecord: CrmData | null
  isOpen: boolean
  onClose: () => void
  onUpdate: (updates: Partial<CrmData>) => void
}

export function CrmDrawer({ selectedLead, crmRecord, isOpen, onClose, onUpdate }: CrmDrawerProps) {
  const [status, setStatus] = useState<LeadStatus>(crmRecord?.status || "NEW")
  const [notes, setNotes] = useState(crmRecord?.notes || "")

  if (!selectedLead) return null

  const handleSave = () => {
    onUpdate({ status, notes })
    onClose()
  }

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent className="sm:max-w-md flex flex-col h-full overflow-hidden p-0">
        <div className="flex-1 overflow-y-auto">
          <SheetHeader className="p-6 pb-4">
            <SheetTitle className="text-xl">{selectedLead.title}</SheetTitle>
            <SheetDescription className="flex items-center gap-1.5">
              <MapPin className="h-3.5 w-3.5" />
              {selectedLead.address}
            </SheetDescription>
          </SheetHeader>

          <div className="px-6 space-y-6 pb-8">
            {/* Quick Actions/Info */}
            <div className="grid grid-cols-2 gap-3">
              <Button variant="outline" size="sm" className="w-full justify-start" asChild>
                <a href={formatMapsLink(selectedLead)} target="_blank" rel="noopener noreferrer">
                  <MapPin className="mr-2 h-4 w-4 text-primary" />
                  Maps
                  <ExternalLink className="ml-auto h-3 w-3 opacity-50" />
                </a>
              </Button>
              {selectedLead.phone && (
                <Button variant="outline" size="sm" className="w-full justify-start" asChild>
                  <a
                    href={formatWhatsAppLink(selectedLead.phone)}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <MessageCircle className="mr-2 h-4 w-4 text-[#25D366]" />
                    WhatsApp
                    <ExternalLink className="ml-auto h-3 w-3 opacity-50" />
                  </a>
                </Button>
              )}
            </div>

            <Separator />

            {/* CRM Fields */}
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="status">Lead Status</Label>
                <Select value={status} onValueChange={(val) => setStatus(val as LeadStatus)}>
                  <SelectTrigger id="status" className="w-full">
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="NEW">New</SelectItem>
                    <SelectItem value="CONTACTED">Contacted</SelectItem>
                    <SelectItem value="FOLLOW_UP">Follow Up</SelectItem>
                    <SelectItem value="NOT_INTERESTED">Not Interested</SelectItem>
                    <SelectItem value="CLOSED">Closed</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="notes">Notes</Label>
                <Textarea
                  id="notes"
                  placeholder="Enter lead notes, interaction history, etc."
                  className="min-h-[200px] resize-none"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                />
              </div>

              {crmRecord?.lastUpdated && (
                <p className="text-[10px] text-muted-foreground italic">
                  Last updated: {new Date(crmRecord.lastUpdated).toLocaleString()}
                </p>
              )}
            </div>

            <Separator />

            {/* Business Details Summary */}
            <div className="space-y-3">
              <h4 className="text-sm font-medium">Business Details</h4>
              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <StarRating rating={selectedLead.ratingScore} />
                  <span>•</span>
                  <span>{selectedLead.reviewCount} reviews</span>
                </div>
                {selectedLead.phone && (
                  <div className="flex items-center gap-2">
                    <Phone className="h-3.5 w-3.5 opacity-70" />
                    <span className="font-mono">{selectedLead.phone}</span>
                  </div>
                )}
                {selectedLead.website && (
                  <div className="flex items-center gap-2">
                    <Globe className="h-3.5 w-3.5 opacity-70" />
                    <a
                      href={
                        selectedLead.website.startsWith("http")
                          ? selectedLead.website
                          : `https://${selectedLead.website}`
                      }
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary hover:underline truncate"
                    >
                      {selectedLead.website}
                    </a>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        <SheetFooter className="p-6 pt-2 border-t bg-slate-50 dark:bg-slate-900/50">
          <div className="flex gap-3 w-full">
            <Button variant="outline" className="flex-1" onClick={onClose}>
              Cancel
            </Button>
            <Button className="flex-1" onClick={handleSave}>
              Save Changes
            </Button>
          </div>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  )
}

function StarRating({ rating }: { rating: string }) {
  const score = parseFloat(rating) || 0
  return (
    <div className="flex items-center gap-1">
      <span className="font-semibold text-amber-500">{score.toFixed(1)}</span>
      <div className="flex text-amber-400">
        {[1, 2, 3, 4, 5].map((i) => (
          <span key={i} className="text-xs">
            {i <= score ? "★" : "☆"}
          </span>
        ))}
      </div>
    </div>
  )
}
