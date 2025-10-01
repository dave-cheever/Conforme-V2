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
    <Stack data-id="000174" direction="column" overflow="auto">
      <InputGroup data-id="000175">
        <Input
          borderColor="filterPanel.searchBoxBordercolor"
          borderWidth="1px"
          color="brand.darkGrey"
          data-id="000176"
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
          data-id="000177"
          h="12px"
          left="14px"
          position="absolute"
          w="12x"
        />
      </InputGroup>
      <CheckboxGroup data-id="000178" onChange={handleChange} value={value}>
        {selectedTrackerItems?.map(({ name, _id }) => (
          <FilterCheckBox data-id="000179" key={_id} label={name} value={_id} />
        ))}
        {filteredTrackerItems?.map(({ name, _id }) => (
          <FilterCheckBox data-id="000180" key={_id} label={name} value={_id} />
        ))}
      </CheckboxGroup>
    </Stack>
  );
}

export default TrackerItemFilter;
