import { Box, Flex } from '@chakra-ui/react';
import { t } from 'i18next';
import { capitalize } from 'lodash';

import { IAnswer } from '../../interfaces/IAnswer';
import AdminTableHeader from '../Admin/AdminTableHeader';
import AdminTableHeaderElement from '../Admin/AdminTableHeaderElement';
import WalkItemsListItem from './WalkItemsListItem';

const WalkItemsList = ({
  answers,
  sortOrder,
  sortType,
  setSortType,
  setSortOrder,
  refetchAnswers,
  editAnswer,
}: {
  answers: IAnswer[];
  sortOrder: 'asc' | 'desc';
  sortType: string;
  setSortType: (key: string) => void;
  setSortOrder: (order: 'asc' | 'desc') => void;
  refetchAnswers: () => void;
  editAnswer: (answer: IAnswer) => void;
}) => (
  <Box h="full" overflow="none" w="full">
    <Box bg="walkItemsList.bg" borderRadius="20px" h="full" w="full">
      <AdminTableHeader>
        <AdminTableHeaderElement
          label="Type"
          onClick={() => {
            setSortType('question.questionsCategory.name');
            setSortOrder(sortOrder === 'asc' && sortType === 'question.questionsCategory.name' ? 'desc' : 'asc');
          }}
          showSortingIcon={sortType === 'question.questionsCategory.name'}
          sortOrder={sortType === 'question.questionsCategory.name' ? sortOrder : undefined}
          w="10%"
        />
        <AdminTableHeaderElement
          label="Description"
          onClick={() => {
            setSortType('question.question');
            setSortOrder(sortOrder === 'asc' && sortType === 'question.question' ? 'desc' : 'asc');
          }}
          showSortingIcon={sortType === 'question.question'}
          sortOrder={sortType === 'question.question' ? sortOrder : undefined}
          w="15%"
        />
        <AdminTableHeaderElement
          label="Status"
          onClick={() => {
            setSortType('status');
            setSortOrder(sortOrder === 'asc' && sortType === 'status' ? 'desc' : 'asc');
          }}
          showSortingIcon={sortType === 'status'}
          sortOrder={sortType === 'status' ? sortOrder : undefined}
          w="6%"
        />
        <AdminTableHeaderElement
          label={capitalize(t('location'))}
          onClick={() => {
            setSortType('audit.location.name');
            setSortOrder(sortOrder === 'asc' && sortType === 'audit.location.name' ? 'desc' : 'asc');
          }}
          showSortingIcon={sortType === 'audit.location.name'}
          sortOrder={sortType === 'audit.location.name' ? sortOrder : undefined}
          w="19%"
        />
        <AdminTableHeaderElement
          label={capitalize(t('business unit'))}
          onClick={() => {
            setSortType('audit.businessUnit.name');
            setSortOrder(sortOrder === 'asc' && sortType === 'audit.businessUnit.name' ? 'desc' : 'asc');
          }}
          showSortingIcon={sortType === 'audit.businessUnit.name'}
          sortOrder={sortType === 'audit.businessUnit.name' ? sortOrder : undefined}
          w="19%"
        />
        <AdminTableHeaderElement
          label="# of actions"
          onClick={() => {
            setSortType('actions.length');
            setSortOrder(sortOrder === 'asc' && sortType === 'actions.length' ? 'desc' : 'asc');
          }}
          showSortingIcon={sortType === 'actions.length'}
          sortOrder={sortType === 'actions.length' ? sortOrder : undefined}
          w="5%"
        />
        <AdminTableHeaderElement
          label="Added by"
          onClick={() => {
            setSortType('addedBy.displayName');
            setSortOrder(sortOrder === 'asc' && sortType === 'addedBy.displayName' ? 'desc' : 'asc');
          }}
          showSortingIcon={sortType === 'addedBy.displayName'}
          sortOrder={sortType === 'addedBy.displayName' ? sortOrder : undefined}
          w="12%"
        />
        <AdminTableHeaderElement
          label="Date added"
          onClick={() => {
            setSortType('metatags.addedAt');
            setSortOrder(sortOrder === 'asc' && sortType === 'metatags.addedAt' ? 'desc' : 'asc');
          }}
          showSortingIcon={sortType === 'metatags.addedAt'}
          sortOrder={sortType === 'metatags.addedAt' ? sortOrder : undefined}
          w="8%"
        />
      </AdminTableHeader>
      <Flex flexDir="column" h={['full', 'calc(100vh - 295px)', 'calc(100vh - 293px)']} overflowY="auto" w="full">
        {answers?.map((answer) => (
          <WalkItemsListItem answer={answer} editAnswer={editAnswer} key={answer._id} refetchAnswers={refetchAnswers} />
        ))}
      </Flex>
    </Box>
  </Box>
);

export default WalkItemsList;

export const walkItemsListStyles = {
  walkItemsList: {
    bg: 'white',
    headerBorderColor: '#F0F0F0',
    iconColor: '#282F36',
    open: '#282F36',
    closed: '#282F36',
  },
};
