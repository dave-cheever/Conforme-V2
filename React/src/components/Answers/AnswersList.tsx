import { Box, Flex } from '@chakra-ui/react';
import { t } from 'i18next';
import { capitalize } from 'lodash';

import { IAnswer } from '../../interfaces/IAnswer';
import AdminTableHeader from '../Admin/AdminTableHeader';
import AdminTableHeaderElement from '../Admin/AdminTableHeaderElement';
import AnswersListItem from './AnswersListItem';

function AnswersList({
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
}) {
  return <Box data-id="2bbf3cb51d71" h="full" overflow="none" w="full">
    <Box
      bg="answersList.bg"
      borderRadius="20px"
      data-id="9ed6a0796976"
      h="full"
      w="full">
      <AdminTableHeader data-id="8d072756422b">
        <AdminTableHeaderElement
          data-id="94ec98491bcc"
          label="Type"
          onClick={() => {
            setSortType('question.questionsCategory.name');
            setSortOrder(sortOrder === 'asc' && sortType === 'question.questionsCategory.name' ? 'desc' : 'asc');
          }}
          showSortingIcon={sortType === 'question.questionsCategory.name'}
          sortOrder={sortType === 'question.questionsCategory.name' ? sortOrder : undefined}
          w="10%" />
        <AdminTableHeaderElement
          data-id="7a4b568177c5"
          label="Description"
          onClick={() => {
            setSortType('question.question');
            setSortOrder(sortOrder === 'asc' && sortType === 'question.question' ? 'desc' : 'asc');
          }}
          showSortingIcon={sortType === 'question.question'}
          sortOrder={sortType === 'question.question' ? sortOrder : undefined}
          w="15%" />
        <AdminTableHeaderElement
          data-id="6cedd262ce53"
          label="Status"
          onClick={() => {
            setSortType('status');
            setSortOrder(sortOrder === 'asc' && sortType === 'status' ? 'desc' : 'asc');
          }}
          showSortingIcon={sortType === 'status'}
          sortOrder={sortType === 'status' ? sortOrder : undefined}
          w="6%" />
        <AdminTableHeaderElement
          data-id="f0e89569202e"
          label={capitalize(t('location'))}
          onClick={() => {
            setSortType('audit.location.name');
            setSortOrder(sortOrder === 'asc' && sortType === 'audit.location.name' ? 'desc' : 'asc');
          }}
          showSortingIcon={sortType === 'audit.location.name'}
          sortOrder={sortType === 'audit.location.name' ? sortOrder : undefined}
          w="19%" />
        <AdminTableHeaderElement
          data-id="ba5ec43859af"
          label={capitalize(t('business unit'))}
          onClick={() => {
            setSortType('businessUnit.name');
            setSortOrder(sortOrder === 'asc' && sortType === 'businessUnit.name' ? 'desc' : 'asc');
          }}
          showSortingIcon={sortType === 'businessUnit.name'}
          sortOrder={sortType === 'businessUnit.name' ? sortOrder : undefined}
          w="19%" />
        <AdminTableHeaderElement
          data-id="a55eb24ed040"
          label="# of actions"
          onClick={() => {
            setSortType('actions.length');
            setSortOrder(sortOrder === 'asc' && sortType === 'actions.length' ? 'desc' : 'asc');
          }}
          showSortingIcon={sortType === 'actions.length'}
          sortOrder={sortType === 'actions.length' ? sortOrder : undefined}
          w="5%" />
        <AdminTableHeaderElement
          data-id="bc9b5240b005"
          label="Added by"
          onClick={() => {
            setSortType('addedBy.displayName');
            setSortOrder(sortOrder === 'asc' && sortType === 'addedBy.displayName' ? 'desc' : 'asc');
          }}
          showSortingIcon={sortType === 'addedBy.displayName'}
          sortOrder={sortType === 'addedBy.displayName' ? sortOrder : undefined}
          w="12%" />
        <AdminTableHeaderElement
          data-id="ad5ff6c327a4"
          label="Date added"
          onClick={() => {
            setSortType('metatags.addedAt');
            setSortOrder(sortOrder === 'asc' && sortType === 'metatags.addedAt' ? 'desc' : 'asc');
          }}
          showSortingIcon={sortType === 'metatags.addedAt'}
          sortOrder={sortType === 'metatags.addedAt' ? sortOrder : undefined}
          w="8%" />
      </AdminTableHeader>
      <Flex
        data-id="542f9fc2b876"
        flexDir="column"
        h={['full', 'calc(100vh - 295px)', 'calc(100vh - 293px)']}
        overflowY="auto"
        w="full">
        {answers?.map((answer) => (
          <AnswersListItem
            answer={answer}
            data-id="ecf11473c1b0"
            editAnswer={editAnswer}
            key={answer._id}
            refetchAnswers={refetchAnswers} />
        ))}
      </Flex>
    </Box>
  </Box>
}

export default AnswersList;

export const answersListStyles = {
  answersList: {
    bg: 'white',
    headerBorderColor: '#F0F0F0',
    iconColor: '#282F36',
    open: '#282F36',
    closed: '#282F36',
  },
};
