import { useMemo } from 'react';
import { useLocation } from 'react-router-dom';

import { gql, useQuery } from '@apollo/client';
import { CheckboxGroup, Stack } from '@chakra-ui/react';

import { actionStatuses, answerStatuses } from '../../bootstrap/config';
import { useAppContext } from '../../contexts/AppProvider';
import { useFiltersContext } from '../../contexts/FiltersProvider';
import { auditStatuses } from '../../hooks/useAuditUtils';
import useFiltersUtils, { actionPriorities, auditWalkTypes } from '../../hooks/useFiltersUtils';
import useNavigate from '../../hooks/useNavigate';
import updateLocalStorageFilter from '../../utils/filterStorage';
import Loader from '../Loader';
import FilterCheckBox from './FilterCheckBox';

const GET_RESPONSES_ANSWERS = gql`
  query ResponsesAnswers($filterName: String!) {
    customQuestionsOptions(filterName: $filterName) {
      value
      label
    }
  }
`;

function StateChoiceFilter({ name }: { name: string }) {
  const { user, module } = useAppContext();
  const { filtersValues, setFilters } = useFiltersContext();
  const { trackerItemStatuses } = useFiltersUtils();
  const location = useLocation();
  const { getPath } = useNavigate();
  const { data: responsesAnswers, loading } = useQuery(GET_RESPONSES_ANSWERS, {
    variables: { filterName: name },
    skip: ['itemStatus', 'status', 'priority', 'walkType'].includes(name),
  });

  const usedStatuses = useMemo(() => {
    switch (getPath()) {
      case 'actions':
        return actionStatuses;
      case 'answers':
        return answerStatuses;
      case 'audits':
      default:
        return auditStatuses;
    }
  }, [location.pathname]);

  const value = useMemo(() => filtersValues[name]?.value, [filtersValues, name]) as string[];

  const handleChange = (newValue: string[]) => {
    const labelMap = {
      itemStatus: 'Item status',
      status: 'Status',
      priority: 'Priority',
      walkType: 'Walk type',
    };
    if(user && module)
      {updateLocalStorageFilter(
      module._id,
      name,
      labelMap[name] || name,
      newValue,
      user?._id,
      setFilters,
    );}
  };

  const renderChoices = () => {
    switch (name) {
      case 'itemStatus':
        return Object.entries(trackerItemStatuses).map(([key, label]) => (
          <FilterCheckBox data-id="000184" key={key} label={label} value={key} />
        ));
      case 'status':
        return Object.entries(usedStatuses).map(([key, label]) => (
          <FilterCheckBox data-id="000185" key={key} label={label} value={key} />
        ));
      case 'priority':
        return Object.entries(actionPriorities).map(([key, label]) => (
          <FilterCheckBox data-id="000186" key={key} label={label} value={key} />
        ));
      case 'walkType':
        return Object.entries(auditWalkTypes).map(([key, label]) => (
          <FilterCheckBox data-id="000187" key={key} label={label} value={key} />
        ));
      default:
        return (responsesAnswers?.customQuestionsOptions || []).map((option) => (
          <FilterCheckBox data-id="000188" key={option.value} label={option.label} value={option.value} />
        ));
    }
  };

  return (
    <CheckboxGroup data-id="000189" onChange={handleChange} value={value}>
      <Stack data-id="000190" direction="column" overflow="auto">
        {loading ? <Loader data-id="000191" size="sm" /> : renderChoices()}
      </Stack>
    </CheckboxGroup>
  );
}

export default StateChoiceFilter;
