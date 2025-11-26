import { useState, useCallback } from "react";
import { PAGINATION_DEFAULT_PAGE_SIZE, PAGINATION_PAGE_SIZE_OPTIONS } from "../bootstrap/config";

const PAGINATION_STORAGE_KEY = "pagination_page_size";

const getStoredPageSize = (): typeof PAGINATION_PAGE_SIZE_OPTIONS[number] => {

  try {
    const stored = localStorage.getItem(PAGINATION_STORAGE_KEY);
    if (stored) {
      const parsed = Number.parseInt(stored, 10);
      if (PAGINATION_PAGE_SIZE_OPTIONS.includes(parsed as typeof PAGINATION_PAGE_SIZE_OPTIONS[number])) {
        return parsed as typeof PAGINATION_PAGE_SIZE_OPTIONS[number];
      }
    }
  } catch (error) {
    console.warn("Failed to read page size from localStorage:", error);
  }

  return PAGINATION_DEFAULT_PAGE_SIZE;
};

const savePageSize = (size: typeof PAGINATION_PAGE_SIZE_OPTIONS[number]): void => {
  if (globalThis.window === undefined) {
    return;
  }

  try {
    localStorage.setItem(PAGINATION_STORAGE_KEY, String(size));
  } catch (error) {
    console.warn("Failed to save page size to localStorage:", error);
  }
};

const usePagination = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState<typeof PAGINATION_PAGE_SIZE_OPTIONS[number]>(() => getStoredPageSize());
  const [total, setTotal] = useState(0);

  const updatePageSize = useCallback((newPageSize: typeof PAGINATION_PAGE_SIZE_OPTIONS[number]) => {
    setPageSize(newPageSize);
    savePageSize(newPageSize);
  }, []);

  return {
    currentPage,
    setCurrentPage,
    pageSize,
    setPageSize: updatePageSize,
    total,
    setTotal,
  };
};

export default usePagination;
