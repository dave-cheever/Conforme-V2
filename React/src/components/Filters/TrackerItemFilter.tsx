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
    <Stack data-id="de0ea4fff461" direction="column" overflow="auto">
      <InputGroup data-id="953c772cd47f">
        <Input
          borderColor="filterPanel.searchBoxBordercolor"
          borderWidth="1px"
          color="brand.darkGrey"
          data-id="5e2eef8a01e2"
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
          data-id="70db5ea07d5a"
          h="12px"
          left="14px"
          position="absolute"
          w="12x"
        />
      </InputGroup>
      <CheckboxGroup data-id="8aa949bd9a6b" onChange={handleChange} value={value}>
        {selectedTrackerItems?.map(({ name, _id }) => (
          <FilterCheckBox data-id="0daeae10f75f" key={_id} label={name} value={_id} />
        ))}
        {filteredTrackerItems?.map(({ name, _id }) => (
          <FilterCheckBox data-id="13ff6a9aaae3" key={_id} label={name} value={_id} />
        ))}
      </CheckboxGroup>
    </Stack>
  );
}

export default TrackerItemFilter;
