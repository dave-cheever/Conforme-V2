import { useState } from 'react';

import { Box, Flex, Text } from '@chakra-ui/react';

import * as Icons from '../../icons';
import QuestionAdditionalButton from './QuestionAdditionalButton';

function QuestionAdditionalInformation() {
  const [activeInformation, setActiveInformation] = useState('Actions');
  return (
    <Box data-id="000432">
      <Text data-id="000433" fontSize="16px" fontWeight="400">
        Provide additional information or actions
      </Text>
      <br data-id="000434" />
      <Flex data-id="000435" alignItems="center">
        <QuestionAdditionalButton
          data-id="000436"
          activeInformation={activeInformation}
          icon={Icons.HealthKitIcon}
          label="Actions"
          requiredIcon={Icons.RequiredIcon}
          setActiveInformation={setActiveInformation} />
        <QuestionAdditionalButton
          data-id="000437"
          activeInformation={activeInformation}
          icon={Icons.AttachmentIcon}
          label="Attachments"
          setActiveInformation={setActiveInformation} />
        <QuestionAdditionalButton
          data-id="000438"
          activeInformation={activeInformation}
          icon={Icons.DetailIcon}
          label="More detail"
          setActiveInformation={setActiveInformation} />
      </Flex>
    </Box>
  );
}

export default QuestionAdditionalInformation;
