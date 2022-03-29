import { useState } from 'react';

import { Box, Flex, Text } from '@chakra-ui/react';

import * as Icons from '../../icons';
import QuestionAdditionalButton from './QuestionAdditionalButton';

const QuestionAdditionalInformation = () => {
  const [activeInformation, setActiveInformation] = useState('Actions');
  return (
    <Box>
      <Text fontSize="16px" fontWeight="400">
        Provide additional information or actions
      </Text>
      <br />
      <Flex alignItems="center">
        <QuestionAdditionalButton
          activeInformation={activeInformation}
          icon={Icons.HealthKitIcon}
          label="Actions"
          requiredIcon={Icons.RequiredIcon}
          setActiveInformation={setActiveInformation}
        />
        <QuestionAdditionalButton
          activeInformation={activeInformation}
          icon={Icons.AttachmentIcon}
          label="Attachments"
          setActiveInformation={setActiveInformation}
        />
        <QuestionAdditionalButton
          activeInformation={activeInformation}
          icon={Icons.DetailIcon}
          label="More detail"
          setActiveInformation={setActiveInformation}
        />
      </Flex>
    </Box>
  );
};

export default QuestionAdditionalInformation;
