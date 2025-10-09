import { Box, Flex, Text } from '@chakra-ui/react';

import { CircleTick, HourGlassIcon, InProgress } from '../../../icons';
import InReviewIcon from '../../../icons/inReviewIcon';

interface StatusCellProps {
  status: string;
  size?: 'sm' | 'md' | 'lg';
}

function StatusCell({ status, size = 'md' }: StatusCellProps) {
  const getStatusConfig = (status: string) => {
    switch (status) {
        case 'actionPlan':
        return {
            label: 'Action Plan',
            bg: '#5850EC',
            color: 'white',
            icon: <CircleTick boxSize="14px" data-id="001308" data-testid="circle-tick-icon" />,
        };
      case 'inReview':
        return {
          label: 'In Review',
          colorScheme: 'orange',
          bg: '#F97316',
          color: 'white',
          icon: <InReviewIcon boxSize="14px" data-id="001309" data-testid="in-review-icon" />,
        };
      case 'completed':
        return {
          label: 'Completed',
          bg: '#00A650',
          color: 'white',
          icon: <CircleTick boxSize="14px" data-id="001310" data-testid="circle-tick-icon" />,
        };
      case 'missed':
        return {
          label: 'Missed',
          colorScheme: 'red',
          bg: 'red.500',
          color: 'white',
          icon: null,
        };
      case 'open':
        return {
          label: 'Open',
          colorScheme: 'red',
          bg: '#00A650',
          color: 'white',
          icon: null,
        };
      case 'upcoming':
        return {
          label: 'Upcoming',
          colorScheme: 'yellow',
          bg: 'yellow.500',
          color: 'white',
          icon: null,
        };
      case 'inProgress':
        return {
          label: 'In Progress',
          bg: '#0073E6',
          color: 'white',
          icon: <InProgress boxSize="14px" data-id="001311" data-testid="in-progress-icon" />,
        };
      case 'notStarted':
        return {
            label: 'Not started',
            bg: '#A0AEC0',
            color: 'white',
            icon: <HourGlassIcon boxSize="14px" data-id="001312" data-testid="hourglass-icon" />,
        };
      default:
        return {
          label: status,
          colorScheme: 'white',
          bg: 'gray.500',
          color: 'white',
          icon: null,
        };
    }
  };

  const config = getStatusConfig(status);
  
  const sizeProps = {
    sm: { px: 2, fontSize: '10px', gap: 1, height: '18px' },
    md: { px: 3, fontSize: '12px', gap: 1, height: '22px' },
    lg: { px: 4, fontSize: '14px', gap: 2, height: '30px' },
  };

  return (
    <Box
      alignItems="center"
      bg={config.bg}
      borderRadius="full"
      data-id="001313"
      display="inline-flex"
      gap={sizeProps[size].gap}
      height={sizeProps[size].height}
      justifyContent="center"
      minW="fit-content"
      px={sizeProps[size].px}>
      <Text
        color={config.color}
        data-id="001314"
        fontSize={sizeProps[size].fontSize}
        fontWeight="bold"
        letterSpacing="0.36px"
        lineHeight="normal"
        textTransform="uppercase"
        whiteSpace="nowrap">
        {config.label}
      </Text>
      {config.icon && (
        <Flex color={config.color} data-id="001315">
          {config.icon}
        </Flex>
      )}
    </Box>
  );
}

export default StatusCell;
