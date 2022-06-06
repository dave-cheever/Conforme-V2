import { useMemo } from 'react';

import { Box, Flex } from '@chakra-ui/react';

import useNavigate from '../../hooks/useNavigate';
import { IBusinessUnit } from '../../interfaces/IBusinessUnit';
import { ILocation } from '../../interfaces/ILocation';
import InsightCount from './InsightCount';

const InsightListItem = ({ item, type = 'audits' }: { item: ILocation | IBusinessUnit; type?: 'audits' | 'actions' | 'answers' }) => {
  const { navigateTo } = useNavigate();

  const counts = useMemo(() => {
    switch (type) {
      case 'actions':
        return (
          <>
            <InsightCount count={item.totalActionsCount} />
            <InsightCount count={item.completedActionsCount} />
            <InsightCount count={item.inProgressActionsCount} />
            <InsightCount count={item.overdueActionsCount} />
          </>
        );
      case 'answers':
        return (
          <>
            <InsightCount count={item.totalAnswersCount} />
            <InsightCount count={item.openAnswersCount} />
            <InsightCount count={item.resolvedAnswersCount} />
            <InsightCount count={item.closedAnswersCount} />
          </>
        );
      case 'audits':
      default:
        return (
          <>
            <InsightCount count={item.totalAuditsCount} />
            <InsightCount count={item.completedAuditsCount} />
            <InsightCount count={item.upcomingAuditsCount} />
            <InsightCount count={item.missedAuditsCount} />
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
      onClick={() => navigateTo(`/admin/sites`)}
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
