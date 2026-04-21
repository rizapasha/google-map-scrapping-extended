import { Button } from "~/components/ui/button"
import { Download, Trash2 } from "lucide-react"

interface BatchActionBarProps {
  selectedCount: number
  onExport: () => void
  onDelete: () => void
}

export function BatchActionBar({ selectedCount, onExport, onDelete }: BatchActionBarProps) {
  if (selectedCount === 0) return null

  return (
    <div className="flex items-center gap-4 bg-background border px-4 py-2 rounded-full shadow-sm animate-in fade-in slide-in-from-bottom-2">
      <span className="text-xs font-medium text-muted-foreground whitespace-nowrap">
        {selectedCount} selected
      </span>
      <div className="flex items-center gap-1">
        <Button variant="ghost" size="sm" className="h-8" onClick={onExport}>
          <Download className="mr-2 h-4 w-4" />
          Export
        </Button>
        <Button
          variant="ghost"
          size="sm"
          className="h-8 text-destructive hover:text-destructive hover:bg-destructive/10"
          onClick={onDelete}
        >
          <Trash2 className="mr-2 h-4 w-4" />
          Delete
        </Button>
      </div>
    </div>
  )
}
