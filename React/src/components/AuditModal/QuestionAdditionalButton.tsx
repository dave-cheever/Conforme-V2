import Icon, { IconProps } from "@chakra-ui/icon";
import { Box } from "@chakra-ui/layout";
import { ComponentWithAs } from "@chakra-ui/system";
import { useMemo } from "react";

interface IQuestionAdditionalButton {
  label: string;
  icon: ComponentWithAs<"svg", IconProps>;
  requiredIcon?: ComponentWithAs<"svg", IconProps>;
  activeInformation: string;
  setActiveInformation: Function;
}

const QuestionAdditionalButton = ({
  label,
  icon,
  requiredIcon,
  activeInformation,
  setActiveInformation,
}: IQuestionAdditionalButton) => {
  const active = useMemo(
    () => activeInformation === label,
    [activeInformation, label]
  );

  return (
    <Box
      fontSize="16px"
      fontWeight="400"
      h="41px"
      cursor="pointer"
      color={
        active
          ? "additionalQuestions.active.text"
          : "additionalQuestions.inActive.text"
      }
      borderBottom={active ? "3px solid #A2171E" : ""}
      mr={10}
      onClick={() => setActiveInformation(label)}
    >
      <Icon
        as={icon}
        stroke={
          active
            ? "additionalQuestions.active.icon"
            : "additionalQuestions.inActive.icon"
        }
        w="18px"
        h="18px"
      />
      &nbsp; {label}
      {requiredIcon && (
        <Icon
          as={requiredIcon}
          stroke={
            active
              ? "additionalQuestions.active.requiredIcon"
              : "additionalQuestions.inActive.requiredIcon"
          }
          w="10px"
          h="10px"
          ml="5px"
          mt="-15px"
        />
      )}
    </Box>
  );
};

export default QuestionAdditionalButton;
