// React/src/utils/_tests/answers.test.tsx
import { describe, expect, test } from 'vitest';

import type { AuditType, Category } from '../../pages/answers';
import {
  buildPanels as testUniqueCategoriesLogic,
  categoryIdsForPanel as testPanelSelectionLogic,
  dedupeCategories as testMapDeduplicationLogic,
  flatMapCategories as testFlatMapLogic,
} from '../../pages/answers';

// Test the unique categories logic directly without rendering the full component
describe('Answers Unique Categories Logic', () => {
  // Test the logic that creates unique categories from audit types
  test('creates unique categories from audit types with duplicates', () => {
    const mockAuditTypes: AuditType[] = [
      {
        _id: 'auditType1',
        questionsCategories: [
          { _id: 'cat1', name: 'Category 1' },
          { _id: 'cat2', name: 'Category 2' },
        ],
      },
      {
        _id: 'auditType2',
        questionsCategories: [
          { _id: 'cat2', name: 'Category 2' }, // Duplicate category
          { _id: 'cat3', name: 'Category 3' },
        ],
      },
      {
        _id: 'auditType3',
        questionsCategories: null, // Test null case
      },
    ];

    const panels = testUniqueCategoriesLogic(mockAuditTypes);

    // Verify the logic works correctly
    expect(panels).toHaveLength(4); // 'All' + 3 unique categories
    expect(panels[0]).toEqual({ _id: 'all', name: 'All' });
    expect(panels.find((p) => p._id === 'cat1')).toEqual({ _id: 'cat1', name: 'Category 1' });
    expect(panels.find((p) => p._id === 'cat2')).toEqual({ _id: 'cat2', name: 'Category 2' });
    expect(panels.find((p) => p._id === 'cat3')).toEqual({ _id: 'cat3', name: 'Category 3' });
  });

  test('handles empty audit types array gracefully', () => {
    const mockAuditTypes: AuditType[] = [];

    const panels = testUniqueCategoriesLogic(mockAuditTypes);

    // Verify the logic handles empty arrays
    expect(panels).toHaveLength(1); // Only 'All' tab
    expect(panels[0]).toEqual({ _id: 'all', name: 'All' });
  });

  test('handles null audit types gracefully', () => {
    const mockAuditTypes = null;

    const panels = testUniqueCategoriesLogic(mockAuditTypes);

    // Verify the logic handles null values
    expect(panels).toHaveLength(1); // Only 'All' tab
    expect(panels[0]).toEqual({ _id: 'all', name: 'All' });
  });

  test('handles undefined audit types gracefully', () => {
    const mockAuditTypes = undefined;

    const panels = testUniqueCategoriesLogic(mockAuditTypes);

    // Verify the logic handles undefined values
    expect(panels).toHaveLength(1); // Only 'All' tab
    expect(panels[0]).toEqual({ _id: 'all', name: 'All' });
  });

  test('handles audit types with empty categories arrays', () => {
    const mockAuditTypes: AuditType[] = [
      {
        _id: 'auditType1',
        questionsCategories: [],
      },
      {
        _id: 'auditType2',
        questionsCategories: null,
      },
    ];

    const panels = testUniqueCategoriesLogic(mockAuditTypes);

    // Verify the logic handles empty categories arrays
    expect(panels).toHaveLength(1); // Only 'All' tab
    expect(panels[0]).toEqual({ _id: 'all', name: 'All' });
  });

  test('handles audit types with undefined categories', () => {
    const mockAuditTypes: AuditType[] = [
      {
        _id: 'auditType1',
        questionsCategories: undefined,
      },
    ];

    const panels = testUniqueCategoriesLogic(mockAuditTypes);

    // Verify the logic handles undefined categories
    expect(panels).toHaveLength(1); // Only 'All' tab
    expect(panels[0]).toEqual({ _id: 'all', name: 'All' });
  });

  test('handles mixed audit types with null and valid categories', () => {
    const mockAuditTypes: AuditType[] = [
      {
        _id: 'auditType1',
        questionsCategories: [
          { _id: 'cat1', name: 'Category 1' },
          { _id: 'cat2', name: 'Category 2' },
        ],
      },
      {
        _id: 'auditType2',
        questionsCategories: null,
      },
      {
        _id: 'auditType3',
        questionsCategories: [{ _id: 'cat3', name: 'Category 3' }],
      },
    ];

    const panels = testUniqueCategoriesLogic(mockAuditTypes);

    // Verify the logic handles mixed scenarios
    expect(panels).toHaveLength(4); // 'All' + 3 unique categories
    expect(panels[0]).toEqual({ _id: 'all', name: 'All' });
    expect(panels.find((p) => p._id === 'cat1')).toEqual({ _id: 'cat1', name: 'Category 1' });
    expect(panels.find((p) => p._id === 'cat2')).toEqual({ _id: 'cat2', name: 'Category 2' });
    expect(panels.find((p) => p._id === 'cat3')).toEqual({ _id: 'cat3', name: 'Category 3' });
  });

  test('handles audit types with duplicate category IDs correctly', () => {
    const mockAuditTypes: AuditType[] = [
      {
        _id: 'auditType1',
        questionsCategories: [
          { _id: 'cat1', name: 'Category 1' },
          { _id: 'cat2', name: 'Category 2' },
        ],
      },
      {
        _id: 'auditType2',
        questionsCategories: [
          { _id: 'cat2', name: 'Category 2 Duplicate' }, // Same ID, different name
          { _id: 'cat3', name: 'Category 3' },
        ],
      },
    ];

    const panels = testUniqueCategoriesLogic(mockAuditTypes);

    // Verify that duplicate IDs are properly deduplicated (first occurrence wins)
    expect(panels).toHaveLength(4); // 'All' + 3 unique categories
    expect(panels[0]).toEqual({ _id: 'all', name: 'All' });
    expect(panels.find((p) => p._id === 'cat1')).toEqual({ _id: 'cat1', name: 'Category 1' });
    expect(panels.find((p) => p._id === 'cat2')).toEqual({ _id: 'cat2', name: 'Category 2' }); // First occurrence
    expect(panels.find((p) => p._id === 'cat3')).toEqual({ _id: 'cat3', name: 'Category 3' });
  });

  test('handles single audit type with single category', () => {
    const mockAuditTypes: AuditType[] = [
      {
        _id: 'auditType1',
        questionsCategories: [{ _id: 'cat1', name: 'Single Category' }],
      },
    ];

    const panels = testUniqueCategoriesLogic(mockAuditTypes);

    // Verify the logic handles single category
    expect(panels).toHaveLength(2); // 'All' + 1 category
    expect(panels[0]).toEqual({ _id: 'all', name: 'All' });
    expect(panels[1]).toEqual({ _id: 'cat1', name: 'Single Category' });
  });

  test('handles audit types with deeply nested category structures', () => {
    const mockAuditTypes: AuditType[] = [
      {
        _id: 'auditType1',
        questionsCategories: [
          { _id: 'cat1', name: 'Category 1' },
          { _id: 'cat2', name: 'Category 2' },
          { _id: 'cat3', name: 'Category 3' },
        ],
      },
      {
        _id: 'auditType2',
        questionsCategories: [
          { _id: 'cat4', name: 'Category 4' },
          { _id: 'cat5', name: 'Category 5' },
        ],
      },
      {
        _id: 'auditType3',
        questionsCategories: [
          { _id: 'cat1', name: 'Category 1 Duplicate' }, // Duplicate ID
          { _id: 'cat6', name: 'Category 6' },
        ],
      },
    ];

    const panels = testUniqueCategoriesLogic(mockAuditTypes);

    // Verify the logic handles complex structures
    expect(panels).toHaveLength(7); // 'All' + 6 unique categories
    expect(panels[0]).toEqual({ _id: 'all', name: 'All' });
    expect(panels.find((p) => p._id === 'cat1')).toEqual({ _id: 'cat1', name: 'Category 1' }); // First occurrence
    expect(panels.find((p) => p._id === 'cat2')).toEqual({ _id: 'cat2', name: 'Category 2' });
    expect(panels.find((p) => p._id === 'cat3')).toEqual({ _id: 'cat3', name: 'Category 3' });
    expect(panels.find((p) => p._id === 'cat4')).toEqual({ _id: 'cat4', name: 'Category 4' });
    expect(panels.find((p) => p._id === 'cat5')).toEqual({ _id: 'cat5', name: 'Category 5' });
    expect(panels.find((p) => p._id === 'cat6')).toEqual({ _id: 'cat6', name: 'Category 6' });
  });
});

// Test specific code snippets that SonarQube flags for coverage
describe('SonarQube Code Coverage Tests', () => {
  describe('flatMap Logic Coverage', () => {
    test('flatMap extracts categories from audit types with null coalescing', () => {
      const mockAuditTypes: AuditType[] = [
        {
          _id: 'auditType1',
          questionsCategories: [
            { _id: 'cat1', name: 'Category 1' },
            { _id: 'cat2', name: 'Category 2' },
          ],
        },
        {
          _id: 'auditType2',
          questionsCategories: null,
        },
        {
          _id: 'auditType3',
          questionsCategories: undefined,
        },
      ];

      const allCategories = testFlatMapLogic(mockAuditTypes);

      expect(allCategories).toHaveLength(2);
      expect(allCategories[0]).toEqual({ _id: 'cat1', name: 'Category 1' });
      expect(allCategories[1]).toEqual({ _id: 'cat2', name: 'Category 2' });
    });

    test('flatMap handles null audit types with null coalescing', () => {
      const allCategories = testFlatMapLogic(null);
      expect(allCategories).toHaveLength(0);
    });

    test('flatMap handles undefined audit types with null coalescing', () => {
      const allCategories = testFlatMapLogic(undefined);
      expect(allCategories).toHaveLength(0);
    });

    test('flatMap handles empty audit types array', () => {
      const allCategories = testFlatMapLogic([]);
      expect(allCategories).toHaveLength(0);
    });
  });

  describe('Map Deduplication Logic Coverage', () => {
    test('Map deduplication logic with duplicate category IDs', () => {
      const allCategories: Category[] = [
        { _id: 'cat1', name: 'Category 1' },
        { _id: 'cat2', name: 'Category 2' },
        { _id: 'cat1', name: 'Category 1 Duplicate' }, // Duplicate ID
        { _id: 'cat3', name: 'Category 3' },
      ];

      const uniqueCategoriesMap = testMapDeduplicationLogic(allCategories);

      expect(uniqueCategoriesMap.size).toBe(3);
      expect(uniqueCategoriesMap.get('cat1')).toEqual({ _id: 'cat1', name: 'Category 1' }); // First occurrence
      expect(uniqueCategoriesMap.get('cat2')).toEqual({ _id: 'cat2', name: 'Category 2' });
      expect(uniqueCategoriesMap.get('cat3')).toEqual({ _id: 'cat3', name: 'Category 3' });
    });

    test('Map deduplication logic with empty categories array', () => {
      const allCategories: Category[] = [];
      const uniqueCategoriesMap = testMapDeduplicationLogic(allCategories);
      expect(uniqueCategoriesMap.size).toBe(0);
    });

    test('Map deduplication logic with single category', () => {
      const allCategories: Category[] = [{ _id: 'cat1', name: 'Single Category' }];
      const uniqueCategoriesMap = testMapDeduplicationLogic(allCategories);

      expect(uniqueCategoriesMap.size).toBe(1);
      expect(uniqueCategoriesMap.get('cat1')).toEqual({ _id: 'cat1', name: 'Single Category' });
    });
  });

  describe('Panel Selection Logic Coverage', () => {
    const mockPanels = [
      { _id: 'all', name: 'All' },
      { _id: 'cat1', name: 'Category 1' },
      { _id: 'cat2', name: 'Category 2' },
    ];

    test('panel selection returns parsed filters when "all" is selected', () => {
      const parsedFilters = { questionsCategoriesIds: ['cat1', 'cat2'] };
      const result = testPanelSelectionLogic(mockPanels, 0, parsedFilters);

      expect(result).toEqual(['cat1', 'cat2']);
    });

    test('panel selection returns empty array when "all" is selected and no parsed filters', () => {
      const result = testPanelSelectionLogic(mockPanels, 0);
      expect(result).toEqual([]);
    });

    test('panel selection returns empty array when "all" is selected and questionsCategoriesIds is undefined', () => {
      const parsedFilters = { questionsCategoriesIds: undefined };
      const result = testPanelSelectionLogic(mockPanels, 0, parsedFilters);
      expect(result).toEqual([]);
    });

    test('panel selection returns specific category ID when non-"all" panel is selected', () => {
      const parsedFilters = { questionsCategoriesIds: ['cat1', 'cat2'] };
      const result = testPanelSelectionLogic(mockPanels, 1, parsedFilters);

      expect(result).toEqual(['cat1']);
    });

    test('panel selection returns specific category ID when non-"all" panel is selected (index 2)', () => {
      const parsedFilters = { questionsCategoriesIds: ['cat1', 'cat2'] };
      const result = testPanelSelectionLogic(mockPanels, 2, parsedFilters);

      expect(result).toEqual(['cat2']);
    });

    test('panel selection works with different panel configurations', () => {
      const customPanels = [
        { _id: 'all', name: 'All' },
        { _id: 'custom1', name: 'Custom Category 1' },
      ];

      const result = testPanelSelectionLogic(customPanels, 1);
      expect(result).toEqual(['custom1']);
    });
  });

  describe('Integration Tests for Complete Logic Flow', () => {
    test('complete flow: flatMap -> Map deduplication -> panel selection', () => {
      const mockAuditTypes: AuditType[] = [
        {
          _id: 'auditType1',
          questionsCategories: [
            { _id: 'cat1', name: 'Category 1' },
            { _id: 'cat2', name: 'Category 2' },
          ],
        },
        {
          _id: 'auditType2',
          questionsCategories: [
            { _id: 'cat2', name: 'Category 2 Duplicate' },
            { _id: 'cat3', name: 'Category 3' },
          ],
        },
      ];

      // Step 1: Test flatMap logic
      const allCategories = testFlatMapLogic(mockAuditTypes);
      expect(allCategories).toHaveLength(4); // 2 + 2 categories

      // Step 2: Test Map deduplication
      const uniqueCategoriesMap = testMapDeduplicationLogic(allCategories);
      expect(uniqueCategoriesMap.size).toBe(3); // 3 unique categories

      // Step 3: Test complete panels creation
      const panels = testUniqueCategoriesLogic(mockAuditTypes);
      expect(panels).toHaveLength(4); // 'All' + 3 unique categories

      // Step 4: Test panel selection logic
      const parsedFilters = { questionsCategoriesIds: ['cat1', 'cat2', 'cat3'] };

      // Test "all" selection
      const allResult = testPanelSelectionLogic(panels, 0, parsedFilters);
      expect(allResult).toEqual(['cat1', 'cat2', 'cat3']);

      // Test specific category selection
      const specificResult = testPanelSelectionLogic(panels, 1, parsedFilters);
      expect(specificResult).toEqual(['cat1']);
    });
  });
});
