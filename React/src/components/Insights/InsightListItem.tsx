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
        return (<>
          <InsightCount
            count={item.totalActionsCount}
            data-id="3578a77b7d3e"
            onClick={() => handleClickForActions()} />
          <InsightCount
            count={item.completedActionsCount}
            data-id="8cc91979f83b"
            onClick={() => handleClickForActions('closed')} />
          <InsightCount
            count={item.inProgressActionsCount}
            data-id="e9a64b9f33f2"
            onClick={() => handleClickForActions('open')} />
          <InsightCount
            count={item.overdueActionsCount}
            data-id="ed64480de41e"
            onClick={() => handleClickForActions('overdue')} />
        </>);
      case 'answers':
        return (<>
          <InsightCount
            count={item.totalAnswersCount}
            data-id="f5cad70b73f1"
            onClick={() => handleClickForAnswers()} />
          <InsightCount
            count={item.openAnswersCount}
            data-id="e3021dcd6196"
            onClick={() => handleClickForAnswers('open')} />
          <InsightCount
            count={item.resolvedAnswersCount}
            data-id="7f49acdd73d0"
            onClick={() => handleClickForAnswers('resolved')} />
          <InsightCount
            count={item.closedAnswersCount}
            data-id="9924f419590c"
            onClick={() => handleClickForAnswers('closed')} />
        </>);
      case 'audits':
      default:
        return (<>
          <InsightCount
            count={item.totalAuditsCount}
            data-id="400360a39f0f"
            onClick={() => handleClickForAudits()} />
          <InsightCount
            count={item.completedAuditsCount}
            data-id="9b759557782b"
            onClick={() => handleClickForAudits('completed')} />
          <InsightCount
            count={item.upcomingAuditsCount}
            data-id="25acdaecee15"
            onClick={() => handleClickForAudits('upcoming')} />
          <InsightCount
            count={item.missedAuditsCount}
            data-id="c41ebd517393"
            onClick={() => handleClickForAudits('missed')} />
        </>);
    }
  }, [insightsType]);

  return (
    (<Flex
      align="center"
      bg={light ? 'white' : '#F3F3F5'}
      cursor="pointer"
      data-id="f291bdb7a111"
      minH="70px"
      p="15px 25px"
      py={1.25}
      w="full">
      <Grid data-id="d856e717d4f5" templateColumns="1fr repeat(4, 135px)" w="full">
        <Flex
          color="auditsInsights.list.fontColor"
          data-id="e3023b92294b"
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
            <Flex align="center" data-id="b00ae33eaf25">
              <UserAvatar data-id="bb765ecf756c" size="sm" userId={item?._id} />
              <Text data-id="3e566d1f49fe" ml={2}>{(item as IUser)?.displayName}</Text>
            </Flex>
          ) : (
            <Text data-id="f94275e0eaa5">{(item as IBusinessUnit | ILocation)?.name}</Text>
          )}
        </Flex>
        {counts}
      </Grid>
    </Flex>)
  );
}

export default InsightListItem;
