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
  return (
    <Box
      bg="auditsList.bg"
      border="1px solid"
      borderColor="auditsList.headerBorderColor"
      borderRadius="10px"
      data-id="000017"
      h="full"
      ml="10px"
      overflow="hidden"
      w="full"
    >
      <Box bg="auditsList.bg" data-id="000018" h="full" w="full" >
        <AdminTableHeader data-id="000019">
          <AdminTableHeaderElement
            data-id="000020"
            label="Type"
            onClick={() => {
              setSortType('question.questionsCategory.name');
              setSortOrder(sortOrder === 'asc' && sortType === 'question.questionsCategory.name' ? 'desc' : 'asc');
            }}
            showSortingIcon={sortType === 'question.questionsCategory.name'}
            sortOrder={sortType === 'question.questionsCategory.name' ? sortOrder : undefined}
            w="11%"
          />
          <AdminTableHeaderElement
            data-id="000021"
            label="Description"
            onClick={() => {
              setSortType('question.question');
              setSortOrder(sortOrder === 'asc' && sortType === 'question.question' ? 'desc' : 'asc');
            }}
            showSortingIcon={sortType === 'question.question'}
            sortOrder={sortType === 'question.question' ? sortOrder : undefined}
            w="13%"
          />
          <AdminTableHeaderElement
            data-id="000022"
            label="Status"
            onClick={() => {
              setSortType('status');
              setSortOrder(sortOrder === 'asc' && sortType === 'status' ? 'desc' : 'asc');
            }}
            showSortingIcon={sortType === 'status'}
            sortOrder={sortType === 'status' ? sortOrder : undefined}
            w="7%"
          />
          <AdminTableHeaderElement
            data-id="000023"
            label={capitalize(t('location'))}
            onClick={() => {
              setSortType('audit.location.name');
              setSortOrder(sortOrder === 'asc' && sortType === 'audit.location.name' ? 'desc' : 'asc');
            }}
            showSortingIcon={sortType === 'audit.location.name'}
            sortOrder={sortType === 'audit.location.name' ? sortOrder : undefined}
            w="14%"
          />
          <AdminTableHeaderElement
            data-id="000024"
            label={capitalize(t('business unit'))}
            onClick={() => {
              setSortType('businessUnit.name');
              setSortOrder(sortOrder === 'asc' && sortType === 'businessUnit.name' ? 'desc' : 'asc');
            }}
            showSortingIcon={sortType === 'businessUnit.name'}
            sortOrder={sortType === 'businessUnit.name' ? sortOrder : undefined}
            w="10%"
          />
          <AdminTableHeaderElement
            data-id="000025"
            label="# of actions"
            onClick={() => {
              setSortType('actions.length');
              setSortOrder(sortOrder === 'asc' && sortType === 'actions.length' ? 'desc' : 'asc');
            }}
            showSortingIcon={sortType === 'actions.length'}
            sortOrder={sortType === 'actions.length' ? sortOrder : undefined}
            w="10%"
          />
          <AdminTableHeaderElement
            data-id="000026"
            label="Added by"
            onClick={() => {
              setSortType('addedBy.displayName');
              setSortOrder(sortOrder === 'asc' && sortType === 'addedBy.displayName' ? 'desc' : 'asc');
            }}
            showSortingIcon={sortType === 'addedBy.displayName'}
            sortOrder={sortType === 'addedBy.displayName' ? sortOrder : undefined}
            w="18%"
          />
          <AdminTableHeaderElement
            data-id="000027"
            label="Date added"
            onClick={() => {
              setSortType('metatags.addedAt');
              setSortOrder(sortOrder === 'asc' && sortType === 'metatags.addedAt' ? 'desc' : 'asc');
            }}
            showSortingIcon={sortType === 'metatags.addedAt'}
            sortOrder={sortType === 'metatags.addedAt' ? sortOrder : undefined}
            w="10%"
          />
        </AdminTableHeader>
        <Flex data-id="000028" flexDir="column" h={['full', 'calc(100vh - 295px)', 'calc(100vh - 293px)']} overflowY="auto" w="full">
          {answers?.length > 0 ? (
            answers?.map((answer, idx) => (
              <AnswersListItem
                answer={answer}
                data-id="000029"
                editAnswer={editAnswer}
                index={idx}
                key={answer._id}
                refetchAnswers={refetchAnswers}
              />
            ))
          ) : (
            <Flex data-id="000030" fontSize="18px" fontStyle="italic" h="full" margin="auto" padding="10" textAlign="center" w="fit">
              No {t('question')}s found
            </Flex>
          )}
        </Flex>
      </Box>
    </Box>
  );
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
