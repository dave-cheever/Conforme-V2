import React from "react";
import { Image, Flex } from "@chakra-ui/react";

import { ISetting } from "../../interfaces/ISetting";

const EmailTemplate = ({
  active,
  template,
  setSelectedTemplate,
  updateImage,
}: {
  active: boolean;
  template: ISetting;
  setSelectedTemplate: (template) => void;
  updateImage: number;
}) => {
  const onClick = () => {
    setSelectedTemplate(template);
  };

  return (
    <Flex w="28%" flexDirection="column" mr={5} mt={5} onClick={onClick}>
      <Flex
        borderWidth="2px"
        borderColor={
          active
            ? "emailTemplate.activeBorderColor"
            : "emailTemplate.borderColor"
        }
        _hover={{ borderColor: "emailTemplate.hoverBorderColor" }}
        borderRadius="10px"
      >
        <Image
          w="full"
          h="180px"
          fit="contain"
          src={`${process.env.REACT_APP_API_URL}/images/thumbnails/${template._id}.png?preventCache=${updateImage}`}
          cursor="pointer"
        />
      </Flex>
      <Flex fontSize="14px" color="emailTemplate.labelColor" mt={2}>
        {template?.label}
      </Flex>
    </Flex>
  );
};

export default EmailTemplate;

export const emailTemplateStyles = {
  emailTemplate: {
    borderColor: "rgba(221, 221, 221, 0.5)",
    activeBorderColor: "#462AC4",
    hoverBorderColor: "#462AC4",
    labelColor: "#434B4F",
  },
};
