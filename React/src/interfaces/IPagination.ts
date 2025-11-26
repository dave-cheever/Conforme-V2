import { PAGINATION_PAGE_SIZE_OPTIONS } from "../bootstrap/config";

export interface IPagination {
  readonly currentPage?: number;
  readonly pageSize?: number;
  readonly total?: number;
  readonly onPageChange?: (page: number) => void;
  readonly onPageSizeChange?: (pageSize: (typeof PAGINATION_PAGE_SIZE_OPTIONS)[number]) => void;
}