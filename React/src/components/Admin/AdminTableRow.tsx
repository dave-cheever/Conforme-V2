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
}: {
  element: IBaseWithName;
  responseToEdit: 'regulatoryBodiesIds' | 'categoriesIds';
  edit?: () => void;
}) {
  const { module } = useAppContext();
  const { navigateTo } = useNavigate();
  const { setResponseFiltersValue } = useFiltersContext();
  return (
    (<Flex
      align="center"
      borderBottom="1px solid"
      borderColor="adminTableHeader.border"
      color="adminTableRow.font"
      data-id="6b6c4b02bd5d"
      flexShrink={0}
      flexWrap={['wrap', 'nowrap']}
      fontSize="smm"
      h="60px"
      key={element._id}
      pl={5}
      sx={{
        '&:nth-of-type(even)': {
          bg: 'gray.50',
        },
        '&:nth-of-type(odd)': {
          bg: 'white',
        },
      }}
      w="full">
      <Flex

        align="center"
        cursor="pointer"
        data-id="9fdfe4d5bf9d"
        onClick={edit}
        w={['80%', '50%']}>
        {element.name}
      </Flex>
      {module?.type === 'tracker' && (
        <Flex
          alignItems="center"
          data-id="6e785fd9bd81"
          justifyContent={['flex-end', 'flex-start']}
          mt={['5px', '0']}
          pr={['21px', '0']}
          w={['20%', '50%']}>
          {element.trackerItemsResponsesCount || '0'}
          <Tooltip data-id="c9dd84cbb3c8" fontSize="md" label="Show Items">
            <ArrowCount
              cursor="pointer"
              data-id="c7cb46f24f79"
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
    </Flex>)
  );
}
export default AdminTableRow;
