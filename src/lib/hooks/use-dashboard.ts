import { useState, useEffect, useMemo, useCallback } from "react"
import { calculateLeadScore, generateRowId, type ScrapedData } from "../utils/scraper-utils"
import { toast } from "sonner"

export function useDashboard() {
  const [data, setData] = useState<ScrapedData[]>([])
  const [selectedSession, setSelectedSession] = useState<string>("")
  const [searchQuery, setSearchQuery] = useState("")
  const [minRating, setMinRating] = useState<number>(0)
  const [sortBy, setSortBy] = useState<string>("default")
  const [hideNoWebsite, setHideNoWebsite] = useState(false)
  const [hideNoPhone, setHideNoPhone] = useState(false)
  const [showTopTierOnly, setShowTopTierOnly] = useState(false)
  const [minReviews, setMinReviews] = useState<string>("")
  const [maxReviews, setMaxReviews] = useState<string>("")
  const [currentPage, setCurrentPage] = useState(1)
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set())
  const [confirmState, setConfirmState] = useState<{
    isOpen: boolean
    title: string
    description: string
    onConfirm: () => void
  }>({
    isOpen: false,
    title: "",
    description: "",
    onConfirm: () => {}
  })

  const itemsPerPage = 50

  const openConfirm = (title: string, description: string, onConfirm: () => void) => {
    setConfirmState({ isOpen: true, title, description, onConfirm })
  }

  const loadData = useCallback(() => {
    chrome.storage.local.get(["scrapedData"], (res) => {
      const storedData = (res.scrapedData as ScrapedData[]) || []
      setData(storedData)

      if (storedData.length > 0) {
        const uniqueSessions = Array.from(
          new Set(storedData.map((item) => item.sessionId || "Legacy Session"))
        )
        uniqueSessions.sort((a, b) => b.localeCompare(a))

        setSelectedSession((prev) => {
          if (!prev || !uniqueSessions.includes(prev)) {
            return uniqueSessions[0]
          }
          return prev
        })
      } else {
        setSelectedSession("")
      }
    })
  }, [])

  useEffect(() => {
    loadData()
  }, [loadData])

  // --- Derived Data ---
  const groupedData = useMemo(() => {
    return data.reduce(
      (acc, item) => {
        const key = item.sessionId || "Legacy Session"
        if (!acc[key]) acc[key] = []
        acc[key].push(item)
        return acc
      },
      {} as Record<string, ScrapedData[]>
    )
  }, [data])

  const sessionIds = useMemo(() => {
    return Object.keys(groupedData).sort((a, b) => b.localeCompare(a))
  }, [groupedData])

  const currentData = useMemo(() => {
    return selectedSession ? groupedData[selectedSession] || [] : []
  }, [selectedSession, groupedData])

  const filteredData = useMemo(() => {
    return currentData.filter((item) => {
      const queryParts = searchQuery.toLowerCase().split(" ").filter(Boolean)
      let matchesSearch = true

      for (const part of queryParts) {
        if (part.startsWith("-") && part.length > 1) {
          const exclusionTerm = part.slice(1)
          if (
            item.title.toLowerCase().includes(exclusionTerm) ||
            item.address.toLowerCase().includes(exclusionTerm)
          ) {
            matchesSearch = false
            break
          }
        } else {
          if (
            !item.title.toLowerCase().includes(part) &&
            !item.address.toLowerCase().includes(part)
          ) {
            matchesSearch = false
            break
          }
        }
      }

      const matchesRating = parseFloat(item.ratingScore) >= minRating
      const hasWebsite = !hideNoWebsite || !!item.website
      const hasPhone = !hideNoPhone || !!item.phone
      const isTopTier = !showTopTierOnly || calculateLeadScore(item) >= 80

      const revCount = parseInt(item.reviewCount.replace(/,/g, "")) || 0
      const parsedMinRev = minReviews ? parseInt(minReviews) : 0
      const parsedMaxRev = maxReviews ? parseInt(maxReviews) : Infinity
      const matchesReviews = revCount >= parsedMinRev && revCount <= parsedMaxRev

      return matchesSearch && matchesRating && hasWebsite && hasPhone && isTopTier && matchesReviews
    })
  }, [
    currentData,
    searchQuery,
    minRating,
    hideNoWebsite,
    hideNoPhone,
    showTopTierOnly,
    minReviews,
    maxReviews
  ])

  const sortedData = useMemo(() => {
    return [...filteredData].sort((a, b) => {
      if (sortBy === "rating-desc")
        return (parseFloat(b.ratingScore) || 0) - (parseFloat(a.ratingScore) || 0)
      if (sortBy === "rating-asc")
        return (parseFloat(a.ratingScore) || 0) - (parseFloat(b.ratingScore) || 0)
      if (sortBy === "reviews-desc")
        return (
          (parseInt(b.reviewCount.replace(/,/g, "")) || 0) -
          (parseInt(a.reviewCount.replace(/,/g, "")) || 0)
        )
      return 0
    })
  }, [filteredData, sortBy])

  const paginatedData = useMemo(() => {
    return sortedData.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)
  }, [sortedData, currentPage, itemsPerPage])

  const totalPages = Math.ceil(sortedData.length / itemsPerPage)

  // --- Actions ---
  const handleSessionChange = (val: string) => {
    setSelectedSession(val)
    setCurrentPage(1)
    setSelectedIds(new Set())
  }

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value)
    setCurrentPage(1)
    setSelectedIds(new Set())
  }

  const handleRatingChange = (val: string) => {
    setMinRating(parseFloat(val))
    setCurrentPage(1)
    setSelectedIds(new Set())
  }

  const handleSortChange = (val: string) => {
    setSortBy(val)
    setCurrentPage(1)
    setSelectedIds(new Set())
  }

  const handleWebsiteFilter = (val: boolean) => {
    setHideNoWebsite(val)
    setCurrentPage(1)
    setSelectedIds(new Set())
  }

  const handlePhoneFilter = (val: boolean) => {
    setHideNoPhone(val)
    setCurrentPage(1)
    setSelectedIds(new Set())
  }

  const handleTopTierFilter = (val: boolean) => {
    setShowTopTierOnly(val)
    setCurrentPage(1)
    setSelectedIds(new Set())
  }

  const handleMinReviewsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMinReviews(e.target.value)
    setCurrentPage(1)
    setSelectedIds(new Set())
  }

  const handleMaxReviewsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMaxReviews(e.target.value)
    setCurrentPage(1)
    setSelectedIds(new Set())
  }

  const handleSelectRow = (id: string, checked: boolean) => {
    const next = new Set(selectedIds)
    if (checked) next.add(id)
    else next.delete(id)
    setSelectedIds(next)
  }

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      const allIds = sortedData.map((item) => generateRowId(item))
      setSelectedIds(new Set(allIds))
    } else {
      setSelectedIds(new Set())
    }
  }

  const clearDatabase = () => {
    openConfirm(
      "Hapus Semua Data?",
      "Tindakan ini tidak dapat dibatalkan. Seluruh data hasil scraping akan dihapus permanen.",
      () => {
        chrome.storage.local.set({ scrapedData: [] }, () => {
          setData([])
          toast.success("Database berhasil dibersihkan")
        })
      }
    )
  }

  const deleteSession = () => {
    openConfirm(
      "Hapus Sesi?",
      `Apakah Anda yakin ingin menghapus sesi "${selectedSession}"?`,
      () => {
        const newData = data.filter((d) => (d.sessionId || "Legacy Session") !== selectedSession)
        chrome.storage.local.set({ scrapedData: newData }, () => {
          loadData()
          toast.success("Sesi berhasil dihapus")
        })
      }
    )
  }

  const deleteSelected = () => {
    openConfirm(
      "Hapus Leads Terpilih?",
      `Apakah Anda yakin ingin menghapus ${selectedIds.size} leads yang dipilih?`,
      () => {
        const newData = data.filter((item) => !selectedIds.has(generateRowId(item)))
        chrome.storage.local.set({ scrapedData: newData }, () => {
          loadData()
          setSelectedIds(new Set())
          toast.success(`${selectedIds.size} leads berhasil dihapus`)
        })
      }
    )
  }

  return {
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
    openConfirm
  }
}
