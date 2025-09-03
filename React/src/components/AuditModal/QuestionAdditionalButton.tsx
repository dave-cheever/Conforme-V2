import { useMemo } from 'react';

import { Box, ComponentWithAs, Icon, IconProps } from '@chakra-ui/react';

interface IQuestionAdditionalButton {
  label: string;
  icon: ComponentWithAs<'svg', IconProps>;
  requiredIcon?: ComponentWithAs<'svg', IconProps>;
  activeInformation: string;
  setActiveInformation: Function;
}

function QuestionAdditionalButton({ label, icon, requiredIcon, activeInformation, setActiveInformation }: IQuestionAdditionalButton) {
  const active = useMemo(() => activeInformation === label, [activeInformation, label]);

  return (
    <Box
        data-id="030925-5a46ad"
        borderBottom={active ? '3px solid #A2171E' : ''}
        color={active ? 'additionalQuestions.active.text' : 'additionalQuestions.inActive.text'}
        cursor="pointer"
        fontSize="16px"
        fontWeight="400"
        h="41px"
        mr={10}
        onClick={() => setActiveInformation(label)}>
      <Icon
        data-id="030925-a4a9c6"
        as={icon}
        h="18px"
        stroke={active ? 'additionalQuestions.active.icon' : 'additionalQuestions.inActive.icon'}
        w="18px" />
      {label}
      {requiredIcon && (
        <Icon
          data-id="030925-328330"
          as={requiredIcon}
          h="10px"
          ml="5px"
          mt="-15px"
          stroke={active ? 'additionalQuestions.active.requiredIcon' : 'additionalQuestions.inActive.requiredIcon'}
          w="10px" />
      )}
    </Box>
  );
}

export default QuestionAdditionalButton;
