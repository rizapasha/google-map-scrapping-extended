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
import { AlertCircle, CheckCircle2 } from "lucide-react"
import { type LeadScoreConfig } from "~/lib/utils/scraper-utils"

interface LeadScoreConfigModalProps {
  isOpen: boolean
  onOpenChange: (open: boolean) => void
  config: LeadScoreConfig
  onSave: (config: LeadScoreConfig) => void
}

export function LeadScoreConfigModal({
  isOpen,
  onOpenChange,
  config,
  onSave
}: LeadScoreConfigModalProps) {
  const [localConfig, setLocalConfig] = useState<LeadScoreConfig>(config)

  const totalWeight =
    localConfig.websiteWeight +
    localConfig.phoneWeight +
    localConfig.ratingWeight +
    localConfig.reviewWeight

  const isValid = totalWeight === 100

  const handleChange = (field: keyof LeadScoreConfig, value: string) => {
    const numValue = parseInt(value) || 0
    setLocalConfig((prev) => ({ ...prev, [field]: numValue }))
  }

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Lead Scoring Metrics</DialogTitle>
          <DialogDescription>
            Configure how leads are scored. The total weight MUST equal 100.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="flex flex-col gap-2">
            <Label htmlFor="websiteWeight" className="text-xs font-semibold">
              Website Weight
            </Label>
            <Input
              id="websiteWeight"
              type="number"
              value={localConfig.websiteWeight}
              onChange={(e) => handleChange("websiteWeight", e.target.value)}
              className="w-full h-9"
            />
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="phoneWeight" className="text-xs font-semibold">
              Phone Weight
            </Label>
            <Input
              id="phoneWeight"
              type="number"
              value={localConfig.phoneWeight}
              onChange={(e) => handleChange("phoneWeight", e.target.value)}
              className="w-full h-9"
            />
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="ratingWeight" className="text-xs font-semibold">
              Rating Weight
            </Label>
            <Input
              id="ratingWeight"
              type="number"
              value={localConfig.ratingWeight}
              onChange={(e) => handleChange("ratingWeight", e.target.value)}
              className="w-full h-9"
            />
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="reviewWeight" className="text-xs font-semibold">
              Reviews Weight
            </Label>
            <Input
              id="reviewWeight"
              type="number"
              value={localConfig.reviewWeight}
              onChange={(e) => handleChange("reviewWeight", e.target.value)}
              className="w-full h-9"
            />
          </div>

          <div className="border-t pt-4 mt-2">
            <div className="flex flex-col gap-2">
              <Label htmlFor="threshold" className="text-xs font-bold text-primary">
                Top Tier Threshold
              </Label>
              <Input
                id="threshold"
                type="number"
                value={localConfig.topTierThreshold}
                onChange={(e) => handleChange("topTierThreshold", e.target.value)}
                className="w-full h-9"
              />
              <p className="text-[10px] text-muted-foreground italic">
                Minimum score to be considered "Top Tier".
              </p>
            </div>
          </div>
        </div>

        <div
          className={`flex items-center gap-2 p-3 rounded-md text-sm ${
            isValid
              ? "bg-green-50 text-green-700 dark:bg-green-950/30 dark:text-green-400"
              : "bg-red-50 text-red-700 dark:bg-red-950/30 dark:text-red-400"
          }`}
        >
          {isValid ? <CheckCircle2 className="h-4 w-4" /> : <AlertCircle className="h-4 w-4" />}
          <span className="font-medium">
            Total Weight: {totalWeight} / 100
            {!isValid && ` (Needs adjustment of ${100 - totalWeight})`}
          </span>
        </div>

        <DialogFooter>
          <Button
            type="submit"
            onClick={() => onSave(localConfig)}
            disabled={!isValid}
            className="w-full"
          >
            Save Configuration
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
