import { Box, Flex } from '@chakra-ui/react';

import useNavigate from '../../hooks/useNavigate';
import { IBusinessUnit } from '../../interfaces/IBusinessUnit';
import { ILocation } from '../../interfaces/ILocation';
import InsightCount from './InsightCount';

const InsightListItem = ({ item }: { item: ILocation | IBusinessUnit }) => {
  const { navigateTo } = useNavigate();

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
          <InsightCount count={item.totalAuditsCount} />
          <InsightCount count={item.completedAuditsCount} />
          <InsightCount count={item.upcomingAuditsCount} />
          <InsightCount count={item.overdueAuditsCount} />
        </Flex>
        {/* <Flex h="100%" w="10%">
        </Flex>
        <Flex h="100%" w="10%">
        </Flex>
        <Flex h="100%" w="10%">
        </Flex> */}
      </Flex>
    </Box>
  );
};

export default InsightListItem;
