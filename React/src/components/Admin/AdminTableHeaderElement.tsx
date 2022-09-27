import { Flex, Text, Tooltip } from '@chakra-ui/react';

import { ArrowDownIcon, ArrowUpIcon } from '../../icons';

const AdminTableHeaderElement = ({
  w,
  ml,
  label,
  onClick,
  sortOrder,
  showSortingIcon,
  tooltip = '',
}: {
  w: any;
  ml?: string;
  label: string;
  onClick?;
  sortOrder?: 'asc' | 'desc';
  showSortingIcon?: boolean;
  tooltip?: string;
}) => (
  <Flex alignItems="center" cursor="pointer" ml={ml || '0'} onClick={onClick} w={w}>
    <Tooltip hasArrow isDisabled={tooltip === ''} label={tooltip}>
      <Text color="adminTableHeaderElement.fontColor">{label}</Text>
    </Tooltip>
    {sortOrder !== null && sortOrder === 'desc' ? (
      <ArrowDownIcon color={showSortingIcon ? 'adminTableHeaderElement.colorEnabled' : 'adminTableHeaderElement.colorDisabled'} ml="10px" />
    ) : (
      <ArrowUpIcon color={showSortingIcon ? 'adminTableHeaderElement.colorEnabled' : 'adminTableHeaderElement.colorDisabled'} ml="10px" />
    )}
  </Flex>
);

export default AdminTableHeaderElement;

export const adminTableHeaderElementStyles = {
  adminTableHeaderElement: {
    colorEnabled: '#282F36',
    colorDisabled: '#FFFFFF',
    fontColor: '#818197',
  },
};
