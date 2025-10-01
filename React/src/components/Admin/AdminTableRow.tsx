import { Flex, Tooltip } from '@chakra-ui/react';

import { useAppContext } from '../../contexts/AppProvider';
import { useFiltersContext } from '../../contexts/FiltersProvider';
import useNavigate from '../../hooks/useNavigate';
import { ArrowCount } from '../../icons';
import { IBaseWithName } from '../../interfaces/IBaseWithName';

function AdminTableRow({
  element,
  responseToEdit,
  edit,
  index,
}: {
  element: IBaseWithName;
  responseToEdit: 'regulatoryBodiesIds' | 'categoriesIds';
  edit?: () => void;
  index: number;
}) {
  const { module } = useAppContext();
  const { navigateTo } = useNavigate();
  const { setResponseFiltersValue } = useFiltersContext();
  return (
    <Flex
         _hover={{ bg: '#F5F7FA' }}
        align="center"
        bg={index % 2 === 0 ? 'white' : 'gray.50'}
        borderBottom="1px solid"
        borderColor="adminTableHeader.border"
        color="adminTableRow.font"
        cursor="pointer"
        data-id="000343"
        flexShrink={0}
        flexWrap={['wrap', 'nowrap']}
        fontSize="smm"
        h="55px"
        key={element._id}
        onClick={edit}
        pl={2}
        w="full">
      <Flex
        align="center"
        cursor="pointer"
        data-id="000344"
        fontSize="14px"
        
        w={['70%', '50%']}>
        {element.name}
      </Flex>
      {module?.type === 'tracker' && (
        <Flex
          alignItems="center"
          data-id="000345"
          justifyContent={['flex-end', 'flex-start']}
          mt={['5px', '0']}
          pr={['21px', '0']}
          w={['20%', '50%']}>
          {element.trackerItemsResponsesCount || '0'}
          <Tooltip data-id="000346" fontSize="14px" label="Show Items">
            <ArrowCount
              cursor="pointer"
              data-id="000347"
              h="10px"
              ml="13px"
              onClick={() => {
                setResponseFiltersValue({ [responseToEdit]: [element._id] });
                navigateTo('/');
              }}
              stroke="#282F36"
              w="10px" />
          </Tooltip>
        </Flex>
      )}
    </Flex>
  );
}
export default AdminTableRow;
