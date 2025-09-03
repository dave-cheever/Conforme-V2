import { ArrowDownIcon, ArrowUpIcon } from '@chakra-ui/icons';
import { Flex, Text, Tooltip } from '@chakra-ui/react';

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
    <Flex
      data-id="030925-fbdb2b"
      alignItems="center"
      cursor="pointer"
      ml={ml || '0'}
      onClick={onClick}
      w={w}>
      <Tooltip
        data-id="030925-cf4092"
        hasArrow
        isDisabled={tooltip === ''}
        label={tooltip}>
        <Text data-id="030925-82a44e" color="adminTableHeaderElement.fontColor" fontSize={['12px', '12.4px']} fontWeight="600">{label}</Text>
        </Tooltip>
      {!hideSortIcon && (
        <>
          {sortOrder === 'desc' ? (
            <ArrowDownIcon
              data-id="030925-10d013"
              color={showSortingIcon ? 'adminTableHeaderElement.colorEnabled' : 'adminTableHeaderElement.colorDisabled'}
              ml="3px"
              // Fade if undefined
              opacity={sortOrder ? 1 : 0.3} />
          ) : (
            <ArrowUpIcon
              data-id="030925-d21226"
              color={showSortingIcon ? 'adminTableHeaderElement.colorEnabled' : 'adminTableHeaderElement.colorDisabled'}
              ml="3px"
              // Fade if undefined
              opacity={sortOrder ? 1 : 0.3} />
          )}
        </>
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
