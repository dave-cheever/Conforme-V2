import { Icon } from '@chakra-ui/icons';
import { Box, Flex, Heading, Spacer, Text } from '@chakra-ui/react';

import { actionsInsightsTypes, auditsInsightsTypes, insightsCardsDotsPosition } from '../../bootstrap/config';
import { InsightsCardDots } from '../../icons';

const InsightsCard = ({
  count,
  onSelect,
  selected = false,
  status = 'total',
  type = 'audits',
}: {
  count: number;
  onSelect: (type: string) => void;
  selected?: boolean;
  status: string;
  type?: 'audits' | 'actions';
}) => (
  <Flex align="center" cursor="pointer" direction="column" mr="20px" onClick={() => onSelect(status)}>
    <Box bg={`insightsCard.types.${status}`} h="250px" overflow="hidden" position="relative" rounded="20px" w="246px" zIndex="1">
      <InsightsCardDots h="175px" position="absolute" w="175px" zIndex="2" {...insightsCardsDotsPosition[status]} />
      <Flex direction="column" position="relative" px="30px" py="25px" textAlign="left" zIndex="3">
        <Text color="insightsCard.color" fontSize="14px">
          {type === 'audits' ? auditsInsightsTypes[status] : actionsInsightsTypes[status]}
        </Text>
        <Heading color="insightsCard.color" fontSize="100px">
          {count}
        </Heading>
        <Spacer />
        {selected && <Box bg="insightsCard.color" h="7px" mt="22px" rounded="100px" w="100%" />}
      </Flex>
    </Box>
    {selected && (
      <Icon fill={`insightsCard.types.${status}`} height="15px" viewBox="0 0 39 15" width="39px" zIndex="2">
        <path d="M19.5 15L0.880456 -3.50736e-06L38.1195 -2.51817e-07L19.5 15Z" />
      </Icon>
    )}
  </Flex>
);

export default InsightsCard;

export const insightsCardStyles = {
  insightsCard: {
    types: {
      total: '#1E1836',
      completed: '#41B916',
      upcoming: '#FF9A00',
      inProgress: '#FF9A00',
      overdue: '#E93C44',
      missed: '#E93C44',
    },
    color: 'white',
  },
};
