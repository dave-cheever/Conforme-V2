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
              count={item.totalActionsCount}
              data-id="000467"
              onClick={() => handleClickForActions()} />
            <InsightCount
              count={item.completedActionsCount}
              data-id="000468"
              onClick={() => handleClickForActions('closed')} />
            <InsightCount
              count={item.inProgressActionsCount}
              data-id="000469"
              onClick={() => handleClickForActions('open')} />
            <InsightCount
              count={item.overdueActionsCount}
              data-id="000470"
              onClick={() => handleClickForActions('overdue')} />
          </>
        );
      case 'answers':
        return (
          <>
            <InsightCount
              count={item.totalAnswersCount}
              data-id="000471"
              onClick={() => handleClickForAnswers()} />
            <InsightCount
              count={item.openAnswersCount}
              data-id="000472"
              onClick={() => handleClickForAnswers('open')} />
            <InsightCount
              count={item.resolvedAnswersCount}
              data-id="000473"
              onClick={() => handleClickForAnswers('resolved')} />
            <InsightCount
              count={item.closedAnswersCount}
              data-id="000474"
              onClick={() => handleClickForAnswers('closed')} />
          </>
        );
      case 'audits':
      default:
        return (
          <>
            <InsightCount
              count={item.totalAuditsCount}
              data-id="000475"
              onClick={() => handleClickForAudits()} />
            <InsightCount
              count={item.completedAuditsCount}
              data-id="000476"
              onClick={() => handleClickForAudits('completed')} />
            <InsightCount
              count={item.upcomingAuditsCount}
              data-id="000477"
              onClick={() => handleClickForAudits('upcoming')} />
            <InsightCount
              count={item.missedAuditsCount}
              data-id="000478"
              onClick={() => handleClickForAudits('missed')} />
          </>
        );
    }
  }, [insightsType]);

  return (
    <Flex
        align="center"
        bg={light ? 'white' : '#F3F3F5'}
        cursor="pointer"
        data-id="000479"
        minH="70px"
        p="15px 25px"
        py={1.25}
        w="full">
      <Grid data-id="000480" templateColumns="1fr repeat(4, 135px)" w="full">
        <Flex
          color="auditsInsights.list.fontColor"
          data-id="000481"
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
            <Flex align="center" data-id="000482">
              <UserAvatar data-id="000483" size="sm" userId={item?._id} />
              <Text data-id="000484" ml={2}>{(item as IUser)?.displayName}</Text>
            </Flex>
          ) : (
            <Text data-id="000485">{(item as IBusinessUnit | ILocation)?.name}</Text>
          )}
        </Flex>
        {counts}
      </Grid>
    </Flex>
  );
}

export default InsightListItem;
