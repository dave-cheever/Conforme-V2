import { ColumnConfig } from '../components/Table/ListView';

export interface CSVExportMetadata {
  exportTimestamp: string;
  exportedBy: string;
  activeFilters: string;
  totalRecordsExported: number;
}

export type CSVRow = Record<string, string>;

export interface CSVHeader {
  label: string;
  key: string;
}

export type FilterValue = 
  | string 
  | number 
  | boolean 
  | string[] 
  | Date 
  | { auditorsIds?: string[]; participantsIds?: string[]; assigneesIds?: string[]; addedByIds?: string[] }
  | [string, string?, string?]; // For date ranges: [filterType, startDate?, endDate?]

export interface CSVExportConfig {
  listType: string;
  columns: ColumnConfig[];
  appliedFilters?: Record<string, FilterValue>;
  user?: { _id?: string; userId?: string; displayName?: string } | null;
  permissionAction?: string;
}

export interface ICSVExport {
  readonly onExport?: () => void;
  readonly listType: string;
  readonly totalRecords?: number;
  readonly isLoading?: boolean;
  readonly error?: string | null;
  readonly disabled?: boolean;
}


