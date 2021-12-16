import React, { useState } from 'react';
import { Box, Button } from '@chakra-ui/react';
import { useResponseContext } from '../../contexts/ResponseProvider';

const DescriptionText = () => {
  const { response } = useResponseContext();
  const [expandDescription, setExpandDescription] = useState<boolean>(false);

  const expandButton = (text) => {
    return (
      <Button
        fontWeight="700"
        color="complianceItemResponse.expandButtonText"
        variant="ghost"
        _hover={{}}
        _active={{}}
        size="sm"
        onClick={() => setExpandDescription(!expandDescription)}
        px={0}
      >
        Read {text}
      </Button>
    );
  };

  return (
    <Box lineHeight="20px" color="complianceItemResponse.textColor" fontSize="14px" mt="5">
      {response && response?.complianceItem?.description?.length < 300 ? (
        <Box whiteSpace="break-spaces">{response?.complianceItem?.description}</Box>
      ) : !expandDescription ? (
        <>
          <Box whiteSpace="break-spaces">{response?.complianceItem?.description?.slice(0, 297)}...</Box>
          {expandButton('more')}
        </>
      ) : (
        <>
          <Box whiteSpace="break-spaces">{response?.complianceItem?.description}</Box>
          {expandButton('less')}
        </>
      )}
    </Box>
  );
};

export default DescriptionText;
