import { useEffect, useState } from 'react';

import { compareAsc } from 'date-fns';
import { get } from 'lodash';

const useSort = (data: any[], initialSortType = 'name') => {
  const [sortType, setSortType] = useState(initialSortType);
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [sortedData, setSortedData] = useState<any>([]);

  useEffect(
    () => {
      const sort = (a, b) => {
        if (get(a, sortType) === null) return 1;

        if (get(b, sortType) === null) return -1;

        if (get(a, sortType) instanceof Date) return compareAsc(new Date(get(b, sortType)), new Date(get(b, sortType)));

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
