import { useState } from 'react';

import { Box, Flex, Text } from '@chakra-ui/react';

import * as Icons from '../../icons';
import QuestionAdditionalButton from './QuestionAdditionalButton';

function QuestionAdditionalInformation() {
  const [activeInformation, setActiveInformation] = useState('Actions');
  return (
    (<Box data-id="da0b157865e3">
      <Text data-id="879a2f9f5d57" fontSize="16px" fontWeight="400">
        Provide additional information or actions
      </Text>
      <br data-id="b2ad565585ed" />
      <Flex alignItems="center" data-id="ec13443c1bd6">
        <QuestionAdditionalButton
          activeInformation={activeInformation}
          data-id="ba2313396a95"
          icon={Icons.HealthKitIcon}
          label="Actions"
          requiredIcon={Icons.RequiredIcon}
          setActiveInformation={setActiveInformation} />
        <QuestionAdditionalButton
          activeInformation={activeInformation}
          data-id="b4f177efd418"
          icon={Icons.AttachmentIcon}
          label="Attachments"
          setActiveInformation={setActiveInformation} />
        <QuestionAdditionalButton
          activeInformation={activeInformation}
          data-id="1b4bead3bda2"
          icon={Icons.DetailIcon}
          label="More detail"
          setActiveInformation={setActiveInformation} />
      </Flex>
    </Box>)
  );
}

export default QuestionAdditionalInformation;
