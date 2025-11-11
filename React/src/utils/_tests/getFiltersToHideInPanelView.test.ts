import { describe, expect, test } from 'vitest';

import { getFiltersToHideInPanelView, shouldHideFilterInPanelView } from '../getFiltersToHideInPanelView';

describe('getFiltersToHideInPanelView', () => {
  describe('Audits page detection', () => {
    test('returns correct filters for audits on /audits path', () => {
      const result = getFiltersToHideInPanelView('audits', '/audits');
      expect(result).toEqual(['walkType', 'locationsIds', 'businessUnitsIds', 'createdDate', 'showArchived']);
    });

    test('returns correct filters for audits on /module-path/dashboard path', () => {
      const result = getFiltersToHideInPanelView('audits', '/safety-health-environment-walk/dashboard');
      expect(result).toEqual(['walkType', 'locationsIds', 'businessUnitsIds', 'createdDate', 'showArchived']);
    });

    test('returns correct filters for audits on /audits with single segment', () => {
      const result = getFiltersToHideInPanelView('audits', '/audits/');
      expect(result).toEqual(['walkType', 'locationsIds', 'businessUnitsIds', 'createdDate', 'showArchived']);
    });

    test('does not match audits on /audits/detail path (too many segments)', () => {
      const result = getFiltersToHideInPanelView('audits', '/audits/123');
      expect(result).toEqual([]);
    });
  });

  describe('Tracker items page detection', () => {
    test('returns correct filters for tracker on /module-path/dashboard path', () => {
      const result = getFiltersToHideInPanelView('tracker', '/documents/dashboard');
      expect(result).toEqual(['locationsIds', 'regulatoryBodiesIds']);
    });

    test('returns correct filters for tracker on path with tracker-items', () => {
      const result = getFiltersToHideInPanelView('tracker', '/tracker-items');
      expect(result).toEqual(['locationsIds', 'regulatoryBodiesIds']);
    });

    test('returns correct filters for tracker on path with tracker-item (list page)', () => {
      const result = getFiltersToHideInPanelView('tracker', '/tracker-item');
      expect(result).toEqual(['locationsIds', 'regulatoryBodiesIds']);
    });

    test('does not match tracker on /tracker-item/123 path (detail page)', () => {
      const result = getFiltersToHideInPanelView('tracker', '/tracker-item/123');
      expect(result).toEqual([]);
    });

    test('returns correct filters for tracker on nested tracker-items path', () => {
      const result = getFiltersToHideInPanelView('tracker', '/module/tracker-items/list');
      expect(result).toEqual(['locationsIds', 'regulatoryBodiesIds']);
    });
  });

  describe('Edge cases', () => {
    test('returns empty array for undefined moduleType', () => {
      const result = getFiltersToHideInPanelView(undefined, '/audits');
      expect(result).toEqual([]);
    });

    test('returns empty array for non-matching module type', () => {
      const result = getFiltersToHideInPanelView('other', '/audits');
      expect(result).toEqual([]);
    });

    test('returns empty array for non-matching pathname', () => {
      const result = getFiltersToHideInPanelView('audits', '/other-page');
      expect(result).toEqual([]);
    });

    test('returns empty array for empty pathname', () => {
      const result = getFiltersToHideInPanelView('audits', '');
      expect(result).toEqual([]);
    });

    test('handles root pathname', () => {
      const result = getFiltersToHideInPanelView('audits', '/');
      expect(result).toEqual([]);
    });

    test('handles pathname with query parameters', () => {
      const result = getFiltersToHideInPanelView('audits', '/audits?filter=test');
      expect(result).toEqual(['walkType', 'locationsIds', 'businessUnitsIds', 'createdDate', 'showArchived']);
    });
  });

  describe('Dashboard path detection', () => {
    test('correctly identifies dashboard path with 2 segments', () => {
      const result = getFiltersToHideInPanelView('audits', '/module-name/dashboard');
      expect(result).toEqual(['walkType', 'locationsIds', 'businessUnitsIds', 'createdDate', 'showArchived']);
    });

    test('does not match dashboard path with more than 2 segments', () => {
      const result = getFiltersToHideInPanelView('audits', '/module/dashboard/extra');
      expect(result).toEqual([]);
    });

    test('does not match /dashboard alone (only 1 segment)', () => {
      const result = getFiltersToHideInPanelView('audits', '/dashboard');
      expect(result).toEqual([]);
    });
  });
});

describe('shouldHideFilterInPanelView', () => {
  describe('Audits filters', () => {
    const auditsPath = '/safety-health-environment-walk/dashboard';

    test('hides walkType filter for audits', () => {
      expect(shouldHideFilterInPanelView('walkType', 'audits', auditsPath)).toBe(true);
    });

    test('hides locationsIds filter for audits', () => {
      expect(shouldHideFilterInPanelView('locationsIds', 'audits', auditsPath)).toBe(true);
    });

    test('hides businessUnitsIds filter for audits', () => {
      expect(shouldHideFilterInPanelView('businessUnitsIds', 'audits', auditsPath)).toBe(true);
    });

    test('hides createdDate filter for audits', () => {
      expect(shouldHideFilterInPanelView('createdDate', 'audits', auditsPath)).toBe(true);
    });

    test('hides showArchived filter for audits', () => {
      expect(shouldHideFilterInPanelView('showArchived', 'audits', auditsPath)).toBe(true);
    });

    test('does not hide status filter for audits', () => {
      expect(shouldHideFilterInPanelView('status', 'audits', auditsPath)).toBe(false);
    });

    test('does not hide usersIds filter for audits', () => {
      expect(shouldHideFilterInPanelView('usersIds', 'audits', auditsPath)).toBe(false);
    });

    test('does not hide dueDate filter for audits', () => {
      expect(shouldHideFilterInPanelView('dueDate', 'audits', auditsPath)).toBe(false);
    });
  });

  describe('Tracker items filters', () => {
    const trackerPath = '/documents/dashboard';

    test('hides locationsIds filter for tracker items', () => {
      expect(shouldHideFilterInPanelView('locationsIds', 'tracker', trackerPath)).toBe(true);
    });

    test('hides regulatoryBodiesIds filter for tracker items', () => {
      expect(shouldHideFilterInPanelView('regulatoryBodiesIds', 'tracker', trackerPath)).toBe(true);
    });

    test('does not hide trackerItemsIds filter for tracker items', () => {
      expect(shouldHideFilterInPanelView('trackerItemsIds', 'tracker', trackerPath)).toBe(false);
    });

    test('does not hide categoriesIds filter for tracker items', () => {
      expect(shouldHideFilterInPanelView('categoriesIds', 'tracker', trackerPath)).toBe(false);
    });

    test('does not hide usersIds filter for tracker items', () => {
      expect(shouldHideFilterInPanelView('usersIds', 'tracker', trackerPath)).toBe(false);
    });

    test('does not hide businessUnitsIds filter for tracker items', () => {
      expect(shouldHideFilterInPanelView('businessUnitsIds', 'tracker', trackerPath)).toBe(false);
    });

    test('does not hide itemStatus filter for tracker items', () => {
      expect(shouldHideFilterInPanelView('itemStatus', 'tracker', trackerPath)).toBe(false);
    });

    test('does not hide dueDate filter for tracker items', () => {
      expect(shouldHideFilterInPanelView('dueDate', 'tracker', trackerPath)).toBe(false);
    });
  });

  describe('Custom question filters for tracker items', () => {
    const trackerPath = '/documents/dashboard';
    const standardFilters = ['trackerItemsIds', 'categoriesIds', 'usersIds', 'locationsIds', 'businessUnitsIds', 'itemStatus', 'regulatoryBodiesIds', 'dueDate'];

    test('hides custom question filter (not in standard list)', () => {
      expect(shouldHideFilterInPanelView('customQuestion123', 'tracker', trackerPath)).toBe(true);
    });

    test('hides custom question filter with different naming pattern', () => {
      expect(shouldHideFilterInPanelView('question_abc_xyz', 'tracker', trackerPath)).toBe(true);
    });

    test('hides custom question filter with numeric suffix', () => {
      expect(shouldHideFilterInPanelView('questionFilter456', 'tracker', trackerPath)).toBe(true);
    });

    test('does not hide standard filters even if they contain "question"', () => {
      // This test ensures standard filters are not hidden even if they match some pattern
      for (const filter of standardFilters) {
        if (filter !== 'locationsIds' && filter !== 'regulatoryBodiesIds') {
          expect(shouldHideFilterInPanelView(filter, 'tracker', trackerPath)).toBe(false);
        }
      }
    });
  });

  describe('Edge cases', () => {
    test('returns false for undefined moduleType', () => {
      expect(shouldHideFilterInPanelView('walkType', undefined, '/audits')).toBe(false);
    });

    test('returns false for non-matching module type', () => {
      expect(shouldHideFilterInPanelView('walkType', 'other', '/audits')).toBe(false);
    });

    test('returns false for non-matching pathname', () => {
      expect(shouldHideFilterInPanelView('walkType', 'audits', '/other-page')).toBe(false);
    });

    test('returns false for empty filter name', () => {
      expect(shouldHideFilterInPanelView('', 'audits', '/audits')).toBe(false);
    });

    test('handles tracker detail page correctly (does not hide custom filters)', () => {
      // On detail page, should not match tracker page pattern
      expect(shouldHideFilterInPanelView('customQuestion123', 'tracker', '/tracker-item/123')).toBe(false);
    });

    test('handles audits detail page correctly', () => {
      expect(shouldHideFilterInPanelView('walkType', 'audits', '/audits/123')).toBe(false);
    });
  });

  describe('Pathname variations', () => {
    test('handles /audits path correctly', () => {
      expect(shouldHideFilterInPanelView('walkType', 'audits', '/audits')).toBe(true);
      expect(shouldHideFilterInPanelView('status', 'audits', '/audits')).toBe(false);
    });

    test('handles /module-path/dashboard path correctly for audits', () => {
      const path = '/safety-health-environment-walk/dashboard';
      expect(shouldHideFilterInPanelView('walkType', 'audits', path)).toBe(true);
      expect(shouldHideFilterInPanelView('status', 'audits', path)).toBe(false);
    });

    test('handles /module-path/dashboard path correctly for tracker', () => {
      const path = '/documents/dashboard';
      expect(shouldHideFilterInPanelView('locationsIds', 'tracker', path)).toBe(true);
      expect(shouldHideFilterInPanelView('trackerItemsIds', 'tracker', path)).toBe(false);
      expect(shouldHideFilterInPanelView('customQuestion', 'tracker', path)).toBe(true);
    });

    test('handles tracker-items path correctly', () => {
      const path = '/tracker-items';
      expect(shouldHideFilterInPanelView('locationsIds', 'tracker', path)).toBe(true);
      expect(shouldHideFilterInPanelView('trackerItemsIds', 'tracker', path)).toBe(false);
    });

    test('handles nested tracker-items path correctly', () => {
      const path = '/module/tracker-items/list';
      expect(shouldHideFilterInPanelView('locationsIds', 'tracker', path)).toBe(true);
      expect(shouldHideFilterInPanelView('customQuestion', 'tracker', path)).toBe(true);
    });
  });

  describe('Integration with getFiltersToHideInPanelView', () => {
    test('shouldHideFilterInPanelView uses getFiltersToHideInPanelView correctly', () => {
      const auditsPath = '/audits';
      const hiddenFilters = getFiltersToHideInPanelView('audits', auditsPath);
      
      // All filters returned by getFiltersToHideInPanelView should be hidden
      for (const filter of hiddenFilters) {
        expect(shouldHideFilterInPanelView(filter, 'audits', auditsPath)).toBe(true);
      }
    });

    test('non-hidden filters are not hidden', () => {
      const auditsPath = '/audits';
      const hiddenFilters = getFiltersToHideInPanelView('audits', auditsPath);
      const allFilters = ['walkType', 'locationsIds', 'businessUnitsIds', 'createdDate', 'showArchived', 'status', 'usersIds', 'dueDate'];
      
      for (const filter of allFilters) {
        const shouldHide = shouldHideFilterInPanelView(filter, 'audits', auditsPath);
        const isInHiddenList = hiddenFilters.includes(filter);
        expect(shouldHide).toBe(isInHiddenList);
      }
    });
  });
});

