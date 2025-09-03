import { useMemo } from 'react';

import { Flex, Grid, Text } from '@chakra-ui/react';

import { useFiltersContext } from '../../contexts/FiltersProvider';
import useNavigate from '../../hooks/useNavigate';
import { IBusinessUnit } from '../../interfaces/IBusinessUnit';
import { ILocation } from '../../interfaces/ILocation';
import { IUser } from '../../interfaces/IUser';
import UserAvatar from '../UserAvatar';
import InsightCount from './InsightCount';

function InsightListItem({
  item,
  light = true,
  questionsCategoriesId,
  insightsType = 'audits',
  insightsModel = 'users',
}: {
  item: ILocation | IBusinessUnit | IUser;
  light?: boolean;
  questionsCategoriesId?: string;
  insightsType?: 'audits' | 'actions' | 'answers';
  insightsModel?: 'users' | 'businessUnits' | 'locations';
}) {
  const { navigateTo } = useNavigate();
  const { setAuditFiltersValue, setAnswerFiltersValue, setActionFiltersValue } = useFiltersContext();

  const handleClickForAudits = (status?: string) => {
    navigateTo('/');
    const filter: { value: string[] | { auditorsIds: string[] } } = {
      value: [item._id],
    };

    // Nest user filter
    if (insightsModel === 'users') {
      filter.value = {
        auditorsIds: [item._id],
      };
    }

    setAuditFiltersValue({
      [`${insightsModel}Ids`]: filter,
      status: {
        value: status ? [status] : [],
      },
    });
  };

  const handleClickForAnswers = (status?: string) => {
    navigateTo('/answers');
    const filter: { value: string[] | { addedByIds: string[] } } = {
      value: [item._id],
    };

    // Nest user filter
    if (insightsModel === 'users') {
      filter.value = {
        addedByIds: [item._id],
      };
    }

    setAnswerFiltersValue({
      [`${insightsModel}Ids`]: filter,
      status: {
        value: status ? [status] : [],
      },
      questionsCategoriesIds: {
        value: [questionsCategoriesId],
      },
    });
  };

  const handleClickForActions = (status?: string) => {
    navigateTo('/actions');
    const filter: { value: string[] | { assigneesIds: string[] } } = {
      value: [item._id],
    };

    // Nest user filter
    if (insightsModel === 'users') {
      filter.value = {
        assigneesIds: [item._id],
      };
    }

    setActionFiltersValue({
      [`${insightsModel}Ids`]: filter,
      status: {
        value: status ? [status] : [],
      },
    });
  };

  const counts = useMemo(() => {
    switch (insightsType) {
      case 'actions':
        return (
          <>
            <InsightCount
              data-id="030925-dd03ba"
              count={item.totalActionsCount}
              onClick={() => handleClickForActions()} />
            <InsightCount
              data-id="030925-4e888b"
              count={item.completedActionsCount}
              onClick={() => handleClickForActions('closed')} />
            <InsightCount
              data-id="030925-424f4d"
              count={item.inProgressActionsCount}
              onClick={() => handleClickForActions('open')} />
            <InsightCount
              data-id="030925-17e440"
              count={item.overdueActionsCount}
              onClick={() => handleClickForActions('overdue')} />
          </>
        );
      case 'answers':
        return (
          <>
            <InsightCount
              data-id="030925-962b4f"
              count={item.totalAnswersCount}
              onClick={() => handleClickForAnswers()} />
            <InsightCount
              data-id="030925-9ba46b"
              count={item.openAnswersCount}
              onClick={() => handleClickForAnswers('open')} />
            <InsightCount
              data-id="030925-01f170"
              count={item.resolvedAnswersCount}
              onClick={() => handleClickForAnswers('resolved')} />
            <InsightCount
              data-id="030925-2660c1"
              count={item.closedAnswersCount}
              onClick={() => handleClickForAnswers('closed')} />
          </>
        );
      case 'audits':
      default:
        return (
          <>
            <InsightCount
              data-id="030925-73c3ac"
              count={item.totalAuditsCount}
              onClick={() => handleClickForAudits()} />
            <InsightCount
              data-id="030925-2624f1"
              count={item.completedAuditsCount}
              onClick={() => handleClickForAudits('completed')} />
            <InsightCount
              data-id="030925-aebe2e"
              count={item.upcomingAuditsCount}
              onClick={() => handleClickForAudits('upcoming')} />
            <InsightCount
              data-id="030925-1647e9"
              count={item.missedAuditsCount}
              onClick={() => handleClickForAudits('missed')} />
          </>
        );
    }
  }, [insightsType]);

  return (
    <Flex
        data-id="030925-cc8f3b"
        align="center"
        bg={light ? 'white' : '#F3F3F5'}
        cursor="pointer"
        minH="70px"
        p="15px 25px"
        py={1.25}
        w="full">
      <Grid data-id="030925-40fb2b" templateColumns="1fr repeat(4, 135px)" w="full">
        <Flex
          data-id="030925-f6cd53"
          color="auditsInsights.list.fontColor"
          fontSize="14px"
          fontWeight="400"
          lineHeight="18px"
          noOfLines={1}
          onClick={() => {
            switch (insightsType) {
              case 'actions':
                handleClickForActions();
                break;
              case 'answers':
                handleClickForAnswers();
                break;
              default:
                handleClickForAudits();
            }
          }}
          textOverflow="ellipsis">
          {insightsModel === 'users' ? (
            <Flex data-id="030925-4fcf28" align="center">
              <UserAvatar data-id="030925-599a60" size="sm" userId={item?._id} />
              <Text data-id="030925-fc0e2f" ml={2}>{(item as IUser)?.displayName}</Text>
            </Flex>
          ) : (
            <Text data-id="030925-8197cb">{(item as IBusinessUnit | ILocation)?.name}</Text>
          )}
        </Flex>
        {counts}
      </Grid>
    </Flex>
  );
}

export default InsightListItem;
