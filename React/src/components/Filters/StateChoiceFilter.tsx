import { useMemo } from 'react';

import { CheckboxGroup, Stack } from '@chakra-ui/react';

import { useFiltersContext } from '../../contexts/FiltersProvider';
import { auditStatuses } from '../../hooks/useAuditUtils';
import { auditWalkTypes, complianceItemStatuses } from '../../hooks/useFiltersUtils';
import FilterCheckBox from './FilterCheckBox';

const StateChoiceFilter = ({ name }: { name: string }) => {
  const { filtersValues, setFilters } = useFiltersContext();
  const value = useMemo(() => {
    switch (name) {
      case 'itemStatus':
        return filtersValues.itemStatus?.value;
      case 'status':
        return filtersValues.status?.value;
      case 'walkType':
        return filtersValues.walkType?.value;
      default:
        break;
    }
  }, [filtersValues]) as string[];

  const renderChoices = () => {
    switch (name) {
      case 'itemStatus':
        return Object.entries(complianceItemStatuses).map(([key, label]) => <FilterCheckBox key={key} label={label} value={key} />);
      case 'status':
        return Object.entries(auditStatuses).map(([key, label]) => <FilterCheckBox key={key} label={label} value={key} />);
      case 'walkType':
        return Object.entries(auditWalkTypes).map(([key, label]) => <FilterCheckBox key={key} label={label} value={key} />);
      default:
        break;
    }
  };

  return (
    <CheckboxGroup onChange={(newValue) => setFilters({ [name]: newValue })} value={value}>
      <Stack direction="column" overflow="auto">
        {renderChoices()}
      </Stack>
    </CheckboxGroup>
  );
};

export default StateChoiceFilter;
