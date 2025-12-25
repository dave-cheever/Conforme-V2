import { format } from 'date-fns';
import { capitalize } from 'lodash';
import { ColumnConfig } from '../components/Table/ListView';
import { CSVExportConfig, CSVExportMetadata, CSVRow, CSVHeader, FilterValue } from '../interfaces/ICSVExport';
import { auditWalkTypes, auditsFilterDates } from '../hooks/useFiltersUtils';
import { t } from 'i18next';

const getNestedValue = (obj: Record<string, unknown>, path: string): unknown => {
  if (!path) return undefined;
  return path.split('.').reduce((current: unknown, key: string) => {
    if (current && typeof current === 'object' && key in current) {
      return (current as Record<string, unknown>)[key];
    }
    return undefined;
  }, obj);
};

const formatStatusFilter = (value: FilterValue): string => {
  if (Array.isArray(value)) {
    return `Status: ${value.join(', ')}`;
  }
  return '';
};

const formatWalkTypeFilter = (value: FilterValue): string => {
  if (Array.isArray(value)) {
    return `Walk Type: ${value.map((wt) => auditWalkTypes[wt] || wt).join(', ')}`;
  }
  return '';
};

const formatLocationsFilter = (value: FilterValue): string => {
  if (Array.isArray(value) && value.length > 0) {
    return `${capitalize(t('location'))}: ${value.length} selected`;
  }
  return '';
};

const formatBusinessUnitsFilter = (value: FilterValue): string => {
  if (Array.isArray(value) && value.length > 0) {
    return `${capitalize(t('business unit'))}: ${value.length} selected`;
  }
  return '';
};

const isValidUserFilter = (value: FilterValue): boolean => {
  return typeof value === 'object' && value !== null && !Array.isArray(value) && !(value instanceof Date);
};

const buildUserFilterParts = (userFilter: { auditorsIds?: string[]; participantsIds?: string[]; assigneesIds?: string[]; addedByIds?: string[] }): string[] => {
  const parts: string[] = [];
  
  if (userFilter.auditorsIds?.length) {
    parts.push(`Auditors: ${userFilter.auditorsIds.length} selected`);
  }
  if (userFilter.participantsIds?.length) {
    parts.push(`Participants: ${userFilter.participantsIds.length} selected`);
  }
  if (userFilter.assigneesIds?.length) {
    parts.push(`Assignees: ${userFilter.assigneesIds.length} selected`);
  }
  if (userFilter.addedByIds?.length) {
    parts.push(`Added By: ${userFilter.addedByIds.length} selected`);
  }
  
  return parts;
};

const formatUsersFilter = (value: FilterValue): string => {
  if (!isValidUserFilter(value)) {
    return '';
  }
  
  const userFilter = value as { auditorsIds?: string[]; participantsIds?: string[]; assigneesIds?: string[]; addedByIds?: string[] };
  const parts = buildUserFilterParts(userFilter);
  
  return parts.length > 0 ? `Users: ${parts.join(', ')}` : '';
};

const formatDateFilter = (key: string, value: FilterValue): string => {
  if (Array.isArray(value) && value.length > 0) {
    const [filterType, startDate, endDate] = value;
    const dateLabel = key === 'dueDate' ? 'Due Date' : 'Created Date';
    
    if (filterType === 'dateRange' && startDate && endDate) {
      const start = format(new Date(startDate), 'dd/MM/yyyy');
      const end = format(new Date(endDate), 'dd/MM/yyyy');
      return `${capitalize(dateLabel)}: ${start} - ${end}`;
    }
    if (filterType === 'exactDate' && startDate) {
      const date = format(new Date(startDate), 'dd/MM/yyyy');
      return `${capitalize(dateLabel)}: ${date}`;
    }
    if (typeof value[0] === 'string' && auditsFilterDates[value[0]]) {
      return `${capitalize(dateLabel)}: ${auditsFilterDates[value[0]]}`;
    }
  }
  return '';
};

const formatShowArchivedFilter = (value: FilterValue): string => {
  if (value === true) {
    return 'Show Archived: Yes';
  }
  return '';
};

const formatDefaultFilter = (key: string, value: FilterValue): string => {
  if (Array.isArray(value) && value.length > 0) {
    return `${capitalize(key)}: ${value.length} selected`;
  }
  if (typeof value === 'string' || typeof value === 'number' || typeof value === 'boolean') {
    return `${capitalize(key)}: ${String(value)}`;
  }
  return '';
};

const formatFilterValue = (key: string, value: FilterValue): string => {
  switch (key) {
    case 'status':
      return formatStatusFilter(value);
    case 'walkType':
      return formatWalkTypeFilter(value);
    case 'locationsIds':
      return formatLocationsFilter(value);
    case 'businessUnitsIds':
      return formatBusinessUnitsFilter(value);
    case 'usersIds':
      return formatUsersFilter(value);
    case 'dueDate':
    case 'createdDate':
      return formatDateFilter(key, value);
    case 'showArchived':
      return formatShowArchivedFilter(value);
    default:
      return formatDefaultFilter(key, value);
  }
};

export const formatFiltersAsText = (appliedFilters?: Record<string, FilterValue>): string => {
  if (!appliedFilters || Object.keys(appliedFilters).length === 0) {
    return 'None';
  }

  const filterTexts: string[] = [];

  Object.entries(appliedFilters).forEach(([key, value]) => {
    if (!value || (Array.isArray(value) && value.length === 0)) return;

    const filterText = formatFilterValue(key, value);
    if (filterText) {
      filterTexts.push(filterText);
    }
  });

  return filterTexts.length > 0 ? filterTexts.join('; ') : 'None';
};

const safeStringify = (val: unknown): string => {
  if (val === null || val === undefined) {
    return '';
  }
  if (typeof val === 'string') {
    return val;
  }
  if (typeof val === 'number' || typeof val === 'boolean') {
    return String(val);
  }
  return JSON.stringify(val);
};

const formatCompletedDateValue = (value: unknown): string | null => {
  if (value === undefined || value === null || value === '') {
    return 'No submitted date';
  }
  return null;
};

const formatDateValue = (value: unknown, sortKey: string): string | null => {
  if (typeof value !== 'string' && !(value instanceof Date)) {
    return null;
  }

  try {
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) {
      return null;
    }

    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    
    if (sortKey.includes('completedDate') || sortKey.includes('completed')) {
      return `${day}/${month}/${year} ${hours}:${minutes}`;
    }
    return `${day}/${month}/${year}`;
  } catch (e) {
    console.warn('Error formatting date value:', e);
    return null;
  }
};

const formatArrayValue = (value: unknown[]): string => {
  return value
    .map((v) => {
      if (typeof v === 'object' && v !== null) {
        const obj = v as Record<string, unknown>;
        const displayName = obj.displayName;
        const name = obj.name;
        
        if (displayName !== undefined && displayName !== null) {
          return safeStringify(displayName);
        }
        if (name !== undefined && name !== null) {
          return safeStringify(name);
        }
        return JSON.stringify(v);
      }
      return safeStringify(v);
    })
    .join(', ');
};

const formatObjectValue = (value: Record<string, unknown>): string => {
  const displayName = value.displayName;
  const name = value.name;
  const status = value.status;

  if (displayName !== undefined && displayName !== null) {
    return safeStringify(displayName);
  }
  if (name !== undefined && name !== null) {
    return safeStringify(name);
  }
  if (status !== undefined && status !== null) {
    return safeStringify(status);
  }
  return JSON.stringify(value);
};

const formatWalkTypeValue = (value: string): string => {
  const walkTypes: Record<string, string> = {
    virtual: 'Virtual',
    physical: 'Physical',
  };
  return walkTypes[value] || value;
};

const formatValueForCSV = (value: unknown, sortKey: string, columnLabel?: string): string => {
  if (sortKey === 'completedDate') {
    const completedDateResult = formatCompletedDateValue(value);
    if (completedDateResult !== null) {
      return completedDateResult;
    }
  }

  if (value === undefined || value === null) {
    return '';
  }

  if (sortKey.includes('Date') || sortKey.includes('date')) {
    const dateResult = formatDateValue(value, sortKey);
    if (dateResult !== null) {
      return dateResult;
    }
  }

  if (typeof value === 'object' && value !== null) {
    if (Array.isArray(value)) {
      return formatArrayValue(value);
    }
    return formatObjectValue(value as Record<string, unknown>);
  }

  if (sortKey === 'walkType' && typeof value === 'string') {
    return formatWalkTypeValue(value);
  }

  return safeStringify(value);
};


const convertRowToCSV = (row: Record<string, unknown>, columns: ColumnConfig[]): CSVRow => {
  const csvRow: Record<string, string> = {};

  columns.forEach((column) => {
    if (column.disabled || column.sortKey === '' || column.disableSort) return;

    const value = getNestedValue(row, column.sortKey);
    const displayValue = formatValueForCSV(value, column.sortKey, column.label as string);
    const csvKey = (column.label as string) === capitalize(t('location')) ? 'Site' : (column.label as string);
    csvRow[csvKey] = displayValue;
  });

  return csvRow;
};

export const generateCSVData = <TData = Record<string, unknown>>({
  config,
  data,
}: {
  config: CSVExportConfig;
  data: TData[];
}): { headers: CSVHeader[]; data: CSVRow[] } => {
  const { columns, appliedFilters, user } = config;

  const headers = columns
    .filter((col) => !col.disabled && col.sortKey !== '' && !col.disableSort)
    .map((col) => {
      const label = safeStringify(col.label);
      const csvLabel = label === capitalize(t('location')) ? 'Site' : label;
      return {
        label: csvLabel,
        key: csvLabel,
      };
    });

  const metadata: CSVExportMetadata = {
    exportTimestamp: format(new Date(), "yyyy-MM-dd'T'HH:mm:ss'Z'"),
    exportedBy: user?.displayName || user?.userId || user?._id || 'Unknown',
    activeFilters: formatFiltersAsText(appliedFilters),
    totalRecordsExported: data.length,
  };

  const metadataRows = [
    { [headers[0]?.label || 'Metadata']: 'Export Timestamp (UTC)', [headers[1]?.label || 'Value']: metadata.exportTimestamp },
    { [headers[0]?.label || 'Metadata']: 'Exported By', [headers[1]?.label || 'Value']: metadata.exportedBy },
    { [headers[0]?.label || 'Metadata']: 'Active Filters', [headers[1]?.label || 'Value']: metadata.activeFilters },
    { [headers[0]?.label || 'Metadata']: 'Total Records Exported', [headers[1]?.label || 'Value']: String(metadata.totalRecordsExported) },
    {},
  ];

  const dataRows = data.map((row) => convertRowToCSV(row as Record<string, unknown>, columns));
  const allRows = [...metadataRows, ...dataRows];

  return { headers, data: allRows };
};

export const generateCSVFilename = (listType: string): string => {
  const timestamp = format(new Date(), 'yyyy_MM_dd_HHmmss');
  return `Export_${listType}_${timestamp}.csv`;
};

