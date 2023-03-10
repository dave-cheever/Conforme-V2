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

const QuestionsSection = () => {
  const [questionGroups, setQuestionGroups] = useState<IGroupQuestion[]>([]);
  const [expandedItem, setExpandedItem] = useState<string>('');
  const [selectedGroup, setSelectedGroup] = useState<'category' | 'kloe'>('category');
  useEffect(() => {
    setQuestionGroups(() => (selectedGroup === 'category' ? groupQuestionsByCategory : groupQuestionsByKLOE));
  }, [selectedGroup]);
  return (
    (<Box data-id="f190619c1740">
      <ButtonGroup data-id="a93a4648ee25" pr={2} spacing={2.5}>
        <Button
          _after={selectedGroup === 'category' ? arrowPointerActiveStyle : arrowPointerStyle}
          borderRadius="10px"
          color={selectedGroup === 'category' ? 'white' : 'auditModal.menu.active.text'}
          colorScheme={selectedGroup === 'category' ? 'auditModal.questionGroup.activeButton' : 'auditModal.questionGroup.nonActiveButton'}
          data-id="c9ec8ca4fbcb"
          fontSize="14px"
          h="36px"
          onClick={() => setSelectedGroup('category')}
          w="130px">
          By Category
        </Button>
        <Button
          _after={selectedGroup === 'kloe' ? arrowPointerActiveStyle : arrowPointerStyle}
          borderRadius="10px"
          color={selectedGroup === 'kloe' ? 'white' : 'auditModal.menu.active.text'}
          colorScheme={selectedGroup === 'kloe' ? 'auditModal.questionGroup.activeButton' : 'auditModal.questionGroup.nonActiveButton'}
          data-id="7fbe7fbdfe1d"
          fontSize="14px"
          h="36px"
          onClick={() => setSelectedGroup('kloe')}
          w="130px">
          By KLOE
        </Button>
      </ButtonGroup>
      <VStack
        data-id="14d71f93bd6b"
        maxH="calc(100% - 40px)"
        mt={4}
        overflow="auto"
        pr={2}
        spacing={2}
        w="full">
        {questionGroups.map((item) => (
          <QuestionGroup
            data-id="105fa21f7784"
            isExpanded={item.id === expandedItem}
            key={item.id}
            questionGroupItem={item}
            setExpandedItem={setExpandedItem} />
        ))}
      </VStack>
      <br data-id="75d30ab98ec8" />
      <QuestionAdditionalInformation data-id="e773c8e5b72a" />
    </Box>)
  );
};

export default QuestionsSection;
