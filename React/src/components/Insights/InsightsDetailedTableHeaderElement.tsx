import { Flex, Text, Tooltip } from '@chakra-ui/react';

import { ArrowDownIcon, ArrowUpIcon } from '../../icons';

const InsightsDetailedTableHeaderElement = ({
  ml,
  pl,
  label,
  color = 'white',
  onClick,
  sortOrder,
  showSortingIcon,
  tooltip = '',
}: {
  ml?: string;
  pl?: string;
  label: string;
  color?: string;
  onClick?;
  sortOrder?: 'asc' | 'desc';
  showSortingIcon?: boolean;
  tooltip?: string;
}) => (
  <Flex
    alignItems="center"
    bg={color}
    cursor="pointer"
    justifyContent={color !== 'white' ? 'center' : undefined}
    ml={ml || '0'}
    onClick={onClick}
    px={3}
    py={1}
    // Disable sorting props to enforce no left padding on first table column
    // eslint-disable-next-line react/jsx-sort-props
    pl={pl || 0}
    rounded="md"
  >
    <Tooltip hasArrow isDisabled={tooltip === ''} label={tooltip}>
      <Text color={color !== 'white' ? 'white' : '#787486'}>{label}</Text>
    </Tooltip>
    {sortOrder && (
      <>
        {sortOrder === 'desc' ? (
          <ArrowDownIcon color={showSortingIcon ? (color !== 'white' ? 'white' : '#787486') : color} ml="5px" />
        ) : (
          <ArrowUpIcon color={showSortingIcon ? (color !== 'white' ? 'white' : '#787486') : color} ml="5px" />
        )}
      </>
    )}
  </Flex>
);

export default InsightsDetailedTableHeaderElement;
