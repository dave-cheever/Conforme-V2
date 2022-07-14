import { useMemo } from 'react';
import { useLocation } from 'react-router-dom';

import { CheckboxGroup, Stack } from '@chakra-ui/react';

import { actionStatuses, walkItemStatuses } from '../../bootstrap/config';
import { useFiltersContext } from '../../contexts/FiltersProvider';
import { auditStatuses } from '../../hooks/useAuditUtils';
import useFiltersUtils, { auditWalkTypes } from '../../hooks/useFiltersUtils';
import useNavigate from '../../hooks/useNavigate';
import FilterCheckBox from './FilterCheckBox';

const StateChoiceFilter = ({ name }: { name: string }) => {
  const { filtersValues, setFilters } = useFiltersContext();
  const { complianceItemStatuses } = useFiltersUtils();
  const location = useLocation();
  const { getPath } = useNavigate();

  const usedStatuses = useMemo(() => {
    switch (getPath()) {
      case 'actions':
        return actionStatuses;
      case 'walk-items':
        return walkItemStatuses;
      case 'audits':
      default:
        return auditStatuses;
    }
  }, [location.pathname]);

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
  }, [filtersValues, location.pathname]) as string[];

  const renderChoices = () => {
    switch (name) {
      case 'itemStatus':
        return Object.entries(complianceItemStatuses).map(([key, label]) => <FilterCheckBox key={key} label={label} value={key} />);
      case 'status':
        return Object.entries(usedStatuses).map(([key, label]) => <FilterCheckBox key={key} label={label} value={key} />);
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
