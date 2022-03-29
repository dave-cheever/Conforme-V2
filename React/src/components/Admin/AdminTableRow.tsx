import { useHistory } from 'react-router-dom';

import { Flex, Tooltip } from '@chakra-ui/react';

import { useFiltersContext } from '../../contexts/FiltersProvider';
import { ArrowCount } from '../../icons';
import { IBaseWithName } from '../../interfaces/IBaseWithName';

const AdminTableRow = ({
  element,
  responseToEdit,
  edit,
}: {
  element: IBaseWithName;
  responseToEdit: 'regulatoryBodiesIds' | 'categoriesIds';
  edit?: () => void;
}) => {
  const history = useHistory();
  const { setResponseFiltersValue } = useFiltersContext();
  return (
    <Flex
      align="center"
      bg="adminTableRow.bg"
      borderBottom="1px solid"
      borderColor="adminTableHeader.border"
      color="adminTableRow.font"
      flexShrink={0}
      flexWrap={['wrap', 'nowrap']}
      fontSize="smm"
      h="60px"
      key={element._id}
      pl={5}
      w="full"
    >
      <Flex align="center" cursor="pointer" onClick={edit} w={['80%', '50%']}>
        {element.name}
      </Flex>
      <Flex
        alignItems="center"
        justifyContent={['flex-end', 'flex-start']}
        mt={['5px', '0']}
        pr={['21px', '0']}
        w={['20%', '50%']}
      >
        {element.complianceItemsResponsesCount || '0'}
        <Tooltip fontSize="md" label="Show Items">
          <ArrowCount
            cursor="pointer"
            h="10px"
            ml="13px"
            onClick={() => {
              setResponseFiltersValue({ [responseToEdit]: [element._id] });
              history.push('/');
            }}
            stroke="#282F36"
            w="10px"
          />
        </Tooltip>
      </Flex>
    </Flex>
  );
};
export default AdminTableRow;
