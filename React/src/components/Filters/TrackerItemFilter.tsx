import { useCallback, useMemo, useState } from 'react';

import { CheckboxGroup, Input, InputGroup, Stack } from '@chakra-ui/react';
import { t } from 'i18next';

import { useAppContext } from '../../contexts/AppProvider';
import { useFiltersContext } from '../../contexts/FiltersProvider';
import { Magnifier } from '../../icons';
import updateLocalStorageFilter from '../../utils/filterStorage';
import FilterCheckBox from './FilterCheckBox';

function TrackerItemFilter() {
  const { user, module } = useAppContext();
  const { filtersValues, setFilters, trackerItems } = useFiltersContext();
  const value = useMemo(() => filtersValues.trackerItemsIds?.value, [filtersValues]) as string[];
  const [search, setSearch] = useState<string>('');

  const isSelected = useCallback((_id: string) => value?.includes(_id), [value]);

  const selectedTrackerItems = useMemo(
    () => trackerItems?.filter(({ _id }) => _id && isSelected(_id)),
    [trackerItems, isSelected],
  );

  const filteredTrackerItems = useMemo(() => {
    const nameMatch = (name: string) => name.toLowerCase().includes(search.toLowerCase());
    return trackerItems?.filter(({ name, _id }) => _id && name && nameMatch(name) && !isSelected(_id));
  }, [trackerItems, search, isSelected]);

  const handleChange = (newValue: string[]) => {
    if(user && module)
      {updateLocalStorageFilter(
      module._id,
      'trackerItemsIds',
      'Tracker item',
      newValue,
      user?._id,
      setFilters,
    );}
  };

  return (
    <Stack data-id="030925-c58b9f" direction="column" overflow="auto">
      <InputGroup data-id="030925-48d671">
        <Input
          borderColor="filterPanel.searchBoxBordercolor"
          borderWidth="1px"
          color="brand.darkGrey"
          data-id="030925-695c2e"
          fontSize="14px"
          h="40px"
          mb={3}
          onChange={({ target: { value } }) => setSearch(value)}
          pl={8}
          placeholder={`Search ${t('tracker item')}`}
          value={search}
          w="full"
        />
        <Magnifier
          bottom="25px"
          data-id="030925-2783df"
          h="12px"
          left="14px"
          position="absolute"
          w="12x"
        />
      </InputGroup>
      <CheckboxGroup data-id="030925-28ff89" onChange={handleChange} value={value}>
        {selectedTrackerItems?.map(({ name, _id }) => (
          <FilterCheckBox data-id="030925-e341cb" key={_id} label={name} value={_id} />
        ))}
        {filteredTrackerItems?.map(({ name, _id }) => (
          <FilterCheckBox data-id="030925-0fb2b1" key={_id} label={name} value={_id} />
        ))}
      </CheckboxGroup>
    </Stack>
  );
}

export default TrackerItemFilter;
