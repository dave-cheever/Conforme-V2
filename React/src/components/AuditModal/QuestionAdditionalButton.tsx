import { useMemo } from 'react';

import { Box, ComponentWithAs, Icon, IconProps } from '@chakra-ui/react';

interface IQuestionAdditionalButton {
  label: string;
  icon: ComponentWithAs<'svg', IconProps>;
  requiredIcon?: ComponentWithAs<'svg', IconProps>;
  activeInformation: string;
  setActiveInformation: Function;
}

const QuestionAdditionalButton = ({ label, icon, requiredIcon, activeInformation, setActiveInformation }: IQuestionAdditionalButton) => {
  const active = useMemo(() => activeInformation === label, [activeInformation, label]);

  return (
    (<Box
      borderBottom={active ? '3px solid #A2171E' : ''}
      color={active ? 'additionalQuestions.active.text' : 'additionalQuestions.inActive.text'}
      cursor="pointer"
      data-id="9513f09a2d85"
      fontSize="16px"
      fontWeight="400"
      h="41px"
      mr={10}
      onClick={() => setActiveInformation(label)}>
      <Icon
        as={icon}
        data-id="ff3c21954b3d"
        h="18px"
        stroke={active ? 'additionalQuestions.active.icon' : 'additionalQuestions.inActive.icon'}
        w="18px" />
      {label}
      {requiredIcon && (
        <Icon
          as={requiredIcon}
          data-id="b8056eab928e"
          h="10px"
          ml="5px"
          mt="-15px"
          stroke={active ? 'additionalQuestions.active.requiredIcon' : 'additionalQuestions.inActive.requiredIcon'}
          w="10px" />
      )}
    </Box>)
  );
};

export default QuestionAdditionalButton;
