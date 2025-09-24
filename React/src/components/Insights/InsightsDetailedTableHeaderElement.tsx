import { Flex, Text, Tooltip } from '@chakra-ui/react';

import { ArrowDownIcon, ArrowUpIcon } from '../../icons';

function InsightsDetailedTableHeaderElement({
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
}) {
  return (
    <Flex
      data-id="000522"
      alignItems="center"
      bg={color}
      cursor="pointer"
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
        data-id="000523"
        hasArrow
        isDisabled={tooltip === ''}
        label={tooltip}>
        <Text data-id="000524" color={color !== 'white' ? 'white' : '#787486'}>{label}</Text>
      </Tooltip>
      {sortOrder && (
        sortOrder === 'desc' ? (
          <ArrowDownIcon
            data-id="000525"
            color={showSortingIcon ? (color !== 'white' ? 'white' : '#787486') : color}
            ml="5px" />
        ) : (
          <ArrowUpIcon
            data-id="000526"
            color={showSortingIcon ? (color !== 'white' ? 'white' : '#787486') : color}
            ml="5px" />
        )
      )}
    </Flex>
  );
}

export default InsightsDetailedTableHeaderElement;
