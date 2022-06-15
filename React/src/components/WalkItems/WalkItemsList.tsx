import { gql, useQuery } from '@apollo/client';
import { Box, Flex } from '@chakra-ui/react';
import { t } from 'i18next';
import { capitalize } from 'lodash';

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
  sortOrder,
  sortType,
  setSortType,
  setSortOrder,
  refetchAnswers,
}: {
  answers: IAnswer[];
  sortOrder: 'asc' | 'desc';
  sortType: string;
  setSortType: (key: string) => void;
  setSortOrder: (order: 'asc' | 'desc') => void;
  refetchAnswers: () => void;
}) => {
  const { data } = useQuery(GET_AUDITS);

  return (
    <Box h="full" ml="10px" overflow="none" p={[0, 1]} w="full">
      <Box bg="walkItemsList.bg" borderRadius="20px" h="fit-content" mb={7} minH="full" pb={7} w="full">
        <AdminTableHeader>
          <AdminTableHeaderElement
            label="Type"
            onClick={() => {
              setSortType('question.questionsCategory.name');
              setSortOrder(sortOrder === 'asc' && sortType === 'question.questionsCategory.name' ? 'desc' : 'asc');
            }}
            showSortingIcon={sortType === 'question.questionsCategory.name'}
            sortOrder={sortType === 'question.questionsCategory.name' ? sortOrder : undefined}
            w="20%"
          />
          <AdminTableHeaderElement
            label="Description"
            onClick={() => {
              setSortType('question.question');
              setSortOrder(sortOrder === 'asc' && sortType === 'question.question' ? 'desc' : 'asc');
            }}
            showSortingIcon={sortType === 'question.question'}
            sortOrder={sortType === 'question.question' ? sortOrder : undefined}
            w="25%"
          />
          <AdminTableHeaderElement
            label={capitalize(t('area'))}
            onClick={() => {
              setSortType('audit.area.name');
              setSortOrder(sortOrder === 'asc' && sortType === 'audit.area.name' ? 'desc' : 'asc');
            }}
            showSortingIcon={sortType === 'audit.area.name'}
            sortOrder={sortType === 'audit.area.name' ? sortOrder : undefined}
            w="15%"
          />
          <AdminTableHeaderElement
            label="# of actions"
            onClick={() => {
              setSortType('actions.length');
              setSortOrder(sortOrder === 'asc' && sortType === 'actions.length' ? 'desc' : 'asc');
            }}
            showSortingIcon={sortType === 'actions.length'}
            sortOrder={sortType === 'actions.length' ? sortOrder : undefined}
            w="15%"
          />
          <AdminTableHeaderElement
            label="Added by"
            onClick={() => {
              setSortType('addedBy.displayName');
              setSortOrder(sortOrder === 'asc' && sortType === 'addedBy.displayName' ? 'desc' : 'asc');
            }}
            showSortingIcon={sortType === 'addedBy.displayName'}
            sortOrder={sortType === 'addedBy.displayName' ? sortOrder : undefined}
            w="20%"
          />
          <AdminTableHeaderElement
            label="Date added"
            onClick={() => {
              setSortType('metatags.addedAt');
              setSortOrder(sortOrder === 'asc' && sortType === 'metatags.addedAt' ? 'desc' : 'asc');
            }}
            showSortingIcon={sortType === 'metatags.addedAt'}
            sortOrder={sortType === 'metatags.addedAt' ? sortOrder : undefined}
            w="20%"
          />
        </AdminTableHeader>
        <Flex flexDir="column" h={['full', 'calc(100vh - 340px)', 'calc(100vh - 325px)']} overflowY="auto" w="full">
          {answers?.map((answer) => (
            <WalkItemsListItem
              answer={answer}
              audit={data?.audits?.find((audit) => audit._id === answer?.scope?._id)}
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
