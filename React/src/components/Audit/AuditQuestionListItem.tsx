import { EditIcon } from '@chakra-ui/icons';
import { Flex, HStack, Spacer, Stack, Text } from '@chakra-ui/react';
import { capitalize } from 'lodash';
import pluralize from 'pluralize';

import { useAppContext } from '../../contexts/AppProvider';
import { TQuestionWithAnswer, useAuditContext } from '../../contexts/AuditProvider';
import useDevice from '../../hooks/useDevice';
import { ActionsIcon, AreaInfoIcon, Eye, Trashcan } from '../../icons';
import Can, { isPermitted } from '../can';
import DocumentThumbnail from '../Documents/DocumentThumbnail';

function AuditQuestionListItem({ question, handleDelete }: { question: TQuestionWithAnswer; handleDelete: () => void }) {
  const { user } = useAppContext();
  const { audit, setSelectedQuestion } = useAuditContext();
  const numberOfActions = (question?.answer?.actions || []).length;
  const isUserPermittedToModify = isPermitted({ user, action: 'audits.edit', data: { audit } });
  const device = useDevice();
  return (
    (<HStack
      bgColor="auditItem.listItem.bg"
      data-id="ed300c529993"
      h="90px"
      key={question._id}
      onClick={device === 'mobile' ? () => setSelectedQuestion(question) : () => { }}
      p={4}
      rounded="10px">
      <Stack data-id="0ce5d2360e07" flexGrow={1} spacing={2}>
        {audit?.auditType?.businessUnitScope === 'answer' && (
          <HStack data-id="071edf37fcb9" spacing={1}>
            <AreaInfoIcon
              data-id="461730d921a8"
              fill="transparent"
              stroke="auditItem.listItem.action.icon" />
            <Text
              color="auditItem.listItem.action.color"
              data-id="5144bb38d4c9"
              fontSize="ssm">
              {capitalize(question.answer?.businessUnit?.name)}
            </Text>
          </HStack>
        )}
        <Text data-id="15c6b8530b9c" fontSize="smm" noOfLines={1}>
          {question.question}
        </Text>
        <HStack data-id="916400bd1c5d" spacing={6}>
          {question.questionsCategory?.useStatus && (
            <Text
              color="auditItem.listItem.action.color"
              data-id="f1a31ffff02d"
              fontSize="ssm">
              {capitalize(question.answer?.status)}
            </Text>
          )}
          <HStack data-id="d94875dd6091" spacing={1}>
            <ActionsIcon
              data-id="249d23ebdb2e"
              fill="transparent"
              stroke="auditItem.listItem.action.icon" />
            <Text
              color="auditItem.listItem.action.color"
              data-id="7ea51b411fd3"
              fontSize="ssm">
              {numberOfActions} {pluralize('Action', numberOfActions)}
            </Text>
          </HStack>
        </HStack>
      </Stack>
      <HStack data-id="1fcba778ccc1" spacing={2}>
        {(question.answer?.attachments || []).length >= 1 && (
          <DocumentThumbnail
            data-id="adc0b86ea89c"
            document={question.answer!.attachments![0]}
            key={question.answer!.attachments![0]?.id} />
        )}
        {(question.answer?.attachments || []).length - 1 > 1 && (
          <Flex
            align="center"
            border="1px solid"
            borderColor="documentUploaded.border"
            cursor="default"
            data-id="306a7247b14e"
            h="55px"
            justify="center"
            rounded="3px"
            w="55px">
            +{(question.answer?.attachments || []).length - 1}
          </Flex>
        )}
      </HStack>
      {audit.status === 'upcoming' && isUserPermittedToModify && (
        <Stack data-id="4772b6ab3c88">
          <EditIcon
            cursor="pointer"
            data-id="7ae59620536f"
            onClick={() => setSelectedQuestion(question)}
            stroke="auditItem.listItem.editIcon" />
          <Can
            action="answers.delete"
            data={{ answer: question?.answer, audit }}
            data-id="4478d598c2a7"
            // eslint-disable-next-line react/no-unstable-nested-components
            yes={() => (
              <>
                <Spacer data-id="37e9e938549a" />
                <Trashcan
                  cursor="pointer"
                  data-id="4ced520a3c1b"
                  onClick={() => {
                    setSelectedQuestion(question);
                    handleDelete();
                  }}
                  stroke="auditItem.listItem.deleteIcon" />
              </>
            )} />
        </Stack>
      )}
      {(audit.status !== 'upcoming' || !isUserPermittedToModify) && (
        <Stack data-id="459a8f73dbbc">
          <Eye
            cursor="pointer"
            data-id="7f7c21e948fb"
            onClick={() => setSelectedQuestion(question)}
            stroke="auditItem.listItem.editIcon" />
        </Stack>
      )}
    </HStack>)
  );
}

export default AuditQuestionListItem;
