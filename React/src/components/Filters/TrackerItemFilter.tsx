import React, { useCallback, useMemo, useState } from 'react';

import { CheckboxGroup, Input, InputGroup, Stack } from '@chakra-ui/react';
import { t } from 'i18next';

import { useFiltersContext } from '../../contexts/FiltersProvider';
import { Magnifier } from '../../icons';
import FilterCheckBox from './FilterCheckBox';

const TrackerItemFilter = () => {
  const { filtersValues, setFilters, trackerItems } = useFiltersContext();
  const value = useMemo(() => filtersValues.trackerItemsIds?.value, [filtersValues]) as string[];
  const [search, setSearch] = useState<string>('');

  const isSelected = useCallback((_id: string) => value?.includes(_id), [value]);

  const selectedTrackerItems = useMemo(() => trackerItems?.filter(({ _id }) => _id && isSelected(_id)), [trackerItems, isSelected]);

  const filteredTrackerItems = useMemo(() => {
    const nameMatch = (name: string) => name.toLowerCase().includes(search.toLowerCase());
    return trackerItems?.filter(({ name, _id }) => _id && name && nameMatch(name) && !isSelected(_id));
  }, [trackerItems, search, isSelected]);

  return (
    <Stack direction="column" overflow="auto">
      <InputGroup>
        <Input
          borderColor="filterPanel.searchBoxBordercolor"
          borderWidth="1px"
          color="brand.darkGrey"
          fontSize="14px"
          h="40px"
          mb={3}
          onChange={({ target: { value } }) => setSearch(value)}
          pl={8}
          placeholder={`Search ${t('tracker item')}`}
          value={search}
          w="full"
        />
        <Magnifier bottom="25px" h="12px" left="14px" position="absolute" w="12x" />
      </InputGroup>
      <CheckboxGroup onChange={(newValue) => setFilters({ trackerItemsIds: newValue })} value={value}>
        {selectedTrackerItems?.map(({ name, _id }) => (
          <FilterCheckBox key={_id} label={name} value={_id} />
        ))}
        {filteredTrackerItems?.map(({ name, _id }) => (
          <FilterCheckBox key={_id} label={name} value={_id} />
        ))}
      </CheckboxGroup>
    </Stack>
  );
};

export default TrackerItemFilter;
