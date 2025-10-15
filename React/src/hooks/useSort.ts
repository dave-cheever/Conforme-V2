import { useEffect, useState } from 'react';

import { compareAsc, parseISO } from 'date-fns';
import { get } from 'lodash';

const useSort = (data: any[], initialSortType = 'name', initialSortOrder: 'asc' | 'desc' = 'asc') => {
  const [sortType, setSortType] = useState(initialSortType);
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>(initialSortOrder);
  const [sortedData, setSortedData] = useState<any>([]);
  const priorities = ['high', 'medium', 'low'];

  useEffect(
    () => {
      const sort = (a, b) => {
        if (sortType === 'priority') return priorities.indexOf(get(a, sortType)) - priorities.indexOf(get(b, sortType));

        if (get(a, sortType) === null) return 1;
        if (get(b, sortType) === null) return -1;

        if (!Number.isNaN(parseISO(a[sortType]).valueOf())) return compareAsc(parseISO(get(a, sortType)), parseISO(get(b, sortType)));

        if (typeof get(a, sortType) === 'number') return get(a, sortType) - get(b, sortType);

        return get(a, sortType) ? get(a, sortType).localeCompare(get(b, sortType)) : 0;
      };
      if (sortOrder === 'asc') setSortedData([...data].sort((a, b) => sort(a, b)));
      else setSortedData([...data].sort((a, b) => sort(b, a)));
    },
    // eslint-disable-line react-hooks/exhaustive-deps
    [JSON.stringify(data), sortType, sortOrder],
  );

  return {
    setSortOrder,
    setSortType,
    sortedData,
    sortOrder,
    sortType,
  };
};

export default useSort;
