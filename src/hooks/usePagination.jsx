import { useState, useMemo } from "react"

const usePagination = (items, itemsPerPage) => {
  const [currentPage, setCurrentPage] = useState(1)

  const totalPages = Math.ceil(items.length / itemsPerPage)

  const displayItems = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage
    const end = start + itemsPerPage
    return items.slice(start, end)
  }, [items, currentPage, itemsPerPage])

  const goToPage = (pageNumber) => {
    setCurrentPage(pageNumber)
  }

  return { displayItems, currentPage, totalPages, goToPage }
}

export default usePagination
