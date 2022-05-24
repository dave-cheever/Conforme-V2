import { Icon } from '@chakra-ui/icons';
import { Box, Flex, Heading, Spacer, Text } from '@chakra-ui/react';

import {
  auditsInsightsTypes,
  insightsCardsDotsPosition,
} from '../../bootstrap/config';
import { InsightsCardDots } from '../../icons';

const InsightsCard = ({
  audits,
  onSelect,
  selected = false,
  type = 'total',
}: {
  audits: number;
  onSelect: (type: string) => void;
  selected?: boolean;
  type: string;
}) => (
  <Flex
    align="center"
    cursor="pointer"
    direction="column"
    mr="20px"
    onClick={() => onSelect(type)}
  >
    <Box
      bg={`auditsInsights.types.${type}`}
      h="250px"
      overflow="hidden"
      position="relative"
      rounded="20px"
      w="246px"
      zIndex="1"
    >
      <InsightsCardDots
        h="175px"
        position="absolute"
        w="175px"
        zIndex="2"
        {...insightsCardsDotsPosition[type]}
      />
      <Flex
        direction="column"
        position="relative"
        px="30px"
        py="25px"
        textAlign="left"
        zIndex="3"
      >
        <Text color="auditsInsights.insightsCard.color" fontSize="14px">
          {auditsInsightsTypes[type]}
        </Text>
        <Heading color="auditsInsights.insightsCard.color" fontSize="100px">
          {audits}
        </Heading>
        <Text color="auditsInsights.insightsCard.color" fontSize="14px">
          Most added recent today
        </Text>
        <Spacer />
        {selected && (
          <Box
            bg="auditsInsights.insightsCard.color"
            h="7px"
            mt="22px"
            rounded="100px"
            w="100%"
          />
        )}
      </Flex>
    </Box>
    {selected && (
      <Icon
        fill={`auditsInsights.types.${type}`}
        height="15px"
        viewBox="0 0 39 15"
        width="39px"
        zIndex="2"
      >
        <path d="M19.5 15L0.880456 -3.50736e-06L38.1195 -2.51817e-07L19.5 15Z" />
      </Icon>
    )}
  </Flex>
);

export default InsightsCard;
