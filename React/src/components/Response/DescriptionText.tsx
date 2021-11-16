import React, { useState } from 'react';
import { Box, Button } from '@chakra-ui/react';

const DescriptionText = ({response}) => {
  const [expandDescription, setExpandDescription] = useState<boolean>(false);

  const expandButton = (text) => {
    return (
      <Button
        fontWeight="700"
        color="response.expandButtonText"
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
    <Box lineHeight="31px">
      {response?.complianceItem?.description?.length < 100 ? (
        <Box whiteSpace="break-spaces">{response?.complianceItem?.description}</Box>
      ) : !expandDescription ? (
        <>
          <Box whiteSpace="break-spaces">{response?.complianceItem?.description?.slice(0, 97)}...</Box>
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
