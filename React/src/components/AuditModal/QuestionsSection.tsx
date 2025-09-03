import React, { useEffect, useState } from 'react';

import { Box, Button, ButtonGroup, VStack } from '@chakra-ui/react';

import { groupQuestionsByCategory, groupQuestionsByKLOE, IGroupQuestion } from '../../interfaces/IGroupQuestion';
import QuestionAdditionalInformation from './QuestionAdditionalInformation';
import QuestionGroup from './QuestionGroup';

const arrowPointerActiveStyle = {
  content: `''`,
  position: 'absolute',
  width: 0,
  height: 0,
  left: 0,
  right: 0,
  bottom: '-8px',
  margin: 'auto',
  borderTop: '11px solid',
  borderTopColor: 'navigationTop.addButton',
  borderLeft: '9.5px solid transparent',
  borderRight: '9.5px solid transparent',
  transitionProperty: 'all',
  transitionDuration: 'var(--chakra-transition-duration-normal)',
};

const arrowPointerStyle = {
  content: `''`,
  position: 'absolute',
  width: 0,
  height: 0,
  left: 0,
  right: 0,
  bottom: '0',
  margin: 'auto',
  borderTop: '0 solid',
  borderTopColor: 'navigationTop.addButton',
  borderLeft: '0 solid transparent',
  borderRight: '0 solid transparent',
};

function QuestionsSection() {
  const [questionGroups, setQuestionGroups] = useState<IGroupQuestion[]>([]);
  const [expandedItem, setExpandedItem] = useState<string>('');
  const [selectedGroup, setSelectedGroup] = useState<'category' | 'kloe'>('category');
  useEffect(() => {
    setQuestionGroups(() => (selectedGroup === 'category' ? groupQuestionsByCategory : groupQuestionsByKLOE));
  }, [selectedGroup]);
  return (
    <Box data-id="030925-e4ee66">
      <ButtonGroup data-id="030925-c4cd97" pr={2} spacing={2.5}>
        <Button
          data-id="030925-681b2c"
          _after={selectedGroup === 'category' ? arrowPointerActiveStyle : arrowPointerStyle}
          borderRadius="10px"
          color={selectedGroup === 'category' ? 'white' : 'auditModal.menu.active.text'}
          colorScheme={selectedGroup === 'category' ? 'auditModal.questionGroup.activeButton' : 'auditModal.questionGroup.nonActiveButton'}
          fontSize="14px"
          h="36px"
          onClick={() => setSelectedGroup('category')}
          w="130px">
          By Category
        </Button>
        <Button
          data-id="030925-c1b7e9"
          _after={selectedGroup === 'kloe' ? arrowPointerActiveStyle : arrowPointerStyle}
          borderRadius="10px"
          color={selectedGroup === 'kloe' ? 'white' : 'auditModal.menu.active.text'}
          colorScheme={selectedGroup === 'kloe' ? 'auditModal.questionGroup.activeButton' : 'auditModal.questionGroup.nonActiveButton'}
          fontSize="14px"
          h="36px"
          onClick={() => setSelectedGroup('kloe')}
          w="130px">
          By KLOE
        </Button>
      </ButtonGroup>
      <VStack
        data-id="030925-f1dd55"
        maxH="calc(100% - 40px)"
        mt={4}
        overflow="auto"
        pr={2}
        spacing={2}
        w="full">
        {questionGroups.map((item) => (
          <QuestionGroup
            data-id="030925-28eb76"
            isExpanded={item.id === expandedItem}
            key={item.id}
            questionGroupItem={item}
            setExpandedItem={setExpandedItem} />
        ))}
      </VStack>
      <br data-id="030925-c2697e" />
      <QuestionAdditionalInformation data-id="030925-6bfc9e" />
    </Box>
  );
}

export default QuestionsSection;
