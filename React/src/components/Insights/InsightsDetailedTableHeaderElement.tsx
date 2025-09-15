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
      alignItems="center"
      bg={color}
      cursor="pointer"
      data-id="030925-a33116"
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
        data-id="030925-8d64f6"
        hasArrow
        isDisabled={tooltip === ''}
        label={tooltip}>
        <Text color={color !== 'white' ? 'white' : '#787486'} data-id="030925-a15e9f">{label}</Text>
      </Tooltip>
      {sortOrder && (
        sortOrder === 'desc' ? (
          <ArrowDownIcon
            color={showSortingIcon ? (color !== 'white' ? 'white' : '#787486') : color}
            data-id="030925-f88dfa"
            ml="5px" />
        ) : (
          <ArrowUpIcon
            color={showSortingIcon ? (color !== 'white' ? 'white' : '#787486') : color}
            data-id="030925-9980ec"
            ml="5px" />
        )
      )}
    </Flex>
  );
}

export default InsightsDetailedTableHeaderElement;
