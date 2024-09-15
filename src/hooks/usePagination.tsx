import { useState, useMemo } from "react"

interface PaginationProps {
  items: any[]
  itemsPerPage: number
}

interface PaginationHook {
  displayItems: any[]
  currentPage: number
  totalPages: number
  goToPage: (pageNumber: number) => void
}

const usePagination = (
  items: PaginationProps["items"],
  itemsPerPage: PaginationProps["itemsPerPage"]
): PaginationHook => {
  const [currentPage, setCurrentPage] = useState(1)

  const totalPages = Math.ceil(items.length / itemsPerPage)

  const displayItems = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage
    const end = start + itemsPerPage
    return items.slice(start, end)
  }, [items, currentPage, itemsPerPage])

  const goToPage = (pageNumber: number) => {
    setCurrentPage(pageNumber)
  }

  return { displayItems, currentPage, totalPages, goToPage }
}

export default usePagination
