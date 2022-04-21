import { CheckboxGroup, Stack } from '@chakra-ui/react';

import { useAppContext } from '../contexts/AppProvider';
import { IBusinessUnit } from '../interfaces/IBusinessUnit';
import FilterCheckBox from './Filters/FilterCheckBox';

interface IBusinessUnitsSelectorList {
  filteredBusinessUnits: IBusinessUnit[];
  selected: string[];
  disabled?: boolean;
  handleChange: (any) => void;
}

const BusinessUnitsSelectorList = ({
  filteredBusinessUnits,
  selected,
  handleChange,
}: IBusinessUnitsSelectorList) => {
  const { module } = useAppContext();

  return (
    <CheckboxGroup
      onChange={(value) =>
        handleChange({
          target: {
            name: module?.type === 'tracker' ? 'businessUnitsIds' : 'areasIds',
            value,
          },
        })
      }
      value={selected}
    >
      <Stack direction="column" w="full">
        {filteredBusinessUnits?.map(({ name, _id }) => (
          <FilterCheckBox key={_id} label={name} value={_id} />
        ))}
      </Stack>
    </CheckboxGroup>
  );
};

export default BusinessUnitsSelectorList;
