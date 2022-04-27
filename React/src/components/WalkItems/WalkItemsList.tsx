import { gql, useQuery } from '@apollo/client';
import { Box, Flex } from '@chakra-ui/react';

import { IAnswer } from '../../interfaces/IAnswer';
import AdminTableHeader from '../Admin/AdminTableHeader';
import AdminTableHeaderElement from '../Admin/AdminTableHeaderElement';
import WalkItemsListItem from './WalkItemsListItem';

const GET_AUDITS = gql`
  query {
    audits {
      _id
      walkType
      areaId
      area {
        name
      }
      metatags {
        addedAt
      }
    }
  }
`;

const WalkItemsList = ({
  answers,
  refetchAnswers,
}: {
  answers: IAnswer[];
  refetchAnswers: () => void;
}) => {
  const { data } = useQuery(GET_AUDITS);

  return (
    <Box h="full" ml={['0px', '10px']} overflow="none" p={[0, 1]} w="full">
      <Box
        bg="walkItemsList.bg"
        borderRadius="20px"
        h="fit-content"
        mb={7}
        minH="full"
        pb={7}
        w="full"
      >
        <AdminTableHeader>
          <AdminTableHeaderElement label="Type" w="20%" />
          <AdminTableHeaderElement label="Description" w="25%" />
          <AdminTableHeaderElement label="Belongs to" w="15%" />
          <AdminTableHeaderElement label="# of actions" w="15%" />
          <AdminTableHeaderElement label="Added by" w="20%" />
          <AdminTableHeaderElement label="Added at" w="20%" />
        </AdminTableHeader>
        <Flex
          flexDir="column"
          h={['full', 'calc(100vh - 450px)', 'calc(100vh - 500px)']}
          overflowY="auto"
          w="full"
        >
          {answers?.map((answer) => (
            <WalkItemsListItem
              answer={answer}
              audit={data?.audits?.find(
                (audit) => audit._id === answer?.scope?._id,
              )}
              key={answer._id}
              refetchAnswers={refetchAnswers}
            />
          ))}
        </Flex>
      </Box>
    </Box>
  );
};

export default WalkItemsList;

export const walkItemsListStyles = {
  walkItemsList: {
    bg: 'white',
    headerBorderColor: '#F0F0F0',
    iconColor: '#282F36',
  },
};
