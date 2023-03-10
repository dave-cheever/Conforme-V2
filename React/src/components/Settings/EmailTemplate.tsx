import React from 'react';

import { Flex, Image } from '@chakra-ui/react';

import { ISetting } from '../../interfaces/ISetting';

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
    (<Flex
      data-id="6faeb475653c"
      flexDirection="column"
      minW={['80px', '155px', 'full']}
      onClick={onClick}
      w="full">
      <Flex
        _hover={{ borderColor: 'emailTemplate.hoverBorderColor' }}
        borderColor={active ? 'emailTemplate.activeBorderColor' : 'emailTemplate.borderColor'}
        borderRadius="10px"
        borderWidth="2px"
        data-id="958323afb428">
        <Image
          cursor="pointer"
          data-id="2ed37f0b4b66"
          fit="contain"
          h="180px"
          src={`${process.env.REACT_APP_API_URL}/images/thumbnails/${template._id}.png?preventCache=${updateImage}`}
          w="full" />
      </Flex>
      <Flex
        color="emailTemplate.labelColor"
        data-id="f11e6ef86716"
        fontSize="14px"
        mt={2}>
        {template?.label}
      </Flex>
    </Flex>)
  );
};

export default EmailTemplate;

export const emailTemplateStyles = {
  emailTemplate: {
    borderColor: 'rgba(221, 221, 221, 0.5)',
    activeBorderColor: '#462AC4',
    hoverBorderColor: '#462AC4',
    labelColor: '#434B4F',
  },
};
