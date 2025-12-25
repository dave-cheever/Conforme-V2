import { describe, expect, test, vi } from 'vitest';

// Mock i18next BEFORE any imports - must match how it's imported in csvExportUtils
vi.mock('i18next', () => ({
  t: (key: string) => key,
}));

// Mock useFiltersUtils BEFORE any imports
vi.mock('../../hooks/useFiltersUtils', () => ({
  auditWalkTypes: {
    virtual: 'Virtual',
    physical: 'Physical',
  },
  auditsFilterDates: {
    last7Days: 'Last 7 Days',
    last30Days: 'Last 30 Days',
    last90Days: 'Last 90 Days',
  },
}));

// Now import after mocks
import { ColumnConfig } from '../../components/Table/ListView';
import { generateCSVData, generateCSVFilename, formatFiltersAsText } from '../csvExportUtils';
import { CSVExportConfig } from '../../interfaces/ICSVExport';

describe('CSV Export Utils', () => {
  describe('formatFiltersAsText', () => {
    test('returns "None" for empty or undefined filters', () => {
      expect(formatFiltersAsText()).toBe('None');
      expect(formatFiltersAsText({})).toBe('None');
    });

    test('formats status filter', () => {
      const filters = { status: ['completed', 'in-progress'] };
      expect(formatFiltersAsText(filters)).toBe('Status: completed, in-progress');
    });

    test('formats walkType filter', () => {
      const filters = { walkType: ['virtual', 'physical'] };
      expect(formatFiltersAsText(filters)).toBe('Walk Type: Virtual, Physical');
    });

    test('formats locationsIds filter', () => {
      const filters = { locationsIds: ['loc1', 'loc2', 'loc3'] };
      const result = formatFiltersAsText(filters);
      expect(result).toContain('Location'); // capitalize() capitalizes first letter
      expect(result).toContain('3 selected');
    });

    test('formats businessUnitsIds filter', () => {
      const filters = { businessUnitsIds: ['bu1', 'bu2'] };
      const result = formatFiltersAsText(filters);
      expect(result).toContain('Business unit'); // capitalize() capitalizes first letter
      expect(result).toContain('2 selected');
    });

    test('formats usersIds filter with auditors', () => {
      const filters = {
        usersIds: {
          auditorsIds: ['user1', 'user2'],
          participantsIds: [],
        },
      };
      const result = formatFiltersAsText(filters);
      expect(result).toContain('Users:');
      expect(result).toContain('Auditors: 2 selected');
    });

    test('formats usersIds filter with multiple user types', () => {
      const filters = {
        usersIds: {
          auditorsIds: ['user1'],
          participantsIds: ['user2', 'user3'],
          assigneesIds: ['user4'],
        },
      };
      const result = formatFiltersAsText(filters);
      expect(result).toContain('Auditors: 1 selected');
      expect(result).toContain('Participants: 2 selected');
      expect(result).toContain('Assignees: 1 selected');
    });

    test('formats dueDate filter with dateRange', () => {
      const filters = {
        dueDate: ['dateRange', '2024-01-01', '2024-12-31'],
      };
      const result = formatFiltersAsText(filters);
      expect(result).toContain('Due date:'); // capitalize('dueDate') = 'Due date' (only first letter)
      expect(result).toMatch(/01\/01\/2024/);
      expect(result).toMatch(/31\/12\/2024/);
    });

    test('formats dueDate filter with exactDate', () => {
      const filters = {
        dueDate: ['exactDate', '2024-06-15'],
      };
      const result = formatFiltersAsText(filters);
      expect(result).toContain('Due date:'); // capitalize('dueDate') = 'Due date'
      expect(result).toMatch(/15\/06\/2024/);
    });

    test('formats dueDate filter with preset date', () => {
      const filters = {
        dueDate: ['last7Days'],
      };
      const result = formatFiltersAsText(filters);
      expect(result).toContain('Due date:'); // capitalize('dueDate') = 'Due date'
      expect(result).toContain('Last 7 Days');
    });

    test('formats showArchived filter', () => {
      const filters = { showArchived: true };
      expect(formatFiltersAsText(filters)).toBe('Show Archived: Yes');
    });

    test('formats multiple filters together', () => {
      const filters = {
        status: ['completed'],
        showArchived: true,
        locationsIds: ['loc1'],
      };
      const result = formatFiltersAsText(filters);
      expect(result).toContain('Status:');
      expect(result).toContain('Show Archived: Yes');
      expect(result).toContain('Location'); // capitalize() capitalizes first letter
    });

    test('ignores empty arrays', () => {
      const filters = {
        status: [],
        locationsIds: ['loc1'],
      };
      const result = formatFiltersAsText(filters);
      expect(result).not.toContain('Status:');
      expect(result).toContain('Location'); // capitalize() capitalizes first letter
    });

    test('handles default case for unknown filter types', () => {
      const filters = {
        customFilter: ['value1', 'value2'],
        numericFilter: 123,
        stringFilter: 'test',
        booleanFilter: true,
      };
      const result = formatFiltersAsText(filters);
      // capitalize capitalizes first letter only
      expect(result).toContain('Customfilter');
      expect(result).toContain('2 selected');
      expect(result).toContain('Numericfilter');
      expect(result).toContain('123');
      expect(result).toContain('Stringfilter');
      expect(result).toContain('test');
      expect(result).toContain('Booleanfilter');
      expect(result).toContain('true');
    });
  });

  describe('generateCSVData', () => {
    const mockColumns: ColumnConfig[] = [
      {
        label: 'Name',
        sortKey: 'name',
        width: '20%',
        dataId: '001',
        render: () => null,
      },
      {
        label: 'Status',
        sortKey: 'status',
        width: '15%',
        dataId: '002',
        render: () => null,
      },
    ];

    const mockUser = {
      _id: 'user123',
      userId: 'user123',
      displayName: 'John Doe',
    };

    test('generates CSV data with basic records', () => {
      const config: CSVExportConfig = {
        listType: 'audits',
        columns: mockColumns,
        user: mockUser,
      };

      const data = [
        { name: 'Audit 1', status: 'completed' },
        { name: 'Audit 2', status: 'in-progress' },
      ];

      const result = generateCSVData({ config, data });

      expect(result.headers).toHaveLength(2);
      expect(result.headers[0].label).toBe('Name');
      expect(result.headers[0].key).toBe('Name');
      expect(result.data.length).toBe(7); // 4 metadata + 1 empty + 2 data rows

      // Check data rows (skip 5 metadata rows)
      const dataRows = result.data.slice(5);
      expect(dataRows.length).toBe(2);
      expect(dataRows[0].Name).toBe('Audit 1');
      expect(dataRows[0].Status).toBe('completed');
      expect(dataRows[1].Name).toBe('Audit 2');
      expect(dataRows[1].Status).toBe('in-progress');
    });

    test('includes metadata rows', () => {
      const config: CSVExportConfig = {
        listType: 'audits',
        columns: mockColumns,
        user: mockUser,
      };

      const data = [{ name: 'Test Audit', status: 'completed' }];
      const result = generateCSVData({ config, data });

      // Should have 4 metadata rows + 1 empty + 1 data = 6 total
      expect(result.data.length).toBe(6);

      // Metadata rows use first header as key, second header as value key
      const firstHeader = result.headers[0].label;
      const secondHeader = result.headers[1].label;

      // First metadata row: Export Timestamp
      expect(result.data[0][firstHeader]).toBe('Export Timestamp (UTC)');
      expect(result.data[0][secondHeader]).toBeTruthy(); // Has timestamp

      // Second metadata row: Exported By
      expect(result.data[1][firstHeader]).toBe('Exported By');
      expect(result.data[1][secondHeader]).toBe('John Doe');

      // Third metadata row: Active Filters
      expect(result.data[2][firstHeader]).toBe('Active Filters');
      expect(result.data[2][secondHeader]).toBe('None');

      // Fourth metadata row: Total Records
      expect(result.data[3][firstHeader]).toBe('Total Records Exported');
      expect(result.data[3][secondHeader]).toBe('1');

      // Fifth row: empty separator
      expect(result.data[4]).toEqual({});
    });

    test('handles empty data array', () => {
      const config: CSVExportConfig = {
        listType: 'audits',
        columns: mockColumns,
        user: mockUser,
      };

      const result = generateCSVData({ config, data: [] });

      expect(result.headers.length).toBe(2);
      expect(result.data.length).toBe(5); // Only metadata rows, no data rows
      expect(result.data[3][result.headers[1].label]).toBe('0'); // Total records = 0
    });

    test('handles null/undefined values in data', () => {
      const config: CSVExportConfig = {
        listType: 'audits',
        columns: mockColumns,
        user: mockUser,
      };

      const data = [
        {
          name: 'Audit 1',
          status: null,
        },
      ];

      const result = generateCSVData({ config, data });
      const dataRow = result.data[result.data.length - 1];

      expect(dataRow.Name).toBe('Audit 1');
      expect(dataRow.Status).toBe('');
    });

    test('formats dates correctly', () => {
      const columns: ColumnConfig[] = [
        {
          label: 'Date',
          sortKey: 'dueDate',
          width: '15%',
          dataId: '003',
          render: () => null,
        },
      ];

      const config: CSVExportConfig = {
        listType: 'audits',
        columns,
        user: mockUser,
      };

      const data = [
        {
          dueDate: '2024-03-15T10:30:00Z',
        },
      ];

      const result = generateCSVData({ config, data });
      const dataRow = result.data[result.data.length - 1];

      // Date should be formatted as DD/MM/YYYY
      expect(dataRow.Date).toMatch(/^\d{2}\/\d{2}\/\d{4}$/);
    });

    test('handles nested object properties', () => {
      const columns: ColumnConfig[] = [
        {
          label: 'Location',
          sortKey: 'location.name',
          width: '20%',
          dataId: '004',
          render: () => null,
        },
      ];

      const config: CSVExportConfig = {
        listType: 'audits',
        columns,
        user: mockUser,
      };

      const data = [
        {
          location: {
            name: 'Main Office',
            address: '123 Street',
          },
        },
      ];

      const result = generateCSVData({ config, data });
      const dataRow = result.data[result.data.length - 1];

      // Since label is 'Location' and capitalize(t('location')) = 'Location', it gets converted to 'Site'
      expect(dataRow.Site).toBe('Main Office');
    });

    test('handles arrays in data', () => {
      const columns: ColumnConfig[] = [
        {
          label: 'Tags',
          sortKey: 'tags',
          width: '20%',
          dataId: '001',
          render: () => null,
        },
      ];

      const config: CSVExportConfig = {
        listType: 'audits',
        columns,
        user: mockUser,
      };

      const data = [
        {
          tags: ['urgent', 'safety', 'compliance'],
        },
      ];

      const result = generateCSVData({ config, data });
      const dataRow = result.data[result.data.length - 1];

      expect(dataRow.Tags).toBe('urgent, safety, compliance');
    });

    test('handles objects with displayName property', () => {
      const columns: ColumnConfig[] = [
        {
          label: 'Auditor',
          sortKey: 'auditor',
          width: '20%',
          dataId: '001',
          render: () => null,
        },
      ];

      const config: CSVExportConfig = {
        listType: 'audits',
        columns,
        user: mockUser,
      };

      const data = [
        {
          auditor: {
            displayName: 'Jane Smith',
            userId: 'user456',
          },
        },
      ];

      const result = generateCSVData({ config, data });
      const dataRow = result.data[result.data.length - 1];

      expect(dataRow.Auditor).toBe('Jane Smith');
    });

    test('handles walkType conversion', () => {
      const columns: ColumnConfig[] = [
        {
          label: 'Walk Type',
          sortKey: 'walkType',
          width: '20%',
          dataId: '001',
          render: () => null,
        },
      ];

      const config: CSVExportConfig = {
        listType: 'audits',
        columns,
        user: mockUser,
      };

      const data = [
        { walkType: 'virtual' },
        { walkType: 'physical' },
        { walkType: 'unknown' },
      ];

      const result = generateCSVData({ config, data });
      const dataRows = result.data.slice(5);

      expect(dataRows[0]['Walk Type']).toBe('Virtual');
      expect(dataRows[1]['Walk Type']).toBe('Physical');
      expect(dataRows[2]['Walk Type']).toBe('unknown');
    });

    test('handles completedDate with null value', () => {
      const columns: ColumnConfig[] = [
        {
          label: 'Completed',
          sortKey: 'completedDate',
          width: '20%',
          dataId: '001',
          render: () => null,
        },
      ];

      const config: CSVExportConfig = {
        listType: 'audits',
        columns,
        user: mockUser,
      };

      const data = [
        { completedDate: null },
        { completedDate: undefined },
        { completedDate: '' },
      ];

      const result = generateCSVData({ config, data });
      const dataRows = result.data.slice(5);

      expect(dataRows[0].Completed).toBe('No submitted date');
      expect(dataRows[1].Completed).toBe('No submitted date');
      expect(dataRows[2].Completed).toBe('No submitted date');
    });

    test('converts location label to Site', () => {
      const columns: ColumnConfig[] = [
        {
          label: 'Location',
          sortKey: 'location',
          width: '20%',
          dataId: '001',
          render: () => null,
        },
      ];

      const config: CSVExportConfig = {
        listType: 'audits',
        columns,
        user: mockUser,
      };

      const data = [{ location: { name: 'Test Site' } }];

      const result = generateCSVData({ config, data });

      // Since t('location') returns 'location', capitalize('location') = 'Location'
      // So if label is 'Location', it should convert to 'Site'
      expect(result.headers[0].label).toBe('Site');
      expect(result.headers[0].key).toBe('Site');
    });

    test('handles user without displayName', () => {
      const config: CSVExportConfig = {
        listType: 'audits',
        columns: mockColumns,
        user: {
          userId: 'user123',
          _id: 'user123',
        },
      };

      const data = [{ name: 'Test' }];
      const result = generateCSVData({ config, data });

      // Should use userId as fallback
      const metadataRow = result.data[1];
      const firstHeader = result.headers[0].label;
      const secondHeader = result.headers[1].label;
      expect(metadataRow[firstHeader]).toBe('Exported By');
      expect(metadataRow[secondHeader]).toBe('user123');
    });

    test('handles missing user', () => {
      const config: CSVExportConfig = {
        listType: 'audits',
        columns: mockColumns,
      };

      const data = [{ name: 'Test' }];
      const result = generateCSVData({ config, data });

      // Should use "Unknown" as fallback
      const metadataRow = result.data[1];
      const firstHeader = result.headers[0].label;
      const secondHeader = result.headers[1].label;
      expect(metadataRow[firstHeader]).toBe('Exported By');
      expect(metadataRow[secondHeader]).toBe('Unknown');
    });

    test('excludes disabled and hidden columns', () => {
      const columns: ColumnConfig[] = [
        {
          label: 'Visible',
          sortKey: 'visible',
          width: '20%',
          dataId: '001',
          render: () => null,
        },
        {
          label: 'Hidden',
          sortKey: '',
          width: '10%',
          dataId: '002',
          disableSort: true,
          render: () => null,
        },
        {
          label: 'Disabled',
          sortKey: 'disabled',
          width: '10%',
          dataId: '003',
          disabled: true,
          render: () => null,
        },
      ];

      const config: CSVExportConfig = {
        listType: 'audits',
        columns,
        user: mockUser,
      };

      const data = [{ visible: 'test', disabled: 'hidden' }];
      const result = generateCSVData({ config, data });

      // Should only have 1 header (Visible)
      expect(result.headers.length).toBe(1);
      expect(result.headers[0].label).toBe('Visible');
    });
  });

  describe('generateCSVFilename', () => {
    test('generates filename with correct format', () => {
      const filename = generateCSVFilename('audits');

      expect(filename).toMatch(/^Export_audits_\d{4}_\d{2}_\d{2}_\d{6}\.csv$/);
      expect(filename).toContain('Export_audits_');
      expect(filename).toContain('.csv');
    });

    test('handles different list types', () => {
      const auditsFilename = generateCSVFilename('audits');
      const actionsFilename = generateCSVFilename('actions');
      const answersFilename = generateCSVFilename('answers');

      expect(auditsFilename).toContain('audits');
      expect(actionsFilename).toContain('actions');
      expect(answersFilename).toContain('answers');
    });
  });

  describe('Edge Cases', () => {
    test('handles very large data arrays', () => {
      const config: CSVExportConfig = {
        listType: 'audits',
        columns: [
          {
            label: 'ID',
            sortKey: 'id',
            width: '10%',
            dataId: '001',
            render: () => null,
          },
        ],
        user: { displayName: 'Test User' },
      };

      const largeData = Array.from({ length: 1000 }, (_, i) => ({
        id: `item-${i}`,
      }));

      const result = generateCSVData({ config, data: largeData });

      expect(result.data.length).toBe(1005); // 5 metadata rows + 1000 data rows
      expect(result.data[result.data.length - 1].ID).toBe('item-999');
    });

    test('handles deeply nested objects', () => {
      const config: CSVExportConfig = {
        listType: 'audits',
        columns: [
          {
            label: 'Nested',
            sortKey: 'level1.level2.level3.value',
            width: '20%',
            dataId: '001',
            render: () => null,
          },
        ],
        user: { displayName: 'Test User' },
      };

      const data = [
        {
          level1: {
            level2: {
              level3: {
                value: 'Deep Value',
              },
            },
          },
        },
      ];

      const result = generateCSVData({ config, data });
      const dataRow = result.data[result.data.length - 1];

      expect(dataRow.Nested).toBe('Deep Value');
    });

    test('handles missing nested properties gracefully', () => {
      const config: CSVExportConfig = {
        listType: 'audits',
        columns: [
          {
            label: 'Missing',
            sortKey: 'missing.property.value',
            width: '20%',
            dataId: '001',
            render: () => null,
          },
        ],
        user: { displayName: 'Test User' },
      };

      const data = [{ name: 'Test' }];

      const result = generateCSVData({ config, data });
      const dataRow = result.data[result.data.length - 1];

      expect(dataRow.Missing).toBe('');
    });
  });
});
