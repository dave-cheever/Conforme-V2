import { Flex, Text, Tooltip } from '@chakra-ui/react';

import { ArrowDownIcon, ArrowUpIcon } from '../../icons';

function AdminTableHeaderElement({
  hideSortIcon,
  w,
  ml,
  label,
  onClick,
  sortOrder,
  showSortingIcon,
  tooltip = '',
}: {
  hideSortIcon?: boolean;
  w: any;
  ml?: string;
  label: React.ReactNode;
  onClick?;
  sortOrder?: 'asc' | 'desc';
  showSortingIcon?: boolean;
  tooltip?: string;
}) {
  return (
    <Flex alignItems="center" data-id="000338" ml={ml || '0'} w={w}>
      <Tooltip data-id="000339" hasArrow isDisabled={tooltip === ''} label={tooltip}>
        <Text color="adminTableHeaderElement.fontColor" data-id="000340" fontSize={['12px', '12.4px']} fontWeight="600">
          {label}
        </Text>
      </Tooltip>
      {!hideSortIcon && (
        <Flex cursor="pointer" data-id="001206" onClick={onClick}>
          {sortOrder === 'desc' ? (
            <ArrowDownIcon
              color={showSortingIcon ? 'adminTableHeaderElement.colorEnabled' : 'adminTableHeaderElement.colorDisabled'}
              data-id="000341"
              ml="3px"
              opacity={sortOrder ? 1 : 0.3}
            />
          ) : (
            <ArrowUpIcon
              color={showSortingIcon ? 'adminTableHeaderElement.colorEnabled' : 'adminTableHeaderElement.colorDisabled'}
              data-id="000342"
              ml="3px"
              opacity={sortOrder ? 1 : 0.3}
            />
          )}
        </Flex>
      )}
    </Flex>
  );
}

export default AdminTableHeaderElement;

export const adminTableHeaderElementStyles = {
  adminTableHeaderElement: {
    colorEnabled: '#282F36',
    colorDisabled: '#282F36',
    fontColor: '#282F36',
  },
};
