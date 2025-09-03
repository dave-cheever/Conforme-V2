import { useState } from 'react';

import { Box, Flex, Text } from '@chakra-ui/react';

import * as Icons from '../../icons';
import QuestionAdditionalButton from './QuestionAdditionalButton';

function QuestionAdditionalInformation() {
  const [activeInformation, setActiveInformation] = useState('Actions');
  return (
    <Box data-id="030925-664409">
      <Text data-id="030925-fde4e4" fontSize="16px" fontWeight="400">
        Provide additional information or actions
      </Text>
      <br data-id="030925-343729" />
      <Flex data-id="030925-54bd9d" alignItems="center">
        <QuestionAdditionalButton
          data-id="030925-ff689b"
          activeInformation={activeInformation}
          icon={Icons.HealthKitIcon}
          label="Actions"
          requiredIcon={Icons.RequiredIcon}
          setActiveInformation={setActiveInformation} />
        <QuestionAdditionalButton
          data-id="030925-4446ec"
          activeInformation={activeInformation}
          icon={Icons.AttachmentIcon}
          label="Attachments"
          setActiveInformation={setActiveInformation} />
        <QuestionAdditionalButton
          data-id="030925-388785"
          activeInformation={activeInformation}
          icon={Icons.DetailIcon}
          label="More detail"
          setActiveInformation={setActiveInformation} />
      </Flex>
    </Box>
  );
}

export default QuestionAdditionalInformation;
