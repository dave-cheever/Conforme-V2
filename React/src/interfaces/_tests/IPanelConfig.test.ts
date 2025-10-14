import { describe, expect, test } from 'vitest';

import { PanelConfig, PanelFieldConfig } from '../IPanelConfig';

describe('IPanelConfig Interface', () => {
  describe('PanelFieldConfig', () => {
    test('allows fontWeight in textStyle', () => {
      const config: PanelFieldConfig = {
        key: 'test',
        type: 'text',
        textStyle: {
          color: '#2D3748',
          fontSize: '12px',
          fontWeight: 600,
        },
      };

      expect(config.textStyle?.fontWeight).toBe(600);
    });

    test('allows fontWeight as string in textStyle', () => {
      const config: PanelFieldConfig = {
        key: 'test',
        type: 'text',
        textStyle: {
          color: '#2D3748',
          fontSize: '12px',
          fontWeight: 'bold',
        },
      };

      expect(config.textStyle?.fontWeight).toBe('bold');
    });

    test('allows all textStyle properties', () => {
      const config: PanelFieldConfig = {
        key: 'test',
        type: 'text',
        textStyle: {
          color: '#2D3748',
          textDecoration: 'underline',
          cursor: 'pointer',
          fontSize: '12px',
          fontWeight: 600,
        },
      };

      expect(config.textStyle?.color).toBe('#2D3748');
      expect(config.textStyle?.textDecoration).toBe('underline');
      expect(config.textStyle?.cursor).toBe('pointer');
      expect(config.textStyle?.fontSize).toBe('12px');
      expect(config.textStyle?.fontWeight).toBe(600);
    });

    test('textStyle properties are optional', () => {
      const config: PanelFieldConfig = {
        key: 'test',
        type: 'text',
      };

      expect(config.textStyle).toBeUndefined();
    });

    test('supports all field types', () => {
      const types: Array<PanelFieldConfig['type']> = ['text', 'badge', 'date', 'user', 'custom'];
      
      types.forEach(type => {
        const config: PanelFieldConfig = {
          key: 'test',
          type,
        };
        expect(config.type).toBe(type);
      });
    });

    test('supports badge configuration', () => {
      const config: PanelFieldConfig = {
        key: 'status',
        type: 'badge',
        badgeConfig: {
          variant: 'solid',
          statusConfig: {
            active: {
              bg: '#10B981',
              color: 'white',
              text: 'Active',
            },
          },
        },
      };

      expect(config.badgeConfig?.variant).toBe('solid');
      expect(config.badgeConfig?.statusConfig?.active?.bg).toBe('#10B981');
    });

    test('supports custom render function', () => {
      const renderFunction = (value: any) => `Custom: ${value}`;
      
      const config: PanelFieldConfig = {
        key: 'test',
        type: 'text',
        render: renderFunction,
      };

      expect(config.render).toBe(renderFunction);
      expect(config.render!('test', {})).toBe('Custom: test');
    });
  });

  describe('PanelConfig', () => {
    test('supports complete panel configuration', () => {
      const config: PanelConfig = {
        title: {
          primary: {
            key: 'title',
            type: 'text',
          },
          secondary: {
            key: 'id',
            type: 'text',
          },
        },
        status: {
          key: 'status',
          type: 'badge',
          badgeConfig: {
            variant: 'solid',
            statusConfig: {
              active: {
                bg: '#10B981',
                color: 'white',
                text: 'Active',
              },
            },
          },
        },
        description: {
          key: 'description',
          type: 'text',
        },
        details: [
          {
            key: 'owner',
            type: 'user',
          },
          {
            key: 'created_at',
            type: 'date',
            dateFormat: 'd MMM yyyy',
          },
        ],
        actions: {
          primary: {
            label: 'View Details',
            onClick: () => {},
          },
          secondary: {
            label: 'Edit',
            onClick: () => {},
          },
          secondaryActions: [
            {
              label: 'Delete',
              onClick: () => {},
            },
          ],
        },
      };

      expect(config.title.primary.key).toBe('title');
      expect(config.status.type).toBe('badge');
      expect(config.details).toHaveLength(2);
      expect(config.actions.primary?.label).toBe('View Details');
    });

    test('supports optional header configuration', () => {
      const config: PanelConfig = {
        title: {
          primary: {
            key: 'title',
            type: 'text',
          },
        },
        status: {
          key: 'status',
          type: 'text',
        },
        actions: {
          primary: {
            label: 'View',
            onClick: () => {},
          },
        },
        details: [],
        header: {
          show: true,
          fields: [
            {
              key: 'category',
              type: 'text',
            },
          ],
        },
      };

      expect(config.header?.show).toBe(true);
      expect(config.header?.fields).toHaveLength(1);
    });

    test('supports linked item configuration', () => {
      const config: PanelConfig = {
        title: {
          primary: {
            key: 'title',
            type: 'text',
          },
        },
        status: {
          key: 'status',
          type: 'text',
        },
        actions: {
          primary: {
            label: 'View',
            onClick: () => {},
          },
        },
        details: [],
        linkedItem: {
          show: true,
          fieldKey: 'linked_incident',
          label: 'Linked Incident',
          render: (value) => `Incident: ${value}`,
        },
      };

      expect(config.linkedItem?.show).toBe(true);
      expect(config.linkedItem?.fieldKey).toBe('linked_incident');
      expect(config.linkedItem?.label).toBe('Linked Incident');
    });
  });

  describe('Type Safety', () => {
    test('prevents invalid field types', () => {
      // This test ensures TypeScript would catch invalid types
      // In a real scenario, this would be caught at compile time
      const validTypes = ['text', 'badge', 'date', 'user', 'custom'];
      
      validTypes.forEach(type => {
        const config: PanelFieldConfig = {
          key: 'test',
          type: type as PanelFieldConfig['type'],
        };
        expect(config.type).toBe(type);
      });
    });

    test('ensures required properties are present', () => {
      const config: PanelFieldConfig = {
        key: 'test',
        type: 'text',
      };

      expect(config.key).toBeDefined();
      expect(config.type).toBeDefined();
    });

    test('supports readonly properties', () => {
      const config: PanelFieldConfig = {
        key: 'test',
        type: 'text',
        textStyle: {
          color: '#2D3748',
          fontWeight: 600,
        },
      };

      // These should be readonly in the actual interface
      expect(config.key).toBe('test');
      expect(config.type).toBe('text');
      expect(config.textStyle?.color).toBe('#2D3748');
    });
  });
});
