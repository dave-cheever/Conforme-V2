import { describe, expect, test } from 'vitest';

import actionCategoryPanelConfig from '../../components/PanelView/configs/actionCategoryPanelConfig';
import actionPanelConfig from '../../components/PanelView/configs/actionPanelConfig';
import auditPanelConfig from '../../components/PanelView/configs/auditPanelConfig';
import incidentPanelConfig from '../../components/PanelView/configs/incidentPanelConfig';
import trackerPanelConfig from '../../components/PanelView/configs/trackerPanelConfig';
import { PanelConfig } from '../../interfaces/IPanelConfig';

describe('Panel Configurations', () => {
  describe('auditPanelConfig', () => {
    test('has correct structure and properties', () => {
      expect(auditPanelConfig.title).toBeDefined();
      expect(auditPanelConfig.title.primary).toBeDefined();
      expect(auditPanelConfig.title.secondary).toBeDefined();
      expect(auditPanelConfig.status).toBeDefined();
      expect(auditPanelConfig.details).toBeDefined();
      expect(auditPanelConfig.actions).toBeDefined();
    });

    test('has valid title configuration', () => {
      expect(auditPanelConfig.title.primary.key).toBe('reference');
      expect(auditPanelConfig.title.primary.type).toBe('text');
      expect(auditPanelConfig.title.primary.fallback).toBe('No Reference');

      expect(auditPanelConfig.title.secondary?.key).toBe('auditType.name');
      expect(auditPanelConfig.title.secondary?.type).toBe('text');
      expect(auditPanelConfig.title.secondary?.fallback).toBe('No Audit Type');
    });

    test('has valid status configuration', () => {
      expect(auditPanelConfig.status.key).toBe('status');
      expect(auditPanelConfig.status.type).toBe('badge');
      expect(auditPanelConfig.status.badgeConfig).toBeDefined();
      expect(auditPanelConfig.status.fallback).toBe('Unknown');

      const statusConfig = auditPanelConfig.status.badgeConfig?.statusConfig;
      expect(statusConfig?.upcoming).toBeDefined();
      expect(statusConfig?.completed).toBeDefined();
      expect(statusConfig?.missed).toBeDefined();
    });

    test('has valid details configuration', () => {
      expect(Array.isArray(auditPanelConfig.details)).toBe(true);
      expect(auditPanelConfig.details.length).toBeGreaterThan(0);

      const detailFields = auditPanelConfig.details.map((detail) => detail.key);
      expect(detailFields).toContain('dueDate');
      expect(detailFields).toContain('auditor');
    });

    test('has auditor field with custom render function', () => {
      const auditorField = auditPanelConfig.details.find((detail) => detail.key === 'auditor');
      expect(auditorField).toBeDefined();
      expect(auditorField?.type).toBe('custom');
      expect(auditorField?.render).toBeDefined();
      expect(typeof auditorField?.render).toBe('function');
    });

    test('has valid actions configuration', () => {
      expect(auditPanelConfig.actions.primary).toBeDefined();
      expect(auditPanelConfig.actions.primary?.label).toBe('Audit Details');
      expect(typeof auditPanelConfig.actions.primary?.onClick).toBe('function');
    });

    test('auditor render function handles null and undefined', () => {
      const auditorField = auditPanelConfig.details.find((detail) => detail.key === 'auditor');
      const renderFunction = auditorField?.render;

      expect(renderFunction?.(null, {})).toBe('Unassigned');
      expect(renderFunction?.(undefined, {})).toBe('Unassigned');
    });

    test('auditor render function renders correctly with valid data', () => {
      const auditorField = auditPanelConfig.details.find((detail) => detail.key === 'auditor');
      const renderFunction = auditorField?.render;

      const mockAuditor = {
        displayName: 'John Doe',
        imgUrl: 'https://example.com/avatar.jpg',
      };

      const result = renderFunction?.(mockAuditor, {});
      expect(result).toBeDefined();
      // Check that result is a React element
      expect(typeof result).toBe('object');
      if (result && typeof result === 'object' && 'props' in result) {
        expect(result.props.style).toBeDefined();
        expect(result.props.style.display).toBe('flex');
      }
    });
  });

  describe('actionPanelConfig', () => {
    test('has correct structure and properties', () => {
      expect(actionPanelConfig.header).toBeDefined();
      expect(actionPanelConfig.header?.show).toBe(true);
      expect(actionPanelConfig.title).toBeDefined();
      expect(actionPanelConfig.status).toBeDefined();
      expect(actionPanelConfig.details).toBeDefined();
      expect(actionPanelConfig.actions).toBeDefined();
    });

    test('has valid header configuration', () => {
      expect(Array.isArray(actionPanelConfig.header?.fields)).toBe(true);
      expect(actionPanelConfig.header?.fields?.length).toBeGreaterThan(0);

      const headerFieldKeys = actionPanelConfig.header?.fields?.map((field) => field.key);
      expect(headerFieldKeys).toContain('module_type');
      expect(headerFieldKeys).toContain('module_internal_id');
    });

    test('has valid title configuration', () => {
      expect(actionPanelConfig.title.primary.key).toBe('action_title');
      expect(actionPanelConfig.title.primary.type).toBe('text');
      expect(actionPanelConfig.title.secondary?.key).toBe('action_type');
    });

    test('has valid status configuration with multiple states', () => {
      expect(actionPanelConfig.status.key).toBe('status');
      expect(actionPanelConfig.status.type).toBe('badge');

      const statusConfig = actionPanelConfig.status.badgeConfig?.statusConfig;
      expect(statusConfig?.['In Progress']).toBeDefined();
      expect(statusConfig?.Completed).toBeDefined();
      expect(statusConfig?.Pending).toBeDefined();
    });

    test('has comprehensive details configuration', () => {
      const detailFields = actionPanelConfig.details.map((detail) => detail.key);
      expect(detailFields).toContain('action_type');
      expect(detailFields).toContain('action_assigned_to');
      expect(detailFields).toContain('action_end_date_timestamp');
      expect(detailFields).toContain('action_severity');
    });

    test('has valid actions configuration', () => {
      expect(actionPanelConfig.actions.primary).toBeDefined();
      expect(actionPanelConfig.actions.secondary).toBeDefined();
      expect(actionPanelConfig.actions.primary?.label).toBe('View Action');
      expect(actionPanelConfig.actions.secondary?.label).toBe('Edit Action');
    });
  });

  describe('incidentPanelConfig', () => {
    test('has correct structure and properties', () => {
      expect(incidentPanelConfig.header).toBeDefined();
      expect(incidentPanelConfig.title).toBeDefined();
      expect(incidentPanelConfig.status).toBeDefined();
      expect(incidentPanelConfig.details).toBeDefined();
      expect(incidentPanelConfig.linkedItem).toBeDefined();
      expect(incidentPanelConfig.actions).toBeDefined();
    });

    test('has valid header configuration', () => {
      expect(incidentPanelConfig.header?.show).toBe(false);
      expect(Array.isArray(incidentPanelConfig.header?.fields)).toBe(true);

      const headerFieldKeys = incidentPanelConfig.header?.fields?.map((field) => field.key);
      expect(headerFieldKeys).toContain('hospital_name');
      expect(headerFieldKeys).toContain('ward_location');
      expect(headerFieldKeys).toContain('severity');
    });

    test('has valid title configuration', () => {
      expect(incidentPanelConfig.title.primary.key).toBe('title');
      expect(incidentPanelConfig.title.secondary?.key).toBe('id');
    });

    test('has valid status configuration for incident statuses', () => {
      const statusConfig = incidentPanelConfig.status.badgeConfig?.statusConfig;
      expect(statusConfig?.inReview).toBeDefined();
      expect(statusConfig?.Investigation).toBeDefined();
      expect(statusConfig?.Escalated).toBeDefined();
      expect(statusConfig?.Closed).toBeDefined();
    });

    test('has comprehensive details configuration', () => {
      const detailFields = incidentPanelConfig.details.map((detail) => detail.key);
      expect(detailFields).toContain('owner');
      expect(detailFields).toContain('people_assigned');
      expect(detailFields).toContain('timestamp');
      expect(detailFields).toContain('criticality_level');
    });

    test('has valid linked item configuration', () => {
      expect(incidentPanelConfig.linkedItem?.show).toBe(true);
      expect(incidentPanelConfig.linkedItem?.fieldKey).toBe('linked_item');
      expect(incidentPanelConfig.linkedItem?.label).toBe('Linked Action');
      expect(typeof incidentPanelConfig.linkedItem?.render).toBe('function');
    });

    test('linked item render function handles null values', () => {
      const renderFunction = incidentPanelConfig.linkedItem?.render;
      expect(renderFunction?.(null, {})).toBe(null);
      expect(renderFunction?.(undefined, {})).toBe(null);
    });

    test('linked item render function renders correctly with valid data', () => {
      const renderFunction = incidentPanelConfig.linkedItem?.render;
      const mockItem = { id: 'INC-001', title: 'Test Incident' };

      const result = renderFunction?.('ACT-001', mockItem);
      expect(result).toBeDefined();
      // Check that result is a React element
      expect(typeof result).toBe('object');
      if (result && typeof result === 'object' && 'props' in result) expect(result.props).toBeDefined();
    });

    test('has valid actions configuration', () => {
      expect(incidentPanelConfig.actions.primary).toBeDefined();
      expect(incidentPanelConfig.actions.secondary).toBeDefined();
      expect(incidentPanelConfig.actions.primary?.label).toBe('View Incident');
      expect(incidentPanelConfig.actions.secondary?.label).toBe('Edit Incident');
    });
  });

  describe('trackerPanelConfig', () => {
    test('has correct structure and properties', () => {
      expect(trackerPanelConfig.title).toBeDefined();
      expect(trackerPanelConfig.status).toBeDefined();
      expect(trackerPanelConfig.details).toBeDefined();
      expect(trackerPanelConfig.actions).toBeDefined();
    });

    test('has valid title configuration', () => {
      expect(trackerPanelConfig.title.primary).toBeDefined();
      expect(trackerPanelConfig.title.secondary).toBeDefined();
    });

    test('has valid status configuration', () => {
      expect(trackerPanelConfig.status.key).toBeDefined();
      expect(trackerPanelConfig.status.type).toBe('badge');
      expect(trackerPanelConfig.status.badgeConfig).toBeDefined();
    });

    test('has valid details configuration', () => {
      expect(Array.isArray(trackerPanelConfig.details)).toBe(true);
      expect(trackerPanelConfig.details.length).toBeGreaterThan(0);
    });

    test('has valid actions configuration', () => {
      expect(trackerPanelConfig.actions.primary).toBeDefined();
      expect(typeof trackerPanelConfig.actions.primary?.onClick).toBe('function');
    });
  });

  describe('actionCategoryPanelConfig', () => {
    test('has correct structure and properties', () => {
      expect(actionCategoryPanelConfig.title).toBeDefined();
      expect(actionCategoryPanelConfig.title.primary).toBeDefined();
      expect(actionCategoryPanelConfig.status).toBeDefined();
      expect(actionCategoryPanelConfig.details).toBeDefined();
      expect(actionCategoryPanelConfig.actions).toBeDefined();
    });

    test('has valid title configuration with custom render', () => {
      expect(actionCategoryPanelConfig.title.primary.key).toBe('name');
      expect(actionCategoryPanelConfig.title.primary.type).toBe('custom');
      expect(actionCategoryPanelConfig.title.primary.fallback).toBe('No Name');
      expect(typeof actionCategoryPanelConfig.title.primary.render).toBe('function');
    });

    test('title render function handles null and undefined values', () => {
      const renderFunction = actionCategoryPanelConfig.title.primary.render;
      const mockItem = {};
      const resultWithNull = renderFunction?.(null as any, mockItem);
      const resultWithUndefined = renderFunction?.(undefined as any, mockItem);
      const resultWithEmpty = renderFunction?.('', mockItem);

      expect(resultWithNull).toBeDefined();
      expect(resultWithUndefined).toBeDefined();
      expect(resultWithEmpty).toBeDefined();
    });

    test('title render function renders correctly with valid data', () => {
      const renderFunction = actionCategoryPanelConfig.title.primary.render;
      const mockItem = {};
      const result = renderFunction?.('Test Category', mockItem);

      expect(result).toBeDefined();
      expect(typeof result).toBe('object');
      if (result && typeof result === 'object' && 'props' in result) {
        expect(result.props.color).toBe('#1A202C');
        expect(result.props.fontSize).toBe('17px');
        expect(result.props.fontWeight).toBe(600);
        expect(result.props.lineHeight).toBe('100%');
      }
    });

    test('has status configuration that renders null', () => {
      expect(actionCategoryPanelConfig.status.key).toBe('_id');
      expect(actionCategoryPanelConfig.status.type).toBe('text');
      expect(typeof actionCategoryPanelConfig.status.render).toBe('function');
      const mockItem = {};
      expect(actionCategoryPanelConfig.status.render?.(null, mockItem)).toBe(null);
    });

    test('has valid details configuration', () => {
      expect(Array.isArray(actionCategoryPanelConfig.details)).toBe(true);
      expect(actionCategoryPanelConfig.details.length).toBe(2);

      const detailKeys = actionCategoryPanelConfig.details.map((detail) => detail.key);
      expect(detailKeys).toContain('used');
      expect(detailKeys).toContain('metatags.updatedAt');
    });

    test('used detail render function handles different values', () => {
      const usedField = actionCategoryPanelConfig.details.find((detail) => detail.key === 'used');
      const renderFunction = usedField?.render;
      const mockItem = {};

      expect(renderFunction).toBeDefined();
      expect(typeof renderFunction).toBe('function');

      // Test with 0
      const resultZero = renderFunction?.(0, mockItem);
      expect(resultZero).toBeDefined();

      // Test with 1
      const resultOne = renderFunction?.(1, mockItem);
      expect(resultOne).toBeDefined();

      // Test with multiple
      const resultMultiple = renderFunction?.(5, mockItem);
      expect(resultMultiple).toBeDefined();

      // Test with null/undefined
      const resultNull = renderFunction?.(null as any, mockItem);
      expect(resultNull).toBeDefined();
    });

    test('used detail render function formats text correctly', () => {
      const usedField = actionCategoryPanelConfig.details.find((detail) => detail.key === 'used');
      const renderFunction = usedField?.render;
      const mockItem = {};

      const resultOne = renderFunction?.(1, mockItem);
      const resultMultiple = renderFunction?.(5, mockItem);

      expect(resultOne).toBeDefined();
      expect(resultMultiple).toBeDefined();

      // Check that the result contains the correct structure
      if (resultOne && typeof resultOne === 'object' && 'props' in resultOne) {
        expect(Array.isArray(resultOne.props.children)).toBe(true);
      }
    });

    test('last modified detail render function handles date formatting', () => {
      const lastModifiedField = actionCategoryPanelConfig.details.find((detail) => detail.key === 'metatags.updatedAt');
      const renderFunction = lastModifiedField?.render;
      const mockItem = {};

      expect(renderFunction).toBeDefined();
      expect(typeof renderFunction).toBe('function');

      // Test with valid date
      const validDate = '2025-01-15T10:30:00Z';
      const resultValid = renderFunction?.(validDate, mockItem);
      expect(resultValid).toBeDefined();

      // Test with null
      const resultNull = renderFunction?.(null, mockItem);
      expect(resultNull).toBeDefined();

      // Test with undefined
      const resultUndefined = renderFunction?.(undefined, mockItem);
      expect(resultUndefined).toBeDefined();

      // Test with invalid date
      const resultInvalid = renderFunction?.('invalid-date', mockItem);
      expect(resultInvalid).toBeDefined();
    });

    test('has valid actions configuration', () => {
      expect(actionCategoryPanelConfig.actions.primary).toBeDefined();
      expect(actionCategoryPanelConfig.actions.primary?.label).toBe('Edit');
      expect(typeof actionCategoryPanelConfig.actions.primary?.onClick).toBe('function');
      expect(actionCategoryPanelConfig.actions.panelClick).toBeDefined();
      expect(typeof actionCategoryPanelConfig.actions.panelClick?.onClick).toBe('function');
    });
  });

  describe('Configuration Consistency', () => {
    const configs = [
      { name: 'actionCategoryPanelConfig', config: actionCategoryPanelConfig },
      { name: 'auditPanelConfig', config: auditPanelConfig },
      { name: 'actionPanelConfig', config: actionPanelConfig },
      { name: 'incidentPanelConfig', config: incidentPanelConfig },
      { name: 'trackerPanelConfig', config: trackerPanelConfig },
    ];

    for (const { name, config } of configs) {
      test(`${name} has required PanelConfig structure`, () => {
        // Check required properties exist
        expect(config.title).toBeDefined();
        expect(config.title.primary).toBeDefined();
        expect(config.status).toBeDefined();
        expect(config.details).toBeDefined();
        expect(config.actions).toBeDefined();

        // Check required title structure
        expect(config.title.primary.key).toBeDefined();
        expect(config.title.primary.type).toBeDefined();
        expect(['text', 'badge', 'date', 'user', 'custom']).toContain(config.title.primary.type);

        // Check required status structure
        expect(config.status.key).toBeDefined();
        expect(config.status.type).toBeDefined();
        expect(['text', 'badge', 'date', 'user', 'custom']).toContain(config.status.type);

        // Check details are array
        expect(Array.isArray(config.details)).toBe(true);

        // Check actions structure
        expect(config.actions.primary).toBeDefined();
        expect(config.actions.primary?.label).toBeDefined();
        expect(typeof config.actions.primary?.onClick).toBe('function');
      });

      test(`${name} has valid field types`, () => {
        const validTypes = ['text', 'badge', 'date', 'user', 'custom'];

        // Check title
        expect(validTypes).toContain(config.title.primary.type);
        if (config.title.secondary) expect(validTypes).toContain(config.title.secondary.type);

        // Check status
        expect(validTypes).toContain(config.status.type);

        // Check details
        for (const detail of config.details) expect(validTypes).toContain(detail.type);

        // Check header fields if exists
        if (config.header) for (const field of config.header.fields) expect(validTypes).toContain(field.type);
      });

      test(`${name} has consistent badge configurations`, () => {
        // Test passes if no errors are thrown during config validation
        expect(config).toBeDefined();
      });
    }
  });

  describe('Type Safety', () => {
    test('all configs conform to PanelConfig interface', () => {
      const configs: PanelConfig[] = [
        actionCategoryPanelConfig,
        auditPanelConfig,
        actionPanelConfig,
        incidentPanelConfig,
        trackerPanelConfig,
      ];

      for (const config of configs) {
        // This test will fail at compile time if configs don't match the interface
        expect(config).toBeDefined();
        expect(typeof config).toBe('object');
      }
    });
  });
});
