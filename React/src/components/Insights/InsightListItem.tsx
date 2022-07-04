import { useMemo } from 'react';

import { Box, Flex } from '@chakra-ui/react';

import { useFiltersContext } from '../../contexts/FiltersProvider';
import useNavigate from '../../hooks/useNavigate';
import { IBusinessUnit } from '../../interfaces/IBusinessUnit';
import { ILocation } from '../../interfaces/ILocation';
import InsightCount from './InsightCount';

const InsightListItem = ({
  item,
  itemType = 'location',
  navigation,
  questionsCategoriesId,
  type = 'audits',
}: {
  item: ILocation | IBusinessUnit;
  itemType?: 'location' | 'businessUnit';
  navigation: string;
  questionsCategoriesId?: string;
  type?: 'audits' | 'actions' | 'answers';
}) => {
  const { navigateTo } = useNavigate();
  const { setAuditFiltersValue, setWalkItemFiltersValue, setActionFiltersValue } = useFiltersContext();

  const handleClickForAudits = (status?: string) => {
    navigateTo('/');
    setAuditFiltersValue({
      [itemType === 'location' ? 'sitesIds' : 'areasIds']: {
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
      [itemType === 'location' ? 'sitesIds' : 'areasIds']: {
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
      [itemType === 'location' ? 'sitesIds' : 'areasIds']: {
        value: [item._id],
      },
      status: {
        value: status ? [status] : [],
      },
    });
  };

  const counts = useMemo(() => {
    switch (type) {
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
  }, [type]);

  return (
    <Box
      bg="white"
      borderBottomColor="auditsInsights.list.headerBorderColor"
      borderBottomWidth="1px"
      cursor="pointer"
      p="15px 25px"
      py={[1, 0]}
      w="full"
    >
      <Flex align="center" h={['full', '73px']} position="relative" w="full">
        <Flex flexDir="column" w="60%">
          <Flex
            align="flex-start"
            color="auditsInsights.list.fontColor"
            fontSize="14px"
            fontWeight="400"
            h="50%"
            lineHeight="18px"
            noOfLines={1}
            onClick={() => navigateTo(navigation)}
            opacity="1"
            pt="3px"
            textOverflow="ellipsis"
          >
            {item.name}
          </Flex>
        </Flex>
        <Flex h="100%" w="40%">
          {counts}
        </Flex>
      </Flex>
    </Box>
  );
};

export default InsightListItem;
