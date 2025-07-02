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
  return (<Flex
    alignItems="center"
    cursor="pointer"
    data-id="43a1f6d144cf"
    ml={ml || '0'}
    onClick={onClick}
    w={w}>
    <Tooltip
      data-id="8a0727b40673"
      hasArrow
      isDisabled={tooltip === ''}
      label={tooltip}>
      <Text color="adminTableHeaderElement.fontColor" data-id="a3595b917e58" fontSize={['12px', '12.4px']} fontWeight="600">{label}</Text>
      </Tooltip>
      {!hideSortIcon && (
        <>
          {sortOrder === 'desc' ? (
            <ArrowDownIcon
              color={showSortingIcon ? 'adminTableHeaderElement.colorEnabled' : 'adminTableHeaderElement.colorDisabled'}
              ml="3px"
              opacity={sortOrder ? 1 : 0.3} // Fade if undefined
            />
          ) : (
            <ArrowUpIcon
              color={showSortingIcon ? 'adminTableHeaderElement.colorEnabled' : 'adminTableHeaderElement.colorDisabled'}
              ml="3px"
              opacity={sortOrder ? 1 : 0.3} // Fade if undefined
            />
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
