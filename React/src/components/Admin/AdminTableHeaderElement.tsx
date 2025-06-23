import { Flex, Text, Tooltip } from '@chakra-ui/react';

function AdminTableHeaderElement({
  w,
  ml,
  label,
  onClick,
  // sortOrder,
  // showSortingIcon,
  tooltip = '',
}: {
  w: any;
  ml?: string;
  label: React.ReactNode;
  onClick?;
  sortOrder?: 'asc' | 'desc';
  showSortingIcon?: boolean;
  tooltip?: string;
}) {
  return <Flex
    alignItems="center"
    cursor="pointer"
    data-id="43a1f6d144cf"
    ml={ml || '0'}
    onClick={onClick}
    w={w}
    >
    <Tooltip
      data-id="8a0727b40673"
      hasArrow
      isDisabled={tooltip === ''}
      label={tooltip}>
      <Text color="adminTableHeaderElement.fontColor" data-id="a3595b917e58" fontSize="14px" fontWeight="600">{label}</Text>
    </Tooltip>
    {/* {sortOrder !== null && sortOrder === 'desc' ? (
      <ArrowDownIcon
        color={showSortingIcon ? 'adminTableHeaderElement.colorEnabled' : 'adminTableHeaderElement.colorDisabled'}
        data-id="cea3277599b1"
        ml="10px" />
    ) : (
      <ArrowUpIcon
        color={showSortingIcon ? 'adminTableHeaderElement.colorEnabled' : 'adminTableHeaderElement.colorDisabled'}
        data-id="548de9ca958f"
        ml="10px" />
    )} */}
  </Flex>
}

export default AdminTableHeaderElement;

export const adminTableHeaderElementStyles = {
  adminTableHeaderElement: {
    colorEnabled: '#282F36',
    colorDisabled: '#282F36',
    fontColor: '#282F36',
  },
};
