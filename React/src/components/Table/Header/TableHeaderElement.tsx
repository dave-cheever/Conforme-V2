import { Flex, Text, Tooltip } from '@chakra-ui/react';

import { ArrowDownIcon, ArrowUpIcon } from '../../../icons'; 

function TableHeaderElement({
  w,
  ml,
  label,
  onClick,
  sortOrder,
  showSortingIcon,
  tooltip = '',
}: {
  readonly w: any;
  readonly ml?: string;
  readonly label: React.ReactNode;
  readonly onClick?: () => void;
  readonly sortOrder?: 'asc' | 'desc';
  readonly showSortingIcon?: boolean;
  readonly tooltip?: string;
}) {
  return (
    <Flex
      alignItems="center"
      bg={sortOrder ? "#E2E8F0" : "header.bg"}
      cursor={onClick ? "pointer" : "default"}
      data-id="000338"
      ml={ml || '0'}
      onClick={onClick}
      px={4}
      py="10px"
      w={w}
    >
      <Tooltip
        closeDelay={0}
        data-id="000339"
        hasArrow
        isDisabled={tooltip === ''}
        label={tooltip}
        openDelay={300}
        placement="top">
        <Text color="listView.header.fontColor" data-id="000340" fontSize={"14px"} fontWeight="600">{label}</Text>
      </Tooltip>
          {sortOrder === 'desc' ? (
            <ArrowDownIcon
              color={showSortingIcon ? 'listView.header.arrowColorEnabled' : 'listView.header.arrowColorDisabled'}
              data-id="000341"
              display={sortOrder ? "flex" : "none"}
              ml="6px"
            />
          ) : (
            <ArrowUpIcon
              color={showSortingIcon ? 'listView.header.arrowColorEnabled' : 'listView.header.arrowColorDisabled'}
              data-id="000342"
              display={sortOrder ? "flex" : "none"}
              ml="6px"
            />
          )}
    </Flex>
  );
}

export default TableHeaderElement;
