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
    data-id="8bf275ad28ad"
    justifyContent={color !== 'white' ? 'center' : undefined}
    ml={ml || '0'}
    onClick={onClick}
    pl={pl || 0}
    px={3}
    // Disable sorting props to enforce no left padding on first table column
    // eslint-disable-next-line react/jsx-sort-props
    py={1}
    rounded="md">
    <Tooltip
      data-id="cac442f58058"
      hasArrow
      isDisabled={tooltip === ''}
      label={tooltip}>
      <Text color={color !== 'white' ? 'white' : '#787486'} data-id="ccd172ca9e99">{label}</Text>
    </Tooltip>
    {sortOrder && (
      <>
        {sortOrder === 'desc' ? (
          <ArrowDownIcon
            color={showSortingIcon ? (color !== 'white' ? 'white' : '#787486') : color}
            data-id="ecf19fdd4fd5"
            ml="5px" />
        ) : (
          <ArrowUpIcon
            color={showSortingIcon ? (color !== 'white' ? 'white' : '#787486') : color}
            data-id="755a314f55c5"
            ml="5px" />
        )}
      </>
    )}
  </Flex>
);

export default InsightsDetailedTableHeaderElement;
