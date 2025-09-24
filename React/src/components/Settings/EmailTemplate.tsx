import React from 'react';

import { Flex, Image } from '@chakra-ui/react';

import { ISetting } from '../../interfaces/ISetting';
import { runtimeEnv } from '../../utils/runtime-env';

function EmailTemplate({
  active,
  template,
  setSelectedTemplate,
  updateImage,
}: {
  active: boolean;
  template: ISetting;
  setSelectedTemplate: (template) => void;
  updateImage: number;
}) {
  const onClick = () => {
    setSelectedTemplate(template);
  };

  return (
    <Flex
        data-id="000471"
        flexDirection="column"
        minW={['80px', '155px', 'full']}
        onClick={onClick}
        w="full">
      <Flex
        data-id="000472"
        _hover={{ borderColor: 'emailTemplate.hoverBorderColor' }}
        borderColor={active ? 'emailTemplate.activeBorderColor' : 'emailTemplate.borderColor'}
        borderRadius="10px"
        borderWidth="2px">
        <Image
          data-id="000473"
          cursor="pointer"
          fit="contain"
          h="180px"
          src={`${runtimeEnv.apiUrl()}/images/thumbnails/${template._id}.png?preventCache=${updateImage}`}
          w="full" />
      </Flex>
      <Flex
        data-id="000474"
        color="emailTemplate.labelColor"
        fontSize="14px"
        mt={2}>
        {template?.label}
      </Flex>
    </Flex>
  );
}

export default EmailTemplate;

export const emailTemplateStyles = {
  emailTemplate: {
    borderColor: 'rgba(221, 221, 221, 0.5)',
    activeBorderColor: '#462AC4',
    hoverBorderColor: '#462AC4',
    labelColor: '#434B4F',
  },
};
