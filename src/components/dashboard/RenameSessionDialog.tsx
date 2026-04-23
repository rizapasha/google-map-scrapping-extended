import React, { useState, useEffect } from "react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter
} from "~/components/ui/dialog"
import { Button } from "~/components/ui/button"
import { Label } from "~/components/ui/label"
import { Input } from "~/components/ui/input"

interface RenameSessionDialogProps {
  isOpen: boolean
  onOpenChange: (open: boolean) => void
  currentName: string
  onRename: (newName: string) => void
}

export function RenameSessionDialog({
  isOpen,
  onOpenChange,
  currentName,
  onRename
}: RenameSessionDialogProps) {
  const [newName, setNewName] = useState(currentName)

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Rename Session</DialogTitle>
          <DialogDescription>Enter a new name for this scraping session.</DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="flex flex-col gap-2">
            <Label htmlFor="name" className="text-xs font-semibold">
              Session Name
            </Label>
            <Input
              id="name"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              className="w-full"
              autoFocus
              placeholder="Enter session name..."
            />
          </div>
        </div>
        <DialogFooter>
          <Button
            type="submit"
            onClick={() => {
              onRename(newName)
              onOpenChange(false)
            }}
            disabled={!newName || newName === currentName}
          >
            Save changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
