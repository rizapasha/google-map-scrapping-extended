import "./style.css"
import { Badge } from "~/components/ui/badge"
import { Separator } from "~/components/ui/separator"
import { Input } from "~/components/ui/input"
import { SidebarInset, SidebarProvider, SidebarTrigger } from "~/components/ui/sidebar"
import { Search, FolderOpen } from "lucide-react"

import { Toaster } from "~/components/ui/sonner"
import { exportToCSV } from "~/lib/utils/csv-utils"
import { useDashboard } from "~/lib/hooks/use-dashboard"
import { generateRowId } from "~/lib/utils/scraper-utils"

// --- Dashboard Components ---
import { StatCards } from "~/components/dashboard/StatCards"
import { BatchActionBar } from "~/components/dashboard/BatchActionBar"
import { LeadsTable } from "~/components/dashboard/LeadsTable"
import { SessionSidebar } from "~/components/dashboard/SessionSidebar"
import { ConfirmDialog } from "~/components/dashboard/ConfirmDialog"
import { CrmDrawer } from "~/components/dashboard/CrmDrawer"
import { RenameSessionDialog } from "~/components/dashboard/RenameSessionDialog"
import { useState } from "react"
import { Button } from "~/components/ui/button"
import { Pencil } from "lucide-react"
import type { ScrapedData } from "~/lib/utils/scraper-utils"

function OptionsIndex() {
  const {
    data,
    sessionIds,
    selectedSession,
    currentData,
    sortedData,
    paginatedData,
    currentPage,
    totalPages,
    itemsPerPage,
    searchQuery,
    minRating,
    sortBy,
    hideNoWebsite,
    hideNoPhone,
    showTopTierOnly,
    minReviews,
    maxReviews,
    selectedIds,
    confirmState,
    setConfirmState,
    handleSessionChange,
    handleSearchChange,
    handleRatingChange,
    handleSortChange,
    handleWebsiteFilter,
    handlePhoneFilter,
    handleTopTierFilter,
    handleMinReviewsChange,
    handleMaxReviewsChange,
    handleSelectRow,
    handleSelectAll,
    setCurrentPage,
    loadData,
    clearDatabase,
    deleteSession,
    deleteSelected,
    crmData,
    updateCrmData,
    statusFilter,
    handleStatusFilterChange,
    pinnedSessions,
    togglePinSession,
    renameSession,
    leadScoreConfig,
    updateLeadScoreConfig
  } = useDashboard()

  const [drawerLead, setDrawerLead] = useState<ScrapedData | null>(null)
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)
  const [isRenameOpen, setIsRenameOpen] = useState(false)

  const handleRowClick = (lead: ScrapedData) => {
    setDrawerLead(lead)
    setIsDrawerOpen(true)
  }

  const isAllSelected =
    sortedData.length > 0 && sortedData.every((item) => selectedIds.has(generateRowId(item)))

  return (
    <SidebarProvider>
      <SessionSidebar
        sessionIds={sessionIds}
        selectedSession={selectedSession}
        onSessionChange={handleSessionChange}
        sortBy={sortBy}
        onSortChange={handleSortChange}
        minRating={minRating}
        onRatingChange={handleRatingChange}
        showTopTierOnly={showTopTierOnly}
        onTopTierChange={handleTopTierFilter}
        hideNoWebsite={hideNoWebsite}
        onWebsiteFilterChange={handleWebsiteFilter}
        hideNoPhone={hideNoPhone}
        onPhoneFilterChange={handlePhoneFilter}
        minReviews={minReviews}
        onMinReviewsChange={handleMinReviewsChange}
        maxReviews={maxReviews}
        onMaxReviewsChange={handleMaxReviewsChange}
        statusFilter={statusFilter}
        onStatusFilterChange={handleStatusFilterChange}
        onRefresh={loadData}
        onExportSession={() => exportToCSV(sortedData, "filtered_session")}
        onExportAll={() => exportToCSV(data, "all_data")}
        onDeleteSession={deleteSession}
        onClearAll={clearDatabase}
        dataLength={data.length}
        sortedDataLength={sortedData.length}
        pinnedSessions={pinnedSessions}
        onTogglePin={togglePinSession}
        leadScoreConfig={leadScoreConfig}
        onUpdateLeadScoreConfig={updateLeadScoreConfig}
      />

      <SidebarInset className="h-screen overflow-hidden bg-slate-50 dark:bg-slate-950">
        <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4 bg-white dark:bg-slate-900">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="mr-2 h-4" />
          <div className="flex flex-1 items-center justify-between">
            <div className="flex flex-col">
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-semibold">{selectedSession || "Overview"}</h2>
                {selectedSession && (
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7 text-muted-foreground hover:text-primary transition-colors"
                    onClick={() => setIsRenameOpen(true)}
                  >
                    <Pencil className="h-3.5 w-3.5" />
                  </Button>
                )}
              </div>
              <p className="text-sm text-muted-foreground">
                {selectedSession
                  ? `${currentData.length} records in this session`
                  : "Select a session to view data"}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="font-mono">
                {sessionIds.length} sessions
              </Badge>
              <Badge variant="secondary" className="font-mono">
                {data.length} total records
              </Badge>
            </div>
          </div>
        </header>

        <div className="h-[calc(100vh-4rem)] overflow-y-auto">
          <div className="p-4 md:p-8 space-y-6">
            {selectedSession ? (
              <>
                <StatCards currentData={currentData} />

                <div className="space-y-4">
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div className="relative w-full max-w-md">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        placeholder="Search business names, addresses, or locations..."
                        className="h-10 pl-10 bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 shadow-sm transition-all focus-visible:ring-primary"
                        value={searchQuery}
                        onChange={handleSearchChange}
                      />
                    </div>

                    <BatchActionBar
                      selectedCount={selectedIds.size}
                      onExport={() => {
                        const selectedLeads = currentData.filter((item) =>
                          selectedIds.has(generateRowId(item))
                        )
                        exportToCSV(selectedLeads, "selected_leads")
                      }}
                      onDelete={deleteSelected}
                    />
                  </div>

                  <LeadsTable
                    paginatedData={paginatedData}
                    currentPage={currentPage}
                    totalPages={totalPages}
                    itemsPerPage={itemsPerPage}
                    totalCount={sortedData.length}
                    selectedIds={selectedIds}
                    isAllSelected={isAllSelected}
                    onSelectAll={handleSelectAll}
                    onSelectRow={handleSelectRow}
                    onPageChange={setCurrentPage}
                    crmData={crmData}
                    onRowClick={handleRowClick}
                  />
                </div>
              </>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center h-[60vh] text-center space-y-4">
                <div className="rounded-full bg-muted p-4">
                  <FolderOpen className="h-8 w-8 text-muted-foreground" />
                </div>
                <div className="space-y-2">
                  <h3 className="text-lg font-semibold">No session selected</h3>
                  <p className="text-sm text-muted-foreground max-w-sm">
                    Select a scraping session from the sidebar to view and manage your extracted
                    data.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </SidebarInset>

      <ConfirmDialog
        isOpen={confirmState.isOpen}
        onOpenChange={(open) => setConfirmState((prev) => ({ ...prev, isOpen: open }))}
        title={confirmState.title}
        description={confirmState.description}
        onConfirm={confirmState.onConfirm}
      />

      <CrmDrawer
        key={drawerLead ? generateRowId(drawerLead) : "none"}
        selectedLead={drawerLead}
        crmRecord={drawerLead ? crmData[generateRowId(drawerLead)] : null}
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        onUpdate={(updates) => drawerLead && updateCrmData(generateRowId(drawerLead), updates)}
      />

      <RenameSessionDialog
        key={selectedSession + isRenameOpen}
        isOpen={isRenameOpen}
        onOpenChange={setIsRenameOpen}
        currentName={selectedSession}
        onRename={(newName) => renameSession(selectedSession, newName)}
      />

      <Toaster position="bottom-right" richColors />
    </SidebarProvider>
  )
}

export default OptionsIndex
