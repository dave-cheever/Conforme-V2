import { useEffect, useState } from 'react';
import { compareAsc, parseISO } from 'date-fns';
import { get } from 'lodash';

const useSort = (data: any[], initialSortType = 'name', initialSortOrder: 'asc' | 'desc' = 'asc') => {
  const [sortType, setSortType] = useState(initialSortType);
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>(initialSortOrder);
  const [sortedData, setSortedData] = useState<any>([]);
  const priorities = ['high', 'medium', 'low'];

  useEffect(() => {
    const sort = (a, b) => {
      if (sortType === 'priority') {
        return priorities.indexOf(get(a, sortType)) - priorities.indexOf(get(b, sortType));
      }

      const aValue = get(a, sortType);
      const bValue = get(b, sortType);

      // Special handling for completedDate
      if (sortType === 'completedDate') {
        const aStatus = get(a, 'status');
        const bStatus = get(b, 'status');

        const aHasDate = aStatus === 'completed' && !!aValue;
        const bHasDate = bStatus === 'completed' && !!bValue;

        // Always push nulls or non-completed to the end
        if (!aHasDate && bHasDate) return 1;
        if (aHasDate && !bHasDate) return -1;
        if (!aHasDate && !bHasDate) return 0;

        const aDate = parseISO(aValue);
        const bDate = parseISO(bValue);
        const result = compareAsc(aDate, bDate);

        // Flip order based on sortOrder but keep nulls at end
        return sortOrder === 'asc' ? result : -result;
      }

      // Generic null handling
      if (aValue === null || aValue === undefined) return 1;
      if (bValue === null || bValue === undefined) return -1;

      if (!Number.isNaN(parseISO(aValue).valueOf())) {
        const result = compareAsc(parseISO(aValue), parseISO(bValue));
        return sortOrder === 'asc' ? result : -result;
      }

      if (typeof aValue === 'number') return sortOrder === 'asc' ? aValue - bValue : bValue - aValue;
      if (typeof aValue === 'string') return sortOrder === 'asc' ? aValue.localeCompare(bValue) : bValue.localeCompare(aValue);
      return 0;
    };

    const sorted = [...data].sort(sort);
    setSortedData(sorted);
  }, [JSON.stringify(data), sortType, sortOrder]); // eslint-disable-line react-hooks/exhaustive-deps

  return { sortedData, sortType, sortOrder, setSortType, setSortOrder };
};

export default useSort;
