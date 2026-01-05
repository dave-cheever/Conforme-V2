import { useState, useCallback, useMemo } from 'react';
import { useToast } from '@chakra-ui/react';
import { CSVExportConfig } from '../interfaces/ICSVExport';
import { CSV_EXPORT_MAX_RECORDS } from '../bootstrap/config';
import { generateCSVData, generateCSVFilename } from '../utils/csvExportUtils';
import { isPermitted } from '../components/can';
import { useAppContext } from '../contexts/AppProvider';

export interface UseCSVExportOptions<TData = Record<string, unknown>> {
  config: CSVExportConfig;
  fetchData: () => Promise<TData[]>;
}

export interface UseCSVExportReturn {
  isLoading: boolean;
  error: string | null;
  canExport: boolean;
  handleExport: () => Promise<void>;
}

const useCSVExport = <TData = Record<string, unknown>>({
  config,
  fetchData,
}: UseCSVExportOptions<TData>): UseCSVExportReturn => {
  const { user, organizationConfig } = useAppContext();
  const toast = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const canExport = useMemo(() => {
    if (!config.permissionAction) return false;
    return isPermitted({
      user,
      action: config.permissionAction,
      revokedPermissions: organizationConfig?.revokedPermissions,
    });
  }, [user, config.permissionAction, organizationConfig?.revokedPermissions, globalThis.roles]);

  const handleExport = useCallback(async () => {
    if (!canExport) {
      const errorMsg = 'You do not have permission to export data.';
      setError(errorMsg);
      toast({
        title: 'Unauthorized',
        description: errorMsg,
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
      return;
    }

    setError(null);
    setIsLoading(true);

    try {
      const records = await fetchData();

      if (records.length > CSV_EXPORT_MAX_RECORDS) {
        const errorMsg = `Export contains ${records.length} records, which exceeds the maximum of ${CSV_EXPORT_MAX_RECORDS}. Please refine your filters and try again.`;
        setError(errorMsg);
        toast({
          title: 'Export Limit Exceeded',
          description: errorMsg,
          status: 'warning',
          duration: 7000,
          isClosable: true,
          position: 'top',
        });
        return;
      }

      const { headers, data } = generateCSVData({ config, data: records });
      const filename = generateCSVFilename(config.listType);

      // Build CSV text (Excel-friendly with BOM)
      const headerKeys = headers.map((h) => h.key);
      const escape = (val: unknown): string => {
        const s = val === undefined || val === null ? '' : JSON.stringify(val);
        const needsQuotes = /[",\n\r]/.test(s);
        const escaped = s.replaceAll('"', '""');
        return needsQuotes ? `"${escaped}"` : escaped;
      };

      const lines: string[] = [];
      lines.push(headerKeys.map(escape).join(','));
      for (const row of data) {
        lines.push(headerKeys.map((k) => escape(row[k])).join(','));
      }
      const csvText = '\ufeff' + lines.join('\r\n');

      const blob = new Blob([csvText], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      a.style.display = 'none';
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
    } catch (err) {
      const errorMsg = 'Export could not be completed. Please try again or contact support.';
      const errorDetails = err instanceof Error ? err.message : String(err);
      console.error('CSV Export Error:', errorDetails, err);
      setError(errorMsg);
      toast({
        title: 'Export Failed',
        description: errorMsg,
        status: 'error',
        duration: 5000,
        isClosable: true,
        position: 'top',
      });
    } finally {
      setIsLoading(false);
    }
  }, [canExport, config, fetchData, toast]);

  return {
    isLoading,
    error,
    canExport,
    handleExport,
  };
};

export default useCSVExport;

