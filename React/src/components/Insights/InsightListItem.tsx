import { useMemo } from 'react';

import { Flex, Grid, Text } from '@chakra-ui/react';

import { useFiltersContext } from '../../contexts/FiltersProvider';
import useNavigate from '../../hooks/useNavigate';
import { IBusinessUnit } from '../../interfaces/IBusinessUnit';
import { ILocation } from '../../interfaces/ILocation';
import { IUser } from '../../interfaces/IUser';
import UserAvatar from '../UserAvatar';
import InsightCount from './InsightCount';

const InsightListItem = ({
  item,
  light = true,
  navigation,
  questionsCategoriesId,
  insightsType = 'audits',
  insightsModel = 'users',
}: {
  item: ILocation | IBusinessUnit | IUser;
  light?: boolean;
  navigation: string;
  questionsCategoriesId?: string;
  insightsType?: 'audits' | 'actions' | 'answers';
  insightsModel?: 'users' | 'businessUnits' | 'locations';
}) => {
  const { navigateTo } = useNavigate();
  const { setAuditFiltersValue, setWalkItemFiltersValue, setActionFiltersValue } = useFiltersContext();

  const handleClickForAudits = (status?: string) => {
    navigateTo('/');
    setAuditFiltersValue({
      [`${insightsModel}Ids`]: {
        value: [item._id],
      },
      status: {
        value: status ? [status] : [],
      },
    });
  };

  const handleClickForAnswers = (status?: string) => {
    navigateTo('/walk-items');
    setWalkItemFiltersValue({
      [`${insightsModel}Ids`]: {
        value: [item._id],
      },
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
    setActionFiltersValue({
      [`${insightsModel}Ids`]: {
        value: [item._id],
      },
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
            <InsightCount count={item.totalActionsCount} onClick={() => handleClickForActions()} />
            <InsightCount count={item.completedActionsCount} onClick={() => handleClickForActions('completed')} />
            <InsightCount count={item.inProgressActionsCount} onClick={() => handleClickForActions('upcoming')} />
            <InsightCount count={item.overdueActionsCount} onClick={() => handleClickForActions('missed')} />
          </>
        );
      case 'answers':
        return (
          <>
            <InsightCount count={item.totalAnswersCount} onClick={() => handleClickForAnswers()} />
            <InsightCount count={item.openAnswersCount} onClick={() => handleClickForAnswers('open')} />
            <InsightCount count={item.resolvedAnswersCount} onClick={() => handleClickForAnswers('resolved')} />
            <InsightCount count={item.closedAnswersCount} onClick={() => handleClickForAnswers('closed')} />
          </>
        );
      case 'audits':
      default:
        return (
          <>
            <InsightCount count={item.totalAuditsCount} onClick={() => handleClickForAudits()} />
            <InsightCount count={item.completedAuditsCount} onClick={() => handleClickForAudits('completed')} />
            <InsightCount count={item.upcomingAuditsCount} onClick={() => handleClickForAudits('upcoming')} />
            <InsightCount count={item.missedAuditsCount} onClick={() => handleClickForAudits('missed')} />
          </>
        );
    }
  }, [insightsType]);

  return (
    <Flex align="center" bg={light ? 'white' : '#F3F3F5'} cursor="pointer" minH="70px" p="15px 25px" py={1.25} w="full">
      <Grid templateColumns="1fr repeat(4, 135px)" w="full">
        <Flex
          color="auditsInsights.list.fontColor"
          fontSize="14px"
          fontWeight="400"
          lineHeight="18px"
          noOfLines={1}
          onClick={() => navigateTo(navigation)}
          textOverflow="ellipsis"
        >
          {insightsModel === 'users' ? (
            <Flex align="center">
              <UserAvatar size="sm" userId={item?._id} />
              <Text ml={2}>{(item as IUser)?.displayName}</Text>
            </Flex>
          ) : (
            <Text>{(item as IBusinessUnit | ILocation)?.name}</Text>
          )}
        </Flex>
        {counts}
      </Grid>
    </Flex>
  );
};

export default InsightListItem;
