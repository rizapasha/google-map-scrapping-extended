import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "~/components/ui/table"
import { Checkbox } from "~/components/ui/checkbox"
import { Button } from "~/components/ui/button"
import { MapPin, MessageCircle, ExternalLink } from "lucide-react"
import { StarRating } from "./StarRating"
import {
  generateRowId,
  formatWhatsAppLink,
  formatMapsLink,
  type ScrapedData
} from "~/lib/utils/scraper-utils"

interface LeadsTableProps {
  paginatedData: ScrapedData[]
  currentPage: number
  totalPages: number
  itemsPerPage: number
  totalCount: number
  selectedIds: Set<string>
  isAllSelected: boolean
  onSelectAll: (checked: boolean) => void
  onSelectRow: (id: string, checked: boolean) => void
  onPageChange: (page: number) => void
}

export function LeadsTable({
  paginatedData,
  currentPage,
  totalPages,
  itemsPerPage,
  totalCount,
  selectedIds,
  isAllSelected,
  onSelectAll,
  onSelectRow,
  onPageChange
}: LeadsTableProps) {
  return (
    <div className="space-y-4">
      <div className="overflow-hidden rounded-md border w-full bg-white dark:bg-slate-900">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[40px] pl-4">
                <Checkbox
                  checked={isAllSelected}
                  onCheckedChange={(checked) => onSelectAll(checked as boolean)}
                  aria-label="Select all"
                />
              </TableHead>
              <TableHead className="w-[50px]">#</TableHead>
              <TableHead className="w-[300px]">Business & Address</TableHead>
              <TableHead className="w-[180px]">Rating</TableHead>
              <TableHead className="w-[180px]">Contact Info</TableHead>
              <TableHead className="w-[150px]">Website</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedData.length ? (
              paginatedData.map((item, index) => {
                const actualIndex = (currentPage - 1) * itemsPerPage + index + 1
                const rowId = generateRowId(item)
                const isSelected = selectedIds.has(rowId)

                return (
                  <TableRow key={rowId} data-state={isSelected ? "selected" : undefined}>
                    <TableCell className="pl-4">
                      <Checkbox
                        checked={isSelected}
                        onCheckedChange={(checked) => onSelectRow(rowId, checked as boolean)}
                        aria-label={`Select ${item.title}`}
                      />
                    </TableCell>
                    <TableCell className="text-muted-foreground font-mono text-xs">
                      {actualIndex}
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-col gap-1">
                        <span className="font-semibold">{item.title}</span>
                        <div className="flex items-start gap-1.5 text-muted-foreground">
                          <a
                            href={formatMapsLink(item)}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="mt-0.5 shrink-0 text-primary hover:opacity-80 transition-opacity"
                            title="View in Google Maps"
                          >
                            <MapPin className="h-3 w-3" />
                          </a>
                          <span className="text-xs">{item.address || "—"}</span>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-0.5">
                        <StarRating rating={item.ratingScore} />
                        <p className="text-[11px] text-muted-foreground">
                          {item.reviewCount || "0"} reviews
                        </p>
                      </div>
                    </TableCell>
                    <TableCell>
                      {item.phone ? (
                        <div className="flex items-center gap-1.5">
                          <a
                            href={formatWhatsAppLink(item.phone)}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="shrink-0 text-[#25D366] hover:opacity-80 transition-opacity"
                            title="Chat on WhatsApp"
                          >
                            <MessageCircle className="h-4 w-4" />
                          </a>
                          <span className="font-mono text-sm">{item.phone}</span>
                        </div>
                      ) : (
                        <span className="text-muted-foreground">—</span>
                      )}
                    </TableCell>
                    <TableCell>
                      {item.website ? (
                        <a
                          href={
                            item.website.startsWith("http")
                              ? item.website
                              : `https://${item.website}`
                          }
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center text-xs font-medium text-primary hover:underline truncate max-w-[200px]"
                        >
                          {item.website}
                          <ExternalLink className="ml-1 h-3 w-3 shrink-0" />
                        </a>
                      ) : (
                        <span className="text-muted-foreground">—</span>
                      )}
                    </TableCell>
                  </TableRow>
                )
              })
            ) : (
              <TableRow>
                <TableCell colSpan={6} className="h-24 text-center">
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination Footer */}
      <div className="flex items-center justify-between mt-4">
        <div className="text-sm text-muted-foreground font-medium">
          Showing {totalCount > 0 ? (currentPage - 1) * itemsPerPage + 1 : 0} to{" "}
          {Math.min(currentPage * itemsPerPage, totalCount)} of {totalCount} records
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onPageChange(Math.max(1, currentPage - 1))}
            disabled={currentPage === 1}
          >
            Previous
          </Button>
          <div className="text-sm font-medium px-4 py-1.5 bg-muted rounded-md border min-w-[100px] text-center">
            Page {currentPage} of {totalPages || 1}
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
            disabled={currentPage === totalPages || totalPages === 0}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  )
}
