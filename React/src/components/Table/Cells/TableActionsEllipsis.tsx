import React from 'react';

import { Flex } from '@chakra-ui/react';

import EllipsisMenu, { EllipsisMenuOption } from '../../EllipsisMenu';

interface TableActionsEllipsisProps {
  readonly options: readonly EllipsisMenuOption[];
  readonly 'data-id'?: string;
}

function TableActionsEllipsis({ options, 'data-id': dataId = '000239' }: TableActionsEllipsisProps) {
  return (
    <Flex data-id={dataId} justify="flex-end" pr="8px" w="full">
      <EllipsisMenu
        data-id="000600"
        options={options}
      />
    </Flex>
  );
}

export default TableActionsEllipsis;
